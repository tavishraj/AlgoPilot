import api from './api';
import type { Submission } from '@/types/submission';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export const submissionsService = {
  async create(payload: {
    problemId: string;
    code: string;
    language: string;
  }): Promise<ApiResponse<Submission>> {
    const { data } = await api.post('/submissions', payload);
    return data;
  },

  async getByUser(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Submission>> {
    const { data } = await api.get(`/submissions/user/${userId}`, {
      params: { page, limit },
    });
    return data;
  },

  async getById(id: string): Promise<ApiResponse<Submission>> {
    const { data } = await api.get(`/submissions/${id}`);
    return data;
  },
};
