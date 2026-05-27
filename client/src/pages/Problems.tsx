import { useNavigate } from 'react-router-dom';
import { AnimatedPage } from '@/components/common/AnimatedPage';
import { ProblemList } from '@/components/features/problems';
import { ROUTE_PATHS } from '@/routes/paths';
import { getAllProblemSummaries, getAllTags, MOCK_PROBLEMS } from '@/data/problems';
import { Zap, Target, TrendingUp } from 'lucide-react';

// ─── Practice Hub / Problem Explorer ──────────────────────

export function ProblemsPage() {
  const navigate = useNavigate();
  const problems = getAllProblemSummaries();
  const allTags = getAllTags();

  // Mock aggregate stats
  const totalProblems = MOCK_PROBLEMS.length;
  const totalXP = MOCK_PROBLEMS.reduce((sum, p) => sum + p.xpReward.solve, 0);

  return (
    <AnimatedPage>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-text-primary">Practice with AI</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Solve problems with real-time AI guidance, adaptive hints, and instant code review.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Target className="h-4 w-4 text-primary" />}
            label="Total Problems"
            value={String(totalProblems)}
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4 text-success" />}
            label="Solved"
            value="0"
          />
          <StatCard
            icon={<Zap className="h-4 w-4 text-warning" />}
            label="XP Available"
            value={String(totalXP)}
          />
        </div>

        {/* Problem list with integrated filters */}
        <ProblemList
          problems={problems}
          availableTags={allTags}
          onProblemClick={(slug) => navigate(ROUTE_PATHS.practiceProblem(slug))}
        />
      </div>
    </AnimatedPage>
  );
}

// ─── Stat Card ────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-3.5">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <p className="mt-1.5 text-lg font-semibold text-text-primary">{value}</p>
    </div>
  );
}
