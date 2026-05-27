// ─── Concept Teaching Prompt Builder ─────────────────────
// Builds prompts for explaining DSA concepts relevant to a problem.
// Uses analogies, real-world examples, and progressive depth.
// Enhanced with code-aware concept connection.

import type { AiRequestContext, PromptMessage } from '../types/ai.types.js';
import { buildSystemPrompt } from './system.prompt.js';
import { truncateDescription } from '../utils/ai.formatter.js';

/**
 * Builds the message array for a concept explanation request.
 */
export function buildConceptPrompt(
  context: AiRequestContext,
  concept?: string
): PromptMessage[] {
  const conceptTarget = concept
    ? `The user specifically wants to understand: **${concept}**`
    : `Identify the key DSA concept(s) needed to solve this problem and explain them.`;

  const userMessage = `## Task: Teach a DSA Concept
${conceptTarget}

## Teaching Guidelines:
1. **Start with "What"** — Define the concept in one simple sentence
2. **Use an Analogy** — Relate it to something from everyday life
3. **Explain "Why It Matters Here"** — Connect it directly to this problem
4. **Show the Pattern** — Describe when to recognize and use this concept
5. **Complexity Context** — What's the typical time/space complexity?

## Adapt to Difficulty:
- **EASY**: Use very simple language, longer analogies, assume no prior knowledge
- **MEDIUM**: Standard technical explanations, brief analogies
- **HARD**: Dive into nuances, edge cases, optimizations, comparisons with alternatives

## Problem Context
**Title:** ${context.problemTitle}
**Difficulty:** ${context.difficulty}
**Description:**
${truncateDescription(context.description)}

${context.userCode.trim()
    ? `## User's Current Thinking (${context.language})
The user has started writing code, which gives you context about their current approach:
\`\`\`${context.language}
${context.userCode.slice(0, 500)}
\`\`\`

Use their code to connect the concept to what they're already trying. If their approach aligns with the concept, affirm it. If not, gently guide them to see how the concept applies differently.`
    : '## Note: The user has not started coding yet. They want to understand the concept first. Focus on building intuition before implementation.'
  }

Teach this concept clearly. Use the problem as a real example. Remember: guide, don't solve.`;

  return [
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: userMessage },
  ];
}
