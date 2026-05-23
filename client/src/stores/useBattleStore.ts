import { create } from 'zustand';

// ─── Future: Battle Store ─────────────────────────────────
// State management for real-time coding battles

type BattleStatus = 'idle' | 'searching' | 'matched' | 'in_progress' | 'completed';

interface BattleState {
  status: BattleStatus;
  battleId: string | null;
  opponentId: string | null;
  problemId: string | null;
  timeRemaining: number;

  // Actions
  startSearching: () => void;
  setMatched: (battleId: string, opponentId: string, problemId: string) => void;
  setTimeRemaining: (time: number) => void;
  complete: () => void;
  reset: () => void;
}

export const useBattleStore = create<BattleState>()((set) => ({
  status: 'idle',
  battleId: null,
  opponentId: null,
  problemId: null,
  timeRemaining: 0,

  startSearching: () => set({ status: 'searching' }),
  setMatched: (battleId, opponentId, problemId) =>
    set({ status: 'matched', battleId, opponentId, problemId }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  complete: () => set({ status: 'completed' }),
  reset: () =>
    set({
      status: 'idle',
      battleId: null,
      opponentId: null,
      problemId: null,
      timeRemaining: 0,
    }),
}));
