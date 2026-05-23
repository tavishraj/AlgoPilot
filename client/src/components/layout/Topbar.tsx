import { Command, PanelLeft, Search, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getRouteMeta } from '@/routes/navigation';
import { ROUTE_PATHS } from '@/routes/paths';

interface TopbarProps {
  onMobileMenuClick: () => void;
}

export function Topbar({ onMobileMenuClick }: TopbarProps) {
  const location = useLocation();
  const meta = getRouteMeta(location.pathname);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.055]',
        'bg-background/72 px-4 backdrop-blur-2xl sm:px-6 lg:px-8'
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="border border-white/[0.07] bg-white/[0.04] text-text-secondary hover:border-primary/15 hover:bg-primary/[0.065] hover:text-primary md:hidden"
        onClick={onMobileMenuClick}
        aria-label="Open navigation"
      >
        <PanelLeft className="h-4 w-4" />
      </Button>

      <div className="min-w-0 shrink-0">
        <h1 className="truncate text-sm font-semibold tracking-tight text-text-primary">
          {meta.title}
        </h1>
        <p className="hidden truncate text-xs text-text-tertiary sm:block">
          {meta.subtitle}
        </p>
      </div>

      <div className="hidden min-w-0 flex-1 justify-center px-3 sm:flex">
        <button
          type="button"
          className="flex h-9 w-full max-w-md items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.035] px-3 text-sm text-text-tertiary shadow-[0_8px_24px_rgba(0,0,0,0.16)] outline-none transition-all duration-200 hover:border-white/[0.13] hover:bg-white/[0.055] hover:text-text-secondary focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-left">
            Search problems, topics, hints...
          </span>
          <kbd className="hidden h-5 items-center gap-1 rounded-md border border-white/[0.07] bg-black/20 px-1.5 font-mono text-[10px] text-text-muted md:flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden h-7 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.035] px-2.5 text-xs text-text-tertiary lg:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/75 shadow-[0_0_9px_rgba(103,232,249,0.18)]" />
          Focus mode
        </div>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="border border-white/[0.07] bg-white/[0.04] text-text-secondary hover:border-secondary/15 hover:bg-secondary/[0.07] hover:text-secondary"
          aria-label="Open profile"
        >
          <Link to={ROUTE_PATHS.profile}>
            <UserRound className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
