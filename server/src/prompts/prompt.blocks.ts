// ─── Reusable Prompt Blocks ──────────────────────────────
// Composable text sections that prompt builders can combine.
// Each block is a pure function returning a string.
// This eliminates duplication across prompt builders and
// ensures consistent formatting.

import type {
  EnrichedContext,
  CodeAnalysis,
  FailurePattern,
  PromptIntent,
  HintLevel,
} from '../types/ai.types.js';

// ─── Analysis Block ──────────────────────────────────────

/**
 * Builds a concise analysis summary for the AI model.
 * This gives the model insight into the student's code
 * so it can tailor its response intelligently.
 */
export function buildAnalysisBlock(analysis: CodeAnalysis): string {
  const lines: string[] = [];

  lines.push(`## Student Code Analysis (internal — do NOT expose to student)`);

  // Progress context
  switch (analysis.progressLevel) {
    case 'empty':
      lines.push('- The student has NOT written any code yet. They need conceptual guidance first.');
      break;
    case 'boilerplate':
      lines.push('- The student has only the starter template. They need help getting started with an approach.');
      break;
    case 'partial':
      lines.push('- The student has started implementing but their solution is incomplete. Encourage them to think about what\'s missing.');
      break;
    case 'complete':
      lines.push('- The student has a complete attempt. Focus on correctness and edge cases.');
      break;
    case 'optimized':
      lines.push('- The student appears to be working on optimization. Discuss complexity trade-offs.');
      break;
  }

  // Detected patterns
  if (analysis.detectedPatterns.length > 0) {
    lines.push(`- Detected approach: ${analysis.detectedPatterns.join(', ')}`);
  }

  // Complexity
  if (analysis.complexitySignals.isBruteForce) {
    lines.push(`- Their current approach appears brute-force (${analysis.complexitySignals.estimatedTimeComplexity}). They may need to consider a more efficient strategy.`);
  }

  // Issues
  if (analysis.potentialIssues.length > 0) {
    lines.push('- Potential issues to guide around (do NOT list these directly):');
    analysis.potentialIssues
      .filter((i) => i.confidence >= 0.5)
      .forEach((issue) => {
        lines.push(`  - ${issue.description}`);
      });
  }

  return lines.join('\n');
}

// ─── Failure Block ───────────────────────────────────────

/**
 * Builds a formatted test failure analysis block.
 */
export function buildFailureBlock(failurePattern: FailurePattern): string {
  const lines: string[] = [];

  lines.push(`## Test Failure Context`);
  lines.push(`- ${failurePattern.passed}/${failurePattern.total} tests passing`);
  lines.push(`- Pattern: ${failurePattern.patternDescription}`);

  if (failurePattern.isCompleteFailure) {
    lines.push('- **All tests fail** — the fundamental approach or logic may need rethinking.');
  } else if (failurePattern.isEdgeCaseFailure) {
    lines.push('- **Edge case failures** — the core approach works but boundary handling needs attention.');
  }

  return lines.join('\n');
}

// ─── Constraint Block ────────────────────────────────────

/**
 * Builds anti-solution-leak constraints tailored to the intent and level.
 * Higher hint levels allow more specific guidance; lower levels are stricter.
 */
export function buildConstraintBlock(intent: PromptIntent, hintLevel?: HintLevel): string {
  const base = `## CRITICAL CONSTRAINTS
- NEVER provide a complete, working solution
- NEVER write code that the student can copy-paste as their answer
- NEVER do the thinking for the student`;

  switch (intent) {
    case 'hint': {
      const level = hintLevel || 1;
      if (level <= 1) {
        return `${base}
- At this hint level: give ONLY a conceptual nudge (1-2 sentences)
- Do NOT name specific algorithms or data structures yet
- Ask a Socratic question that guides their thinking
- Do NOT provide any code, not even pseudocode`;
      }
      if (level === 2) {
        return `${base}
- At this hint level: you CAN name the relevant pattern or technique
- Explain WHY this pattern fits, but don't explain HOW to implement it
- Do NOT provide pseudocode or step-by-step instructions
- Keep it to 4-6 sentences`;
      }
      if (level === 3) {
        return `${base}
- At this hint level: you CAN describe a step-by-step algorithmic strategy
- Describe the approach in plain English, NOT in code
- You may mention key decisions but leave implementation details to the student
- Do NOT provide pseudocode yet — that's the next level`;
      }
      // Level 4
      return `${base}
- At this hint level: you CAN provide a pseudocode outline
- Pseudocode should be 5-8 lines maximum
- Leave KEY LOGIC GAPS — mark them as "// YOUR LOGIC HERE" or similar
- Do NOT fill in the core algorithm logic — the student must do that
- Include edge case reminders`;
    }

    case 'debug':
      return `${base}
- Point out WHERE the issue likely is, not HOW to fix it
- Suggest what to investigate (print statements, trace through input)
- Guide toward the bug, don't fix it
- You may reference specific line areas but not rewrite them`;

    case 'explain':
      return `${base}
- Explain what the student's existing code does — don't write new code
- Use their code as reference, don't rewrite it
- Focus on understanding, not on fixing or improving`;

    case 'concept':
      return `${base}
- Teach the concept abstractly with analogies
- Connect it to the problem but don't solve the problem
- Show the pattern recognition, not the implementation`;

    default:
      return base;
  }
}

// ─── Tone Block ──────────────────────────────────────────

/**
 * Builds language and tone adaptation rules based on difficulty.
 */
export function buildToneBlock(toneLevel: 'beginner' | 'intermediate' | 'advanced'): string {
  switch (toneLevel) {
    case 'beginner':
      return `## Tone & Language Adaptation
- Use very simple language — no jargon without explanation
- Use everyday analogies (arrays = row of lockers, stack = pile of plates)
- Define technical terms the first time you use them
- Be extra encouraging — the student may feel overwhelmed
- Keep sentences short and paragraphs small`;

    case 'intermediate':
      return `## Tone & Language Adaptation
- Standard technical language is fine (hash map, pointer, stack, DFS)
- Brief analogies when introducing new patterns
- Focus on algorithmic reasoning and trade-offs
- Be supportive but treat the student as capable`;

    case 'advanced':
      return `## Tone & Language Adaptation
- Full technical depth — assume DSA vocabulary familiarity
- Focus on nuances, optimizations, and edge cases
- Compare approaches and discuss trade-offs concisely
- Be direct and efficient — respect their experience level`;
  }
}

// ─── Progress-Aware Guidance Block ───────────────────────

/**
 * Builds guidance based on how far the student has progressed.
 * Tells the AI model what kind of help is most appropriate.
 */
export function buildProgressBlock(analysis: CodeAnalysis): string {
  switch (analysis.progressLevel) {
    case 'empty':
      return `## Student Progress: Not Started
The student hasn't written any code yet. They need help understanding the problem and choosing an approach. Do NOT jump to implementation details — help them think about the problem first.`;

    case 'boilerplate':
      return `## Student Progress: Just Starting
The student only has the starter template. They need help picking a strategy and getting their first lines of logic down. Encourage them to think about what the function needs to do step by step.`;

    case 'partial':
      return `## Student Progress: In Progress
The student has started implementing. They may be stuck on a specific part. Look at what they've written and help them figure out what's missing or where to go next.`;

    case 'complete':
      return `## Student Progress: Complete Attempt
The student has written a full solution attempt. If tests are failing, help them find the bug. If no tests have run, encourage them to test their logic mentally.`;

    case 'optimized':
      return `## Student Progress: Optimization Phase
The student appears to be working on an optimized solution. Focus on correctness of the optimization, edge cases, and complexity analysis.`;
  }
}
