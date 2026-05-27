// ─── Type Barrel Export ───────────────────────────────────
// Single import point: import type { Problem, Submission } from '@/types';

export type {
  // Problem domain
  Difficulty,
  ProblemStatus,
  SupportedLanguage,
  ProblemTag,
  TestCase,
  ProblemExample,
  StarterCode,
  XPReward,
  AIProblemMeta,
  ProblemConstraint,
  Problem,
  ProblemSummary,
  UserProblemStatus,
  UserProblemProgress,
  ProblemFilters,
  ProblemSortOptions,
} from './problem';

export type {
  // Submission domain
  SubmissionStatus,
  TestCaseResult,
  Submission,
  SubmissionFilters,
} from './submission';

export type {
  // User domain
  User,
  AuthResponse,
} from './user';

export type {
  // API domain
  ApiResponse,
  PaginatedResponse,
  ApiError,
} from './api';
