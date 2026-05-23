import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] gradient-accent shadow-[var(--shadow-glow)]">
        <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
        <div className="absolute inset-0 rounded-[var(--radius-md)] bg-white/10" />
      </div>
      {!collapsed && (
        <span className="text-lg font-bold tracking-tight text-text-primary">
          Algo<span className="text-accent">Pilot</span>
        </span>
      )}
    </div>
  );
}
