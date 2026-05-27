// ─── Context Analyzer ────────────────────────────────────
// Thin wrapper over the static analysis engine.
// Preserves the original analyzeCode() signature for backward
// compatibility with the AI hint orchestration system.
//
// The heavy lifting is now done by the analysis module at
// ../analysis/engine.ts using tokenization, block parsing,
// and deterministic analyzers — not regex.

import type {
  CodeAnalysis,
  SupportedLanguage,
} from '../types/ai.types.js';
import { analyzeCodeCompat } from '../analysis/index.js';
import { logger } from '../lib/logger.js';

/**
 * Analyzes user code to extract structural signals.
 * Delegates to the static analysis engine for proper
 * tokenization and scope-aware analysis.
 *
 * @param code - The user's source code
 * @param language - The programming language
 * @returns CodeAnalysis compatible with the AI hint system
 */
export function analyzeCode(
  code: string,
  language: SupportedLanguage
): CodeAnalysis {
  try {
    const analysis = analyzeCodeCompat(code, language);

    logger.debug('Code analysis complete (via engine)', {
      progressLevel: analysis.progressLevel,
      patterns: analysis.detectedPatterns.length,
      issues: analysis.potentialIssues.length,
    });

    return analysis;
  } catch (error) {
    logger.warn('Code analysis failed, returning defaults', {
      error: error instanceof Error ? error.message : 'unknown',
    });
    return getDefaultAnalysis();
  }
}

// ─── Safe Defaults ───────────────────────────────────────

function getDefaultAnalysis(): CodeAnalysis {
  return {
    progressLevel: 'partial',
    detectedPatterns: [],
    potentialIssues: [],
    complexitySignals: {
      estimatedTimeComplexity: 'unknown',
      isBruteForce: false,
      maxNestingDepth: 0,
    },
    codeStructure: {
      hasLoops: false,
      hasRecursion: false,
      hasHashMap: false,
      hasSorting: false,
      hasNestedLoops: false,
      hasBinarySearch: false,
      hasTwoPointers: false,
      hasStackQueue: false,
      lineCount: 0,
      functionCount: 0,
    },
  };
}
