// ─── Context Assembler ───────────────────────────────────
// Takes raw AiRequestContext, runs it through the analyzer,
// and produces an EnrichedContext that all prompt builders
// can consume. This is the bridge between raw input and
// intelligent prompt construction.

import type {
  AiRequestContext,
  EnrichedContext,
  FailurePattern,
  DifficultyProfile,
  TestResult,
} from '../types/ai.types.js';
import { analyzeCode } from './context.analyzer.js';
import { logger } from '../lib/logger.js';
import { truncateCode, truncateDescription, truncateTestIO } from '../utils/ai.formatter.js';

// ─── Difficulty Profiles ─────────────────────────────────

const DIFFICULTY_PROFILES: Record<string, DifficultyProfile> = {
  EASY: {
    expectedComplexity: 'O(n) or O(n log n)',
    toneLevel: 'beginner',
    commonPitfalls: [
      'off-by-one errors in array indexing',
      'forgetting edge cases (empty input, single element)',
      'not handling negative numbers',
      'using wrong loop bounds',
    ],
    explanationDepth: 'detailed',
  },
  MEDIUM: {
    expectedComplexity: 'O(n log n) or O(n)',
    toneLevel: 'intermediate',
    commonPitfalls: [
      'using brute force when optimization is needed',
      'not recognizing the right data structure',
      'missing subtle edge cases',
      'incorrect sliding window boundaries',
    ],
    explanationDepth: 'moderate',
  },
  HARD: {
    expectedComplexity: 'O(n) or O(n log n) with advanced techniques',
    toneLevel: 'advanced',
    commonPitfalls: [
      'not recognizing the optimal substructure',
      'incorrect state transitions in DP',
      'missing monotonic stack/queue opportunities',
      'over-engineering the solution',
    ],
    explanationDepth: 'concise',
  },
};

// ─── Core Assembler ──────────────────────────────────────

/**
 * Assembles an EnrichedContext from raw request data.
 * This is the single entry point for context enrichment.
 */
export function assembleContext(raw: AiRequestContext): EnrichedContext {
  logger.debug('Assembling enriched context', {
    problem: raw.problemTitle,
    difficulty: raw.difficulty,
    codeLength: raw.userCode.length,
    hasTests: !!raw.testResults?.length,
  });

  // 1. Analyze user code
  const analysis = analyzeCode(raw.userCode, raw.language);

  // 2. Analyze failure patterns
  const failurePattern = raw.testResults?.length
    ? analyzeFailures(raw.testResults)
    : null;

  // 3. Get difficulty profile
  const difficultyProfile =
    DIFFICULTY_PROFILES[raw.difficulty] || DIFFICULTY_PROFILES.MEDIUM;

  // 4. Build the pre-formatted context summary
  const contextSummary = buildContextSummary(raw, analysis, failurePattern, difficultyProfile);

  return {
    raw,
    analysis,
    failurePattern,
    difficultyProfile,
    contextSummary,
  };
}

// ─── Failure Pattern Analysis ────────────────────────────

function analyzeFailures(testResults: TestResult[]): FailurePattern {
  const passed = testResults.filter((t) => t.passed);
  const failed = testResults.filter((t) => !t.passed);

  const isCompleteFailure = passed.length === 0;
  const isEdgeCaseFailure =
    passed.length > 0 && failed.length > 0 && passed.length >= failed.length;

  let patternDescription = '';

  if (isCompleteFailure) {
    patternDescription =
      'All tests are failing — this suggests a fundamental issue with the approach or logic, not just an edge case.';
  } else if (isEdgeCaseFailure) {
    patternDescription =
      'Most tests pass but some fail — this suggests the core logic is sound but edge cases or boundary conditions are not handled.';
  } else {
    patternDescription =
      'More tests fail than pass — this suggests a significant logic error in the main approach.';
  }

  // Try to detect numeric edge cases
  const failedInputs = failed.map((t) => t.input);
  const hasEmptyInput = failedInputs.some(
    (i) => i.trim() === '' || i.trim() === '[]' || i.trim() === '""'
  );
  const hasSingleElement = failedInputs.some(
    (i) => i.includes('[') && !i.includes(',')
  );

  if (hasEmptyInput) {
    patternDescription += ' Empty input edge case detected in failures.';
  }
  if (hasSingleElement) {
    patternDescription += ' Single-element edge case detected in failures.';
  }

  return {
    total: testResults.length,
    passed: passed.length,
    failed: failed.length,
    patternDescription,
    isEdgeCaseFailure,
    isCompleteFailure,
  };
}

