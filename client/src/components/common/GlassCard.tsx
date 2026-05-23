import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={cn(
        'glass rounded-[var(--radius-lg)] p-5',
        'transition-all duration-300',
        hover && 'cursor-pointer hover:border-border-hover',
        glow && 'hover:shadow-[var(--shadow-glow)]',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
