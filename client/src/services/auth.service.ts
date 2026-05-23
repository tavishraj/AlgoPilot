import api from './api';
import type { User, AuthResponse } from '@/types/user';
import type { ApiResponse } from '@/types/api';

export const authService = {
  async register(payload: {
    email: string;
    username: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  async login(payload: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  async me(): Promise<ApiResponse<User>> {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
