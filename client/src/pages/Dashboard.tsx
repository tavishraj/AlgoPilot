import { motion } from 'framer-motion';
import {
  Code2,
  Flame,
  Trophy,
  Target,
  TrendingUp,
  ArrowRight,
  Zap,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedPage } from '@/components/common/AnimatedPage';
import { GlassCard } from '@/components/common/GlassCard';
import { DifficultyBadge } from '@/components/features/problems/DifficultyBadge';
import { cn } from '@/lib/utils';

// ─── Mock Data (replace with React Query hooks) ──────────
const stats = [
  { label: 'Problems Solved', value: '127', icon: Code2, trend: '+12 this week', color: 'text-accent' },
  { label: 'Current Streak', value: '14', icon: Flame, trend: '🔥 Personal best!', color: 'text-warning' },
  { label: 'Global Rank', value: '#342', icon: Trophy, trend: 'Top 5%', color: 'text-success' },
  { label: 'Rating', value: '1,847', icon: TrendingUp, trend: '+23 this month', color: 'text-accent' },
];

const recentProblems = [
  { id: '1', title: 'Two Sum', difficulty: 'EASY' as const, status: 'solved', time: '2h ago' },
  { id: '2', title: 'Merge K Sorted Lists', difficulty: 'HARD' as const, status: 'attempted', time: '5h ago' },
  { id: '3', title: 'LRU Cache', difficulty: 'MEDIUM' as const, status: 'solved', time: '1d ago' },
  { id: '4', title: 'Valid Parentheses', difficulty: 'EASY' as const, status: 'solved', time: '1d ago' },
  { id: '5', title: 'Binary Tree Level Order', difficulty: 'MEDIUM' as const, status: 'attempted', time: '2d ago' },
];

const quickActions = [
  { label: 'Random Problem', icon: Target, description: 'Challenge yourself', accent: true },
  { label: 'Daily Challenge', icon: Zap, description: 'Today\'s problem', accent: false },
  { label: 'Continue Learning', icon: Clock, description: 'Pick up where you left off', accent: false },
];

// ─── Stagger Animation Config ────────────────────────────
const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-6 max-w-6xl"
      >
        {/* ─── Header ────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome back<span className="text-accent">.</span>
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Keep your streak alive — solve today's challenge.
          </p>
        </motion.div>

        {/* ─── Stat Cards ────────────────────────────── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <GlassCard key={stat.label} hover glow className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className={cn('mt-1.5 text-2xl font-bold', stat.color)}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">{stat.trend}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-surface">
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
              </div>
              {/* Subtle gradient accent */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5 blur-2xl" />
            </GlassCard>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── Recent Activity ──────────────────────── */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-primary">Recent Activity</h2>
              <button
                onClick={() => navigate('/problems')}
                className="flex items-center gap-1 text-xs text-text-tertiary hover:text-accent transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-1.5">
              {recentProblems.map((problem, i) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className={cn(
                    'group flex items-center justify-between rounded-[var(--radius-md)] border border-border/50 p-3',
                    'bg-surface/30 hover:bg-surface-hover hover:border-border-hover',
                    'cursor-pointer transition-all duration-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full flex-shrink-0',
                        problem.status === 'solved' ? 'bg-success' : 'bg-warning'
                      )}
                    />
                    <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                      {problem.title}
                    </span>
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </div>
                  <span className="text-xs text-text-muted">{problem.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── Quick Actions ────────────────────────── */}
          <motion.div variants={itemVariants}>
            <h2 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <GlassCard
                  key={action.label}
                  hover
                  glow={action.accent}
                  className={cn(
                    'flex items-center gap-3 !p-3.5',
                    action.accent && 'border-accent/20'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)]',
                      action.accent ? 'gradient-accent' : 'bg-surface'
                    )}
                  >
                    <action.icon
                      className={cn('h-4 w-4', action.accent ? 'text-white' : 'text-text-secondary')}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{action.label}</p>
                    <p className="text-xs text-text-tertiary">{action.description}</p>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* ─── Progress Ring ──────────────────────── */}
            <GlassCard className="mt-3 text-center !py-6" hover={false}>
              <div className="relative mx-auto h-24 w-24">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="var(--color-border)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - 0.68)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-accent">68%</span>
                  <span className="text-[10px] text-text-tertiary">Weekly Goal</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-text-secondary">
                Solve <span className="text-accent font-medium">4 more</span> to reach your goal
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </AnimatedPage>
  );
}
