import api from './api';
import type { ApiResponse } from '@/types/api';

// ─── Future AI Service ────────────────────────────────────
// These endpoints will connect to AI-powered features

export interface AiHintResponse {
  hint: string;
  confidence: number;
}

export interface AiExplainResponse {
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export const aiService = {
  async getHint(problemId: string, code: string): Promise<ApiResponse<AiHintResponse>> {
    const { data } = await api.post('/ai/hint', { problemId, code });
    return data;
  },

  async explainSolution(code: string, language: string): Promise<ApiResponse<AiExplainResponse>> {
    const { data } = await api.post('/ai/explain', { code, language });
    return data;
  },

  async reviewCode(code: string, language: string): Promise<ApiResponse<{ feedback: string[] }>> {
    const { data } = await api.post('/ai/review', { code, language });
    return data;
  },
};
