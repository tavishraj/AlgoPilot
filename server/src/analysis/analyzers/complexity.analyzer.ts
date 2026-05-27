// ─── Complexity Analyzer ─────────────────────────────────
// Estimates time and space complexity from the BlockTree.
// Uses loop nesting, recursion patterns, and data structure
// allocations — all deterministic, no AI.

import type {
  BlockTree,
  LoopInfo,
  FunctionInfo,
  ComplexityEstimate,
  SupportedLanguage,
} from '../types.js';
import { getLangConfig } from '../lang/index.js';

// ─── Public API ──────────────────────────────────────────

/**
 * Estimates time and space complexity from analyzed loops, functions, and tokens.
 */
export function analyzeComplexity(
  tree: BlockTree,
  loops: LoopInfo[],
  functions: FunctionInfo[]
): ComplexityEstimate {
  const timeResult = estimateTimeComplexity(tree, loops, functions);
  const spaceResult = estimateSpaceComplexity(tree, functions);

  return {
    time: timeResult.complexity,
    space: spaceResult.complexity,
    timeReasoning: timeResult.reasoning,
    spaceReasoning: spaceResult.reasoning,
  };
}

// ─── Time Complexity ─────────────────────────────────────

interface ComplexityResult {
  complexity: string;
  reasoning: string[];
}

function estimateTimeComplexity(
  tree: BlockTree,
  loops: LoopInfo[],
  functions: FunctionInfo[]
): ComplexityResult {
  const reasoning: string[] = [];

  if (loops.length === 0 && !functions.some((f) => f.callsItself)) {
    reasoning.push('No loops or recursion detected — constant time operations only.');
    return { complexity: 'O(1)', reasoning };
  }

  // ── Analyze loop nesting
  const maxNesting = loops.length > 0 ? Math.max(...loops.map((l) => l.nestingLevel)) : 0;
  let loopComplexity = 'O(1)';

  if (maxNesting >= 3) {
    loopComplexity = 'O(n³)';
    reasoning.push(`Triple-nested loops detected (nesting depth: ${maxNesting}) — O(n³) time.`);
  } else if (maxNesting === 2) {
    loopComplexity = 'O(n²)';
    reasoning.push('Nested loops detected (depth 2) — O(n²) time.');
  } else if (maxNesting === 1) {
    // Check for log(n) patterns in loop condition
    const hasLogPattern = loops.some((l) => isLogarithmicLoop(l));
    if (hasLogPattern) {
      loopComplexity = 'O(log n)';
      reasoning.push('Loop with halving/doubling pattern detected — O(log n) time.');
    } else {
      loopComplexity = 'O(n)';
      reasoning.push('Single-level loop detected — O(n) time.');
    }
  }

  // ── Check for sorting
  const hasSorting = detectSorting(tree);
  if (hasSorting) {
    reasoning.push('Sorting operation detected — contributes O(n log n).');
    loopComplexity = maxComplexity(loopComplexity, 'O(n log n)');
  }

  // ── Check for binary search inside loop
  const hasBinaryInLoop = loops.some(
    (l) => l.nestingLevel === 1 && isLogarithmicLoop(l)
  );
  const hasLinearLoop = loops.some(
    (l) => l.nestingLevel === 1 && !isLogarithmicLoop(l)
  );
  if (hasBinaryInLoop && hasLinearLoop) {
    loopComplexity = maxComplexity(loopComplexity, 'O(n log n)');
    reasoning.push('Linear loop containing binary search pattern — O(n log n).');
  }

  // ── Analyze recursion
  const recursiveFns = functions.filter((f) => f.callsItself);
  let recursionComplexity = 'O(1)';

  for (const fn of recursiveFns) {
    const recType = classifyRecursion(fn, tree);
    recursionComplexity = maxComplexity(recursionComplexity, recType.complexity);
    reasoning.push(recType.reason);
  }

  // ── Combine
  const finalComplexity = maxComplexity(loopComplexity, recursionComplexity);

  if (reasoning.length === 0) {
    reasoning.push(`Estimated time complexity: ${finalComplexity}`);
  }

  return { complexity: finalComplexity, reasoning };
}

// ─── Space Complexity ────────────────────────────────────

function estimateSpaceComplexity(
  tree: BlockTree,
  functions: FunctionInfo[]
): ComplexityResult {
  const reasoning: string[] = [];
  let complexity = 'O(1)';

  const config = getLangConfig(tree.language);

  // Check for array/list allocations that might grow with input
  const allBodyTokens = tree.blocks.flatMap((b) => b.bodyTokens);
  const hasGrowingAllocation = detectGrowingAllocations(allBodyTokens, tree.language);

  if (hasGrowingAllocation.has2D) {
    complexity = 'O(n²)';
    reasoning.push('2D data structure allocation detected — O(n²) space.');
  } else if (hasGrowingAllocation.has1D) {
    complexity = 'O(n)';
    reasoning.push('Linear data structure allocation detected — O(n) space.');
  }

  // Check for recursion stack depth
  const recursiveFns = functions.filter((f) => f.callsItself);
  if (recursiveFns.length > 0) {
    const recSpace = maxComplexity(complexity, 'O(n)');
    if (recSpace !== complexity) {
      complexity = recSpace;
      reasoning.push('Recursive function detected — O(n) call stack space.');
    }
  }

  // Check for hash map/set creation inside loops
  const loopBlocks = tree.blocks.filter((b) =>
    ['for_loop', 'while_loop', 'do_while_loop'].includes(b.type)
  );
  for (const loop of loopBlocks) {
    for (const pattern of config.dataStructurePatterns) {
      if (loop.bodyTokens.some((t) => t.type === 'identifier' && pattern.patterns.includes(t.value))) {
        if (complexity === 'O(1)') {
          complexity = 'O(n)';
          reasoning.push(`${pattern.name} created inside loop — may allocate O(n) space.`);
        }
      }
    }
  }

  if (reasoning.length === 0) {
    reasoning.push('No significant additional space allocations detected — O(1) auxiliary space.');
  }

  return { complexity, reasoning };
}

