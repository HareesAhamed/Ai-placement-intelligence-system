import clsx from 'clsx';

interface TopicBadgeProps {
  topic: string;
  variant?: 'strong' | 'average' | 'weak' | 'neutral' | 'easy' | 'medium' | 'hard';
  size?: 'sm' | 'md';
}

const variantClasses = {
  strong: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/20',
  average: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/20',
  weak: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/20',
  neutral: 'bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/20',
  easy: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/20',
  medium: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/20',
  hard: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/20',
};

const sizeClasses = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export function TopicBadge({ topic, variant = 'neutral', size = 'md' }: TopicBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full border',
        variantClasses[variant],
        sizeClasses[size]
      )}
    >
      {topic}
    </span>
  );
}
