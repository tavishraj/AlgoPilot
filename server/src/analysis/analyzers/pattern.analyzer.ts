// ─── Pattern Analyzer ────────────────────────────────────
// Detects algorithmic patterns from the BlockTree:
// nested loops, recursion, two pointers, sliding window,
// binary search, hash map usage, sorting, DP, etc.
// All detection is deterministic and token/structure-based.

import type {
  BlockTree,
  LoopInfo,
  FunctionInfo,
  DetectedPattern,
} from '../types.js';
import { getLangConfig } from '../lang/index.js';

// ─── Public API ──────────────────────────────────────────

/**
 * Detects algorithmic patterns from the block tree and extracted info.
 */
export function analyzePatterns(
  tree: BlockTree,
  loops: LoopInfo[],
  functions: FunctionInfo[]
): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];

  detectNestedLoops(loops, patterns);
  detectRecursion(functions, patterns);
  detectTwoPointers(tree, loops, patterns);
  detectSlidingWindow(tree, loops, patterns);
  detectBinarySearch(tree, loops, patterns);
  detectHashMapUsage(tree, patterns);
  detectStackQueueUsage(tree, patterns);
  detectSorting(tree, patterns);
  detectDynamicProgramming(tree, loops, functions, patterns);
  detectGreedy(tree, loops, patterns);
  detectDFS_BFS(tree, functions, patterns);

  return patterns;
}

// ─── Nested Loop Detection ───────────────────────────────

function detectNestedLoops(loops: LoopInfo[], patterns: DetectedPattern[]): void {
  const nested = loops.filter((l) => l.nestingLevel >= 2);
  if (nested.length > 0) {
    const maxDepth = Math.max(...nested.map((l) => l.nestingLevel));
    patterns.push({
      name: `nested loops (depth ${maxDepth})`,
      confidence: 0.95,
      lines: nested.map((l) => l.line),
    });
  }

  const singleLoops = loops.filter((l) => l.nestingLevel === 1);
  if (singleLoops.length > 0 && nested.length === 0) {
    patterns.push({
      name: 'linear iteration',
      confidence: 0.9,
      lines: singleLoops.map((l) => l.line),
    });
  }
}

// ─── Recursion Detection ─────────────────────────────────

function detectRecursion(functions: FunctionInfo[], patterns: DetectedPattern[]): void {
  const recursive = functions.filter((f) => f.callsItself);
  if (recursive.length > 0) {
    patterns.push({
      name: 'recursion',
      confidence: 0.95,
      lines: recursive.map((f) => f.startLine),
    });
  }
}

// ─── Two Pointers Detection ──────────────────────────────

function detectTwoPointers(tree: BlockTree, loops: LoopInfo[], patterns: DetectedPattern[]): void {
  const allBodyTokens = tree.blocks.flatMap((b) => b.bodyTokens);
  const identifiers = allBodyTokens.filter((t) => t.type === 'identifier').map((t) => t.value);

  const pointerPairs = [
    ['left', 'right'],
    ['lo', 'hi'],
    ['low', 'high'],
    ['start', 'end'],
    ['l', 'r'],
    ['i', 'j'],
    ['slow', 'fast'],
  ];

  for (const [a, b] of pointerPairs) {
    if (identifiers.includes(a) && identifiers.includes(b)) {
      // Check if both are used in a loop context
      const loopBodyIds = loops.flatMap((l) => {
        const block = tree.blocks[l.blockIndex];
        return block ? block.bodyTokens.filter((t) => t.type === 'identifier').map((t) => t.value) : [];
      });

      if (loopBodyIds.includes(a) && loopBodyIds.includes(b)) {
        // Check for convergence pattern (one increases, one decreases, or both move)
        const hasConvergence = loops.some((l) => {
          const block = tree.blocks[l.blockIndex];
          if (!block) return false;
          const ops = block.bodyTokens.filter((t) => t.type === 'operator').map((t) => t.value);
          return ops.some((op) => ['++', '--', '+=', '-='].includes(op));
        });

        if (hasConvergence) {
          const lines = loops.filter((l) => {
            const block = tree.blocks[l.blockIndex];
            if (!block) return false;
            const ids = block.bodyTokens.filter((t) => t.type === 'identifier').map((t) => t.value);
            return ids.includes(a) && ids.includes(b);
          }).map((l) => l.line);

          patterns.push({
            name: a === 'slow' ? 'fast & slow pointers' : 'two pointers',
            confidence: 0.75,
            lines,
          });
          return; // Only report one pair
        }
      }
    }
  }
}

// ─── Sliding Window Detection ────────────────────────────

