import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import type { AiRequestContext, TestCaseResult } from '@/services/ai.service';

/**
 * A custom hook that automatically extracts all necessary contextual
 * data from the workspace store to power AI-DOST requests.
 * Enhanced with execution status, console output, and hint tracking.
 */
export function useAiContext() {
  const problem = useWorkspaceStore((s) => s.problem);
  const code = useWorkspaceStore((s) => s.code);
  const language = useWorkspaceStore((s) => s.language);
  const testCaseResults = useWorkspaceStore((s) => s.testCaseResults);
  const executionStatus = useWorkspaceStore((s) => s.executionStatus);
  const consoleOutput = useWorkspaceStore((s) => s.consoleOutput);

  const getContext = (): AiRequestContext | null => {
    if (!problem) return null;

    // Map test case results into the format the AI backend expects
    const formattedTestResults: TestCaseResult[] = testCaseResults.map((t) => ({
      input: t.input,
      expectedOutput: t.expectedOutput,
      actualOutput: t.actualOutput || '',
      passed: t.passed,
    }));

    return {
      problemTitle: problem.title,
      difficulty: problem.difficulty,
      description: problem.description,
      userCode: code,
      language: language,
      testResults: formattedTestResults.length > 0 ? formattedTestResults : undefined,
      consoleOutput: consoleOutput || undefined,
    };
  };

  /**
   * Returns workspace state signals that the orchestrator can use
   * to determine which AI action to suggest.
   */
  const getWorkspaceSignals = () => ({
    hasCode: code.trim().length > 0,
    hasRun: executionStatus !== 'idle',
    isRunning: executionStatus === 'running',
    hasTestResults: testCaseResults.length > 0,
    hasFailingTests: testCaseResults.some((t) => !t.passed),
    hasPassingTests: testCaseResults.some((t) => t.passed),
    allTestsPass: testCaseResults.length > 0 && testCaseResults.every((t) => t.passed),
    hasError: executionStatus === 'error',
    hasConsoleOutput: !!consoleOutput?.trim(),
    codeLength: code.trim().length,
  });

  return { getContext, getWorkspaceSignals };
}
