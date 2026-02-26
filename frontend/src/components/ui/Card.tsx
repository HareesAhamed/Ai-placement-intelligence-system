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
    blue: 'hover:shadow-[0_4px_40px_rgba(59,130,246,0.1)] hover:border-[#3B82F6]/20',
    purple: 'hover:shadow-[0_4px_40px_rgba(139,92,246,0.1)] hover:border-[#8B5CF6]/20',
    green: 'hover:shadow-[0_4px_40px_rgba(16,185,129,0.1)] hover:border-[#10B981]/20',
    none: 'hover:border-[#1F2937]/80',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hover ? { scale: 1.008, y: -1 } : undefined}
      onClick={onClick}
      className={clsx(
        'relative rounded-2xl border border-[#1F2937]/50 p-6',
        'bg-gradient-to-br from-[#111827]/90 to-[#111827]/70',
        'backdrop-blur-xl',
        'shadow-[0_2px_16px_rgba(0,0,0,0.2)]',
        hover && 'transition-all duration-300',
        glowClasses[glow],
        gradient && 'gradient-border',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Subtle inner highlight */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
