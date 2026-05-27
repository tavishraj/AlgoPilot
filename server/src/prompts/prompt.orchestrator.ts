// ─── Prompt Orchestrator ─────────────────────────────────
// Central entry point for all prompt construction.
// Receives EnrichedContext + intent, selects the right
// builder, and composes the final PromptMessage array.
// This is the single place that wires everything together.

import type {
  PromptMessage,
  PromptIntent,
  PromptParams,
  EnrichedContext,
  HintLevel,
  TestResult,
} from '../types/ai.types.js';
import { buildSystemPrompt } from './system.prompt.js';
import {
  buildAnalysisBlock,
  buildConstraintBlock,
  buildToneBlock,
  buildProgressBlock,
  buildFailureBlock,
} from './prompt.blocks.js';
import { logger } from '../lib/logger.js';

// ─── Orchestrator ────────────────────────────────────────

/**
 * Builds the complete prompt message array for any AI-DOST interaction.
 * Composes system prompt + context blocks + intent-specific instructions.
 */
export function orchestratePrompt(
  intent: PromptIntent,
  enriched: EnrichedContext,
  params?: PromptParams
): PromptMessage[] {
  logger.debug('Orchestrating prompt', {
    intent,
    progressLevel: enriched.analysis.progressLevel,
    hintLevel: params?.hintLevel,
  });

  const systemMessage = buildSystemPrompt();
  const userMessage = buildUserMessage(intent, enriched, params);

  return [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userMessage },
  ];
}

// ─── User Message Builder ────────────────────────────────

function buildUserMessage(
  intent: PromptIntent,
  enriched: EnrichedContext,
  params?: PromptParams
): string {
  const sections: string[] = [];

  // 1. Intent-specific task instructions
  sections.push(buildTaskInstructions(intent, params));

  // 2. Constraints (anti-leak guardrails)
  sections.push(buildConstraintBlock(intent, params?.hintLevel));

  // 3. Tone adaptation
  sections.push(buildToneBlock(enriched.difficultyProfile.toneLevel));

  // 4. Progress-aware guidance
  sections.push(buildProgressBlock(enriched.analysis));

  // 5. Full context summary (problem + code + analysis + tests)
  sections.push(enriched.contextSummary);

  // 6. Analysis insights (for the model's reference)
  sections.push(buildAnalysisBlock(enriched.analysis));

  // 7. Failure analysis (if applicable)
  if (enriched.failurePattern && (intent === 'debug' || intent === 'hint')) {
    sections.push(buildFailureBlock(enriched.failurePattern));
  }

  // 8. Final instruction
  sections.push(buildClosingInstruction(intent, params));

  return sections.join('\n\n');
}

// ─── Task Instructions ───────────────────────────────────

function buildTaskInstructions(intent: PromptIntent, params?: PromptParams): string {
  switch (intent) {
    case 'hint':
      return buildHintInstructions(params?.hintLevel || 1);
    case 'explain':
      return buildExplainInstructions();
    case 'debug':
      return buildDebugInstructions();
    case 'concept':
      return buildConceptInstructions(params?.concept);
    default:
      return '## Task: Assist the student with their coding problem.';
  }
}

function buildHintInstructions(level: HintLevel): string {
  switch (level) {
    case 1:
      return `## Task: Provide a Level 1 Hint — Directional Guidance
Give the SMALLEST possible hint. A gentle nudge that makes the student think.
- Ask a guiding question about the nature of the problem
- Mention what CATEGORY of problem this is (searching, optimization, graph, etc.)
- Do NOT name specific algorithms, data structures, or patterns
- Keep it to 2-3 sentences maximum
- End with an encouraging question like "What do you think would happen if...?"`;

    case 2:
      return `## Task: Provide a Level 2 Hint — Conceptual Insight
The student needs more direction. Name the relevant concept or pattern.
- Name the specific pattern or technique (e.g., "two pointers", "hash map", "sliding window")
- Briefly explain WHY this pattern is a good fit for this problem
- If they have code, point out which PART of their thinking needs adjustment
- Do NOT provide step-by-step instructions or pseudocode
- Keep it to 4-6 sentences`;

    case 3:
      return `## Task: Provide a Level 3 Hint — Algorithmic Approach
The student is stuck and needs a clearer strategy. Describe the approach.
- Describe the step-by-step algorithmic strategy in plain English
- Explain what data structures to use and WHY
- Walk through the key decisions the algorithm makes
- Mention edge cases they should consider
- Do NOT provide pseudocode or code — that's the next level
- Keep the explanation clear and structured`;

    case 4:
      return `## Task: Provide a Level 4 Hint — Pseudocode Guidance
The student needs structural guidance. Provide a high-level pseudocode skeleton.
- Provide a pseudocode outline (NOT working code) of the approach
- Use language-agnostic pseudocode style
- Leave KEY LOGIC GAPS marked as "// YOUR LOGIC HERE" or "// FILL IN"
- Explain each step of the pseudocode in plain English
- Point out edge cases they should handle
- Keep pseudocode to 5-8 lines maximum
- Still do NOT provide the complete solution — the core logic must be theirs`;
  }
}

function buildExplainInstructions(): string {
  return `## Task: Explain the Student's Code
Walk through what the student's code does, step by step. Help them understand their own solution.

## Structure your response as:
1. **Overview** — What does this code do in one sentence?
2. **Step-by-Step Walkthrough** — Walk through the key logic
3. **Complexity Analysis** — Time and space complexity with brief explanation
4. **Key Concepts Used** — What DSA concepts does this code use?`;
}

function buildDebugInstructions(): string {
  return `## Task: Help Debug Failing Tests
The student's code is failing tests. Help them find WHY, without giving the fix.

## Your Approach:
1. **Identify the Pattern** — Look at which inputs pass vs. fail. What's the pattern?
2. **Trace the Logic** — Walk through the failing input mentally. Where does the logic break?
3. **Ask a Guiding Question** — Help the student see the issue themselves
4. **Suggest an Investigation** — Tell them what to check or print, not what to change

## IMPORTANT:
- Do NOT rewrite their code
- Do NOT give the corrected version
- Point out WHERE the issue likely is and WHAT kind of issue it is
- Let THEM figure out the actual fix`;
}

function buildConceptInstructions(concept?: string): string {
  const target = concept
    ? `The student specifically wants to understand: **${concept}**`
    : `Identify the key DSA concept(s) needed to solve this problem and explain them.`;

  return `## Task: Teach a DSA Concept
${target}

## Teaching Structure:
1. **What** — Define the concept in one simple sentence
2. **Analogy** — Relate it to something from everyday life
3. **Why It Matters Here** — Connect it directly to this problem
4. **The Pattern** — When should you recognize and use this concept?
5. **Complexity** — Typical time/space complexity`;
}

// ─── Closing Instructions ────────────────────────────────

function buildClosingInstruction(intent: PromptIntent, params?: PromptParams): string {
  switch (intent) {
    case 'hint':
      return `Provide a Level ${params?.hintLevel || 1} hint. Remember: NEVER give the complete solution. Guide their thinking.`;
    case 'explain':
      return `Explain this code clearly. Adapt your language depth to the difficulty level.`;
    case 'debug':
      return `Analyze the failing tests and guide the student toward finding the bug. Do NOT give the fix directly.`;
    case 'concept':
      return `Teach this concept clearly. Use the problem as a real example. Guide, don't solve.`;
    default:
      return `Help the student. Remember: guide, don't solve.`;
  }
}
