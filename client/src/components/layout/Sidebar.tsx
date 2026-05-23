import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Code2,
  Send,
  Swords,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useThemeStore } from '@/stores/useThemeStore';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/problems', label: 'Problems', icon: Code2 },
  { path: '/submissions', label: 'Submissions', icon: Send },
  { path: '/battle', label: 'Battle', icon: Swords, badge: 'Soon' },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'Soon' },
];

const bottomItems = [
  { path: '/ai', label: 'AI Assistant', icon: Sparkles, badge: 'Beta' },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useThemeStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 68 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col',
        'border-r border-border bg-background-secondary'
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-border/50">
        <Logo collapsed={sidebarCollapsed} />
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)]',
            'text-text-tertiary hover:text-text-secondary hover:bg-surface',
            'transition-colors duration-200',
            sidebarCollapsed && 'mx-auto'
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2',
                  'text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                )
              }
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!sidebarCollapsed && item.badge && (
                <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-[var(--radius-full)] bg-accent/10 text-accent">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-border/50 py-3 px-2.5 space-y-0.5">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2',
                'text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              )
            }
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!sidebarCollapsed && item.badge && (
              <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-[var(--radius-full)] bg-accent/10 text-accent">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </motion.aside>
  );
}
