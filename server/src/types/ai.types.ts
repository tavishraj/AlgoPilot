// ─── AI-DOST Type Definitions ────────────────────────────
// Complete type system for AlgoPilot's AI service layer.
// Designed for type safety across prompts, providers, and responses.
// Extended with context analysis and orchestration types.

// ─── Request Context ─────────────────────────────────────

/** Full problem context sent from the frontend workspace */
export interface AiRequestContext {
  problemTitle: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  description: string;
  userCode: string;
  language: SupportedLanguage;
  testResults?: TestResult[];
  /** Optional console output from execution (runtime errors, etc.) */
  consoleOutput?: string;
  /** Number of times the user has requested hints for this problem */
  hintHistory?: number;
}

/** Test result from the execution engine */
export interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

/** Languages the AI understands for code analysis */
export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp';

// ─── Endpoint-Specific Requests ──────────────────────────

export interface AiHintRequest {
  context: AiRequestContext;
  /** Progressive hint level: 1 = direction, 2 = concept, 3 = approach, 4 = pseudocode */
  hintLevel: HintLevel;
}

export interface AiExplainRequest {
  context: AiRequestContext;
}

export interface AiDebugRequest {
  context: AiRequestContext;
  /** Test results are required for debugging */
  testResults: TestResult[];
}

export interface AiConceptRequest {
  context: AiRequestContext;
  /** Optional specific concept to explain (e.g. "two pointers") */
  concept?: string;
}

// ─── Hint Levels ─────────────────────────────────────────

export type HintLevel = 1 | 2 | 3 | 4;

export const HINT_LEVEL_NAMES: Record<HintLevel, string> = {
  1: 'Directional Guidance',
  2: 'Conceptual Insight',
  3: 'Algorithmic Approach',
  4: 'Pseudocode Guidance',
};

// ─── AI Response ─────────────────────────────────────────

export interface AiResponse {
  success: boolean;
  data?: {
    content: string;
    metadata: AiResponseMetadata;
  };
  error?: string;
}

export interface AiResponseMetadata {
  model: string;
  tokensUsed: number;
  responseTimeMs: number;
  promptType: PromptType;
}

export type PromptType = 'hint' | 'explain' | 'debug' | 'concept';

// ─── Provider Abstraction ────────────────────────────────

export interface AiProviderConfig {
  name: string;
  apiUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
  headers: Record<string, string>;
}

/** Raw provider response before formatting */
export interface AiProviderResponse {
  content: string;
  model: string;
  tokensUsed: number;
}

// ─── Prompt Messages ─────────────────────────────────────

export type PromptRole = 'system' | 'user' | 'assistant';

export interface PromptMessage {
  role: PromptRole;
  content: string;
}

// ─── Context Analysis Types ──────────────────────────────

/** How far along the user is in their solution */
export type CodeProgressLevel =
  | 'empty'        // No meaningful code written
  | 'boilerplate'  // Only starter code / function signature
  | 'partial'      // Started implementing but incomplete
  | 'complete'     // Full attempt that may or may not work
  | 'optimized';   // Shows signs of optimization

/** A potential issue detected in user code */
export interface CodeIssue {
  type: CodeIssueType;
  description: string;
  /** Confidence level 0-1 that this is actually an issue */
  confidence: number;
}

export type CodeIssueType =
  | 'infinite_loop'
  | 'off_by_one'
  | 'wrong_data_structure'
  | 'missing_edge_case'
  | 'inefficient_approach'
  | 'syntax_pattern'
  | 'missing_return'
  | 'unused_variable';

/** Complexity signals detected in the code */
export interface ComplexitySignal {
  /** Estimated time complexity based on loop/recursion patterns */
  estimatedTimeComplexity: string;
  /** Whether the approach appears brute-force */
  isBruteForce: boolean;
  /** Nesting depth of loops/conditionals */
  maxNestingDepth: number;
}

/** Structural analysis of the code */
export interface CodeStructure {
  hasLoops: boolean;
  hasRecursion: boolean;
  hasHashMap: boolean;
  hasSorting: boolean;
  hasNestedLoops: boolean;
  hasBinarySearch: boolean;
  hasTwoPointers: boolean;
  hasStackQueue: boolean;
  lineCount: number;
  functionCount: number;
}

/** Full code analysis result from the analyzer */
export interface CodeAnalysis {
  progressLevel: CodeProgressLevel;
  detectedPatterns: string[];
  potentialIssues: CodeIssue[];
  complexitySignals: ComplexitySignal;
  codeStructure: CodeStructure;
}

// ─── Enriched Context ────────────────────────────────────

/** Pattern detected across test failures */
export interface FailurePattern {
  /** Total tests */
  total: number;
  /** How many passed */
  passed: number;
  /** How many failed */
  failed: number;
  /** Description of the failure pattern */
  patternDescription: string;
  /** Whether failures appear to be edge cases */
  isEdgeCaseFailure: boolean;
  /** Whether all tests fail (likely fundamental issue) */
  isCompleteFailure: boolean;
}

/** Difficulty-specific metadata for prompt calibration */
export interface DifficultyProfile {
  /** Expected optimal time complexity for this difficulty tier */
  expectedComplexity: string;
  /** Teaching tone adjustment */
  toneLevel: 'beginner' | 'intermediate' | 'advanced';
  /** Common pitfall categories for this difficulty */
  commonPitfalls: string[];
  /** How detailed explanations should be */
  explanationDepth: 'detailed' | 'moderate' | 'concise';
}

/** Fully enriched context produced by the assembler */
export interface EnrichedContext {
  /** Original request context */
  raw: AiRequestContext;
  /** Code analysis results */
  analysis: CodeAnalysis;
  /** Test failure pattern analysis (null if no test results) */
  failurePattern: FailurePattern | null;
  /** Difficulty-calibrated profile */
  difficultyProfile: DifficultyProfile;
  /** Pre-formatted context summary for prompt injection */
  contextSummary: string;
}

// ─── Prompt Orchestration Types ──────────────────────────

/** What kind of AI interaction the user wants */
export type PromptIntent = 'hint' | 'explain' | 'debug' | 'concept';

/** Parameters that vary by intent */
export interface PromptParams {
  /** Hint level (only for hint intent) */
  hintLevel?: HintLevel;
  /** Specific concept name (only for concept intent) */
  concept?: string;
  /** Test results (only for debug intent) */
  testResults?: TestResult[];
}

// ─── Future-Ready Types ──────────────────────────────────

/** Streaming options for future SSE support */
export interface StreamOptions {
  enabled: boolean;
  onChunk?: (chunk: string) => void;
  onComplete?: (full: string) => void;
  signal?: AbortSignal;
}

/** Conversation memory for future multi-turn support */
export interface ConversationMemory {
  sessionId: string;
  messages: PromptMessage[];
  hintLevelReached: HintLevel;
  totalInteractions: number;
}

/** User skill profile for future adaptive difficulty */
export interface UserSkillProfile {
  estimatedLevel: 'beginner' | 'intermediate' | 'advanced';
  solvedProblems: number;
  averageHintsUsed: number;
  strongTopics: string[];
  weakTopics: string[];
}
