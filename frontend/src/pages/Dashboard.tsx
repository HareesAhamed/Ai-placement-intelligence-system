import { useMemo } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { Timer, Percent, ShieldAlert, Crown, MoveUpRight, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

import { Card } from '../components/ui/Card';
import { ScoreRing } from '../components/ui/ScoreRing';
import { TopicBadge } from '../components/ui/TopicBadge';
import { ProgressBar } from '../components/ui/ProgressBar';

import { userPerformance, companyPatterns, weeklyPerformance, aiInsights } from '../data/mockData';
import { analyzeWeaknesses } from '../utils/weaknessEngine';
import { calculateOverallReadiness, getCompanyReadinessBreakdown } from '../utils/readinessEngine';

export default function Dashboard() {
  const weaknessData = useMemo(() => analyzeWeaknesses(userPerformance), []);
  const overallReadiness = useMemo(
    () => calculateOverallReadiness(userPerformance, companyPatterns), []
  );
  const companyReadiness = useMemo(
    () => getCompanyReadinessBreakdown(userPerformance, companyPatterns), []
  );

  // Prepare radar chart data
  const radarData = useMemo(
    () => userPerformance.map(t => ({
      topic: t.topic.length > 8 ? t.topic.substring(0, 8) + '.' : t.topic,
      fullTopic: t.topic,
      strength: Math.round((t.solved / t.attempts) * 100),
      fullMark: 100,
    })), []
  );

  // Random AI insight
  // eslint-disable-next-line react-hooks/purity
  const insight = useMemo(() => aiInsights[Math.floor(Math.random() * aiInsights.length)], []);

  const weakTopics = weaknessData.filter(w => w.classification === 'Weak');
  const avgTopics = weaknessData.filter(w => w.classification === 'Average');
  const strongTopics = weaknessData.filter(w => w.classification === 'Strong');

  const totalSolved = userPerformance.reduce((a, b) => a + b.solved, 0);
  const totalAttempts = userPerformance.reduce((a, b) => a + b.attempts, 0);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Top Stats Row */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Problems Solved', value: totalSolved, sub: `of ${totalAttempts} attempted`, icon: Hash, color: '#6366F1', change: '+12%' },
          { label: 'Accuracy Rate', value: `${Math.round((totalSolved / totalAttempts) * 100)}%`, sub: 'overall', icon: Percent, color: '#10B981', change: '+5%' },
          { label: 'Weak Areas', value: weakTopics.length, sub: 'topics need focus', icon: ShieldAlert, color: '#F43F5E', change: '-2' },
          { label: 'Avg. Time', value: `${Math.round(userPerformance.reduce((a, b) => a + b.avgTime, 0) / userPerformance.length)}m`, sub: 'per problem', icon: Timer, color: '#06B6D4', change: '-3m' },
        ].map((stat) => (
          <Card key={stat.label} className="!p-5" glow="blue">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-[#E5E7EB] mt-1.5">{stat.value}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">{stat.sub}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-medium text-[#10B981]">
                  <MoveUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <motion.div variants={staggerItem} className="lg:col-span-4 space-y-6">
          {/* AI Readiness Score */}
          <Card glow="purple" hover={false}>
            <div className="flex flex-col items-center py-4">
              <ScoreRing score={overallReadiness} label="AI Readiness Score" sublabel="Based on all company patterns" />
            </div>
          </Card>

          {/* Company Readiness */}
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#F59E0B]" />
              Company Readiness
            </h3>
            <div className="space-y-4">
              {companyReadiness.map((c) => (
                <ProgressBar
                  key={c.company}
                  label={c.company}
                  value={c.readiness}
                  color={c.readiness >= 70 ? 'green' : c.readiness >= 50 ? 'yellow' : 'red'}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Center Column */}
        <motion.div variants={staggerItem} className="lg:col-span-5 space-y-6">
          {/* Radar Chart */}
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4">Topic Strength Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#1F2937" />
                <PolarAngleAxis dataKey="topic" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Strength"
                  dataKey="strength"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance Trend */}
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4">7-Day Performance Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyPerformance}>
                <defs>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={{ stroke: '#1F2937' }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={{ stroke: '#1F2937' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #1F2937',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#3B82F6" fillOpacity={1} fill="url(#colorAccuracy)" strokeWidth={2} />
                <Area type="monotone" dataKey="problems" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorProblems)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={staggerItem} className="lg:col-span-3 space-y-6">
          {/* AI Insight */}
          <Card className="!bg-gradient-to-br !from-[#6366F1]/10 !to-[#06B6D4]/10 !border-[#6366F1]/20" hover={false}>
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-[#06B6D4]" />
              <h3 className="text-sm font-semibold text-[#E5E7EB]">AI Insight</h3>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">{insight}</p>
          </Card>

          {/* Weakness Analysis */}
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4">Topic Analysis</h3>
            <div className="space-y-3">
              {weaknessData.slice(0, 8).map((w) => (
                <div key={w.topic} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          w.classification === 'Strong' ? '#10B981' :
                          w.classification === 'Average' ? '#F59E0B' : '#EF4444'
                      }}
                    />
                    <span className="text-sm text-[#E5E7EB]">{w.topic}</span>
                  </div>
                  <TopicBadge
                    topic={w.classification}
                    variant={w.classification.toLowerCase() as 'strong' | 'average' | 'weak'}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-[#E5E7EB] mb-3">Classification</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/10">
                <p className="text-xl font-bold text-[#10B981]">{strongTopics.length}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-1">Strong</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/10">
                <p className="text-xl font-bold text-[#F59E0B]">{avgTopics.length}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-1">Average</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/10">
                <p className="text-xl font-bold text-[#EF4444]">{weakTopics.length}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-1">Weak</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
