// ─── AI-DOST Configuration ───────────────────────────────
// Centralized AI settings. Designed for easy model swapping,
// future caching, rate limiting, and multi-provider support.
//
// Model resolution: OPENROUTER_MODEL > AI_MODEL > DEFAULT_MODEL

import { env } from './env.js';
import type { AiProviderConfig } from '../types/ai.types.js';

// ─── Model Defaults ──────────────────────────────────────

const DEFAULT_MODEL = 'poolside/laguna-m.1:free';
const FALLBACK_MODEL = 'meta-llama/llama-3.1-8b-instruct:free';

// ─── Provider Configuration ──────────────────────────────

function buildOpenRouterConfig(): AiProviderConfig {
  const resolvedModel = env.OPENROUTER_MODEL || DEFAULT_MODEL;

  return {
    name: 'openrouter',
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    model: resolvedModel,
    maxTokens: env.AI_MAX_TOKENS || 1024,
    temperature: env.AI_TEMPERATURE || 0.7,
    headers: {
      'Content-Type': 'application/json',
      'HTTP-Referer': env.CORS_ORIGIN || 'http://localhost:5173',
      'X-Title': 'AlgoPilot',
      ...(env.OPENROUTER_API_KEY && {
        'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
      }),
    },
  };
}

// ─── Exported Config ─────────────────────────────────────

export const aiConfig = {
  /** Active provider config */
  provider: buildOpenRouterConfig(),

  /** Fallback model if primary fails */
  fallbackModel: FALLBACK_MODEL,

  /** Max characters of user code included in prompts */
  maxCodeLength: 5000,

  /** Max characters of problem description in prompts */
  maxDescriptionLength: 3000,

  // ─── Future: Caching ───────────────────────────────
  // cacheTtlSeconds: 300,

  // ─── Future: Rate Limiting ─────────────────────────
  // rateLimitWindowMs: 60_000,
  // rateLimitMaxRequests: 10,

  // ─── Future: Moderation ────────────────────────────
  // moderationEnabled: false,

  // ─── Future: Analytics ─────────────────────────────
  // analyticsEnabled: false,
} as const;
