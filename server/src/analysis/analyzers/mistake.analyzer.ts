// ─── Mistake Analyzer ────────────────────────────────────
// Detects common beginner mistakes and missing edge cases.
// All checks are deterministic, pattern-based heuristics.

import type {
  BlockTree,
  LoopInfo,
  FunctionInfo,
  VariableInfo,
  Diagnostic,
  Suggestion,
  SupportedLanguage,
} from '../types.js';
import { getLangConfig } from '../lang/index.js';

// ─── Public API ──────────────────────────────────────────

/**
 * Detects beginner mistakes, missing edge cases, and produces guidance.
 * Returns diagnostics (warnings) and suggestions (actionable advice).
 */
export function analyzeMistakes(
  tree: BlockTree,
  loops: LoopInfo[],
  functions: FunctionInfo[],
  variables: VariableInfo[]
): { diagnostics: Diagnostic[]; suggestions: Suggestion[] } {
  const diagnostics: Diagnostic[] = [];
  const suggestions: Suggestion[] = [];
  const config = getLangConfig(tree.language);

  // Run all detectors
  detectOffByOne(tree, loops, diagnostics);
  detectMissingReturn(tree, functions, diagnostics);
  detectUnusedVariables(variables, diagnostics);
  detectWrongComparison(tree, diagnostics);
  detectMissingEdgeCases(tree, loops, functions, diagnostics);
  detectMutableDefaults(tree, diagnostics);
  detectIntegerOverflow(tree, diagnostics);
  detectGlobalMutation(tree, loops, diagnostics);
  detectEmptyBlocks(tree, diagnostics);

  // Generate suggestions from diagnostics
  generateSuggestions(tree, loops, functions, diagnostics, suggestions);

  return { diagnostics, suggestions };
}

// ─── Off-by-One Detection ────────────────────────────────

function detectOffByOne(tree: BlockTree, loops: LoopInfo[], diagnostics: Diagnostic[]): void {
  const lang = tree.language;

  for (const loop of loops) {
    const block = tree.blocks[loop.blockIndex];
    if (!block) continue;

    const headerStr = block.headerTokens.map((t) => t.value).join(' ');

    // Pattern: i <= arr.length / len(arr) / arr.size()
    const lengthPatterns = [
      /<=\s*\w+\s*\.\s*length/,
      /<=\s*len\s*\(\s*\w+\s*\)/,
      /<=\s*\w+\s*\.\s*size\s*\(\s*\)/,
      /<=\s*\w+\s*\.\s*length\s*\(\s*\)/,
    ];

    if (lengthPatterns.some((p) => p.test(headerStr))) {
      diagnostics.push({
        severity: 'warning',
        category: 'off_by_one',
        message: 'Possible off-by-one error: using <= with array length.',
        line: loop.line,
        guidance:
          'Array indices are 0-based, so the last valid index is length - 1. ' +
          'Using <= instead of < will access one element past the end. ' +
          'Try changing <= to <.',
      });
    }

    // Pattern: starting from 1 instead of 0 (sometimes intentional, but flag for beginners)
    if (lang !== 'python' && /=\s*1\s*;/.test(headerStr) && /\.\s*length/.test(headerStr)) {
      diagnostics.push({
        severity: 'hint',
        category: 'off_by_one',
        message: 'Loop starts at index 1 — is this intentional?',
        line: loop.line,
        guidance:
          'Arrays typically start at index 0. Starting at 1 means you skip the first element. ' +
          'If this is intentional (e.g., comparing with previous element), this is fine.',
      });
    }
  }
}

// ─── Missing Return Detection ────────────────────────────

function detectMissingReturn(
  tree: BlockTree,
  functions: FunctionInfo[],
  diagnostics: Diagnostic[]
): void {
  for (const fn of functions) {
    if (fn.name === 'main') continue; // main doesn't need explicit return in some languages

    // Skip Python functions that might use print
    if (tree.language === 'python') continue;

    if (!fn.hasReturn) {
      diagnostics.push({
        severity: 'warning',
        category: 'missing_return',
        message: `Function '${fn.name}' has no return statement.`,
        line: fn.startLine,
        guidance:
          'Your function doesn\'t return a value. If it\'s supposed to compute and return something, ' +
          'make sure to add a return statement with the result.',
      });
    }
  }
}

