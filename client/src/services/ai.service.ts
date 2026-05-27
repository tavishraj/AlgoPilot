import api from './api';
import type { SupportedLanguage } from '@/types/problem';

// ─── AI-DOST Frontend Types ──────────────────────────────

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export interface AiRequestContext {
  problemTitle: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  description: string;
  userCode: string;
  language: SupportedLanguage;
  testResults?: TestCaseResult[];
  consoleOutput?: string;
  hintHistory?: number;
}

export interface AiResponseMetadata {
  model: string;
  tokensUsed: number;
  responseTimeMs: number;
  promptType: 'hint' | 'explain' | 'debug' | 'concept';
}

export interface AiResponse {
  success: boolean;
  data?: {
    content: string;
    metadata: AiResponseMetadata;
  };
  error?: string;
}

export type HintLevel = 1 | 2 | 3 | 4;

export const HINT_LEVEL_NAMES: Record<HintLevel, string> = {
  1: 'Direction',
  2: 'Concept',
  3: 'Approach',
  4: 'Pseudocode',
};

export const HINT_LEVEL_DESCRIPTIONS: Record<HintLevel, string> = {
  1: 'A gentle nudge in the right direction',
  2: 'Which pattern or technique to use',
  3: 'Step-by-step algorithmic strategy',
  4: 'Pseudocode skeleton with gaps to fill',
};

// ─── AI Service Client ───────────────────────────────────

export const aiService = {
  /**
   * Legacy hint endpoint — direct prompt building.
   */
  async getHint(context: AiRequestContext, hintLevel: HintLevel): Promise<AiResponse> {
    const { data } = await api.post('/ai/hint', { context, hintLevel });
    return data;
  },

  /**
   * Contextual hint endpoint — enriched orchestration pipeline.
   * Uses code analysis + context assembly for higher-quality responses.
   */
  async getContextualHint(
    context: AiRequestContext,
    hintLevel: HintLevel,
    signal?: AbortSignal
  ): Promise<AiResponse> {
    const { data } = await api.post(
      '/ai/contextual-hint',
      { context, hintLevel },
      { signal }
    );
    return data;
  },

  async explainCode(context: AiRequestContext, signal?: AbortSignal): Promise<AiResponse> {
    const { data } = await api.post('/ai/explain', { context }, { signal });
    return data;
  },

  async debugCode(context: AiRequestContext, signal?: AbortSignal): Promise<AiResponse> {
    const { data } = await api.post(
      '/ai/debug',
      { context, testResults: context.testResults },
      { signal }
    );
    return data;
  },

  async explainConcept(
    context: AiRequestContext,
    concept?: string,
    signal?: AbortSignal
  ): Promise<AiResponse> {
    const { data } = await api.post('/ai/concept', { context, concept }, { signal });
    return data;
  },
};
