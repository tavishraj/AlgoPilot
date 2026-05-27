import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { DifficultyBadge } from '@/components/features/problems';
import { BookOpen, Zap, Clock, Tag } from 'lucide-react';

// ─── Problem Panel ────────────────────────────────────────
// Left workspace panel: problem description, examples,
// constraints. Scrollable, read-only.

export function ProblemPanel() {
  const problem = useWorkspaceStore((s) => s.problem);

  if (!problem) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-muted">
        No problem loaded
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden border-r border-border">
      {/* Panel header */}
      <div className="panel-header shrink-0">
        <BookOpen className="h-3.5 w-3.5 text-text-muted" />
        <span className="text-xs font-medium text-text-secondary">Description</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Title + Difficulty */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-text-muted">#{problem.order}</span>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
          <h2 className="text-lg font-semibold text-text-primary leading-snug">
            {problem.title}
          </h2>
        </div>

        {/* Tags + Meta */}
        <div className="flex flex-wrap items-center gap-2">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-text-tertiary"
            >
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 text-xs text-warning">
            <Zap className="h-3 w-3" />
            {problem.xpReward.solve} XP
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-text-muted">
            <Clock className="h-3 w-3" />
            ~{problem.difficulty === 'EASY' ? '10' : problem.difficulty === 'MEDIUM' ? '20' : '35'} min
          </span>
        </div>

        {/* Description */}
        <div className="text-sm leading-relaxed text-text-secondary space-y-3">
          {problem.description.split('\n\n').map((paragraph, i) => (
            <p key={i}>
              {paragraph.split('`').map((segment, j) =>
                j % 2 === 1 ? (
                  <code
                    key={j}
                    className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-primary"
                  >
                    {segment}
                  </code>
                ) : (
                  <span key={j}>{segment}</span>
                )
              )}
            </p>
          ))}
        </div>

        {/* Examples */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Examples
          </h3>
          {problem.examples.map((example, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-surface/50 p-3 space-y-2"
            >
              <div className="text-xs text-text-muted font-medium">Example {i + 1}</div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-xs text-text-muted">Input: </span>
                  <code className="font-mono text-xs text-text-primary">{example.input}</code>
                </div>
                <div>
                  <span className="text-xs text-text-muted">Output: </span>
                  <code className="font-mono text-xs text-text-primary">{example.output}</code>
                </div>
                {example.explanation && (
                  <div className="pt-1 border-t border-border/50">
                    <span className="text-xs text-text-muted">Explanation: </span>
                    <span className="text-xs text-text-tertiary">{example.explanation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Constraints
          </h3>
          <ul className="space-y-1">
            {problem.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-tertiary">
                <span className="mt-1 h-1 w-1 rounded-full bg-text-muted shrink-0" />
                <code className="font-mono">{c.description}</code>
              </li>
            ))}
          </ul>
        </div>

        {/* Complexity hints */}
        <div className="rounded-lg border border-border/60 bg-surface/30 p-3 space-y-1.5">
          <h4 className="text-xs font-medium text-text-muted">Target Complexity</h4>
          <div className="flex gap-4 text-xs">
            <span className="text-text-tertiary">
              Time: <code className="font-mono text-primary">{problem.aiMeta.optimalTimeComplexity}</code>
            </span>
            <span className="text-text-tertiary">
              Space: <code className="font-mono text-primary">{problem.aiMeta.optimalSpaceComplexity}</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
