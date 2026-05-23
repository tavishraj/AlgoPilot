import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { AnimatedPage } from '@/components/common/AnimatedPage';
import { GlassCard } from '@/components/common/GlassCard';
import { cn } from '@/lib/utils';

interface WorkspaceMetric {
  label: string;
  value: string;
}

interface WorkspacePageProps {
  title: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  accent?: 'cyan' | 'purple';
  metrics?: WorkspaceMetric[];
}

export function WorkspacePage({
  title,
  eyebrow,
  description,
  icon: Icon,
  accent = 'cyan',
  metrics = [
    { label: 'Sessions', value: '18' },
    { label: 'Velocity', value: '+12%' },
    { label: 'Focus', value: '92%' },
  ],
}: WorkspacePageProps) {
  return (
    <AnimatedPage>
      <section className="max-w-6xl space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg border',
                  accent === 'cyan'
                    ? 'border-primary/20 bg-primary/10 text-primary'
                    : 'border-secondary/20 bg-secondary/10 text-secondary'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-medium uppercase text-text-tertiary">
                {eyebrow}
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
              {description}
            </p>
          </div>

          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-primary/20 hover:bg-primary/10 hover:text-primary">
            Open workspace
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.24 }}
            >
              <GlassCard hover={false} className="!rounded-lg !p-4">
                <p className="text-xs text-text-tertiary">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">
                  {metric.value}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid min-h-[360px] gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <GlassCard hover={false} className="!rounded-lg !p-0">
            <div className="border-b border-border/60 px-4 py-3">
              <p className="text-sm font-medium text-text-primary">
                Primary panel
              </p>
            </div>
            <div className="grid h-[300px] place-items-center px-6 text-center">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Ready for resizable workspaces
                </p>
                <p className="mt-1 max-w-md text-sm text-text-tertiary">
                  The shell keeps content unframed and panel-friendly, so editor,
                  AI, ranking, and analytics panes can be dropped in cleanly.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover={false} className="!rounded-lg !p-4">
            <p className="text-sm font-medium text-text-primary">Context</p>
            <div className="mt-4 space-y-3">
              {['Adaptive hints', 'Progress memory', 'Low-noise review'].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-border/60 bg-surface/50 px-3 py-2"
                  >
                    <p className="text-sm text-text-secondary">{item}</p>
                  </div>
                )
              )}
            </div>
          </GlassCard>
        </div>
      </section>
    </AnimatedPage>
  );
}
