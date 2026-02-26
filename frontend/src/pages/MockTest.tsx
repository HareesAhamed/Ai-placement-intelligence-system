import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, PlayCircle, RotateCcw, Wand2, Timer, BadgeCheck, ArrowUpFromLine, Loader } from 'lucide-react';

import { Card } from '../components/ui/Card';
import { ScoreRing } from '../components/ui/ScoreRing';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TopicBadge } from '../components/ui/TopicBadge';
import type { MockTestResult } from '../types';
import { mockTestHistory } from '../data/mockData';

interface TestCategory {
  name: string;
  icon: string;
  type: 'pattern' | 'company';
  color: string;
  description: string;
}

const patternTests: TestCategory[] = [
  { name: 'Array', icon: '📊', type: 'pattern', color: '#3B82F6', description: 'Two pointers, sliding window, prefix sum' },
  { name: 'String', icon: '🔤', type: 'pattern', color: '#10B981', description: 'Pattern matching, manipulation, parsing' },
  { name: 'Graph', icon: '🕸️', type: 'pattern', color: '#F59E0B', description: 'BFS, DFS, shortest path, topological sort' },
  { name: 'DP', icon: '🧩', type: 'pattern', color: '#EF4444', description: 'Memoization, tabulation, state transition' },
];

const companyTests: TestCategory[] = [
  { name: 'Amazon', icon: '📦', type: 'company', color: '#F59E0B', description: 'OA simulation with mixed difficulty' },
  { name: 'Google', icon: '🔍', type: 'company', color: '#3B82F6', description: 'Algorithm-heavy with optimization focus' },
  { name: 'Meta', icon: '👤', type: 'company', color: '#8B5CF6', description: 'Data structures and system design' },
  { name: 'Apple', icon: '🍎', type: 'company', color: '#9CA3AF', description: 'Clean code and edge case handling' },
];

function generateMockScore(): { score: number; strengths: string[]; weaknesses: string[] } {
  const score = Math.floor(Math.random() * 50) + 40; // 40-90

  const allStrengths = [
    'Pattern recognition', 'Time complexity analysis', 'Edge case handling',
    'Code readability', 'Optimal solution', 'Hash map usage',
    'Two pointer technique', 'Sliding window mastery',
  ];
  const allWeaknesses = [
    'Space optimization', 'Recursive thinking', 'State transition design',
    'Graph traversal efficiency', 'Boundary conditions', 'Time management',
    'DP state definition', 'Backtracking pruning',
  ];

  const strengths = allStrengths.sort(() => Math.random() - 0.5).slice(0, 2);
  const weaknesses = allWeaknesses.sort(() => Math.random() - 0.5).slice(0, 2);

  return { score, strengths, weaknesses };
}

function generateAIComment(score: number, category: string): string {
  if (score >= 80) {
    return `Exceptional performance in ${category}! You demonstrate strong command of core patterns. Focus on edge cases and optimization to achieve perfection.`;
  }
  if (score >= 60) {
    return `Solid foundation in ${category}. Your approach is correct but can be optimized. Practice timed drills to improve speed and accuracy under pressure.`;
  }
  if (score >= 40) {
    return `${category} needs targeted practice. Review fundamental patterns and solve 3-5 medium problems daily. Your weak areas need structured revision.`;
  }
  return `Critical gaps in ${category} detected. Start with easy problems to build pattern recognition. Follow the roadmap for a structured improvement plan.`;
}

