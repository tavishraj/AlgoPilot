import { useState, useMemo } from 'react';
import { Search, Filter, Tag } from 'lucide-react';
import { ProblemCard } from './ProblemCard';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';
import type { ProblemSummary, Difficulty, ProblemTag } from '@/types/problem';

interface ProblemListProps {
  problems: ProblemSummary[];
  availableTags?: string[];
  isLoading?: boolean;
  onProblemClick?: (slug: string) => void;
}

const difficulties: (Difficulty | 'ALL')[] = ['ALL', 'EASY', 'MEDIUM', 'HARD'];

export function ProblemList({ problems, availableTags = [], isLoading, onProblemClick }: ProblemListProps) {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'ALL'>('ALL');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesDifficulty = selectedDifficulty === 'ALL' || p.difficulty === selectedDifficulty;
      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((tag) => p.tags.includes(tag as ProblemTag));
      return matchesSearch && matchesDifficulty && matchesTags;
    });
  }, [problems, search, selectedDifficulty, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

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
      {/* Search & Difficulty Filter */}
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

      {/* Tag Filter */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Tag className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                'shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-150',
                selectedTags.includes(tag)
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border bg-surface/50 text-text-muted hover:text-text-secondary hover:border-border-hover'
              )}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="shrink-0 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">
          {filtered.length} of {problems.length} problems
        </p>
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
