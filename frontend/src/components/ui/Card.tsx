import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'blue' | 'purple' | 'green' | 'none';
  gradient?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = true, glow = 'none', gradient = false, onClick }: CardProps) {
  const glowClasses = {
    blue: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]',
    purple: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]',
    green: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hover ? { scale: 1.01, y: -2 } : undefined}
      onClick={onClick}
      className={clsx(
        'relative rounded-2xl border border-[#1F2937]/60 p-6',
        'bg-[#111827]/80 backdrop-blur-xl',
        hover && 'cursor-pointer transition-all duration-300',
        glowClasses[glow],
        gradient && 'gradient-border',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
