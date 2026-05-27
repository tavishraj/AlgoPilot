import { Code2, AlertTriangle, Sparkles, BookOpen, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { HINT_LEVEL_NAMES } from '@/services/ai.service';
import type { HintLevel } from '@/services/ai.service';
import type { MessageType } from './AiMessageBubble';

interface AiActionButtonsProps {
  onAction: (action: MessageType) => void;
  isLoading: boolean;
  hintLevel: HintLevel;
  suggestedAction?: MessageType;
}

export function AiActionButtons({ onAction, isLoading, hintLevel, suggestedAction }: AiActionButtonsProps) {
  const testCaseResults = useWorkspaceStore((s) => s.testCaseResults);
  const hasFailingTests = testCaseResults.some((t) => !t.passed);

  return (
    <div className="grid grid-cols-2 gap-2">
      <ActionButton
        icon={Sparkles}
        label={`Hint L${hintLevel}`}
        sublabel={HINT_LEVEL_NAMES[hintLevel]}
        onClick={() => onAction('hint')}
        disabled={isLoading}
        variant="primary"
        isSuggested={suggestedAction === 'hint'}
      />
      <ActionButton
        icon={Code2}
        label="Explain Code"
        onClick={() => onAction('explain')}
        disabled={isLoading}
        isSuggested={suggestedAction === 'explain'}
      />
      <ActionButton
        icon={BookOpen}
        label="Teach Concept"
        onClick={() => onAction('concept')}
        disabled={isLoading}
        isSuggested={suggestedAction === 'concept'}
      />
      <ActionButton
        icon={AlertTriangle}
        label="Debug Tests"
        onClick={() => onAction('debug')}
        disabled={isLoading || !hasFailingTests}
        title={!hasFailingTests ? 'Run code and fail a test to use debugging' : undefined}
        isSuggested={suggestedAction === 'debug' && hasFailingTests}
      />
    </div>
  );
}

// ─── Internal Button Component ─────────────────────────────

interface ActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sublabel?: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary';
  title?: string;
  isSuggested?: boolean;
}

function ActionButton({ icon: Icon, label, sublabel, onClick, disabled, variant = 'default', title, isSuggested }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'group relative flex items-center justify-center gap-2 rounded-lg border p-2 text-[11px] font-medium transition-all duration-200',
        disabled ? 'cursor-not-allowed opacity-50' : 'active:scale-[0.98]',
        variant === 'primary'
          ? 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10'
          : 'border-border/60 bg-surface/30 text-text-muted hover:border-border-hover hover:bg-surface hover:text-text-secondary',
        isSuggested && !disabled && 'ring-1 ring-primary/30'
      )}
    >
      {/* Suggested indicator */}
      {isSuggested && !disabled && (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] text-white">
          <Zap className="h-2 w-2" />
        </span>
      )}
      <Icon className={cn('h-3.5 w-3.5', variant === 'primary' ? 'text-primary' : 'text-text-muted group-hover:text-text-secondary')} />
      <div className="flex flex-col items-start">
        <span>{label}</span>
        {sublabel && (
          <span className="text-[9px] font-normal opacity-60">{sublabel}</span>
        )}
      </div>
    </button>
  );
}
