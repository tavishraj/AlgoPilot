// ─── Static Analysis Engine ──────────────────────────────
// Central orchestrator that runs the full analysis pipeline:
// Code → Tokenize → BlockTree → [Analyzers] → Report
//
// Also provides backward-compatible CodeAnalysis output
// for integration with the existing AI hint system.

import type {
  StaticAnalysisReport,
  SupportedLanguage,
  CodeMetrics,
  BlockTree,
  LoopInfo,
  FunctionInfo,
  VariableInfo,
} from './types.js';
import type { CodeAnalysis, CodeProgressLevel, CodeIssue, ComplexitySignal, CodeStructure } from '../types/ai.types.js';
import { tokenize } from './parsers/tokenizer.js';
import { parseBlocks, extractFunctions, extractLoops, extractVariables } from './parsers/block-parser.js';
import { analyzeComplexity } from './analyzers/complexity.analyzer.js';
import { analyzePatterns } from './analyzers/pattern.analyzer.js';
import { analyzeMistakes } from './analyzers/mistake.analyzer.js';
import { analyzeSafety } from './analyzers/safety.analyzer.js';

// ─── Full Static Analysis ────────────────────────────────

/**
 * Runs the complete static analysis pipeline.
 * Returns a rich StaticAnalysisReport.
 * Never throws — returns a safe default on failure.
 */
export function analyzeCodeStatic(
  code: string,
  language: SupportedLanguage
): StaticAnalysisReport {
  const startTime = performance.now();

  try {
    // 1. Tokenize
    const tokens = tokenize(code, language);

    // 2. Build block tree
    const tree = parseBlocks(tokens, language);

    // 3. Extract structural info
    const functions = extractFunctions(tree);
    const loops = extractLoops(tree);
    const variables = extractVariables(tree);

    // 4. Run all analyzers (independent — no ordering dependencies)
    const complexity = analyzeComplexity(tree, loops, functions);
    const patterns = analyzePatterns(tree, loops, functions);
    const { diagnostics: mistakeDiags, suggestions } = analyzeMistakes(tree, loops, functions, variables);
    const safetyDiags = analyzeSafety(tree, loops, functions);

    // 5. Merge diagnostics
    const diagnostics = [...safetyDiags, ...mistakeDiags];

    // 6. Compute metrics
    const metrics = computeMetrics(tree, loops, functions);

    const analysisTimeMs = Math.round(performance.now() - startTime);

    return {
      complexity,
      diagnostics,
      patterns,
      suggestions,
      metrics,
      analysisTimeMs,
      language,
    };
  } catch (error) {
    return getDefaultReport(language, Math.round(performance.now() - startTime));
  }
}

// ─── Backward-Compatible CodeAnalysis ────────────────────

/**
 * Produces a CodeAnalysis object compatible with the existing
 * AI hint orchestration system. Bridges the new engine output
 * to the old type interface.
 */
export function analyzeCodeCompat(
  code: string,
  language: SupportedLanguage
): CodeAnalysis {
  const report = analyzeCodeStatic(code, language);

  // Map patterns to string array
  const detectedPatterns = report.patterns.map((p) => p.name);

  // Map diagnostics to CodeIssue array
  const potentialIssues: CodeIssue[] = report.diagnostics.map((d) => ({
    type: mapDiagCategory(d.category),
    description: d.message,
    confidence: d.severity === 'error' ? 0.9 : d.severity === 'warning' ? 0.7 : 0.5,
  }));

  // Map complexity
  const complexitySignals: ComplexitySignal = {
    estimatedTimeComplexity: report.complexity.time,
    isBruteForce: report.complexity.time === 'O(n²)' || report.complexity.time === 'O(n³)',
    maxNestingDepth: report.metrics.maxNestingDepth,
  };

  // Map structure
  const codeStructure: CodeStructure = {
    hasLoops: report.patterns.some((p) =>
      ['linear iteration', 'nested loops'].some((n) => p.name.includes(n)) || p.name.includes('loop')
    ) || report.metrics.loopCount > 0,
    hasRecursion: report.patterns.some((p) => p.name === 'recursion'),
    hasHashMap: report.patterns.some((p) => p.name.includes('hash')),
    hasSorting: report.patterns.some((p) => p.name === 'sorting'),
    hasNestedLoops: report.patterns.some((p) => p.name.includes('nested')),
    hasBinarySearch: report.patterns.some((p) => p.name.includes('binary search')),
    hasTwoPointers: report.patterns.some((p) => p.name.includes('two pointers') || p.name.includes('fast')),
    hasStackQueue: report.patterns.some((p) =>
      p.name.includes('stack') || p.name.includes('queue')
    ),
    lineCount: report.metrics.lineCount,
    functionCount: report.metrics.functionCount,
  };

  // Assess progress
  const progressLevel = assessProgress(code, report);

  return {
    progressLevel,
    detectedPatterns,
    potentialIssues,
    complexitySignals,
    codeStructure,
  };
}

