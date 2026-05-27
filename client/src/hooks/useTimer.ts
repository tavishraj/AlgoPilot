import { useEffect, useRef, useCallback } from 'react';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

// ─── Timer Hook ───────────────────────────────────────────
// Drives the workspace solve timer via setInterval.
// The workspace store owns the state; this hook just ticks.

export function useTimer() {
  const timerRunning = useWorkspaceStore((s) => s.timerRunning);
  const elapsedSeconds = useWorkspaceStore((s) => s.elapsedSeconds);
  const tickTimer = useWorkspaceStore((s) => s.tickTimer);
  const pauseTimer = useWorkspaceStore((s) => s.pauseTimer);
  const resetTimer = useWorkspaceStore((s) => s.resetTimer);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        tickTimer();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerRunning, tickTimer]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  return {
    elapsed: elapsedSeconds,
    formatted: formatTime(elapsedSeconds),
    isRunning: timerRunning,
    pause: pauseTimer,
    reset: resetTimer,
  };
}
