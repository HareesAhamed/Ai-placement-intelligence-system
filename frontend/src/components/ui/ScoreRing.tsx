import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export function ScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
  label = 'AI Readiness',
  sublabel,
  color,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Determine color based on score
  const getColor = () => {
    if (color) return color;
    if (score >= 75) return '#10B981';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const ringColor = getColor();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative pulse-glow" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1F2937"
            strokeWidth={strokeWidth}
          />
          {/* Animated progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            style={{
              filter: `drop-shadow(0 0 8px ${ringColor}40)`,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold text-[#E5E7EB]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-[#9CA3AF] mt-0.5">/100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[#E5E7EB]">{label}</p>
        {sublabel && <p className="text-xs text-[#9CA3AF] mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}
