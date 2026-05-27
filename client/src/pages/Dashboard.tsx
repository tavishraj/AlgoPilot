import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  LineChart,
  Play,
  Target,
  Trophy,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedPage } from '@/components/common/AnimatedPage';
import { DashboardCard } from '@/components/features/dashboard';
import { DifficultyBadge } from '@/components/features/problems';
import { cn } from '@/lib/utils';
import { ROUTE_PATHS } from '@/routes/paths';

const overviewStats = [
  {
    label: 'Daily streak',
    value: '14 days',
    detail: 'Checked in before noon',
    icon: CalendarDays,
  },
  {
    label: 'XP this week',
    value: '2,840',
    detail: '+18% from last week',
    icon: LineChart,
  },
  {
    label: 'Current rank',
    value: '#342',
    detail: 'Top 5% consistency',
    icon: Trophy,
  },
];

const practiceQueue = [
  {
    title: 'LRU Cache',
    topic: 'Hash map + linked list',
    difficulty: 'MEDIUM' as const,
    progress: 72,
    estimate: '18 min',
  },
  {
    title: 'Binary Tree Level Order',
    topic: 'Trees and BFS',
    difficulty: 'MEDIUM' as const,
    progress: 44,
    estimate: '22 min',
  },
];

const recentActivity = [
  {
    title: 'Two Sum',
    difficulty: 'EASY' as const,
    status: 'Accepted',
    time: '2h ago',
  },
  {
    title: 'Merge K Sorted Lists',
    difficulty: 'HARD' as const,
    status: 'Reviewed',
    time: '5h ago',
  },
  {
    title: 'Valid Parentheses',
    difficulty: 'EASY' as const,
    status: 'Accepted',
    time: 'Yesterday',
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'MEDIUM' as const,
    status: 'Revisited',
    time: '2d ago',
  },
];

const wishlistProblems = [
  {
    title: 'Design Twitter',
    topic: 'System design warmup',
    difficulty: 'MEDIUM' as const,
  },
  {
    title: 'Word Ladder',
    topic: 'Graph shortest path',
    difficulty: 'HARD' as const,
  },
  {
    title: 'Median of Two Sorted Arrays',
    topic: 'Binary search',
    difficulty: 'HARD' as const,
  },
];

const heatmapLevels = [
  'bg-white/[0.04]',
  'bg-primary/[0.12]',
  'bg-primary/[0.22]',
  'bg-primary/[0.34]',
  'bg-primary/[0.48]',
];