export default function MockTest() {
  const [testing, setTesting] = useState(false);
  const [activeTest, setActiveTest] = useState<TestCategory | null>(null);
  const [result, setResult] = useState<MockTestResult | null>(null);
  const [history, setHistory] = useState<MockTestResult[]>(() => {
    const saved = localStorage.getItem('prepiq_mock_history');
    return saved ? JSON.parse(saved) : mockTestHistory;
  });
  const [timer, setTimer] = useState(0);

  const startTest = (test: TestCategory) => {
    setActiveTest(test);
    setTesting(true);
    setResult(null);
    setTimer(0);

    // Simulate timer
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 100);

    // Simulate test completion (2-4 seconds)
    const duration = 2000 + Math.random() * 2000;
    setTimeout(() => {
      clearInterval(interval);
      const { score, strengths, weaknesses } = generateMockScore();
      const newResult: MockTestResult = {
        id: `mt_${Date.now()}`,
        type: test.type,
        category: test.name,
        score,
        totalQuestions: 10,
        timeTaken: Math.floor(30 + Math.random() * 30),
        date: new Date().toISOString().split('T')[0],
        strengths,
        weaknesses,
      };

      setResult(newResult);
      setTesting(false);

      const updatedHistory = [newResult, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('prepiq_mock_history', JSON.stringify(updatedHistory));
    }, duration);
  };

  const resetTest = () => {
    setActiveTest(null);
    setResult(null);
    setTesting(false);
  };

  const renderTestGrid = (tests: TestCategory[], title: string, icon: React.ReactNode) => (
    <div>
      <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tests.map((test) => (
          <motion.div
            key={test.name}
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              onClick={() => !testing && startTest(test)}
              className="!p-5 !cursor-pointer group"
              glow="blue"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl shrink-0"
                  style={{ backgroundColor: `${test.color}15` }}
                >
                  {test.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#E5E7EB]">{test.name}</h4>
                  <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2">{test.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                      <Timer className="w-3 h-3" /> 30-60 min
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                      <Crosshair className="w-3 h-3" /> 10 Qs
                    </div>
                  </div>
                </div>
                <div className="shrink-0 p-2 rounded-lg bg-[#6366F1]/10 group-hover:bg-[#6366F1]/20 transition-colors">
                  <PlayCircle className="w-4 h-4 text-[#6366F1]" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Mock Tests"
        subtitle="Simulate real interview assessments and track performance"
        icon={<Crosshair className="w-5 h-5 text-[#6366F1]" />}
        action={
          result && (
            <button
              onClick={resetTest}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F2937]/60 border border-[#1F2937] text-sm text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#3B82F6]/30 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Test
            </button>
          )
        }
      />

      <AnimatePresence mode="wait">
        {/* Testing in progress */}
        {testing && (
          <motion.div
            key="testing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-center min-h-[400px]"
          >
            <Card hover={false} className="!p-12 text-center max-w-md mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6 rounded-full border-[3px] border-[#1F2937] border-t-[#6366F1]"
              />
              <h3 className="text-lg font-bold text-[#E5E7EB] mb-2">
                {activeTest?.name} Test in Progress
              </h3>
              <p className="text-sm text-[#9CA3AF] mb-4">
                AI is generating and evaluating your assessment...
              </p>
              <div className="flex items-center justify-center gap-2 text-[#3B82F6]">
                <Loader className="w-4 h-4" />
                <span className="text-sm font-mono">{(timer / 10).toFixed(1)}s</span>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Result view */}
        {result && !testing && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Score */}
              <div className="lg:col-span-4">
                <Card hover={false} glow="purple" className="flex flex-col items-center !py-8">
                  <p className="text-xs text-[#9CA3AF] mb-4 uppercase tracking-wider font-medium">{result.category} Test Result</p>
                  <ScoreRing
                    score={result.score}
                    size={180}
                    label="Test Score"
                    sublabel={`${result.totalQuestions} questions · ${result.timeTaken} min`}
                  />
                  <div className="flex items-center gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-[#E5E7EB]">{result.totalQuestions}</p>
                      <p className="text-[10px] text-[#9CA3AF]">Questions</p>
                    </div>
                    <div className="w-px h-8 bg-[#1F2937]" />
                    <div className="text-center">
                      <p className="text-lg font-bold text-[#E5E7EB]">{result.timeTaken}m</p>
                      <p className="text-[10px] text-[#9CA3AF]">Duration</p>
                    </div>
                    <div className="w-px h-8 bg-[#1F2937]" />
                    <div className="text-center">
                      <p className={`text-lg font-bold ${result.score >= 70 ? 'text-[#10B981]' : result.score >= 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                        {result.score >= 70 ? 'Pass' : result.score >= 50 ? 'Avg' : 'Fail'}
                      </p>
                      <p className="text-[10px] text-[#9CA3AF]">Status</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Analysis */}
              <div className="lg:col-span-8 space-y-5">
                {/* AI Comment */}
                <Card
                  hover={false}
                  className="!bg-gradient-to-br !from-[#3B82F6]/8 !to-[#8B5CF6]/8 !border-[#3B82F6]/20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Wand2 className="w-4 h-4 text-[#06B6D4]" />
                    <h4 className="text-sm font-semibold text-[#E5E7EB]">AI Performance Analysis</h4>
                  </div>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">
                    {generateAIComment(result.score, result.category)}
                  </p>
                </Card>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-4">
                  <Card hover={false}>
                    <h4 className="text-sm font-semibold text-[#10B981] mb-3 flex items-center gap-2">
                      <ArrowUpFromLine className="w-4 h-4" />
                      Strengths
                    </h4>
                    <div className="space-y-2">
                      {result.strengths.map((s) => (
                        <div key={s} className="flex items-center gap-2">
                          <BadgeCheck className="w-3.5 h-3.5 text-[#10B981]" />
                          <span className="text-sm text-[#E5E7EB]">{s}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card hover={false}>
                    <h4 className="text-sm font-semibold text-[#EF4444] mb-3 flex items-center gap-2">
                      <Crosshair className="w-4 h-4" />
                      Areas to Improve
                    </h4>
                    <div className="space-y-2">
                      {result.weaknesses.map((w) => (
                        <div key={w} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                          <span className="text-sm text-[#E5E7EB]">{w}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Test selection */}
        {!testing && !result && (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {renderTestGrid(patternTests, 'Pattern-wise Tests', <Loader className="w-4 h-4 text-[#F59E0B]" />)}
            {renderTestGrid(companyTests, 'Company-wise Tests', <Crosshair className="w-4 h-4 text-[#6366F1]" />)}

            {/* Recent History */}
            {history.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
                  <Timer className="w-4 h-4 text-[#9CA3AF]" />
                  Recent Results
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.slice(0, 6).map((h) => (
                    <Card key={h.id} hover={false} className="!p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TopicBadge topic={h.type === 'pattern' ? 'Pattern' : 'Company'} variant="neutral" size="sm" />
                          <span className="text-sm font-medium text-[#E5E7EB]">{h.category}</span>
                        </div>
                        <span className={`text-lg font-bold ${h.score >= 70 ? 'text-[#10B981]' : h.score >= 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                          {h.score}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                        <span>{h.date}</span>
                        <span>{h.timeTaken}min</span>
                        <span>{h.totalQuestions} Qs</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
