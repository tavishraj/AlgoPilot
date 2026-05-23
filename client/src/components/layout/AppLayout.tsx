import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXPANDED_WIDTH,
  Sidebar,
} from './Sidebar';
import { Topbar } from './Topbar';
import { RouteTransitionOutlet } from './RouteTransitionOutlet';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useThemeStore } from '@/stores/useThemeStore';

export function AppLayout() {
  const { sidebarCollapsed } = useThemeStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const sidebarWidth = sidebarCollapsed
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_EXPANDED_WIDTH;

  return (
    <div className="noise-overlay relative min-h-dvh overflow-x-hidden bg-background text-foreground">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <AnimatePresence>
        {mobileSidebarOpen && !isDesktop && (
          <motion.button
            type="button"
            aria-label="Close navigation overlay"
            className="fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.main
        initial={false}
        animate={{ marginLeft: isDesktop ? sidebarWidth : 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 34 }}
        className="relative z-10 flex min-h-dvh min-w-0 flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.018),transparent_320px)]"
      >
        <Topbar onMobileMenuClick={() => setMobileSidebarOpen(true)} />

        <section className="flex-1 px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1440px]">
            <RouteTransitionOutlet />
          </div>
        </section>
      </motion.main>
    </div>
  );
}
