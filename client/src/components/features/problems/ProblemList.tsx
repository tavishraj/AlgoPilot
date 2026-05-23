import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { ProblemCard } from './ProblemCard';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';
import type { ProblemSummary, Difficulty } from '@/types/problem';

interface ProblemListProps {
  problems: ProblemSummary[];
  isLoading?: boolean;
  onProblemClick?: (slug: string) => void;
}

const difficulties: (Difficulty | 'ALL')[] = ['ALL', 'EASY', 'MEDIUM', 'HARD'];

export function ProblemList({ problems, isLoading, onProblemClick }: ProblemListProps) {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'ALL'>('ALL');

  const filtered = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'ALL' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[72px] rounded-[var(--radius-lg)] animate-shimmer"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              'w-full rounded-[var(--radius-md)] border border-border bg-surface pl-10 pr-4 py-2.5',
              'text-sm text-text-primary placeholder:text-text-muted',
              'focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20',
              'transition-all duration-200'
            )}
          />
        </div>
        <div className="flex items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={cn(
                'px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-all duration-200',
                selectedDifficulty === d
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-tertiary hover:text-text-secondary'
              )}
            >
              {d === 'ALL' ? 'All' : d.charAt(0) + d.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Problem List */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((problem, index) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              index={index}
              onClick={() => onProblemClick?.(problem.slug)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Filter className="h-7 w-7" />}
          title="No problems found"
          description="Try adjusting your search or filter criteria."
        />
      )}
    </div>
  );
}