const heatmapCells = Array.from({ length: 84 }, (_, index) => {
  const pattern = [0, 1, 0, 2, 3, 1, 0, 2, 4, 1, 0, 3];
  return pattern[index % pattern.length];
});

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.055 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function SectionAction({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-text-tertiary transition-colors duration-200 hover:bg-white/[0.045] hover:text-text-primary"
    >
      {children}
      <ArrowRight className="size-3.5" />
    </button>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="mx-auto flex w-full max-w-[1320px] flex-col gap-5"
      >
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-5 shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-text-tertiary">
                <span className="size-1.5 rounded-full bg-primary/80 shadow-[0_0_10px_rgba(103,232,249,0.22)]" />
                Focus workspace
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                Welcome back to AlgoPilot.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                Your practice plan, streak, and saved problems are organized for
                a calm daily coding session.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/[0.07] bg-black/15 p-1.5 sm:min-w-[360px]">
              {overviewStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-white/[0.035]"
                >
                  <div className="mb-2 flex items-center gap-2 text-text-muted">
                    <stat.icon className="size-3.5" />
                    <span className="truncate text-[11px] font-medium uppercase tracking-[0.12em]">
                      {stat.label}
                    </span>
                  </div>
                  <p className="truncate text-lg font-semibold text-text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-text-muted">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.9fr)]"
        >
          <div className="grid min-w-0 gap-5">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <DashboardCard
                eyebrow="Daily streak"
                title="Consistency"
                icon={<CalendarDays className="size-4" />}
                contentClassName="space-y-5"
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-4xl font-semibold tracking-tight text-text-primary">
                      14
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      days in a row
                    </p>
                  </div>
                  <div className="rounded-lg border border-primary/10 bg-primary/[0.055] px-3 py-2 text-right">
                    <p className="text-xs text-text-tertiary">Today</p>
                    <p className="text-sm font-medium text-primary/90">
                      Completed
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                    <div key={`${day}-${index}`} className="text-center">
                      <div
                        className={cn(
                          'mb-1.5 grid aspect-square place-items-center rounded-lg border text-xs font-medium',
                          index < 6
                            ? 'border-primary/10 bg-primary/[0.12] text-primary/90'
                            : 'border-white/[0.08] bg-white/[0.035] text-text-muted'
                        )}
                      >
                        {index < 6 ? <CheckCircle2 className="size-3.5" /> : day}
                      </div>
                      <span className="text-[11px] text-text-muted">{day}</span>
                    </div>
                  ))}
                </div>
              </DashboardCard>

              <DashboardCard
                eyebrow="XP and rank"
                title="Progress profile"
                icon={<LineChart className="size-4" />}
                contentClassName="space-y-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
                      XP earned
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
                      12,480
                    </p>
                    <p className="mt-1 text-sm text-text-tertiary">
                      840 XP to next rank
                    </p>
                  </div>
                  <div className="sm:border-l sm:border-white/[0.07] sm:pl-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-tertiary">Rank</span>
                      <span className="text-sm font-semibold text-text-primary">
                        #342
                      </span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.055]">
                      <div className="h-full w-[68%] rounded-full bg-primary/70 shadow-[0_0_18px_rgba(103,232,249,0.16)]" />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-text-muted">
                      Top 5% among active learners this month.
                    </p>
                  </div>
                </div>
              </DashboardCard>
            </div>

            <DashboardCard
              eyebrow="Continue practicing"
              title="Recommended queue"
              icon={<Play className="size-4" />}
              action={
                <SectionAction onClick={() => navigate(ROUTE_PATHS.practice)}>
                  Open practice
                </SectionAction>
              }
              contentClassName="space-y-3"
            >
              {practiceQueue.map((problem) => (
                <button
                  key={problem.title}
                  type="button"
                  onClick={() => navigate(ROUTE_PATHS.practice)}
                  className="group flex w-full flex-col gap-3 rounded-xl p-3 text-left transition-colors duration-200 hover:bg-white/[0.04] sm:flex-row sm:items-center"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-black/15 text-text-secondary group-hover:text-text-primary">
                    <Code2 className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-text-primary">
                        {problem.title}
                      </h3>
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </div>
                    <p className="mt-1 text-sm text-text-tertiary">
                      {problem.topic}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1.5 min-w-[120px] flex-1 overflow-hidden rounded-full bg-white/[0.055]">
                        <div
                          className="h-full rounded-full bg-primary/65"
                          style={{ width: `${problem.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-muted">
                        {problem.progress}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-text-muted sm:justify-end">
                    <Clock3 className="size-3.5" />
                    {problem.estimate}
                    <ChevronRight className="size-4 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-text-secondary" />
                  </div>
                </button>
              ))}
            </DashboardCard>

            <DashboardCard
              eyebrow="Activity map"
              title="Practice heatmap"
              icon={<Activity className="size-4" />}
              contentClassName="space-y-4"
            >
              <div className="dashboard-heatmap-grid">
                {heatmapCells.map((level, index) => (
                  <span
                    key={index}
                    className={cn(
                      'aspect-square rounded-[5px] border border-white/[0.045] transition-colors duration-200 hover:border-primary/25',
                      heatmapLevels[level]
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between gap-3 text-xs text-text-muted">
                <span>12 weeks of placeholder activity</span>
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  {heatmapLevels.map((level) => (
                    <span
                      key={level}
                      className={cn(
                        'size-2.5 rounded-[4px] border border-white/[0.045]',
                        level
                      )}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </DashboardCard>
          </div>

          <aside className="grid min-w-0 gap-5 xl:auto-rows-min">
            <DashboardCard
              eyebrow="Recent activity"
              title="Latest work"
              icon={<Target className="size-4" />}
              action={
                <SectionAction onClick={() => navigate(ROUTE_PATHS.practice)}>
                  View all
                </SectionAction>
              }
              contentClassName="space-y-2"
            >
              {recentActivity.map((activity) => (
                <div
                  key={`${activity.title}-${activity.time}`}
                  className="flex items-center gap-3 rounded-lg px-1.5 py-2.5 transition-colors duration-200 hover:bg-white/[0.035]"
                >
                  <span className="size-2 rounded-full bg-primary/70 shadow-[0_0_12px_rgba(103,232,249,0.12)]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {activity.title}
                      </p>
                      <DifficultyBadge
                        difficulty={activity.difficulty}
                        className="hidden sm:inline-flex"
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {activity.status} · {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </DashboardCard>

            <DashboardCard
              eyebrow="Wishlist problems"
              title="Saved for later"
              icon={<Bookmark className="size-4" />}
              action={
                <SectionAction onClick={() => navigate(ROUTE_PATHS.practice)}>
                  Manage
                </SectionAction>
              }
              contentClassName="space-y-3"
            >
              {wishlistProblems.map((problem) => (
                <button
                  key={problem.title}
                  type="button"
                  onClick={() => navigate(ROUTE_PATHS.practice)}
                  className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors duration-200 hover:bg-white/[0.04]"
                >
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-black/15 text-text-tertiary group-hover:text-text-primary">
                    <Bookmark className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {problem.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-text-muted">
                      {problem.topic}
                    </p>
                  </div>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </button>
              ))}
            </DashboardCard>
          </aside>
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
}
