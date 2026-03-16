import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Line, LineChart,
} from 'recharts';
import { Activity, ArrowDownToDot, Landmark, LayoutGrid, Timer, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

import { AuthRequiredCard } from '../components/auth/AuthRequiredCard';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TopicBadge } from '../components/ui/TopicBadge';
import { useAuth } from '../context/useAuth';
import {
  fetchAnalyticsSummary,
  fetchCompanyReadiness,
  fetchProgressAnalytics,
  fetchSubmissions,
  fetchTopicStrength,
} from '../services/api';

const CHART_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#6366F1', '#F97316', '#84CC16', '#A855F7', '#14B8A6'];

export default function Analytics() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const [topicStrength, setTopicStrength] = useState<Array<{ topic: string; attempts: number; accuracy: number; avg_runtime_ms: number; classification: string }>>([]);
  const [companyReadiness, setCompanyReadiness] = useState<Record<string, number>>({});
  const [summary, setSummary] = useState<{ difficulty_distribution: Record<string, number> } | null>(null);
  const [progress, setProgress] = useState<Array<{ date: string; attempts: number }>>([]);
  const [timeSpentData, setTimeSpentData] = useState<Array<{ topic: string; minutes: number }>>([]);

  const refreshAnalytics = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    setLoading(true);
    try {
      const [topicData, readinessData, analyticsSummary, progressData, submissions] = await Promise.all([
        fetchTopicStrength().catch(() => ({ topics: [] })),
        fetchCompanyReadiness().catch(() => ({ readiness: {} })),
        fetchAnalyticsSummary().catch(() => null),
        fetchProgressAnalytics().catch(() => null),
        fetchSubmissions().catch(() => []),
      ]);

      setTopicStrength(topicData.topics);
      setCompanyReadiness(readinessData.readiness ?? {});
      setSummary(analyticsSummary ? { difficulty_distribution: analyticsSummary.difficulty_distribution } : null);
      setProgress(progressData?.consistency ?? []);

      const topicMap = new Map<string, number>();
      const strengthMap = new Map<string, number>();
      for (const item of topicData.topics) {
        strengthMap.set(item.topic, item.avg_runtime_ms);
      }
      for (const item of submissions) {
        const key = `Problem ${item.problem_id}`;
        topicMap.set(key, (topicMap.get(key) ?? 0) + ((item.runtime_ms ?? 0) / 1000 / 60));
      }
      const synthesized = Array.from(topicMap.entries())
        .slice(0, 10)
        .map(([topic, minutes]) => ({ topic, minutes: Math.max(1, Math.round(minutes)) }));
      if (synthesized.length > 0) {
        setTimeSpentData(synthesized);
      } else {
        setTimeSpentData(
          topicData.topics.slice(0, 8).map((item) => ({ topic: item.topic, minutes: Math.max(1, Math.round(item.avg_runtime_ms / 60000) * Math.max(1, item.attempts)) }))
        );
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshAnalytics();
  }, [refreshAnalytics]);

  const companyData = useMemo(
    () =>
      Object.entries(companyReadiness)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([company, readiness]) => ({
          company,
          readiness: Math.round(readiness),
          topics: topicStrength.slice(0, 5).map((item) => ({ topic: item.topic, weight: Math.round(item.accuracy) })),
        })),
    [companyReadiness, topicStrength]
  );

  const barData = useMemo(
    () =>
      topicStrength.map((item) => ({
        topic: item.topic.length > 10 ? `${item.topic.substring(0, 10)}.` : item.topic,
        solved: Math.round((item.accuracy / 100) * item.attempts),
        unsolved: Math.max(0, item.attempts - Math.round((item.accuracy / 100) * item.attempts)),
      })),
    [topicStrength]
  );

  const weaknessData = useMemo(
    () => [...topicStrength].sort((a, b) => a.accuracy - b.accuracy),
    [topicStrength]
  );

  const difficultyRows = useMemo(
    () => Object.entries(summary?.difficulty_distribution ?? {}).map(([difficulty, value]) => ({ difficulty, value })),
    [summary]
  );

  const tooltipStyle = {
    backgroundColor: '#111827',
    border: '1px solid #1F2937',
    borderRadius: '12px',
    fontSize: '12px',
  };

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
        <AuthRequiredCard
          title="Login Required"
          message="Sign in to view behavior-driven analytics charts and AI trend insights."
        />
      ) : null}

      <SectionHeader
        title="Performance Analytics"
        subtitle="Deep dive into your placement preparation metrics"
        icon={<Activity className="w-5 h-5 text-[#6366F1]" />}
        action={
          <button
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('login');
                return;
              }
              void refreshAnalytics();
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#1F2937] bg-[#111827] px-3 py-2 text-xs font-semibold text-[#E5E7EB] disabled:opacity-60"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        }
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
              <Card hover={true} glow="purple" className="p-5!">
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
                    <p className="text-xs text-[#9CA3AF]">{Math.round(w.accuracy)}% accuracy</p>
                  </div>
                  <TopicBadge
                    topic={w.classification}
                    variant={w.classification as 'strong' | 'average' | 'weak'}
                    size="sm"
                  />
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card hover={false}>
        <h3 className="text-sm font-semibold text-[#E5E7EB] mb-5 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-[#10B981]" />
          Consistency Trend
          <span className="text-xs text-[#9CA3AF] font-normal ml-2">Last 7 sessions</span>
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={progress}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <Tooltip />
            <Line dataKey="attempts" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card hover={false}>
        <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
          <Timer className="w-4 h-4 text-[#06B6D4]" />
          Time Spent by Topic
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={timeSpentData} layout="vertical" margin={{ left: 12, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis
              type="number"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              axisLine={{ stroke: '#1F2937' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="topic"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              axisLine={{ stroke: '#1F2937' }}
              tickLine={false}
              width={110}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`${Number(value ?? 0)} min`, 'Time Spent']}
            />
            <Bar dataKey="minutes" fill="#06B6D4" radius={[0, 8, 8, 0]} name="Minutes" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card hover={false}>
        <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4">Difficulty Distribution</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={difficultyRows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="difficulty" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
