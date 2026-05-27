// ─── Submission Types ─────────────────────────────────────
// Expanded to support future submission history, AI reviews,
// and detailed test case results.

import type { SupportedLanguage, Difficulty } from './problem';

// ─── Status ───────────────────────────────────────────────

export type SubmissionStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'COMPILATION_ERROR';

// ─── Test Case Result ─────────────────────────────────────

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  /** Runtime in milliseconds */
  runtime: number;
  /** Memory usage in MB */
  memory: number;
  error?: string;
}

// ─── Submission ───────────────────────────────────────────

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: SupportedLanguage;
  status: SubmissionStatus;

  // ─── Performance ──────────────────────────────────
  /** Overall runtime in ms */
  runtime?: number;
  /** Overall memory usage in MB */
  memory?: number;
  /** Percentage of test cases passed */
  passRate?: number;

  // ─── Details ──────────────────────────────────────
  testCaseResults?: TestCaseResult[];
  compilerOutput?: string;

  // ─── XP ───────────────────────────────────────────
  /** XP awarded for this submission */
  xpAwarded: number;

  // ─── Problem context (for history views) ──────────
  problem?: {
    title: string;
    slug: string;
    difficulty: Difficulty;
  };

  // ─── AI Review (future) ───────────────────────────
  aiReview?: {
    feedback: string[];
    suggestions: string[];
    rating: number; // 1-5
  };

  createdAt: string;
}

// ─── Submission History Query ─────────────────────────────

export interface SubmissionFilters {
  problemId?: string;
  language?: SupportedLanguage;
  status?: SubmissionStatus;
}
