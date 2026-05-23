import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useThemeStore } from '@/stores/useThemeStore';
import { cn } from '@/lib/utils';

export function PageShell() {
  const { sidebarCollapsed } = useThemeStore();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 68 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1 flex flex-col min-h-screen"
      >
        <Topbar />

        <div className="flex-1 p-6">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="border-t border-border/30 px-6 py-3">
          <p className="text-xs text-text-muted text-center">
            AlgoPilot — Master algorithms, one problem at a time.
          </p>
        </footer>
      </motion.main>
    </div>
  );
}
