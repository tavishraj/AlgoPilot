import { useState, useCallback, useRef } from 'react';
import { useAiContext } from './useAiContext';
import type { HintLevel } from '@/services/ai.service';
import type { MessageType } from '@/components/features/ai/AiMessageBubble';

// ─── Suggestion Types ────────────────────────────────────

export interface SmartSuggestion {
  /** The recommended action type */
  action: MessageType;
  /** Why this action is recommended */
  reason: string;
}

// ─── AI Orchestrator Hook ────────────────────────────────

/**
 * Client-side AI orchestrator that manages hint progression,
 * smart action suggestions, and request lifecycle.
 *
 * Tracks:
 * - Current hint level per problem (auto-progresses)
 * - Workspace state for intelligent suggestions
 * - Abort controllers for cancellation
 */
export function useAiOrchestrator() {
  const { getWorkspaceSignals } = useAiContext();
  const [hintLevel, setHintLevel] = useState<HintLevel>(1);
  const [hintCount, setHintCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ─── Hint Progression ────────────────────────────────

  /**
   * Returns the current hint level and advances it after use.
   * Caps at level 4.
   */
  const getCurrentHintLevel = useCallback((): HintLevel => {
    return hintLevel;
  }, [hintLevel]);

  /**
   * Advances the hint level by one (max 4).
   * Called after a successful hint response.
   */
  const advanceHintLevel = useCallback(() => {
    setHintCount((prev) => prev + 1);
    setHintLevel((prev) => {
      if (prev >= 4) return 4;
      return (prev + 1) as HintLevel;
    });
  }, []);

  /**
   * Resets hint progression (e.g., when switching problems or clearing chat).
   */
  const resetHintProgression = useCallback(() => {
    setHintLevel(1);
    setHintCount(0);
  }, []);

  // ─── Smart Suggestions ───────────────────────────────

  /**
   * Analyzes the current workspace state and recommends
   * the most helpful AI action for the user.
   */
  const getSmartSuggestion = useCallback((): SmartSuggestion => {
    const signals = getWorkspaceSignals();

    // No code yet → suggest learning the concept first
    if (!signals.hasCode || signals.codeLength < 10) {
      return {
        action: 'concept',
        reason: 'Learn the key concept before coding',
      };
    }

    // Has failing tests → suggest debug
    if (signals.hasFailingTests) {
      return {
        action: 'debug',
        reason: 'Help find why tests are failing',
      };
    }

    // Has error output → suggest debug
    if (signals.hasError || signals.hasConsoleOutput) {
      return {
        action: 'debug',
        reason: 'Investigate the runtime error',
      };
    }

    // Has code but hasn't run yet → suggest explain or hint
    if (signals.hasCode && !signals.hasRun) {
      if (signals.codeLength > 100) {
        return {
          action: 'explain',
          reason: 'Review your approach before running',
        };
      }
      return {
        action: 'hint',
        reason: 'Get guidance on your approach',
      };
    }

    // All tests pass → celebrate and suggest explain for understanding
    if (signals.allTestsPass) {
      return {
        action: 'explain',
        reason: 'Understand your working solution',
      };
    }

    // Default → hint
    return {
      action: 'hint',
      reason: 'Get a hint to move forward',
    };
  }, [getWorkspaceSignals]);

  // ─── Abort Controller Management ─────────────────────

  /**
   * Creates a new AbortController for the current request.
   * Cancels any existing in-flight request.
   */
  const createAbortSignal = useCallback((): AbortSignal => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    return controller.signal;
  }, []);

  /**
   * Cancels the current in-flight request.
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    // Hint progression
    hintLevel,
    hintCount,
    getCurrentHintLevel,
    advanceHintLevel,
    resetHintProgression,

    // Smart suggestions
    getSmartSuggestion,

    // Request lifecycle
    createAbortSignal,
    cancelRequest,
  };
}
