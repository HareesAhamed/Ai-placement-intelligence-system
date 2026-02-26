import clsx from 'clsx';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  sublabel?: string;
  color?: 'blue' | 'purple' | 'green' | 'yellow' | 'red';
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const colorMap = {
  blue: 'from-[#3B82F6] to-[#60A5FA]',
  purple: 'from-[#8B5CF6] to-[#A78BFA]',
  green: 'from-[#10B981] to-[#34D399]',
  yellow: 'from-[#F59E0B] to-[#FBBF24]',
  red: 'from-[#EF4444] to-[#F87171]',
};

const bgColorMap = {
  blue: 'bg-[#3B82F6]/10',
  purple: 'bg-[#8B5CF6]/10',
  green: 'bg-[#10B981]/10',
  yellow: 'bg-[#F59E0B]/10',
  red: 'bg-[#EF4444]/10',
};

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  label,
  sublabel,
  color = 'blue',
  showValue = true,
  size = 'md',
  animated = true,
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          <div>
            {label && <span className="text-sm font-medium text-[#E5E7EB]">{label}</span>}
            {sublabel && <span className="text-xs text-[#9CA3AF] ml-2">{sublabel}</span>}
          </div>
          {showValue && (
            <span className="text-sm font-semibold text-[#E5E7EB]">{clampedValue}%</span>
          )}
        </div>
      )}
      <div className={clsx('w-full rounded-full overflow-hidden', bgColorMap[color], sizeMap[size])}>
        <motion.div
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={clsx(
            'h-full rounded-full bg-gradient-to-r',
            colorMap[color]
          )}
        />
      </div>
    </div>
  );
}
