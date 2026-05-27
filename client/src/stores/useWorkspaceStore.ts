import { create } from 'zustand';
import type { Problem, SupportedLanguage } from '@/types/problem';
import type { TestCaseResult } from '@/types/submission';
import { getProblemBySlug, getStarterCode, getVisibleTestCases } from '@/data/problems';

// ─── Execution Status ─────────────────────────────────────

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error';

// ─── Bottom Panel Tab ─────────────────────────────────────

export type BottomTab = 'testcases' | 'result';

// ─── Workspace State ──────────────────────────────────────

interface WorkspaceState {
  // ─── Problem ──────────────────────────────────────
  problem: Problem | null;
  problemSlug: string | null;

  // ─── Editor ───────────────────────────────────────
  code: string;
  language: SupportedLanguage;
  fontSize: number;

  // ─── Execution ────────────────────────────────────
  executionStatus: ExecutionStatus;
  testCaseResults: TestCaseResult[];
  activeTestCaseIndex: number;
  customInput: string;
  consoleOutput: string;
  runtime: number | null;
  memory: number | null;

  // ─── Timer ────────────────────────────────────────
  timerRunning: boolean;
  timerStarted: boolean;
  elapsedSeconds: number;

  // ─── UI ───────────────────────────────────────────
  bottomTab: BottomTab;
  aiPanelCollapsed: boolean;

  // ─── Actions ──────────────────────────────────────
  loadProblem: (slug: string) => void;
  setCode: (code: string) => void;
  switchLanguage: (language: SupportedLanguage) => void;
  setFontSize: (size: number) => void;
  resetCode: () => void;

  setExecutionStatus: (status: ExecutionStatus) => void;
  setTestCaseResults: (results: TestCaseResult[]) => void;
  setActiveTestCaseIndex: (index: number) => void;
  setCustomInput: (input: string) => void;
  setConsoleOutput: (output: string) => void;
  setRuntime: (ms: number | null) => void;
  setMemory: (mb: number | null) => void;

  startTimer: () => void;
  tickTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;

  setBottomTab: (tab: BottomTab) => void;
  toggleAiPanel: () => void;

  resetWorkspace: () => void;
}

// ─── Initial State ────────────────────────────────────────

const initialState = {
  problem: null as Problem | null,
  problemSlug: null as string | null,
  code: '',
  language: 'javascript' as SupportedLanguage,
  fontSize: 14,
  executionStatus: 'idle' as ExecutionStatus,
  testCaseResults: [] as TestCaseResult[],
  activeTestCaseIndex: 0,
  customInput: '',
  consoleOutput: '',
  runtime: null as number | null,
  memory: null as number | null,
  timerRunning: false,
  timerStarted: false,
  elapsedSeconds: 0,
  bottomTab: 'testcases' as BottomTab,
  aiPanelCollapsed: false,
};

// ─── Store ────────────────────────────────────────────────

export const useWorkspaceStore = create<WorkspaceState>()((set, get) => ({
  ...initialState,

  // ─── Problem Actions ──────────────────────────────

  loadProblem: (slug) => {
    const problem = getProblemBySlug(slug);
    if (!problem) return;

    const language = get().language;
    const code = getStarterCode(problem, language);
    const visibleTests = getVisibleTestCases(problem);

    set({
      problem,
      problemSlug: slug,
      code,
      executionStatus: 'idle',
      testCaseResults: [],
      activeTestCaseIndex: 0,
      customInput: visibleTests[0]?.input ?? '',
      consoleOutput: '',
      runtime: null,
      memory: null,
      timerRunning: false,
      timerStarted: false,
      elapsedSeconds: 0,
      bottomTab: 'testcases',
    });
  },

  // ─── Editor Actions ───────────────────────────────

  setCode: (code) => {
    const state = get();
    // Auto-start timer on first keystroke
    if (!state.timerStarted && state.problem) {
      set({ code, timerRunning: true, timerStarted: true });
    } else {
      set({ code });
    }
  },

  switchLanguage: (language) => {
    const { problem } = get();
    if (!problem) {
      set({ language });
      return;
    }
    const code = getStarterCode(problem, language);
    set({ language, code });
  },

  setFontSize: (fontSize) => set({ fontSize }),

  resetCode: () => {
    const { problem, language } = get();
    if (!problem) return;
    const code = getStarterCode(problem, language);
    set({ code });
  },

  // ─── Execution Actions ────────────────────────────

  setExecutionStatus: (executionStatus) => set({ executionStatus }),
  setTestCaseResults: (testCaseResults) => set({ testCaseResults }),
  setActiveTestCaseIndex: (activeTestCaseIndex) => set({ activeTestCaseIndex }),
  setCustomInput: (customInput) => set({ customInput }),
  setConsoleOutput: (consoleOutput) => set({ consoleOutput }),
  setRuntime: (runtime) => set({ runtime }),
  setMemory: (memory) => set({ memory }),

  // ─── Timer Actions ────────────────────────────────

  startTimer: () => set({ timerRunning: true, timerStarted: true }),
  tickTimer: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),
  pauseTimer: () => set({ timerRunning: false }),
  resetTimer: () => set({ timerRunning: false, timerStarted: false, elapsedSeconds: 0 }),

  // ─── UI Actions ───────────────────────────────────

  setBottomTab: (bottomTab) => set({ bottomTab }),
  toggleAiPanel: () => set((s) => ({ aiPanelCollapsed: !s.aiPanelCollapsed })),

  // ─── Full Reset ───────────────────────────────────

  resetWorkspace: () => set(initialState),
}));
