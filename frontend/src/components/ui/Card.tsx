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
    blue: 'hover:border-[#3B82F6]/30',
    purple: 'hover:border-[#8B5CF6]/30',
    green: 'hover:border-[#10B981]/30',
    none: 'hover:border-[#2A3340]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hover ? { scale: 1.008, y: -1 } : undefined}
      onClick={onClick}
      className={clsx(
        'relative rounded-2xl border border-[#222A33] p-6',
        'bg-[#151B22]',
        hover && 'transition-all duration-300',
        glowClasses[glow],
        gradient && 'gradient-border',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="relative">{children}</div>
    </motion.div>
  );
}
