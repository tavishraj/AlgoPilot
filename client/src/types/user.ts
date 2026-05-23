// ─── User Types ───────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
  rank: number;
  streak: number;
  solvedCount: number;
  rating: number;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
