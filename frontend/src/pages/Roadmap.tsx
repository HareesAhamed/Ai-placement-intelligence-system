import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Route, CircleCheckBig, CircleDashed, RotateCw, Sparkles } from 'lucide-react';

import { AuthRequiredCard } from '../components/auth/AuthRequiredCard';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useAuth } from '../context/useAuth';
import { completeRoadmapDay, fetchRoadmap, generateRoadmap, refreshRoadmap } from '../services/api';
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

export default function Roadmap() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [plan, setPlan] = useState<RoadmapPlan | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError('Unable to generate roadmap. Please complete onboarding survey first.');
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

  const onCompleteDay = async (dayId: number) => {
    if (!plan) return;
    await completeRoadmapDay(dayId);
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map((day) => (day.id === dayId ? { ...day, is_completed: true } : day)),
      };
    });
  };

  const progress = useMemo(() => {
    if (!plan || plan.days.length === 0) return 0;
    const completed = plan.days.filter((day) => day.is_completed).length;
    return Math.round((completed / plan.days.length) * 100);
  }, [plan]);

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

      <Card hover={false} className="!p-5">
        <ProgressBar
          value={progress}
          label="Roadmap Progress"
          color={progress >= 70 ? 'green' : progress >= 40 ? 'yellow' : 'blue'}
          size="lg"
        />
      </Card>

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
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-[#E5E7EB] mb-5">30-Day Plan</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {plan.days
              .slice()
              .sort((a, b) => a.day_number - b.day_number)
              .map((day, index) => {
                const color = getTopicColor(day.topic);
                return (
                  <motion.div
                    key={day.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    onClick={() => {
                      if (!day.is_completed) {
                        void onCompleteDay(day.id);
                      }
                    }}
                    className={`relative p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                      day.is_completed
                        ? 'bg-[#10B981]/10 border-[#10B981]/30'
                        : 'bg-[#0B1120]/60 border-[#1F2937]/40 hover:border-[#3B82F6]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">Day {day.day_number}</span>
                      {day.is_completed ? (
                        <CircleCheckBig className="w-3.5 h-3.5 text-[#10B981]" />
                      ) : (
                        <CircleDashed className="w-3.5 h-3.5 text-[#9CA3AF]/30" />
                      )}
                    </div>
                    <p className="text-xs font-medium truncate" style={{ color }}>
                      {day.topic}
                    </p>
                    <p className="text-[10px] text-[#9CA3AF] mt-1">
                      {day.task_type === 'weekly-review' ? 'Weekly Review' : `${day.problems_count} problems`}
                    </p>
                    {day.tutorial_link ? (
                      <a
                        href={day.tutorial_link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="mt-2 block text-[10px] text-[#60A5FA] underline underline-offset-2"
                      >
                        Tutorial
                      </a>
                    ) : null}
                  </motion.div>
                );
              })}
          </div>
        </Card>
      ) : (
        <Card hover={false} className="text-sm text-[#94A3B8]">
          {loading ? 'Loading roadmap...' : 'No roadmap found. Generate your personalized roadmap to begin.'}
        </Card>
      )}
    </div>
  );
}
