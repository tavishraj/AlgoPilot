import { Search, Command, User } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { cn } from '@/lib/utils';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { sidebarCollapsed } = useThemeStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/50',
        'bg-background/80 backdrop-blur-xl px-6',
        'transition-all duration-300'
      )}
    >
      {/* Left: Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        {title && (
          <div>
            <h1 className="text-sm font-semibold text-text-primary">{title}</h1>
            {subtitle && (
              <p className="text-xs text-text-tertiary">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Center: Command Palette Trigger */}
      <button
        className={cn(
          'flex items-center gap-2 rounded-[var(--radius-md)] border border-border',
          'bg-surface/50 px-3 py-1.5 text-sm text-text-tertiary',
          'hover:border-border-hover hover:text-text-secondary',
          'transition-all duration-200 min-w-[240px]'
        )}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search problems...</span>
        <kbd className="flex items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      {/* Right: User Avatar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent">
            <User className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
