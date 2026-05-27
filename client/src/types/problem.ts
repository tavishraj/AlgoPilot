// ─── Problem Domain Types ─────────────────────────────────
// Scalable type system for AlgoPilot's DSA problem engine.
// Designed for client-side mock data today, database models tomorrow.

// ─── Enums & Literals ─────────────────────────────────────

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type ProblemStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

/** Supported editor languages — keep in sync with LANGUAGES in constants.ts */
export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp';

/** DSA topic tags for filtering and categorization */
export type ProblemTag =
  | 'Array'
  | 'String'
  | 'Hash Table'
  | 'Linked List'
  | 'Stack'
  | 'Queue'
  | 'Tree'
  | 'Binary Search'
  | 'Graph'
  | 'Dynamic Programming'
  | 'Greedy'
  | 'Backtracking'
  | 'Heap'
  | 'Sorting'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Recursion'
  | 'Math'
  | 'Bit Manipulation'
  | 'Design'
  | 'Divide and Conquer'
  | 'Trie'
  | 'Union Find';

// ─── Test Cases ───────────────────────────────────────────

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  /** Hidden test cases are used for grading but not shown to the user */
  isHidden: boolean;
  /** Optional explanation for visible test cases */
  explanation?: string;
}

// ─── Examples ─────────────────────────────────────────────

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

// ─── Starter Code ─────────────────────────────────────────

export interface StarterCode {
  language: SupportedLanguage;
  code: string;
  /** The function signature the user must implement */
  functionSignature: string;
}

// ─── XP & Rewards ─────────────────────────────────────────

export interface XPReward {
  /** Base XP earned on first solve */
  solve: number;
  /** Bonus XP for optimal time/space solution */
  optimal: number;
  /** XP earned for first attempt (no wrong answers) */
  firstAttempt: number;
}

// ─── AI Integration Metadata ──────────────────────────────

export interface AIProblemMeta {
  /** Key concepts the AI hint system can reference */
  concepts: string[];
  /** Suggested approach patterns for the AI tutor */
  approachHints: string[];
  /** Common mistakes the AI reviewer should watch for */
  commonMistakes: string[];
  /** Optimal time complexity (e.g., "O(n)") */
  optimalTimeComplexity: string;
  /** Optimal space complexity (e.g., "O(1)") */
  optimalSpaceComplexity: string;
}

// ─── Problem Constraints ──────────────────────────────────

export interface ProblemConstraint {
  description: string;
}

// ─── Full Problem ─────────────────────────────────────────

export interface Problem {
  /** Unique identifier (UUID in production) */
  id: string;
  /** Human-readable title */
  title: string;
  /** URL-safe slug derived from title */
  slug: string;
  /** Markdown-compatible problem description */
  description: string;
  difficulty: Difficulty;
  status: ProblemStatus;
  /** Problem number for ordering (like LeetCode's numbering) */
  order: number;

  // ─── Classification ───────────────────────────────
  tags: ProblemTag[];
  /** Primary category for the problem */
  category: string;

  // ─── Content ──────────────────────────────────────
  constraints: ProblemConstraint[];
  examples: ProblemExample[];
  starterCodes: StarterCode[];
  testCases: TestCase[];

  // ─── Rewards ──────────────────────────────────────
  xpReward: XPReward;

  // ─── AI Integration ───────────────────────────────
  aiMeta: AIProblemMeta;

  // ─── Statistics ───────────────────────────────────
  acceptanceRate: number;
  totalSubmissions: number;
  totalAccepted: number;

  // ─── Timestamps ───────────────────────────────────
  createdAt: string;
  updatedAt: string;
}

// ─── Problem Summary (List Views) ─────────────────────────
// Lightweight projection for problem lists, avoids loading
// descriptions, test cases, and starter code unnecessarily.

export interface ProblemSummary {
  id: string;
  title: string;
  slug: string;
  order: number;
  difficulty: Difficulty;
  status: ProblemStatus;
  tags: ProblemTag[];
  category: string;
  acceptanceRate: number;
  totalSubmissions: number;
  xpReward: Pick<XPReward, 'solve'>;
  createdAt: string;
}

// ─── User Problem Progress ────────────────────────────────
// Tracks a user's relationship with a specific problem.

export type UserProblemStatus = 'NOT_STARTED' | 'ATTEMPTED' | 'SOLVED';

export interface UserProblemProgress {
  problemId: string;
  userId: string;
  status: UserProblemStatus;
  /** Number of submissions the user has made */
  submissionCount: number;
  /** Best runtime in ms (if solved) */
  bestRuntime?: number;
  /** Best memory usage in MB (if solved) */
  bestMemory?: number;
  /** XP earned from this problem */
  xpEarned: number;
  /** Whether solved on first attempt */
  firstAttemptSolve: boolean;
  lastSubmittedAt?: string;
  solvedAt?: string;
}

// ─── Filter & Query Types ─────────────────────────────────

export interface ProblemFilters {
  difficulty?: Difficulty;
  tags?: ProblemTag[];
  status?: UserProblemStatus;
  search?: string;
  category?: string;
}

export interface ProblemSortOptions {
  field: 'order' | 'title' | 'difficulty' | 'acceptanceRate' | 'totalSubmissions';
  direction: 'asc' | 'desc';
}