function detectSlidingWindow(tree: BlockTree, loops: LoopInfo[], patterns: DetectedPattern[]): void {
  const windowIndicators = ['window', 'windowSize', 'windowStart', 'windowEnd', 'maxLen', 'minLen', 'shrink'];
  const allBodyTokens = tree.blocks.flatMap((b) => b.bodyTokens);
  const identifiers = allBodyTokens.filter((t) => t.type === 'identifier').map((t) => t.value.toLowerCase());

  // Explicit window variable names
  const hasWindowVar = windowIndicators.some((w) => identifiers.includes(w.toLowerCase()));

  // Pattern: two variables moving in same direction with conditional shrink
  const hasNestedWhileInFor = loops.some((forLoop) => {
    if (forLoop.type !== 'for') return false;
    const forBlock = tree.blocks[forLoop.blockIndex];
    if (!forBlock) return false;
    return forBlock.childIndices.some((ci) => tree.blocks[ci]?.type === 'while_loop');
  });

  if (hasWindowVar || hasNestedWhileInFor) {
    const lines = loops.map((l) => l.line);
    patterns.push({
      name: 'sliding window',
      confidence: hasWindowVar ? 0.8 : 0.65,
      lines,
    });
  }
}

// ─── Binary Search Detection ─────────────────────────────

function detectBinarySearch(tree: BlockTree, loops: LoopInfo[], patterns: DetectedPattern[]): void {
  const allBodyTokens = tree.blocks.flatMap((b) => b.bodyTokens);
  const identifiers = allBodyTokens.filter((t) => t.type === 'identifier').map((t) => t.value.toLowerCase());

  const hasMid = identifiers.includes('mid') || identifiers.includes('middle');
  const hasBounds = (identifiers.includes('left') && identifiers.includes('right')) ||
                    (identifiers.includes('lo') && identifiers.includes('hi')) ||
                    (identifiers.includes('low') && identifiers.includes('high'));
  const hasHalving = loops.some((l) => /\/\s*2|>>\s*1/.test(l.conditionText));

  if (hasMid && hasBounds) {
    patterns.push({
      name: 'binary search',
      confidence: 0.9,
      lines: loops.map((l) => l.line),
    });
  } else if (hasHalving && hasBounds) {
    patterns.push({
      name: 'binary search',
      confidence: 0.75,
      lines: loops.map((l) => l.line),
    });
  }
}

// ─── Hash Map Usage ──────────────────────────────────────

function detectHashMapUsage(tree: BlockTree, patterns: DetectedPattern[]): void {
  const config = getLangConfig(tree.language);
  const allTokenValues = tree.tokens.map((t) => t.value);

  for (const dsPattern of config.dataStructurePatterns) {
    if (dsPattern.type === 'hash_map' || dsPattern.type === 'set') {
      const matchedLines: number[] = [];

      for (let i = 0; i < tree.tokens.length; i++) {
        const token = tree.tokens[i];
        if (token.type === 'identifier' && dsPattern.patterns.includes(token.value)) {
          matchedLines.push(token.line);
        } else if (
          dsPattern.patterns.includes('{}') &&
          token.type === 'delimiter' &&
          token.value === '{' &&
          i + 1 < tree.tokens.length &&
          tree.tokens[i + 1].type === 'delimiter' &&
          tree.tokens[i + 1].value === '}'
        ) {
          matchedLines.push(token.line);
        }
      }

      if (matchedLines.length > 0) {
        patterns.push({
          name: dsPattern.type === 'hash_map' ? 'hash map / dictionary' : 'hash set',
          confidence: 0.85,
          lines: [...new Set(matchedLines)],
        });
        break; // Report once
      }
    }
  }
}

// ─── Stack / Queue Usage ─────────────────────────────────

function detectStackQueueUsage(tree: BlockTree, patterns: DetectedPattern[]): void {
  const config = getLangConfig(tree.language);

  for (const dsPattern of config.dataStructurePatterns) {
    if (dsPattern.type === 'stack' || dsPattern.type === 'queue') {
      const matchedLines: number[] = [];

      for (const token of tree.tokens) {
        if (token.type === 'identifier' && dsPattern.patterns.includes(token.value)) {
          matchedLines.push(token.line);
        }
      }

      if (matchedLines.length > 0) {
        patterns.push({
          name: dsPattern.type,
          confidence: 0.85,
          lines: [...new Set(matchedLines)],
        });
      }
    }
  }

  // Also detect push/pop pattern without explicit Stack type
  const pushTokens = tree.tokens.filter((t) => t.type === 'identifier' && (t.value === 'push' || t.value === 'append'));
  const popTokens = tree.tokens.filter((t) => t.type === 'identifier' && t.value === 'pop');

  if (pushTokens.length > 0 && popTokens.length > 0) {
    if (!patterns.some((p) => p.name === 'stack')) {
      patterns.push({
        name: 'stack (push/pop pattern)',
        confidence: 0.7,
        lines: [...new Set([...pushTokens.map((t) => t.line), ...popTokens.map((t) => t.line)])],
      });
    }
  }
}

