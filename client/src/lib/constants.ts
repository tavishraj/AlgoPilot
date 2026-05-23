// ─── Application Constants ────────────────────────────────

export const APP_NAME = 'AlgoPilot';

export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

export const DIFFICULTY_COLORS = {
  EASY: { bg: 'bg-success-muted', text: 'text-easy', label: 'Easy' },
  MEDIUM: { bg: 'bg-warning-muted', text: 'text-medium', label: 'Medium' },
  HARD: { bg: 'bg-error-muted', text: 'text-hard', label: 'Hard' },
} as const;

export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: 'JS' },
  { value: 'typescript', label: 'TypeScript', icon: 'TS' },
  { value: 'python', label: 'Python', icon: 'PY' },
  { value: 'java', label: 'Java', icon: 'JV' },
  { value: 'cpp', label: 'C++', icon: 'C+' },
] as const;

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/problems', label: 'Problems', icon: 'Code2' },
  { path: '/submissions', label: 'Submissions', icon: 'Send' },
  { path: '/battle', label: 'Battle', icon: 'Swords', badge: 'Soon' },
  { path: '/leaderboard', label: 'Leaderboard', icon: 'Trophy', badge: 'Soon' },
] as const;

export const SUBMISSION_STATUS_MAP = {
  PENDING: { label: 'Pending', color: 'text-text-secondary' },
  ACCEPTED: { label: 'Accepted', color: 'text-success' },
  WRONG_ANSWER: { label: 'Wrong Answer', color: 'text-error' },
  TIME_LIMIT_EXCEEDED: { label: 'TLE', color: 'text-warning' },
  RUNTIME_ERROR: { label: 'Runtime Error', color: 'text-error' },
  COMPILATION_ERROR: { label: 'Compile Error', color: 'text-error' },
} as const;
