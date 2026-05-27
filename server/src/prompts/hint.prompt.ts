// ─── Progressive Hint Prompt Builder ─────────────────────
// Builds prompts for the 4-level progressive hint system.
// Level 1: Directional Guidance (what kind of problem is this?)
// Level 2: Conceptual Insight (which technique/pattern?)
// Level 3: Algorithmic Approach (step-by-step strategy)
// Level 4: Pseudocode Guidance (skeleton without solution)
//
// This builder now supports both:
// - Legacy mode: raw AiRequestContext (backward compatible)
// - Enriched mode: EnrichedContext from the orchestrator

import type {
  AiRequestContext,
  EnrichedContext,
  HintLevel,
  PromptMessage,
} from '../types/ai.types.js';
import { buildSystemPrompt } from './system.prompt.js';
import { truncateCode, truncateDescription } from '../utils/ai.formatter.js';

// ─── Hint Level Instructions ─────────────────────────────

const HINT_LEVEL_INSTRUCTIONS: Record<HintLevel, string> = {
  1: `## Hint Level: 1 — Directional Guidance
Give the SMALLEST possible hint. Just a gentle nudge in the right direction.
- Ask a guiding question that makes the user think
- Mention what kind of problem this is (e.g., "this is a searching problem")
- Do NOT mention specific algorithms, data structures, or patterns yet
- Keep it to 2-3 sentences maximum
- End with an encouraging question like "What do you think would happen if...?"`,

  2: `## Hint Level: 2 — Conceptual Insight
The user needs more help. Point them toward the right concept.
- Name the relevant pattern or technique (e.g., "two pointers", "hash map lookup")
- Briefly explain WHY this pattern fits this problem
- If they have code, point out which PART of their approach needs rethinking
- Do NOT give pseudocode or step-by-step instructions yet
- Keep it to 4-6 sentences`,

  3: `## Hint Level: 3 — Algorithmic Approach
The user is stuck and needs a clearer strategy. Describe the approach.
- Describe the step-by-step algorithmic strategy in plain English
- Explain what data structures to use and WHY
- Walk through the key decisions the algorithm makes
- Mention edge cases they should consider
- Do NOT provide pseudocode or code — that's the next level
- Keep the explanation clear and structured`,

  4: `## Hint Level: 4 — Pseudocode Guidance
The user needs structural guidance. Give a high-level skeleton.
- Provide a pseudocode outline (NOT working code) of the approach
- Use language-agnostic pseudocode style
- Explain each step of the pseudocode in plain English
- Leave KEY LOGIC GAPS — mark them as "// YOUR LOGIC HERE"
- Point out edge cases they should consider
- Still do NOT give the complete solution — leave core logic for them
- Keep pseudocode to 5-8 lines maximum`,
};

// ─── Legacy Builder (backward compatible) ────────────────

/**
 * Builds the message array for a progressive hint request.
 * Accepts the original 1-3 levels AND the new level 4.
 */
export function buildHintPrompt(
  context: AiRequestContext,
  hintLevel: HintLevel
): PromptMessage[] {
  const levelInstructions = HINT_LEVEL_INSTRUCTIONS[hintLevel];

  const userMessage = `${levelInstructions}

## Problem Context
**Title:** ${context.problemTitle}
**Difficulty:** ${context.difficulty}
**Description:**
${truncateDescription(context.description)}

## User's Current Code (${context.language})
\`\`\`${context.language}
${truncateCode(context.userCode)}
\`\`\`
${context.testResults && context.testResults.length > 0
    ? `\n## Test Results\n${context.testResults
        .map(
          (t, i) =>
            `Test ${i + 1}: ${t.passed ? '✅ PASSED' : '❌ FAILED'} | Input: ${t.input} | Expected: ${t.expectedOutput}${!t.passed ? ` | Got: ${t.actualOutput}` : ''}`
        )
        .join('\n')}`
    : ''
  }

Provide a Level ${hintLevel} hint for this problem. Remember: NEVER give the complete solution.`;

  return [
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: userMessage },
  ];
}
