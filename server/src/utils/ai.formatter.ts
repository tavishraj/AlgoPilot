// ─── AI Response Formatter & Utilities ───────────────────
// Sanitizes raw AI responses and builds the typed AiResponse envelope.
// Also provides truncation utilities for prompt construction.

import type { AiResponse, AiProviderResponse, PromptType } from '../types/ai.types.js';
import { aiConfig } from '../config/ai.config.js';

// ─── Response Formatting ─────────────────────────────────

/**
 * Wraps a raw provider response into the typed AiResponse envelope.
 */
export function formatAiResponse(
  raw: AiProviderResponse,
  promptType: PromptType,
  responseTimeMs: number
): AiResponse {
  return {
    success: true,
    data: {
      content: sanitizeContent(raw.content),
      metadata: {
        model: raw.model,
        tokensUsed: raw.tokensUsed,
        responseTimeMs,
        promptType,
      },
    },
  };
}

/**
 * Builds a typed error response.
 */
export function formatAiError(message: string): AiResponse {
  return {
    success: false,
    error: message,
  };
}

// ─── Content Sanitization ────────────────────────────────

/**
 * Cleans up raw AI text: trims whitespace, removes empty code fences.
 */
function sanitizeContent(content: string): string {
  return content
    .trim()
    // Remove empty code fences (```\n```)
    .replace(/```\s*```/g, '')
    // Normalize excessive newlines
    .replace(/\n{4,}/g, '\n\n\n');
}

// ─── Prompt Truncation Utilities ─────────────────────────

/**
 * Truncates user code to fit within prompt token budget.
 */
export function truncateCode(code: string): string {
  const max = aiConfig.maxCodeLength;
  if (code.length <= max) return code;
  return code.slice(0, max) + '\n// ... (code truncated for brevity)';
}

/**
 * Truncates problem description to fit within prompt token budget.
 */
export function truncateDescription(description: string): string {
  const max = aiConfig.maxDescriptionLength;
  if (description.length <= max) return description;
  return description.slice(0, max) + '\n... (description truncated)';
}

/**
 * Truncates test inputs and outputs to prevent token overflow from massive arrays or strings.
 */
export function truncateTestIO(io: string): string {
  const max = 200; // max length for test I/O representation
  if (io.length <= max) return io;
  return io.slice(0, max) + '... (truncated)';
}
