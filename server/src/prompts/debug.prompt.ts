// ─── Debug Assistance Prompt Builder ─────────────────────
// Builds prompts for debugging guidance.
// Analyzes failing tests + user code, guides toward fix
// WITHOUT giving the fix directly.
// Enhanced with failure pattern awareness.

import type { AiRequestContext, TestResult, PromptMessage } from '../types/ai.types.js';
import { buildSystemPrompt } from './system.prompt.js';
import { truncateCode, truncateDescription } from '../utils/ai.formatter.js';

/**
 * Formats test results into a readable analysis block.
 */
function formatTestResults(testResults: TestResult[]): string {
  const passing = testResults.filter((t) => t.passed);
  const failing = testResults.filter((t) => !t.passed);

  let output = `**Summary:** ${passing.length}/${testResults.length} tests passing\n\n`;

  // Add failure pattern insight
  if (failing.length === testResults.length) {
    output += `**Pattern:** All tests failing — likely a fundamental logic or approach issue.\n\n`;
  } else if (failing.length > 0 && passing.length >= failing.length) {
    output += `**Pattern:** Some tests pass, some fail — likely an edge case or boundary condition issue.\n\n`;
  }

  if (failing.length > 0) {
    output += `### Failing Tests\n`;
    failing.forEach((t, i) => {
      output += `**Test ${i + 1}:**\n`;
      output += `- Input: \`${t.input}\`\n`;
      output += `- Expected: \`${t.expectedOutput}\`\n`;
      output += `- Got: \`${t.actualOutput}\`\n\n`;
    });
  }

  if (passing.length > 0) {
    output += `### Passing Tests\n`;
    passing.forEach((t, i) => {
      output += `- Test ${i + 1}: Input \`${t.input}\` → ✅ \`${t.expectedOutput}\`\n`;
    });
  }

  return output;
}

/**
 * Builds the message array for a debugging assistance request.
 */
export function buildDebugPrompt(
  context: AiRequestContext,
  testResults: TestResult[]
): PromptMessage[] {
  const userMessage = `## Task: Help Debug This Code
The user's code is failing some tests. Help them figure out WHY, without giving the fix.

## Your Approach:
1. **Identify the Pattern** — Look at what inputs pass vs. fail. What's the pattern?
2. **Trace the Logic** — Walk through the failing input mentally. Where does the logic break?
3. **Ask a Guiding Question** — Help the user see the issue themselves
4. **Suggest an Investigation** — Tell them what to check or print, not what to change

## IMPORTANT:
- Do NOT rewrite their code
- Do NOT give the corrected version
- Point out WHERE the issue likely is and WHAT kind of issue it is
- Let THEM figure out the actual fix
- If all tests fail, focus on fundamental approach issues
- If only some tests fail, focus on edge cases and boundary conditions

## Problem Context
**Title:** ${context.problemTitle}
**Difficulty:** ${context.difficulty}
**Description:**
${truncateDescription(context.description)}

## User's Code (${context.language})
\`\`\`${context.language}
${truncateCode(context.userCode)}
\`\`\`

## Test Results
${formatTestResults(testResults)}

Analyze the failing tests and guide the user toward finding the bug. Do NOT give the fix directly.`;

  return [
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: userMessage },
  ];
}
