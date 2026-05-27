// ─── Execution Service ────────────────────────────────────
// Mock execution layer for frontend development.
// Drop-in replacement point for Judge0 or custom judge backend.

import type { TestCase, SupportedLanguage } from '@/types/problem';
import type { TestCaseResult } from '@/types/submission';

// ─── Execution Request ────────────────────────────────────

export interface ExecutionRequest {
  code: string;
  language: SupportedLanguage;
  testCases: TestCase[];
}

// ─── Execution Response ───────────────────────────────────

export interface ExecutionResponse {
  success: boolean;
  results: TestCaseResult[];
  totalPassed: number;
  totalFailed: number;
  /** Aggregate runtime in ms */
  runtime: number;
  /** Aggregate memory in MB */
  memory: number;
  /** Compiler/interpreter output if error */
  compilerOutput?: string;
}

// ─── Language → Judge0 ID Map (for future use) ────────────

export const LANGUAGE_ID_MAP: Record<SupportedLanguage, number> = {
  javascript: 63,
  typescript: 74,
  python: 71,
  java: 62,
  cpp: 54,
};

// ─── Mock Execution ───────────────────────────────────────
// Simulates code execution with realistic delays and
// randomized results. Replace with Judge0 API calls.

function generateMockResult(testCase: TestCase, index: number): TestCaseResult {
  // First 2 test cases always pass, rest are random (for realistic feel)
  const passed = index < 2 ? true : Math.random() > 0.3;
  const runtime = Math.round(2 + Math.random() * 18);
  const memory = Math.round((1.2 + Math.random() * 3.5) * 10) / 10;

  return {
    testCaseId: testCase.id,
    passed,
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
    actualOutput: passed ? testCase.expectedOutput : 'undefined',
    runtime,
    memory,
    error: passed ? undefined : undefined,
  };
}

export async function executeCode(request: ExecutionRequest): Promise<ExecutionResponse> {
  // Simulate network + execution delay
  const delay = 800 + Math.random() * 1200;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const results = request.testCases.map((tc, i) => generateMockResult(tc, i));
  const totalPassed = results.filter((r) => r.passed).length;
  const totalFailed = results.length - totalPassed;
  const runtime = results.reduce((sum, r) => sum + r.runtime, 0);
  const memory = Math.max(...results.map((r) => r.memory));

  return {
    success: totalFailed === 0,
    results,
    totalPassed,
    totalFailed,
    runtime,
    memory,
  };
}

// ─── Future: Judge0 Integration ───────────────────────────
// export async function executeCodeJudge0(request: ExecutionRequest): Promise<ExecutionResponse> {
//   const response = await api.post('/execute', {
//     source_code: request.code,
//     language_id: LANGUAGE_ID_MAP[request.language],
//     stdin: request.testCases[0]?.input,
//   });
//   // Poll for results...
//   return parseJudge0Response(response.data);
// }
