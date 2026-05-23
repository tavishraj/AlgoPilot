import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DifficultyBadge } from './DifficultyBadge';
import type { ProblemSummary } from '@/types/problem';

interface ProblemCardProps {
  problem: ProblemSummary;
  index?: number;
  isSolved?: boolean;
  onClick?: () => void;
}

export function ProblemCard({ problem, index = 0, isSolved = false, onClick }: ProblemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
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
          <h3 className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
            {problem.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
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

      {/* Right side */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-text-tertiary">
            {problem.acceptanceRate.toFixed(1)}% accepted
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-accent transition-colors" />
      </div>
    </motion.div>
  );
}