// ─── Context Summary Builder ─────────────────────────────

/**
 * Builds a pre-formatted text block that prompt builders can
 * inject directly. This avoids each builder duplicating context
 * formatting logic.
 */
function buildContextSummary(
  raw: AiRequestContext,
  analysis: ReturnType<typeof analyzeCode>,
  failurePattern: FailurePattern | null,
  difficultyProfile: DifficultyProfile
): string {
  const sections: string[] = [];

  // ── Problem Section
  sections.push(`## Problem Context
**Title:** ${raw.problemTitle}
**Difficulty:** ${raw.difficulty}
**Expected Complexity:** ${difficultyProfile.expectedComplexity}
**Description:**
${truncateDescription(raw.description)}`);

  // ── Code Section
  sections.push(`## Student's Code (${raw.language})
\`\`\`${raw.language}
${truncateCode(raw.userCode)}
\`\`\``);

  // ── Analysis Section (for the AI to leverage)
  const analysisLines: string[] = [
    `## Code Analysis (for your reference — do NOT share this analysis verbatim with the student)`,
    `- **Progress Level:** ${analysis.progressLevel}`,
    `- **Detected Patterns:** ${analysis.detectedPatterns.length > 0 ? analysis.detectedPatterns.join(', ') : 'none detected'}`,
    `- **Estimated Complexity:** ${analysis.complexitySignals.estimatedTimeComplexity}`,
    `- **Approach:** ${analysis.complexitySignals.isBruteForce ? 'appears brute-force' : 'appears reasonably optimized'}`,
  ];

  if (analysis.potentialIssues.length > 0) {
    analysisLines.push('- **Potential Issues:**');
    analysis.potentialIssues.forEach((issue) => {
      const safeDesc = issue.description.length > 200 
        ? issue.description.substring(0, 200) + '... (truncated)' 
        : issue.description;
      analysisLines.push(`  - ${safeDesc} (confidence: ${Math.round(issue.confidence * 100)}%)`);
    });
  }

  sections.push(analysisLines.join('\n'));

  // ── Test Results Section
  if (raw.testResults && raw.testResults.length > 0) {
    // Limit to max 5 tests to prevent token overflow
    const maxTests = 5;
    const testsToInclude = raw.testResults.slice(0, maxTests);
    const omittedCount = raw.testResults.length - testsToInclude.length;

    const testLines = testsToInclude.map(
      (t, i) =>
        `Test ${i + 1}: ${t.passed ? '✅ PASSED' : '❌ FAILED'} | Input: ${truncateTestIO(t.input)} | Expected: ${truncateTestIO(t.expectedOutput)}${!t.passed ? ` | Got: ${truncateTestIO(t.actualOutput)}` : ''}`
    );

    if (omittedCount > 0) {
      testLines.push(`... and ${omittedCount} more test(s)`);
    }

    sections.push(`## Test Results
${testLines.join('\n')}`);

    if (failurePattern) {
      sections.push(`## Failure Analysis
${failurePattern.patternDescription}`);
    }
  }

  // ── Console Output Section
  if (raw.consoleOutput?.trim()) {
    sections.push(`## Console Output
\`\`\`
${raw.consoleOutput.slice(0, 1000)}
\`\`\``);
  }

  return sections.join('\n\n');
}
