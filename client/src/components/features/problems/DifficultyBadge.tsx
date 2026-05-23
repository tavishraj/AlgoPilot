import { cn } from '@/lib/utils';
import type { Difficulty } from '@/types/problem';

const difficultyConfig: Record<Difficulty, { label: string; className: string }> = {
  EASY: {
    label: 'Easy',
    className: 'bg-success-muted/50 text-success border-success/20',
  },
  MEDIUM: {
    label: 'Medium',
    className: 'bg-warning-muted/50 text-warning border-warning/20',
  },
  HARD: {
    label: 'Hard',
    className: 'bg-error-muted/50 text-error border-error/20',
  },
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-full)] border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
