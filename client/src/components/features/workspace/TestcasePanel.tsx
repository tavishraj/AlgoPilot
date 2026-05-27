import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { getVisibleTestCases } from '@/data/problems';
import {
  FlaskConical,
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick,
  Loader2,
} from 'lucide-react';

// ─── Testcase & Console Panel ─────────────────────────────
// Bottom workspace panel with two tabs:
// 1. Testcases — view/edit test case inputs
// 2. Result — execution output console

export function TestcasePanel() {
  const problem = useWorkspaceStore((s) => s.problem);
  const bottomTab = useWorkspaceStore((s) => s.bottomTab);
  const setBottomTab = useWorkspaceStore((s) => s.setBottomTab);
  const activeTestCaseIndex = useWorkspaceStore((s) => s.activeTestCaseIndex);
  const setActiveTestCaseIndex = useWorkspaceStore((s) => s.setActiveTestCaseIndex);
  const customInput = useWorkspaceStore((s) => s.customInput);
  const setCustomInput = useWorkspaceStore((s) => s.setCustomInput);
  const executionStatus = useWorkspaceStore((s) => s.executionStatus);
  const testCaseResults = useWorkspaceStore((s) => s.testCaseResults);
  const consoleOutput = useWorkspaceStore((s) => s.consoleOutput);
  const runtime = useWorkspaceStore((s) => s.runtime);
  const memory = useWorkspaceStore((s) => s.memory);

  const visibleTests = problem ? getVisibleTestCases(problem) : [];

  return (
    <div className="flex h-full flex-col overflow-hidden border-t border-border bg-background/60">
      {/* Tab bar */}
      <div className="flex shrink-0 items-center gap-0 border-b border-border bg-background/40">
        <TabButton
          active={bottomTab === 'testcases'}
          onClick={() => setBottomTab('testcases')}
          icon={<FlaskConical className="h-3 w-3" />}
          label="Testcases"
        />
        <TabButton
          active={bottomTab === 'result'}
          onClick={() => setBottomTab('result')}
          icon={<Terminal className="h-3 w-3" />}
          label="Result"
          badge={
            executionStatus === 'running' ? (
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
            ) : executionStatus === 'success' ? (
              <CheckCircle2 className="h-3 w-3 text-success" />
            ) : executionStatus === 'error' ? (
              <XCircle className="h-3 w-3 text-error" />
            ) : null
          }
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {bottomTab === 'testcases' ? (
          <TestcaseTab
            testCases={visibleTests}
            activeIndex={activeTestCaseIndex}
            onSelectIndex={setActiveTestCaseIndex}
            customInput={customInput}
            onCustomInputChange={setCustomInput}
            results={testCaseResults}
          />
        ) : (
          <ResultTab
            status={executionStatus}
            output={consoleOutput}
            results={testCaseResults}
            runtime={runtime}
            memory={memory}
          />
        )}
      </div>
    </div>
  );
}

// ─── Tab Button ───────────────────────────────────────────

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
}

function TabButton({ active, onClick, icon, label, badge }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium transition-colors relative',
        active
          ? 'text-text-primary'
          : 'text-text-muted hover:text-text-secondary'
      )}
    >
      {icon}
      {label}
      {badge && <span className="ml-1">{badge}</span>}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-px bg-primary" />
      )}
    </button>
  );
}

// ─── Testcase Tab ─────────────────────────────────────────

interface TestcaseTabProps {
  testCases: Array<{ id: string; input: string; expectedOutput: string }>;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  customInput: string;
  onCustomInputChange: (value: string) => void;
  results: Array<{ testCaseId: string; passed: boolean }>;
}

function TestcaseTab({
  testCases,
  activeIndex,
  onSelectIndex,
  customInput,
  onCustomInputChange,
  results,
}: TestcaseTabProps) {
  const activeTest = testCases[activeIndex];

  return (
    <div className="flex h-full flex-col">
      {/* Test case tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border/50">
        {testCases.map((tc, i) => {
          const result = results.find((r) => r.testCaseId === tc.id);
          return (
            <button
              key={tc.id}
              onClick={() => onSelectIndex(i)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                i === activeIndex
                  ? 'bg-surface text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {result ? (
                result.passed ? (
                  <CheckCircle2 className="h-3 w-3 text-success" />
                ) : (
                  <XCircle className="h-3 w-3 text-error" />
                )
              ) : (
                <span className="h-2 w-2 rounded-full border border-text-muted/40" />
              )}
              Case {i + 1}
            </button>
          );
        })}
      </div>

      {/* Active test case content */}
      {activeTest && (
        <div className="flex-1 grid grid-cols-2 gap-3 p-3 min-h-0">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Input
            </label>
            <textarea
              value={customInput || activeTest.input}
              onChange={(e) => onCustomInputChange(e.target.value)}
              className={cn(
                'w-full h-full min-h-[60px] rounded-md border border-border bg-[#0a0c0f] p-2.5',
                'font-mono text-xs text-text-secondary resize-none',
                'outline-none focus:border-primary/30 transition-colors'
              )}
              spellCheck={false}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Expected Output
            </label>
            <div className={cn(
              'w-full h-full min-h-[60px] rounded-md border border-border bg-[#0a0c0f] p-2.5',
              'font-mono text-xs text-text-secondary overflow-auto'
            )}>
              {activeTest.expectedOutput}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Result Tab ───────────────────────────────────────────

interface ResultTabProps {
  status: string;
  output: string;
  results: Array<{ testCaseId: string; passed: boolean; runtime: number; memory: number; actualOutput: string; expectedOutput: string }>;
  runtime: number | null;
  memory: number | null;
}

function ResultTab({ status, output, results, runtime, memory }: ResultTabProps) {
  if (status === 'idle') {
    return (
      <div className="flex h-full items-center justify-center text-xs text-text-muted">
        Run your code to see results
      </div>
    );
  }

  if (status === 'running') {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-xs text-text-muted">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        Executing...
      </div>
    );
  }

  const allPassed = results.length > 0 && results.every((r) => r.passed);

  return (
    <div className="p-3 space-y-3">
      {/* Status banner */}
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold',
          allPassed
            ? 'bg-success/10 text-success border border-success/20'
            : 'bg-error/10 text-error border border-error/20'
        )}
      >
        {allPassed ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        {output}
      </div>

      {/* Metrics */}
      {(runtime !== null || memory !== null) && (
        <div className="flex items-center gap-4 text-xs text-text-tertiary">
          {runtime !== null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {runtime} ms
            </span>
          )}
          {memory !== null && (
            <span className="flex items-center gap-1">
              <MemoryStick className="h-3 w-3" />
              {memory} MB
            </span>
          )}
        </div>
      )}

      {/* Per-test results */}
      {results.length > 0 && (
        <div className="space-y-1.5">
          {results.map((r, i) => (
            <div
              key={r.testCaseId}
              className={cn(
                'flex items-center gap-3 rounded-md border px-3 py-2 text-xs',
                r.passed
                  ? 'border-success/15 bg-success/[0.03]'
                  : 'border-error/15 bg-error/[0.03]'
              )}
            >
              {r.passed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-error shrink-0" />
              )}
              <span className="font-medium text-text-secondary">Test {i + 1}</span>
              <span className="text-text-muted">{r.runtime}ms</span>
              {!r.passed && (
                <span className="ml-auto font-mono text-error/80 truncate max-w-[200px]">
                  got: {r.actualOutput}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
