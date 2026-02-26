import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Activity, ArrowDownToDot, Landmark, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TopicBadge } from '../components/ui/TopicBadge';

import { userPerformance, companyPatterns, heatmapData } from '../data/mockData';
import { analyzeWeaknesses } from '../utils/weaknessEngine';
import { calculateReadiness } from '../utils/readinessEngine';

const CHART_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#6366F1', '#F97316', '#84CC16', '#A855F7', '#14B8A6'];

const intensityColors = [
  'bg-[#1F2937]/30',
  'bg-[#6366F1]/20',
  'bg-[#6366F1]/40',
  'bg-[#6366F1]/60',
  'bg-[#6366F1]/80',
];

export default function Analytics() {
  const weaknessData = useMemo(() => analyzeWeaknesses(userPerformance), []);

  // Company donut data
  const companyData = useMemo(() => {
    return Object.entries(companyPatterns).map(([company, weights]) => ({
      company,
      readiness: calculateReadiness(userPerformance, weights),
      topics: Object.entries(weights)
        .sort((a, b) => b[1] - a[1])
        .map(([topic, weight]) => ({ topic, weight: Math.round(weight * 100) })),
    }));
  }, []);

  // Bar chart data
  const barData = useMemo(() => {
    return userPerformance.map(t => ({
      topic: t.topic.length > 10 ? t.topic.substring(0, 10) + '.' : t.topic,
      fullTopic: t.topic,
      solved: t.solved,
      unsolved: t.attempts - t.solved,
      accuracy: Math.round((t.solved / t.attempts) * 100),
    }));
  }, []);

  // Heatmap
  const heatmapTopics = useMemo(() => {
    const topics = [...new Set(heatmapData.map(h => h.topic))];
    return topics;
  }, []);

  const weeks = [1, 2, 3, 4];

  const tooltipStyle = {
    backgroundColor: '#111827',
    border: '1px solid #1F2937',
    borderRadius: '12px',
    fontSize: '12px',
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Performance Analytics"
        subtitle="Deep dive into your placement preparation metrics"
        icon={<Activity className="w-5 h-5 text-[#6366F1]" />}
      />

      {/* Company-wise Donut Charts */}
      <div>
        <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
          <Landmark className="w-4 h-4 text-[#6366F1]" />
          Company-wise Topic Distribution
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {companyData.map((company, idx) => (
            <motion.div
              key={company.company}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card hover={true} glow="purple" className="!p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-[#E5E7EB]">{company.company}</h4>
                  <span className={`text-sm font-bold ${
                    company.readiness >= 70 ? 'text-[#10B981]' :
                    company.readiness >= 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                  }`}>
                    {company.readiness}%
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={company.topics}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="weight"
                      nameKey="topic"
                      strokeWidth={0}
                    >
                      {company.topics.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {company.topics.slice(0, 4).map((t, i) => (
                    <div key={t.topic} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                      <span className="text-[10px] text-[#9CA3AF]">{t.topic}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pattern-wise Bar Chart */}
        <div className="lg:col-span-8">
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#06B6D4]" />
              Pattern-wise Performance
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis
                  dataKey="topic"
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  axisLine={{ stroke: '#1F2937' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  axisLine={{ stroke: '#1F2937' }}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#1F2937', opacity: 0.3 }} />
                <Bar dataKey="solved" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} name="Solved" />
                <Bar dataKey="unsolved" stackId="a" fill="#1F2937" radius={[4, 4, 0, 0]} name="Unsolved" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Weakness Ranking */}
        <div className="lg:col-span-4">
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
              <ArrowDownToDot className="w-4 h-4 text-[#F43F5E]" />
              Weakness Ranking
            </h3>
            <div className="space-y-3">
              {weaknessData.map((w, i) => (
                <motion.div
                  key={w.topic}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1120]/60 border border-[#1F2937]/30"
                >
                  <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-lg ${
                    i < 3 ? 'bg-[#EF4444]/15 text-[#EF4444]' :
                    i < 6 ? 'bg-[#F59E0B]/15 text-[#F59E0B]' : 'bg-[#10B981]/15 text-[#10B981]'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#E5E7EB] truncate">{w.topic}</p>
                    <p className="text-xs text-[#9CA3AF]">{w.accuracy}% accuracy</p>
                  </div>
                  <TopicBadge
                    topic={w.classification}
                    variant={w.classification.toLowerCase() as 'strong' | 'average' | 'weak'}
                    size="sm"
                  />
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Heatmap */}
      <Card hover={false}>
        <h3 className="text-sm font-semibold text-[#E5E7EB] mb-5 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-[#10B981]" />
          Topic Consistency Heatmap
          <span className="text-xs text-[#9CA3AF] font-normal ml-2">Last 4 weeks</span>
        </h3>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Header */}
            <div className="grid gap-2" style={{ gridTemplateColumns: '140px repeat(4, 1fr)' }}>
              <div />
              {weeks.map(w => (
                <div key={w} className="text-center text-xs text-[#9CA3AF] py-2">Week {w}</div>
              ))}
            </div>
            {/* Rows */}
            {heatmapTopics.map((topic, topicIdx) => (
              <motion.div
                key={topic}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: topicIdx * 0.04 }}
                className="grid gap-2 mb-2"
                style={{ gridTemplateColumns: '140px repeat(4, 1fr)' }}
              >
                <div className="flex items-center text-xs text-[#9CA3AF] font-medium pr-2 truncate">
                  {topic}
                </div>
                {weeks.map(week => {
                  const cell = heatmapData.find(h => h.topic === topic && h.week === week);
                  const intensity = cell?.intensity ?? 0;
                  return (
                    <motion.div
                      key={`${topic}-${week}`}
                      whileHover={{ scale: 1.15 }}
                      className={`h-10 rounded-lg ${intensityColors[intensity]} border border-[#1F2937]/20 flex items-center justify-center cursor-default`}
                      title={`${topic} - Week ${week}: ${['None', 'Low', 'Medium', 'High', 'Intense'][intensity]}`}
                    >
                      {intensity > 0 && (
                        <span className="text-[10px] text-[#9CA3AF]/60">{intensity}</span>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#1F2937]/30">
              <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Intensity:</span>
              {['None', 'Low', 'Med', 'High', 'Max'].map((label, i) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded ${intensityColors[i]}`} />
                  <span className="text-[10px] text-[#9CA3AF]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