// ─── Sorting Detection ──────────────────────────────────

function detectSorting(tree: BlockTree, patterns: DetectedPattern[]): void {
  const config = getLangConfig(tree.language);
  const tokenValues = tree.tokens.map((t) => ({ value: t.value, line: t.line }));

  for (const sortPattern of config.sortPatterns) {
    // sortPattern might be ".sort(" — we need to check consecutive tokens
    const sortName = sortPattern.replace(/[.(]/g, '');
    const matchedLines: number[] = [];

    for (const token of tree.tokens) {
      if (token.type === 'identifier' && token.value === sortName) {
        matchedLines.push(token.line);
      }
    }

    if (matchedLines.length > 0) {
      patterns.push({
        name: 'sorting',
        confidence: 0.9,
        lines: [...new Set(matchedLines)],
      });
      return; // Report once
    }
  }
}

// ─── Dynamic Programming Detection ───────────────────────

function detectDynamicProgramming(
  tree: BlockTree,
  loops: LoopInfo[],
  functions: FunctionInfo[],
  patterns: DetectedPattern[]
): void {
  const allIdentifiers = tree.tokens
    .filter((t) => t.type === 'identifier')
    .map((t) => ({ value: t.value.toLowerCase(), line: t.line }));

  // DP table names
  const dpNames = ['dp', 'memo', 'cache', 'table', 'tab', 'memorize', 'memoize'];
  const dpTokens = allIdentifiers.filter((t) => dpNames.includes(t.value));

  // Check for tabulation: dp array + loop filling
  if (dpTokens.length > 0 && loops.length > 0) {
    patterns.push({
      name: 'dynamic programming (tabulation)',
      confidence: 0.8,
      lines: [...new Set(dpTokens.map((t) => t.line))],
    });
    return;
  }

  // Check for memoization: recursive function + memo/cache
  const recursiveFns = functions.filter((f) => f.callsItself);
  if (recursiveFns.length > 0 && dpTokens.length > 0) {
    patterns.push({
      name: 'dynamic programming (memoization)',
      confidence: 0.8,
      lines: [...new Set([...recursiveFns.map((f) => f.startLine), ...dpTokens.map((t) => t.line)])],
    });
  }
}

// ─── Greedy Detection ────────────────────────────────────

function detectGreedy(tree: BlockTree, loops: LoopInfo[], patterns: DetectedPattern[]): void {
  const identifiers = tree.tokens
    .filter((t) => t.type === 'identifier')
    .map((t) => t.value.toLowerCase());

  const greedyIndicators = ['greedy', 'maxprofit', 'minCost', 'optimal', 'best'];
  const hasSortBeforeLoop = patterns.some((p) => p.name === 'sorting');
  const hasGreedyVar = greedyIndicators.some((g) => identifiers.includes(g));

  if (hasSortBeforeLoop && loops.length > 0 && !patterns.some((p) => p.name.includes('dynamic'))) {
    if (hasGreedyVar) {
      patterns.push({
        name: 'greedy',
        confidence: 0.65,
        lines: loops.map((l) => l.line),
      });
    }
  }
}

// ─── DFS / BFS Detection ────────────────────────────────

function detectDFS_BFS(tree: BlockTree, functions: FunctionInfo[], patterns: DetectedPattern[]): void {
  const identifiers = tree.tokens
    .filter((t) => t.type === 'identifier')
    .map((t) => ({ value: t.value.toLowerCase(), line: t.line }));

  // DFS indicators
  const dfsNames = ['dfs', 'depthfirst', 'depth_first', 'backtrack'];
  const dfsTokens = identifiers.filter((t) => dfsNames.includes(t.value));

  if (dfsTokens.length > 0 || functions.some((f) => dfsNames.includes(f.name.toLowerCase()))) {
    patterns.push({
      name: 'depth-first search (DFS)',
      confidence: 0.85,
      lines: dfsTokens.map((t) => t.line),
    });
  }

  // BFS indicators
  const bfsNames = ['bfs', 'breadthfirst', 'breadth_first'];
  const bfsTokens = identifiers.filter((t) => bfsNames.includes(t.value));
  const hasQueueWithLoop = patterns.some(
    (p) => p.name === 'queue' || p.name.includes('queue')
  );

  if (bfsTokens.length > 0 || (hasQueueWithLoop && identifiers.some((t) => t.value === 'visited'))) {
    patterns.push({
      name: 'breadth-first search (BFS)',
      confidence: 0.85,
      lines: bfsTokens.map((t) => t.line),
    });
  }
}
