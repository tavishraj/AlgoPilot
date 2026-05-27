// ─── Code Explanation Prompt Builder ─────────────────────
// Builds prompts for explaining what the user's code does.
// Adapts depth based on problem difficulty.
// Enhanced with progress-aware guidance.

import type { AiRequestContext, PromptMessage } from '../types/ai.types.js';
import { buildSystemPrompt } from './system.prompt.js';
import { truncateCode, truncateDescription } from '../utils/ai.formatter.js';

const DIFFICULTY_DEPTH: Record<string, string> = {
  EASY: `The user is likely a beginner. Explain in very simple terms.
- Use everyday analogies (e.g., "think of an array like a row of lockers")
- Define any technical terms you use
- Focus on the basic logic flow
- Be extra patient and encouraging`,

  MEDIUM: `The user has some experience. Explain with moderate technical depth.
- You can use standard DSA terminology (hash map, pointer, stack)
- Focus on the algorithmic approach and trade-offs
- Mention time/space complexity
- Connect concepts to common patterns`,

  HARD: `The user is likely experienced. Explain with full technical depth.
- Discuss algorithmic optimizations
- Compare with alternative approaches
- Dive into edge cases and complexity analysis
- Mention relevant advanced patterns`,
};

/**
 * Builds the message array for a code explanation request.
 */
export function buildExplainPrompt(context: AiRequestContext): PromptMessage[] {
  const depthGuide = DIFFICULTY_DEPTH[context.difficulty] || DIFFICULTY_DEPTH.MEDIUM;

  // Determine if the user has meaningful code to explain
  const hasCode = context.userCode.trim().length > 0;
  const codeStatusNote = !hasCode
    ? '\n**Note:** The user hasn\'t written code yet. Explain the problem\'s requirements and what approach they might consider.'
    : '';

  const userMessage = `## Task: Explain This Code
Explain what the user's code does, step by step. Help them understand their own solution.

${depthGuide}

## Structure your response as:
1. **Overview** — What does this code do in one sentence?
2. **Step-by-Step Walkthrough** — Walk through the key logic
3. **Complexity Analysis** — Time and space complexity with brief explanation
4. **Key Concepts Used** — What DSA concepts does this code use?
${codeStatusNote}

## Problem Context
**Title:** ${context.problemTitle}
**Difficulty:** ${context.difficulty}
**Description:**
${truncateDescription(context.description)}

## User's Code (${context.language})
\`\`\`${context.language}
${truncateCode(context.userCode)}
\`\`\`

Explain this code clearly. Remember to adapt your language to the difficulty level.`;

  return [
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: userMessage },
  ];
}
