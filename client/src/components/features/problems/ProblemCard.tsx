import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DifficultyBadge } from './DifficultyBadge';
import type { ProblemSummary } from '@/types/problem';

interface ProblemCardProps {
  problem: ProblemSummary;
  index?: number;
  isSolved?: boolean;
  onClick?: () => void;
}

// Estimated solve time by difficulty
const ESTIMATED_TIME: Record<string, string> = {
  EASY: '~10 min',
  MEDIUM: '~20 min',
  HARD: '~35 min',
};

export function ProblemCard({ problem, index = 0, isSolved = false, onClick }: ProblemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={cn(
        'group flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-border p-4',
        'bg-surface/50 transition-all duration-200',
        'hover:border-border-hover hover:bg-surface-hover cursor-pointer'
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Solved indicator */}
        <div className="flex-shrink-0">
          {isSolved ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-border" />
          )}
        </div>

        {/* Problem info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-muted shrink-0">#{problem.order}</span>
            <h3 className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
              {problem.title}
            </h3>
          </div>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <DifficultyBadge difficulty={problem.difficulty} />
            {problem.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-text-tertiary bg-surface rounded-[var(--radius-sm)] px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: XP, time, acceptance */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="hidden items-center gap-3 sm:flex">
          {'xpReward' in problem && problem.xpReward && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-warning">
              <Zap className="h-3 w-3" />
              {problem.xpReward.solve} XP
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-text-muted">
            <Clock className="h-3 w-3" />
            {ESTIMATED_TIME[problem.difficulty] ?? '~15 min'}
          </span>
          <p className="text-xs text-text-tertiary">
            {problem.acceptanceRate.toFixed(1)}%
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-accent transition-colors" />
      </div>
    </motion.div>
  );
}