// ─── Unused Variable Detection ───────────────────────────

function detectUnusedVariables(variables: VariableInfo[], diagnostics: Diagnostic[]): void {
  for (const variable of variables) {
    if (variable.name.startsWith('_')) continue; // Convention: _ prefix = intentionally unused
    if (['i', 'j', 'k', 'n', 'm', 'x', 'y'].includes(variable.name)) continue; // Common loop/math vars

    if (!variable.isUsed) {
      diagnostics.push({
        severity: 'info',
        category: 'unused_variable',
        message: `Variable '${variable.name}' is declared but never used.`,
        line: variable.line,
        guidance:
          'This variable is declared but not referenced anywhere else. ' +
          'Either use it in your solution or remove it to keep your code clean.',
      });
    }
  }
}

// ─── Wrong Comparison Detection ──────────────────────────

function detectWrongComparison(tree: BlockTree, diagnostics: Diagnostic[]): void {
  const lang = tree.language;
  const config = getLangConfig(lang);

  if (!config.assignmentVsEquality) return;

  // For JS/TS: check for == instead of ===
  if (lang === 'javascript' || lang === 'typescript') {
    for (let i = 0; i < tree.tokens.length; i++) {
      const token = tree.tokens[i];
      if (token.type === 'operator' && token.value === '==') {
        diagnostics.push({
          severity: 'warning',
          category: 'wrong_comparison',
          message: 'Using loose equality (==) instead of strict equality (===).',
          line: token.line,
          guidance:
            'In JavaScript/TypeScript, == performs type coercion which can cause unexpected behavior. ' +
            'For example, "1" == 1 is true, but "1" === 1 is false. ' +
            'Use === for predictable comparisons.',
        });
      }
      if (token.type === 'operator' && token.value === '!=') {
        diagnostics.push({
          severity: 'hint',
          category: 'wrong_comparison',
          message: 'Using loose inequality (!=) instead of strict inequality (!==).',
          line: token.line,
          guidance: 'Consider using !== for strict comparison without type coercion.',
        });
      }
    }
  }

  // For C/C++/Java: check for = in if condition (assignment in condition)
  if (lang === 'java' || lang === 'cpp') {
    const ifBlocks = tree.blocks.filter((b) => b.type === 'if_block');
    for (const block of ifBlocks) {
      const headerOps = block.headerTokens.filter((t) => t.type === 'operator');
      const hasSingleEquals = headerOps.some(
        (t) => t.value === '=' && !headerOps.some((t2) => t2.value === '==')
      );
      if (hasSingleEquals) {
        diagnostics.push({
          severity: 'warning',
          category: 'wrong_comparison',
          message: 'Assignment (=) used inside an if-condition — did you mean == ?',
          line: block.startLine,
          guidance:
            'Using = in an if-condition assigns a value instead of comparing. ' +
            'This is almost always a bug. Use == for comparison.',
        });
      }
    }
  }
}

// ─── Missing Edge Case Detection ─────────────────────────

