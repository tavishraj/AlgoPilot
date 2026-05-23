import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  title?: string;
  eyebrow?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function DashboardCard({
  children,
  className,
  contentClassName,
  title,
  eyebrow,
  icon,
  action,
}: DashboardCardProps) {
  const hasHeader = title || eyebrow || icon || action;

  return (
    <section
      className={cn(
        'group/card relative overflow-hidden rounded-xl border border-white/[0.075]',
        'bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))]',
        'shadow-[0_18px_55px_rgba(0,0,0,0.26)] backdrop-blur-xl',
        'transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out',
        'hover:-translate-y-px hover:border-white/[0.13] hover:shadow-[0_22px_70px_rgba(0,0,0,0.32)]',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

      {hasHeader && (
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.055] px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.045] text-text-secondary transition-colors duration-200 group-hover/card:text-text-primary">
                {icon}
              </div>
            )}

            <div className="min-w-0">
              {eyebrow && (
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="mt-0.5 truncate text-sm font-semibold text-text-primary">
                  {title}
                </h2>
              )}
            </div>
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={cn('p-5', contentClassName)}>{children}</div>
    </section>
  );
}
