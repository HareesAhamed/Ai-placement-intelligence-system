import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
} from 'recharts';

type RadarPoint = {
  topic: string;
  score: number;
};

interface RadarChartProps {
  data: RadarPoint[];
}

export function RadarChart({ data }: RadarChartProps) {
  return (
    <div className="h-72 w-full rounded-2xl border border-[#222A33] bg-[#151B22] p-4">
      <p className="mb-3 text-sm font-semibold text-[#E5E7EB]">Topic Mastery Radar</p>
      <ResponsiveContainer width="100%" height="90%">
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="topic" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
          <Radar
            dataKey="score"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.28}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
