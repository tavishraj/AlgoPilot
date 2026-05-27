import { useState, useRef, useEffect } from 'react';
import { Bot, ChevronLeft, ChevronRight, MessageSquareX, Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
// Removed cn
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useAiContext } from '@/hooks/useAiContext';
import { useAiOrchestrator } from '@/hooks/useAiOrchestrator';
import { aiService, HINT_LEVEL_NAMES } from '@/services/ai.service';
import type { HintLevel } from '@/services/ai.service';
import { AiMessageBubble, AiLoadingBubble, type AiMessage, type MessageType } from './AiMessageBubble';
import { AiActionButtons } from './AiActionButtons';

// ─── AI-DOST Panel ────────────────────────────────────────

export function AiDostPanel() {
  const aiPanelCollapsed = useWorkspaceStore((s) => s.aiPanelCollapsed);
  const toggleAiPanel = useWorkspaceStore((s) => s.toggleAiPanel);
  const { getContext } = useAiContext();
  const {
    hintLevel,
    advanceHintLevel,
    resetHintProgression,
    getSmartSuggestion,
  } = useAiOrchestrator();

  const [messages, setMessages] = useState<AiMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Mutations ───────────────────────────────────────────

  const actionMutation = useMutation({
    mutationFn: async (type: MessageType) => {
      const context = getContext();
      if (!context) throw new Error('No context available');

      switch (type) {
        case 'hint':
          // Use contextual hint for enriched responses
          return aiService.getContextualHint(context, hintLevel);
        case 'explain':
          return aiService.explainCode(context);
        case 'debug':
          return aiService.debugCode(context);
        case 'concept':
          return aiService.explainConcept(context);
        default:
          throw new Error('Unknown action type');
      }
    },
    onMutate: (type) => {
      // Add a user message to chat history immediately
      let userText = '';
      if (type === 'hint') userText = `Can I get a hint? (Level ${hintLevel}: ${HINT_LEVEL_NAMES[hintLevel]})`;
      else if (type === 'explain') userText = 'Can you explain my code?';
      else if (type === 'debug') userText = 'Can you help me debug my failing tests?';
      else if (type === 'concept') userText = 'Can you teach me the core concept here?';

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'user', content: userText },
      ]);
    },
    onSuccess: (data, type) => {
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.data!.content,
          type: type,
        },
      ]);

      // Progress hint level after a successful hint
      if (type === 'hint') {
        advanceHintLevel();
      }
    },
    onError: (error) => {
      // Extract the real backend error message from the response body
      const axiosError = error as any;
      const backendMessage = axiosError?.response?.data?.error;
      const displayMessage = backendMessage
        || (error instanceof Error ? error.message : 'Something went wrong.');

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: displayMessage,
          type: 'chat',
        },
      ]);
    },
  });

  const handleAction = (type: MessageType) => {
    if (actionMutation.isPending) return;
    actionMutation.mutate(type);
  };

  const clearChat = () => {
    setMessages([]);
    resetHintProgression();
  };

  // Get smart suggestion for the UI
  const suggestion = getSmartSuggestion();

  // ─── Collapsed State ─────────────────────────────────────

  if (aiPanelCollapsed) {
    return (
      <div className="flex h-full flex-col items-center border-l border-border bg-background/50 py-3">
        <button
          onClick={toggleAiPanel}
          className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface hover:text-primary"
          title="Expand AI-DOST panel"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <div className="mt-4 flex flex-col items-center gap-3">
          <Bot className="h-4 w-4 text-primary/60" />
          <span className="writing-mode-vertical text-xs font-medium text-text-muted" style={{ writingMode: 'vertical-lr' }}>
            AI-DOST
          </span>
        </div>
      </div>
    );
  }

  // ─── Expanded State ──────────────────────────────────────

  return (
    <div className="flex h-full flex-col overflow-hidden border-l border-border bg-background">
      {/* Panel header */}
      <div className="panel-header justify-between shrink-0 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
            <Bot className="h-3 w-3 text-primary" />
          </div>
          <span className="text-xs font-semibold text-text-primary">AI-DOST</span>
          <span className="flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-dot-pulse" />
            Ready
          </span>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex h-6 w-6 items-center justify-center rounded text-text-muted transition-colors hover:bg-error/10 hover:text-error"
              title="Clear chat"
            >
              <MessageSquareX className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={toggleAiPanel}
            className="flex h-6 w-6 items-center justify-center rounded text-text-muted transition-colors hover:bg-surface hover:text-text-secondary"
            title="Collapse panel"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Hint Level Indicator */}
      <div className="shrink-0 border-b border-border/50 px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
            Hint Progress
          </span>
          <span className="text-[10px] text-text-muted">
            Level {hintLevel}/4
          </span>
        </div>
        <div className="mt-1.5 flex gap-1">
          {([1, 2, 3, 4] as HintLevel[]).map((level) => (
            <div
              key={level}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                level <= hintLevel
                  ? 'bg-primary'
                  : 'bg-border/50'
              }`}
              title={HINT_LEVEL_NAMES[level]}
            />
          ))}
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-text-primary">I'm AI-DOST</h3>
            <p className="max-w-[200px] text-xs leading-relaxed text-text-muted">
              Your personal coding mentor. I can give you hints, explain concepts, and help you debug.
            </p>
            {suggestion && (
              <p className="mt-3 text-[10px] text-primary/70">
                💡 Suggestion: {suggestion.reason}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-5 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <AiMessageBubble key={msg.id} message={msg} />
              ))}
              {actionMutation.isPending && <AiLoadingBubble key="loading" />}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input / Action Area */}
      <div className="shrink-0 border-t border-border p-3 bg-surface/30">
        <AiActionButtons
          onAction={handleAction}
          isLoading={actionMutation.isPending}
          hintLevel={hintLevel}
          suggestedAction={suggestion.action}
        />
      </div>
    </div>
  );
}
