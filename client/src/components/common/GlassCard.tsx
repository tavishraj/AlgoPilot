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
      whileHover={hover ? { y: -1 } : undefined}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      onClick={onClick}
      className={cn(
        'glass rounded-xl p-5',
        'transition-[border-color,box-shadow,transform] duration-200',
        hover && 'cursor-pointer hover:border-border-hover',
        glow && 'hover:shadow-[var(--shadow-glow)]',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
