import { Link } from 'react-router-dom';
import { ChevronLeft, Play, Send, Timer, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LANGUAGES } from '@/lib/constants';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useTimer } from '@/hooks/useTimer';
import { executeCode } from '@/services/execution.service';
import { getVisibleTestCases } from '@/data/problems';
import { DifficultyBadge } from '@/components/features/problems';
import { ROUTE_PATHS } from '@/routes/paths';
import type { SupportedLanguage } from '@/types/problem';

// ─── Workspace Toolbar ────────────────────────────────────
// Minimal top bar: navigation, problem info, timer, actions.

export function WorkspaceToolbar() {
  const problem = useWorkspaceStore((s) => s.problem);
  const language = useWorkspaceStore((s) => s.language);
  const switchLanguage = useWorkspaceStore((s) => s.switchLanguage);
  const executionStatus = useWorkspaceStore((s) => s.executionStatus);
  const setExecutionStatus = useWorkspaceStore((s) => s.setExecutionStatus);
  const setTestCaseResults = useWorkspaceStore((s) => s.setTestCaseResults);
  const setConsoleOutput = useWorkspaceStore((s) => s.setConsoleOutput);
  const setRuntime = useWorkspaceStore((s) => s.setRuntime);
  const setMemory = useWorkspaceStore((s) => s.setMemory);
  const setBottomTab = useWorkspaceStore((s) => s.setBottomTab);
  const code = useWorkspaceStore((s) => s.code);
  const { formatted } = useTimer();

  const handleRun = async () => {
    if (!problem || executionStatus === 'running') return;

    setExecutionStatus('running');
    setBottomTab('result');
    setConsoleOutput('Running code...');

    try {
      const testCases = getVisibleTestCases(problem);
      const response = await executeCode({ code, language, testCases });

      setTestCaseResults(response.results);
      setRuntime(response.runtime);
      setMemory(response.memory);
      setExecutionStatus(response.success ? 'success' : 'error');
      setConsoleOutput(
        response.success
          ? `✓ All ${response.totalPassed} test cases passed`
          : `✗ ${response.totalFailed} of ${response.totalPassed + response.totalFailed} test cases failed`
      );
    } catch {
      setExecutionStatus('error');
      setConsoleOutput('Execution failed. Please try again.');
    }
  };

  if (!problem) return null;

  return (
    <header
      className={cn(
        'col-span-full flex h-12 items-center gap-2 border-b border-border',
        'bg-background/90 px-3 backdrop-blur-xl'
      )}
    >
      {/* Back */}
      <Link
        to={ROUTE_PATHS.practice}
        className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface hover:text-text-primary"
        aria-label="Back to problems"
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {/* Problem info */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-xs font-medium text-text-muted">#{problem.order}</span>
        <h1 className="truncate text-sm font-medium text-text-primary">
          {problem.title}
        </h1>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Timer */}
      <div className="hidden items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-mono text-text-tertiary sm:flex">
        <Timer className="h-3 w-3" />
        {formatted}
      </div>

      {/* Language selector */}
      <select
        value={language}
        onChange={(e) => switchLanguage(e.target.value as SupportedLanguage)}
        className={cn(
          'h-7 rounded-md border border-border bg-surface px-2 text-xs font-medium text-text-secondary',
          'outline-none transition-colors hover:border-border-hover focus:border-primary/40'
        )}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>

      {/* Run */}
      <button
        onClick={handleRun}
        disabled={executionStatus === 'running'}
        className={cn(
          'btn h-7 gap-1.5 rounded-md px-3 text-xs font-medium',
          'bg-success/15 text-success border border-success/20',
          'hover:bg-success/25 hover:border-success/30',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-150'
        )}
      >
        {executionStatus === 'running' ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Play className="h-3 w-3" />
        )}
        Run
      </button>

      {/* Submit (placeholder) */}
      <button
        disabled
        className={cn(
          'btn h-7 gap-1.5 rounded-md px-3 text-xs font-medium',
          'bg-primary/15 text-primary border border-primary/20',
          'opacity-50 cursor-not-allowed',
          'transition-all duration-150'
        )}
        title="Submit will be available with Judge0 integration"
      >
        <Send className="h-3 w-3" />
        Submit
      </button>
    </header>
  );
}
