import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { authService } from '@/services/auth.service';

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();

  // Rehydrate user from token on mount
  useEffect(() => {
    if (token && !user) {
      authService
        .me()
        .then((res) => {
          if (res.success && res.data) {
            useAuthStore.getState().updateUser(res.data);
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, [token, user, logout]);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      setAuth(res.data.user, res.data.token);
    }
    return res;
  };

  const register = async (email: string, username: string, password: string) => {
    const res = await authService.register({ email, username, password });
    if (res.success && res.data) {
      setAuth(res.data.user, res.data.token);
    }
    return res;
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