// ─── Loop Classification ─────────────────────────────────

function isLogarithmicLoop(loop: LoopInfo): boolean {
  const cond = loop.conditionText.toLowerCase();

  // Halving: mid = (lo + hi) / 2, or i /= 2, or i >>= 1
  if (/\/=?\s*2/.test(cond) || />>/.test(cond) || /mid/.test(cond)) return true;

  // Doubling: i *= 2, i <<= 1
  if (/\*=?\s*2/.test(cond) || /<</.test(cond)) return true;

  // Square root: i * i <= n
  if (/\*\s*\w+\s*<=/.test(cond)) return true;

  return false;
}

// ─── Recursion Classification ────────────────────────────

interface RecursionClass {
  complexity: string;
  reason: string;
}

function classifyRecursion(fn: FunctionInfo, tree: BlockTree): RecursionClass {
  const block = tree.blocks[fn.blockIndex];
  if (!block) {
    return { complexity: 'O(n)', reason: `Recursive function '${fn.name}' — assumed O(n).` };
  }

  // Count recursive calls
  const selfCalls = block.bodyTokens.filter(
    (t, i) =>
      t.type === 'identifier' &&
      t.value === fn.name &&
      i + 1 < block.bodyTokens.length &&
      block.bodyTokens[i + 1].type === 'delimiter' &&
      block.bodyTokens[i + 1].value === '('
  ).length;

  // Check for halving pattern (n/2, mid, lo/hi)
  const hasHalving = block.bodyTokens.some(
    (t) => t.type === 'operator' && t.value === '/' &&
    block.bodyTokens.some((t2) => t2.type === 'number' && t2.value === '2')
  ) || block.bodyTokens.some(
    (t) => t.type === 'identifier' && ['mid', 'half'].includes(t.value.toLowerCase())
  );

  if (selfCalls >= 2 && hasHalving) {
    return {
      complexity: 'O(n log n)',
      reason: `Recursive function '${fn.name}' with 2 calls and halving — likely divide-and-conquer O(n log n).`,
    };
  }

  if (selfCalls >= 2) {
    return {
      complexity: 'O(2ⁿ)',
      reason: `Recursive function '${fn.name}' with ${selfCalls} recursive calls — potentially exponential O(2ⁿ).`,
    };
  }

  if (hasHalving) {
    return {
      complexity: 'O(log n)',
      reason: `Recursive function '${fn.name}' with halving — O(log n).`,
    };
  }

  return {
    complexity: 'O(n)',
    reason: `Recursive function '${fn.name}' with linear recursion — O(n).`,
  };
}

// ─── Sorting Detection ───────────────────────────────────

function detectSorting(tree: BlockTree): boolean {
  const config = getLangConfig(tree.language);
  const allTokenValues = tree.tokens.map((t) => t.value);
  const joined = allTokenValues.join(' ');

  return config.sortPatterns.some((pattern) => joined.includes(pattern));
}

// ─── Growing Allocation Detection ────────────────────────

function detectGrowingAllocations(
  tokens: { type: string; value: string }[],
  language: SupportedLanguage
): { has1D: boolean; has2D: boolean } {
  const config = getLangConfig(language);
  let has1D = false;
  let has2D = false;

  const allValues = tokens.map((t) => t.value).join(' ');

  // Check for array/list/vector allocations
  for (const pattern of config.dataStructurePatterns) {
    if (pattern.type === 'array' || pattern.type === 'hash_map' || pattern.type === 'set') {
      if (pattern.patterns.some((p) => allValues.includes(p))) {
        has1D = true;
      }
    }
  }

  // Check for 2D patterns
  const twoDPatterns = [
    /\[\s*\[/,                          // [[
    /Array\s*\(\s*\w+\s*\)\s*\.\s*fill/,  // Array(n).fill
    /new\s+int\s*\[\s*\w+\s*\]\s*\[/,     // new int[n][
    /vector\s*<\s*vector/,              // vector<vector
    /\[\s*\]\s*\*\s*\w+/,               // [] * n (Python)
  ];

  if (twoDPatterns.some((p) => p.test(allValues))) {
    has2D = true;
  }

  // DP table patterns
  if (/dp\s*=|memo\s*=|table\s*=|cache\s*=/.test(allValues)) {
    has1D = true;
  }

  return { has1D, has2D };
}

// ─── Complexity Comparison ───────────────────────────────

const COMPLEXITY_ORDER: Record<string, number> = {
  'O(1)': 0,
  'O(log n)': 1,
  'O(n)': 2,
  'O(n log n)': 3,
  'O(n²)': 4,
  'O(n³)': 5,
  'O(2ⁿ)': 6,
  'O(n!)': 7,
};

function maxComplexity(a: string, b: string): string {
  const orderA = COMPLEXITY_ORDER[a] ?? 2;
  const orderB = COMPLEXITY_ORDER[b] ?? 2;
  return orderA >= orderB ? a : b;
}
