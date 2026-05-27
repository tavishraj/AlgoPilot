import api from './api';
import type { Problem, ProblemSummary, Difficulty } from '@/types/problem';
import type { PaginatedResponse, ApiResponse } from '@/types/api';

export interface ProblemsQueryParams {
  difficulty?: Difficulty;
  tags?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const problemsService = {
  async getAll(params?: ProblemsQueryParams): Promise<PaginatedResponse<ProblemSummary>> {
    const { data } = await api.get('/problems', { params });
    return data;
  },

  async getBySlug(slug: string): Promise<ApiResponse<Problem>> {
    const { data } = await api.get(`/problems/${slug}`);
    return data;
  },

  async create(problem: Partial<Problem>): Promise<ApiResponse<Problem>> {
    const { data } = await api.post('/problems', problem);
    return data;
  },

  async update(id: string, problem: Partial<Problem>): Promise<ApiResponse<Problem>> {
    const { data } = await api.put(`/problems/${id}`, problem);
    return data;
  },

  async delete(id: string): Promise<ApiResponse> {
    const { data } = await api.delete(`/problems/${id}`);
    return data;
  },
};
