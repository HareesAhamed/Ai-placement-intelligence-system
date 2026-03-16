import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Building2, CheckCircle2, Gauge, PlayCircle, RefreshCw, Timer } from 'lucide-react';

import { AuthRequiredCard } from '../components/auth/AuthRequiredCard';
import { Card } from '../components/ui/Card';
import { ScoreRing } from '../components/ui/ScoreRing';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useAuth } from '../context/useAuth';
import {
  evaluateMockTest,
  fetchMockTestCategories,
  startMockTest,
} from '../services/api';
import type {
  MockTestEvaluateResponse,
  MockTestStartResponse,
} from '../types/coding';

type TestMode = 'overall' | 'pattern' | 'company';

type HistoryEntry = MockTestEvaluateResponse & {
  id: string;
  date: string;
};

const HISTORY_KEY = 'prepiq_mock_history';

export default function MockTest() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [categories, setCategories] = useState<{ pattern_categories: string[]; company_categories: string[] }>({
    pattern_categories: [],
    company_categories: [],
  });
  const [mode, setMode] = useState<TestMode>('overall');
  const [category, setCategory] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [session, setSession] = useState<MockTestStartResponse | null>(null);
  const [result, setResult] = useState<MockTestEvaluateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    void (async () => {
      const data = await fetchMockTestCategories().catch(() => ({ pattern_categories: [], company_categories: [] }));
      setCategories(data);
    })();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!session) {
      setTimer(0);
      return;
    }
    const startedAt = new Date(session.started_at).getTime();
    const interval = window.setInterval(() => {
      const now = Date.now();
      setTimer(Math.max(0, Math.floor((now - startedAt) / 1000)));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [session]);

  const selectableCategories = useMemo(() => {
    if (mode === 'pattern') return categories.pattern_categories;
    if (mode === 'company') return categories.company_categories;
    return [];
  }, [categories, mode]);

  const resetSession = () => {
    setSession(null);
    setResult(null);
    setTimer(0);
  };

  const onStart = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if ((mode === 'pattern' || mode === 'company') && !category) {
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const started = await startMockTest({
        mode,
        category: mode === 'overall' ? undefined : category,
        question_count: questionCount,
      });
      setSession(started);
    } finally {
      setLoading(false);
    }
  };

  const onEvaluate = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const evaluated = await evaluateMockTest({
        mode: session.mode,
        category: session.category ?? undefined,
        started_at: session.started_at,
        problem_ids: session.problems.map((item) => item.id),
      });
      setResult(evaluated);
      const entry: HistoryEntry = {
        ...evaluated,
        id: `mock-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
      };
      const updated = [entry, ...history].slice(0, 12);
      setHistory(updated);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
        <AuthRequiredCard
          title="Login Required"
          message="Sign in to run company-wise, pattern-wise, and overall mock tests based on your real submissions."
        />
      ) : null}

      <SectionHeader
        title="Mock Tests"
        subtitle="Company-wise, pattern-wise, and overall interview simulation"
        icon={<Gauge className="h-5 w-5 text-[#6366F1]" />}
        action={
          <button
            onClick={() => {
              if (!isAuthenticated) return;
              void (async () => {
                const data = await fetchMockTestCategories().catch(() => ({ pattern_categories: [], company_categories: [] }));
                setCategories(data);
              })();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-[#1F2937] bg-[#111827] px-3 py-2 text-xs font-semibold text-[#E5E7EB]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        }
      />

      {!session ? (
        <Card hover={false} className="space-y-4 border-[#222A33] bg-[#151B22]">
          <div className="grid gap-3 md:grid-cols-3">
            <button
              onClick={() => {
                setMode('overall');
                setCategory('');
              }}
              className={`rounded-xl border px-4 py-3 text-sm ${mode === 'overall' ? 'border-[#3B82F6]/60 bg-[#1D4ED8]/20 text-[#BFDBFE]' : 'border-[#1F2937] bg-[#0B1120] text-[#CBD5E1]'}`}
            >
              <span className="inline-flex items-center gap-2"><Gauge className="h-4 w-4" /> Overall</span>
            </button>
            <button
              onClick={() => {
                setMode('pattern');
                setCategory('');
              }}
              className={`rounded-xl border px-4 py-3 text-sm ${mode === 'pattern' ? 'border-[#3B82F6]/60 bg-[#1D4ED8]/20 text-[#BFDBFE]' : 'border-[#1F2937] bg-[#0B1120] text-[#CBD5E1]'}`}
            >
              <span className="inline-flex items-center gap-2"><BrainCircuit className="h-4 w-4" /> Pattern-wise</span>
            </button>
            <button
              onClick={() => {
                setMode('company');
                setCategory('');
              }}
              className={`rounded-xl border px-4 py-3 text-sm ${mode === 'company' ? 'border-[#3B82F6]/60 bg-[#1D4ED8]/20 text-[#BFDBFE]' : 'border-[#1F2937] bg-[#0B1120] text-[#CBD5E1]'}`}
            >
              <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4" /> Company-wise</span>
            </button>
          </div>

          {mode !== 'overall' ? (
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#1F2937] bg-[#0B1120] px-3 text-sm text-[#E2E8F0]"
            >
              <option value="">Select category</option>
              {selectableCategories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          ) : null}

          <div className="flex items-center gap-3">
            <label className="text-sm text-[#CBD5E1]">Question Count</label>
            <input
              type="number"
              min={3}
              max={20}
              value={questionCount}
              onChange={(event) => setQuestionCount(Math.max(3, Math.min(20, Number(event.target.value))))}
              className="h-10 w-24 rounded-xl border border-[#1F2937] bg-[#0B1120] px-3 text-sm text-[#E2E8F0]"
            />
            <button
              onClick={() => void onStart()}
              disabled={loading || ((mode === 'pattern' || mode === 'company') && !category)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              <PlayCircle className="h-4 w-4" />
              {loading ? 'Starting...' : 'Start Mock Test'}
            </button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card hover={false} className="border-[#222A33] bg-[#151B22]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#E5E7EB]">
                  Active {session.mode} mock {session.category ? `• ${session.category}` : ''}
                </p>
                <p className="text-xs text-[#94A3B8]">Solve questions in Problem Workspace, then evaluate.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#334155] bg-[#0B1120] px-3 py-2 text-sm text-[#CBD5E1]">
                <Timer className="h-4 w-4" /> {Math.floor(timer / 60)}m {timer % 60}s
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {session.problems.map((problem, idx) => (
                <motion.div key={problem.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }} className="rounded-xl border border-[#1F2937]/50 bg-[#0B1120]/70 p-3">
                  <p className="text-sm font-semibold text-[#E5E7EB]">{problem.title}</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">{problem.topic} • {problem.difficulty}</p>
                  <Link to={`/problems/${problem.id}`} className="mt-2 inline-block text-xs font-semibold text-[#60A5FA] underline underline-offset-2">
                    Open Problem
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => void onEvaluate()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                {loading ? 'Evaluating...' : 'Finish & Evaluate'}
              </button>
              <button
                onClick={resetSession}
                className="rounded-lg border border-[#334155] bg-[#11161D] px-4 py-2 text-sm text-[#CBD5E1]"
              >
                Cancel Session
              </button>
            </div>
          </Card>

          {result ? (
            <Card hover={false} className="border-[#222A33] bg-[#151B22]">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-1 flex items-center justify-center">
                  <ScoreRing score={result.score} label="Mock Score" sublabel={`${result.solved_count}/${result.total_questions} solved`} />
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <p className="text-sm text-[#CBD5E1]">
                    Session: {result.mode}{result.category ? ` • ${result.category}` : ''} • {result.time_taken_minutes} minutes
                  </p>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#94A3B8]">Strengths</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.strengths.map((item) => (
                        <span key={item} className="rounded-full border border-[#14532D]/40 bg-[#14532D]/20 px-2.5 py-1 text-xs text-[#BBF7D0]">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#94A3B8]">Focus Next</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.weaknesses.map((item) => (
                        <span key={item} className="rounded-full border border-[#7F1D1D]/40 bg-[#7F1D1D]/20 px-2.5 py-1 text-xs text-[#FECACA]">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      )}

      {history.length > 0 ? (
        <Card hover={false} className="border-[#222A33] bg-[#151B22]">
          <p className="mb-3 text-sm font-semibold text-[#E5E7EB]">Recent Mock Test Results</p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {history.map((item) => (
              <div key={item.id} className="rounded-xl border border-[#1F2937]/50 bg-[#0B1120]/70 p-3">
                <p className="text-sm font-semibold text-[#E5E7EB]">{item.mode}{item.category ? ` • ${item.category}` : ''}</p>
                <p className="mt-1 text-xs text-[#94A3B8]">Score {item.score}% • {item.solved_count}/{item.total_questions} • {item.date}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
