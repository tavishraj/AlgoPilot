// ─── Problem Types ────────────────────────────────────────

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  constraints?: string;
  examples: ProblemExample[];
  starterCode: Record<string, string>;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }>;
  acceptanceRate: number;
  totalAttempts: number;
  createdAt: string;
}

export interface ProblemSummary {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  tags: string[];
  acceptanceRate: number;
  totalAttempts: number;
  createdAt: string;
}