// ─── Progress Assessment ─────────────────────────────────

function assessProgress(code: string, report: StaticAnalysisReport): CodeProgressLevel {
  const trimmed = code.trim();

  if (trimmed.length === 0) return 'empty';

  const lines = report.metrics.lineCount;

  if (lines <= 3) return 'boilerplate';

  // Check for boilerplate indicators
  if (lines <= 6) {
    const hasEmptyBody = report.diagnostics.some((d) => d.category === 'redundant_code');
    const hasTodo = /\/\/\s*(?:todo|your code|write|implement)/i.test(code) ||
                    /#\s*(?:todo|your code|write|implement)/i.test(code);
    if (hasEmptyBody || hasTodo) return 'boilerplate';
  }

  // Check for optimization signals
  const hasOptPattern = report.patterns.some(
    (p) => p.name.includes('dynamic programming') || p.name.includes('binary search')
  );
  const hasOptKeyword = /memo|cache|dp\[|tabul|optim/i.test(code);
  if ((hasOptPattern || hasOptKeyword) && lines > 8) return 'optimized';

  // Check for completeness (has return, non-trivial)
  if (report.metrics.functionCount > 0 && lines > 5) {
    const hasMissingReturn = report.diagnostics.some((d) => d.category === 'missing_return');
    if (!hasMissingReturn) return 'complete';
  }

  return 'partial';
}

// ─── Metrics Computation ─────────────────────────────────

function computeMetrics(
  tree: BlockTree,
  loops: LoopInfo[],
  functions: FunctionInfo[]
): CodeMetrics {
  // Line count: non-empty source lines
  const tokenLines = new Set<number>();
  for (const token of tree.tokens) {
    if (token.type !== 'newline' && token.type !== 'eof' && token.type !== 'whitespace') {
      tokenLines.add(token.line);
    }
  }

  // Max nesting depth
  const maxNestingDepth = tree.blocks.length > 0
    ? Math.max(...tree.blocks.map((b) => b.depth))
    : 0;

  // Cyclomatic complexity: 1 + number of decision points
  let cyclomaticComplexity = 1;
  for (const block of tree.blocks) {
    if (['if_block', 'elif_block', 'for_loop', 'while_loop', 'do_while_loop', 'catch_block', 'switch_block'].includes(block.type)) {
      cyclomaticComplexity++;
    }
    // Count logical operators as additional decision points
    for (const token of block.headerTokens) {
      if (token.type === 'operator' && (token.value === '&&' || token.value === '||' || token.value === 'and' || token.value === 'or')) {
        cyclomaticComplexity++;
      }
    }
  }

  // Branch count
  const branchCount = tree.blocks.filter((b) =>
    ['if_block', 'elif_block', 'else_block', 'switch_block'].includes(b.type)
  ).length;

  return {
    lineCount: tokenLines.size,
    functionCount: functions.length,
    maxNestingDepth,
    cyclomaticComplexity,
    loopCount: loops.length,
    branchCount,
  };
}

// ─── Utility Mappers ─────────────────────────────────────

function mapDiagCategory(category: string): CodeIssue['type'] {
  const mapping: Record<string, CodeIssue['type']> = {
    infinite_loop: 'infinite_loop',
    off_by_one: 'off_by_one',
    missing_return: 'missing_return',
    missing_edge_case: 'missing_edge_case',
    unused_variable: 'unused_variable',
    wrong_comparison: 'syntax_pattern',
    mutable_default: 'syntax_pattern',
    no_base_case: 'infinite_loop',
    integer_overflow: 'syntax_pattern',
    global_mutation: 'syntax_pattern',
    unreachable_code: 'syntax_pattern',
    type_confusion: 'syntax_pattern',
    redundant_code: 'syntax_pattern',
    loop_invariant: 'inefficient_approach',
  };
  return mapping[category] || 'syntax_pattern';
}

// ─── Safe Defaults ───────────────────────────────────────

function getDefaultReport(language: SupportedLanguage, analysisTimeMs: number): StaticAnalysisReport {
  return {
    complexity: {
      time: 'O(?)',
      space: 'O(?)',
      timeReasoning: ['Analysis could not complete — defaulting to unknown.'],
      spaceReasoning: ['Analysis could not complete — defaulting to unknown.'],
    },
    diagnostics: [],
    patterns: [],
    suggestions: [],
    metrics: {
      lineCount: 0,
      functionCount: 0,
      maxNestingDepth: 0,
      cyclomaticComplexity: 1,
      loopCount: 0,
      branchCount: 0,
    },
    analysisTimeMs,
    language,
  };
}
