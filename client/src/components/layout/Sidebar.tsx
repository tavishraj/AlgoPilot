import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import {
  accountNavigation,
  primaryNavigation,
  type AppNavigationItem,
} from '@/routes/navigation';
import { useThemeStore } from '@/stores/useThemeStore';

export const SIDEBAR_EXPANDED_WIDTH = 252;
export const SIDEBAR_COLLAPSED_WIDTH = 76;
const SIDEBAR_MOBILE_WIDTH = 292;

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface SidebarNavItemProps {
  item: AppNavigationItem;
  compact: boolean;
  onNavigate: () => void;
}

function SidebarNavItem({ item, compact, onNavigate }: SidebarNavItemProps) {
  return (
    <NavLink
      to={item.href}
      end={item.end}
      onClick={onNavigate}
      aria-label={item.label}
      title={compact ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'group relative flex h-9 items-center rounded-lg border text-sm font-medium outline-none',
          'transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-primary/20',
          compact ? 'justify-center px-0' : 'gap-3 px-3',
          isActive
            ? 'border-white/[0.085] bg-white/[0.055] text-text-primary shadow-[0_10px_28px_rgba(0,0,0,0.22)]'
            : 'border-transparent text-text-tertiary hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-text-primary'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-indicator"
              className={cn(
                'absolute top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary/75 shadow-[0_0_10px_rgba(103,232,249,0.18)]',
                compact ? 'left-1' : 'left-1.5'
              )}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            />
          )}

          <span
            className={cn(
              'relative grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors duration-200',
              isActive
                ? 'bg-primary/[0.075] text-primary/90'
                : 'text-inherit group-hover:bg-surface'
            )}
          >
            <item.icon className="h-4 w-4" />
          </span>

          <AnimatePresence initial={false}>
            {!compact && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.16 }}
                className="min-w-0 flex-1 truncate"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>

          {compact && (
            <span
              role="tooltip"
              className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-border bg-popover/95 px-2.5 py-1.5 text-xs text-text-secondary opacity-0 shadow-xl backdrop-blur-xl transition-opacity duration-150 group-hover:opacity-100 md:block"
            >
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useThemeStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const compact = isDesktop && sidebarCollapsed;
  const sidebarWidth = isDesktop
    ? sidebarCollapsed
      ? SIDEBAR_COLLAPSED_WIDTH
      : SIDEBAR_EXPANDED_WIDTH
    : SIDEBAR_MOBILE_WIDTH;

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarWidth,
        x: isDesktop || mobileOpen ? 0 : -SIDEBAR_MOBILE_WIDTH,
      }}
      transition={{ type: 'spring', stiffness: 360, damping: 34 }}
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex h-dvh flex-col overflow-visible',
        'border-r border-sidebar-border/75 bg-[linear-gradient(180deg,rgba(14,16,20,0.93),rgba(8,9,11,0.88))]',
        'shadow-[14px_0_48px_rgba(0,0,0,0.3)] backdrop-blur-2xl'
      )}
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center justify-between border-b border-white/[0.055]',
          compact ? 'px-2' : 'px-4'
        )}
      >
        <Logo collapsed={compact} />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="hidden border border-transparent text-text-tertiary hover:border-white/[0.08] hover:bg-white/[0.045] hover:text-text-primary md:inline-flex"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="border border-transparent text-text-tertiary hover:border-white/[0.08] hover:bg-white/[0.045] hover:text-text-primary md:hidden"
          onClick={onMobileClose}
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 px-3 py-4">
        <nav className="space-y-1.5" aria-label="Primary navigation">
          <p
            className={cn(
              'px-2 pb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted',
              compact && 'sr-only'
            )}
          >
            Main
          </p>
          {primaryNavigation.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              compact={compact}
              onNavigate={onMobileClose}
            />
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <nav className="space-y-1.5" aria-label="Account navigation">
            <p
              className={cn(
                'px-2 pb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted',
                compact && 'sr-only'
              )}
            >
              Account
            </p>
            {accountNavigation.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                compact={compact}
                onNavigate={onMobileClose}
              />
            ))}
          </nav>

          <div
            className={cn(
              'rounded-xl border border-white/[0.07] bg-white/[0.035] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.18)]',
              compact && 'flex justify-center p-2'
            )}
          >
            {compact ? (
              <span className="h-2 w-2 rounded-full bg-primary/75 shadow-[0_0_10px_rgba(103,232,249,0.2)]" />
            ) : (
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary/75 shadow-[0_0_10px_rgba(103,232,249,0.2)]" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-text-secondary">
                    AI systems ready
                  </p>
                  <p className="truncate text-[11px] text-text-muted">
                    Low-latency guidance active
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
