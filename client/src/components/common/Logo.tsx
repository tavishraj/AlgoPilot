import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-2.5',
        collapsed && 'justify-center',
        className
      )}
    >
      <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-[linear-gradient(135deg,rgba(103,232,249,0.12),rgba(167,139,250,0.09))] shadow-[0_12px_24px_rgba(0,0,0,0.22)]">
        <BrainCircuit className="h-4 w-4 text-primary" strokeWidth={2.2} />
        <div className="pointer-events-none absolute inset-px rounded-[7px] bg-white/[0.035]" />
      </div>

      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">
            Algo<span className="text-primary">Pilot</span>
          </p>
          <p className="truncate text-[11px] text-text-muted">
            AI DSA Platform
          </p>
        </div>
      )}
    </div>
  );
}