function detectMissingEdgeCases(
  tree: BlockTree,
  loops: LoopInfo[],
  functions: FunctionInfo[],
  diagnostics: Diagnostic[]
): void {
  const allTokens = tree.tokens;
  const identifiers = allTokens.filter((t) => t.type === 'identifier').map((t) => t.value);
  const allText = allTokens.map((t) => t.value).join(' ');

  // Check for empty input handling
  const hasEmptyCheck =
    /\.length\s*===?\s*0/.test(allText) ||
    /len\s*\(\s*\w+\s*\)\s*==\s*0/.test(allText) ||
    /\.isEmpty\s*\(\s*\)/.test(allText) ||
    /\.size\s*\(\s*\)\s*==\s*0/.test(allText) ||
    /not\s+\w+/.test(allText) ||
    /!\s*\w+\s*\.length/.test(allText);

  if (!hasEmptyCheck && (loops.length > 0 || functions.length > 0)) {
    diagnostics.push({
      severity: 'hint',
      category: 'missing_edge_case',
      message: 'No empty input check detected — consider handling empty arrays/strings.',
      guidance:
        'Many problems have edge cases with empty input ([], "", 0). ' +
        'Adding an early check like "if (arr.length === 0) return ..." prevents errors.',
    });
  }

  // Check for single-element handling
  const hasSingleCheck =
    /\.length\s*===?\s*1/.test(allText) ||
    /len\s*\(\s*\w+\s*\)\s*==\s*1/.test(allText) ||
    /\.size\s*\(\s*\)\s*==\s*1/.test(allText);

  if (!hasSingleCheck && loops.length > 0 && !hasEmptyCheck) {
    diagnostics.push({
      severity: 'hint',
      category: 'missing_edge_case',
      message: 'Consider handling the single-element case separately.',
      guidance:
        'When an array has only one element, loops might not execute or produce wrong results. ' +
        'Check if your logic works correctly when there\'s just one item.',
    });
  }

  // Check for negative number handling (if problem likely involves numbers)
  const hasNumberProcessing = identifiers.some((id) =>
    ['sum', 'total', 'max', 'min', 'product', 'result', 'ans', 'count', 'num', 'nums'].includes(id.toLowerCase())
  );
  const hasNegativeCheck =
    /< 0/.test(allText) ||
    /negative/.test(allText.toLowerCase()) ||
    /Math\.abs/.test(allText) ||
    /abs\s*\(/.test(allText);

  if (hasNumberProcessing && !hasNegativeCheck) {
    diagnostics.push({
      severity: 'hint',
      category: 'missing_edge_case',
      message: 'No negative number handling detected — does your solution handle negative inputs?',
      guidance:
        'If the input can contain negative numbers, make sure your logic accounts for them. ' +
        'For example, a maximum subarray sum might need to handle all-negative arrays.',
    });
  }
}

// ─── Python Mutable Default Detection ────────────────────

function detectMutableDefaults(tree: BlockTree, diagnostics: Diagnostic[]): void {
  if (tree.language !== 'python') return;

  const functions = tree.blocks.filter((b) => b.type === 'function');
  for (const fn of functions) {
    const headerStr = fn.headerTokens.map((t) => t.value).join('');

    // Pattern: def f(x=[]) or def f(x={})
    if (/=\s*\[\s*\]/.test(headerStr) || /=\s*\{\s*\}/.test(headerStr)) {
      diagnostics.push({
        severity: 'warning',
        category: 'mutable_default',
        message: 'Mutable default argument detected in function definition.',
        line: fn.startLine,
        guidance:
          'In Python, default mutable arguments (like [] or {}) are shared across all calls. ' +
          'Use None as the default and create the list/dict inside the function instead: ' +
          'def f(x=None): if x is None: x = []',
      });
    }
  }
}

// ─── Integer Overflow Detection ──────────────────────────

function detectIntegerOverflow(tree: BlockTree, diagnostics: Diagnostic[]): void {
  if (tree.language !== 'java' && tree.language !== 'cpp') return;

  const allText = tree.tokens.map((t) => t.value).join(' ');

  // Check for int type with multiplication or large accumulation
  const hasInt = tree.tokens.some(
    (t) => t.type === 'keyword' && t.value === 'int'
  );
  const hasMultiplication = tree.tokens.some(
    (t) => t.type === 'operator' && (t.value === '*' || t.value === '*=')
  );
  const hasLargeAccum = /sum|total|product|factorial/i.test(allText);

  if (hasInt && (hasMultiplication || hasLargeAccum)) {
    diagnostics.push({
      severity: 'hint',
      category: 'integer_overflow',
      message: 'Potential integer overflow — consider using long/long long for large accumulations.',
      guidance:
        `In ${tree.language === 'java' ? 'Java' : 'C++'}, int can only hold values up to ~2.1 billion. ` +
        'If you\'re multiplying numbers or accumulating large sums, consider using ' +
        `${tree.language === 'java' ? 'long' : 'long long'} to prevent overflow.`,
    });
  }
}

// ─── Global Mutation Detection ───────────────────────────

function detectGlobalMutation(tree: BlockTree, loops: LoopInfo[], diagnostics: Diagnostic[]): void {
  // Check if variables declared outside loops are mutated inside loops
  const rootBlock = tree.blocks[0];
  if (!rootBlock) return;

  const rootIdentifiers = rootBlock.bodyTokens
    .filter((t) => t.type === 'identifier')
    .map((t) => t.value);

  for (const loop of loops) {
    const block = tree.blocks[loop.blockIndex];
    if (!block) continue;

    const bodyIds = block.bodyTokens.filter((t) => t.type === 'identifier').map((t) => t.value);
    const bodyOps = block.bodyTokens.filter((t) => t.type === 'operator').map((t) => t.value);

    // Check if any root-level variable is assigned inside the loop
    for (const id of bodyIds) {
      if (rootIdentifiers.includes(id) && bodyOps.some((op) => ['=', '+=', '-='].includes(op))) {
        // Check that the variable appears before the assignment operator
        const idxInBody = block.bodyTokens.findIndex((t) => t.type === 'identifier' && t.value === id);
        if (idxInBody >= 0 && idxInBody + 1 < block.bodyTokens.length) {
          const nextToken = block.bodyTokens[idxInBody + 1];
          if (nextToken.type === 'operator' && ['='].includes(nextToken.value)) {
            // This is likely intentional (accumulator pattern), so only flag it as a hint
            // for specific suspicious patterns
          }
        }
      }
    }
  }
}

// ─── Empty Block Detection ───────────────────────────────

function detectEmptyBlocks(tree: BlockTree, diagnostics: Diagnostic[]): void {
  for (const block of tree.blocks) {
    if (block.type === 'root') continue;

    // Block with no body tokens (empty function, empty loop, etc.)
    const nonTrivialTokens = block.bodyTokens.filter(
      (t) => t.type !== 'newline' && t.type !== 'whitespace' && t.type !== 'eof'
    );

    if (nonTrivialTokens.length === 0 && block.type !== 'else_block') {
      const blockName = block.type.replace(/_/g, ' ');
      diagnostics.push({
        severity: 'info',
        category: 'redundant_code',
        message: `Empty ${blockName} detected${block.label ? ` (${block.label})` : ''}.`,
        line: block.startLine,
        guidance:
          `This ${blockName} has no code inside it. ` +
          'Either add the implementation or remove it if it\'s not needed.',
      });
    }
  }
}

// ─── Suggestion Generator ────────────────────────────────

function generateSuggestions(
  tree: BlockTree,
  loops: LoopInfo[],
  functions: FunctionInfo[],
  diagnostics: Diagnostic[],
  suggestions: Suggestion[]
): void {
  // Suggest optimization for nested loops
  const nestedLoops = loops.filter((l) => l.nestingLevel >= 2);
  if (nestedLoops.length > 0) {
    suggestions.push({
      type: 'optimization',
      message:
        'Nested loops result in O(n²) or worse. Consider if a hash map, sorting, or two-pointer approach ' +
        'could reduce the complexity.',
      priority: 1,
      lines: nestedLoops.map((l) => l.line),
    });
  }

  // Suggest edge case handling
  const edgeCaseDiags = diagnostics.filter((d) => d.category === 'missing_edge_case');
  if (edgeCaseDiags.length > 0) {
    suggestions.push({
      type: 'beginner',
      message:
        'Always handle edge cases first: empty input, single element, and boundary values. ' +
        'Add early return statements for these cases before your main logic.',
      priority: 2,
    });
  }

  // Suggest code organization if many functions
  if (functions.length > 3) {
    suggestions.push({
      type: 'quality',
      message:
        'Good job breaking the solution into multiple functions! Make sure each function has a clear, ' +
        'single responsibility.',
      priority: 4,
    });
  }

  // Suggest variable naming
  const shortVars = tree.tokens.filter(
    (t) =>
      t.type === 'identifier' &&
      t.value.length === 1 &&
      !['i', 'j', 'k', 'n', 'm', 'x', 'y', 'l', 'r'].includes(t.value)
  );
  if (shortVars.length > 3) {
    suggestions.push({
      type: 'quality',
      message:
        'Consider using more descriptive variable names. Instead of single letters, ' +
        'use names that describe what the variable holds (e.g., "currentSum" instead of "s").',
      priority: 5,
    });
  }
}
