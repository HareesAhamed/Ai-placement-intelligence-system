import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Route, CircleCheckBig, CircleDashed, RotateCw, Sparkles } from 'lucide-react';

import { AuthRequiredCard } from '../components/auth/AuthRequiredCard';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useAuth } from '../context/useAuth';
import { fetchProblems, fetchRoadmap, generateRoadmap, refreshRoadmap } from '../services/api';
import type { RoadmapPlan } from '../types/coding';

const topicColorMap: Record<string, string> = {
  Arrays: '#3B82F6',
  Strings: '#10B981',
  Recursion: '#EF4444',
  Hashing: '#F59E0B',
  'Binary Search': '#6366F1',
  'Dynamic Programming': '#8B5CF6',
  Trees: '#14B8A6',
  Graphs: '#06B6D4',
  'Weekly Review': '#22C55E',
};

function getTopicColor(topic: string): string {
  return topicColorMap[topic] ?? '#3B82F6';
}

function getProviderPresentation(provider: string): { label: string; className: string } {
  if (provider === 'gemini') {
    return { label: 'Gemini AI', className: 'border-[#0EA5E9]/30 bg-[#0EA5E9]/10 text-[#BAE6FD]' };
  }
  if (provider === 'groq') {
    return { label: 'Groq Fallback', className: 'border-[#10B981]/30 bg-[#10B981]/10 text-[#BBF7D0]' };
  }
  return { label: 'Rule Based Fallback', className: 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#FDE68A]' };
}

export default function Roadmap() {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [plan, setPlan] = useState<RoadmapPlan | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [launchingTask, setLaunchingTask] = useState(false);

  const loadRoadmap = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRoadmap();
      setPlan(result);
      setInsights(result.ai_feedback ? [result.ai_feedback] : []);
    } catch {
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void loadRoadmap();
  }, [loadRoadmap]);

  const onGenerate = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generateRoadmap();
      setPlan(result);
      setInsights(result.ai_feedback ? [result.ai_feedback] : []);
    } catch (err) {
      setError('Unable to generate roadmap. Please complete onboarding survey first.' 
        + err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await refreshRoadmap();
      setPlan(result.roadmap);
      setInsights(result.insights);
    } catch {
      setError('Unable to refresh roadmap at the moment.');
    } finally {
      setLoading(false);
    }
  };

  const progress = useMemo(() => {
    if (!plan || plan.days.length === 0) return 0;
    const completed = plan.days.filter((day) => day.is_completed).length;
    return Math.round((completed / plan.days.length) * 100);
  }, [plan]);

  const weeks = useMemo(() => {
    if (!plan) return [] as Array<{ weekNumber: number; days: RoadmapPlan['days'] }>;
    const grouped = new Map<number, RoadmapPlan['days']>();
    for (const day of plan.days.slice().sort((a, b) => a.day_number - b.day_number)) {
      const current = grouped.get(day.week_number) ?? [];
      current.push(day);
      grouped.set(day.week_number, current);
    }
    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([weekNumber, days]) => ({ weekNumber, days }));
  }, [plan]);

  const selectedDay = useMemo(() => {
    if (!plan || selectedDayId == null) return null;
    return plan.days.find((day) => day.id === selectedDayId) ?? null;
  }, [plan, selectedDayId]);

  const onStartTaskInCompiler = async (topic: string, dayNumber: number) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setLaunchingTask(true);
    try {
      const unsolved = await fetchProblems({
        topic,
        status: 'unsolved',
        page: 1,
        page_size: 1,
      }).catch(() => []);
      const first = unsolved[0] ?? (await fetchProblems({ topic, page: 1, page_size: 1 }).catch(() => []))[0];

      if (first) {
        navigate(`/problems/${first.id}?roadmapDay=${dayNumber}&source=roadmap`);
      } else {
        navigate(`/problems?roadmap=roadmap&topic=${encodeURIComponent(topic)}`);
      }
    } finally {
      setLaunchingTask(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
        <AuthRequiredCard
          title="Login Required"
          message="Sign in, complete onboarding survey, and generate your personalized AI roadmap."
        />
      ) : null}

      <SectionHeader
        title="AI Study Roadmap"
        subtitle="Adaptive 30-day plan based on weakness analysis and company priorities"
        icon={<Route className="w-5 h-5 text-[#6366F1]" />}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => void onGenerate()}
              disabled={loading}
              className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              Generate
            </button>
            <button
              onClick={() => void onRefresh()}
              disabled={loading || !plan}
              className="inline-flex items-center gap-1 rounded-lg border border-[#1F2937] bg-[#111827] px-3 py-2 text-xs font-semibold text-[#E5E7EB] disabled:opacity-60"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Refresh Week
            </button>
          </div>
        }
      />

      {error ? <Card hover={false} className="border border-[#EF4444]/40 bg-[#7F1D1D]/20 text-sm text-[#FCA5A5]">{error}</Card> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card hover={false} className="lg:col-span-2 p-5!">
          <ProgressBar
            value={progress}
            label="Roadmap Progress"
            color={progress >= 70 ? 'green' : progress >= 40 ? 'yellow' : 'blue'}
            size="lg"
          />
        </Card>
        <Card hover={false} className="p-5!">
          <p className="text-xs text-[#94A3B8] uppercase tracking-wide">Generation Source</p>
          {plan ? (
            <>
              <div className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getProviderPresentation(plan.ai_provider).className}`}>
                {getProviderPresentation(plan.ai_provider).label}
              </div>
              {plan.generation_trace ? (
                <p className="mt-2 text-[11px] leading-relaxed text-[#94A3B8]">{plan.generation_trace}</p>
              ) : null}
            </>
          ) : (
            <p className="mt-2 text-sm text-[#94A3B8]">Generate roadmap to see AI source.</p>
          )}
        </Card>
      </div>

      {insights.length > 0 ? (
        <Card hover={false} className="space-y-2 border-[#1F2937] bg-[#0E1628]">
          <h3 className="text-sm font-semibold text-[#E2E8F0] inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#60A5FA]" />
            AI Feedback
          </h3>
          {insights.map((line) => (
            <p key={line} className="text-sm text-[#CBD5E1]">{line}</p>
          ))}
        </Card>
      ) : null}

      {plan ? (
        <div className="space-y-4">
          {weeks.map((week) => (
            <Card key={week.weekNumber} hover={false}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#E5E7EB]">Week {week.weekNumber}</h3>
                <span className="rounded-full border border-[#1E3A8A]/40 bg-[#1E3A8A]/20 px-2 py-0.5 text-[10px] font-semibold text-[#BFDBFE]">
                  {week.days.filter((day) => day.is_completed).length}/{week.days.length} done
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {week.days.map((day, index) => {
                  const color = getTopicColor(day.topic);
                  return (
                    <motion.button
                      type="button"
                      key={day.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedDayId(day.id)}
                      className={`relative rounded-xl border p-4 transition-all duration-200 ${
                        day.is_completed
                          ? 'cursor-default border-[#10B981]/30 bg-[#10B981]/10'
                          : 'border-[#1F2937]/50 bg-[#0B1120]/70 hover:border-[#3B82F6]/40'
                      } ${
                        selectedDayId === day.id ? 'ring-1 ring-[#3B82F6]/60' : ''
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-[#9CA3AF]">Day {day.day_number}</span>
                        {day.is_completed ? (
                          <CircleCheckBig className="h-3.5 w-3.5 text-[#10B981]" />
                        ) : (
                          <CircleDashed className="h-3.5 w-3.5 text-[#64748B]" />
                        )}
                      </div>
                      <p className="text-sm font-semibold" style={{ color }}>{day.topic}</p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        {day.task_type === 'weekly-review' ? 'Weekly Review + Mock Interview' : `${day.problems_count} problems`}
                      </p>
                      <p className="mt-1 text-xs text-[#94A3B8]">{day.estimated_minutes} min block</p>
                      <p className="mt-2 text-xs text-[#60A5FA]">Click card to do task</p>
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          ))}

          {selectedDay ? (
            <Card hover={false} className="border-[#1D4ED8]/30 bg-[#0E1628]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#93C5FD]">Selected Task</p>
                  <h3 className="text-sm font-semibold text-[#E2E8F0]">
                    Day {selectedDay.day_number} • {selectedDay.topic}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    {selectedDay.task_type === 'weekly-review' ? 'Weekly review and mock interview block' : `Practice ${selectedDay.problems_count} problem(s)`} • {selectedDay.estimated_minutes} min
                  </p>
                </div>
                {selectedDay.is_completed ? (
                  <span className="rounded-full border border-[#10B981]/30 bg-[#10B981]/15 px-2.5 py-1 text-xs font-semibold text-[#86EFAC]">
                    Auto-completed from accepted submissions
                  </span>
                ) : (
                  <span className="rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/15 px-2.5 py-1 text-xs font-semibold text-[#FCD34D]">
                    Pending
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void onStartTaskInCompiler(selectedDay.topic, selectedDay.day_number)}
                  disabled={launchingTask}
                  className="rounded-lg bg-[#1D4ED8] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {launchingTask ? 'Opening Compiler...' : 'Continue Task'}
                </button>
                <Link
                  to={`/roadmap/day/${selectedDay.id}`}
                  className="rounded-lg border border-[#334155] bg-[#111827] px-3 py-2 text-xs font-semibold text-[#E2E8F0]"
                >
                  View Details
                </Link>
                <Link
                  to={`/tutorials?topic=${encodeURIComponent(selectedDay.topic)}`}
                  className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white"
                >
                  Do Tutorial
                </Link>
                <Link
                  to={`/problems?topic=${encodeURIComponent(selectedDay.topic)}`}
                  className="rounded-lg border border-[#334155] bg-[#111827] px-3 py-2 text-xs font-semibold text-[#E2E8F0]"
                >
                  Practice Problems
                </Link>
                {selectedDay.tutorial_link ? (
                  <a
                    href={selectedDay.tutorial_link}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-[#334155] bg-[#111827] px-3 py-2 text-xs font-semibold text-[#93C5FD]"
                  >
                    External Resource
                  </a>
                ) : null}
              </div>
            </Card>
          ) : null}
        </div>
      ) : (
        <Card hover={false} className="text-sm text-[#94A3B8]">
          {loading ? 'Loading roadmap...' : 'No roadmap found. Generate your personalized roadmap to begin.'}
        </Card>
      )}
    </div>
  );
}
