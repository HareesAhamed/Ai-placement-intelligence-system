import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, BarChart2, CheckCircle2, XCircle, Sparkles, Send } from 'lucide-react';

import { Card } from '../components/ui/Card';
import { TopicBadge } from '../components/ui/TopicBadge';
import { SectionHeader } from '../components/ui/SectionHeader';
import { problemBank } from '../data/mockData';
import type { Problem } from '../types';

export default function Problems() {
  const [problems, setProblems] = useState<Problem[]>(() => {
    const saved = localStorage.getItem('prepiq_problems');
    return saved ? JSON.parse(saved) : problemBank;
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [timeTaken, setTimeTaken] = useState('');
  const [attempts, setAttempts] = useState('1');
  const [confidence, setConfidence] = useState(3);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const topics = useMemo(() => {
    const t = new Set(problems.map(p => p.topic));
    return ['all', ...Array.from(t)];
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.topic.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = filter === 'all' || p.difficulty === filter;
      const matchesTopic = topicFilter === 'all' || p.topic === topicFilter;
      return matchesSearch && matchesDifficulty && matchesTopic;
    });
  }, [problems, search, filter, topicFilter]);

  const generateFeedback = (time: number, problem: Problem): string => {
    const avgTime = problems
      .filter(p => p.topic === problem.topic && p.timeTaken)
      .reduce((acc, p) => acc + (p.timeTaken || 0), 0) / Math.max(1, problems.filter(p => p.topic === problem.topic && p.timeTaken).length);

    const messages: string[] = [];

    if (time > avgTime * 1.3) {
      messages.push(`⚡ Your time (${time}min) is above the topic average (${Math.round(avgTime)}min). Focus on pattern recognition for ${problem.topic} problems.`);
    } else if (time < avgTime * 0.7) {
      messages.push(`🚀 Excellent speed! You solved this ${Math.round(((avgTime - time) / avgTime) * 100)}% faster than your ${problem.topic} average.`);
    } else {
      messages.push(`✅ Good pace. Your time is consistent with your ${problem.topic} average.`);
    }

    if (confidence <= 2) {
      messages.push(`📘 Low confidence detected. Review core ${problem.topic} patterns and attempt similar ${problem.difficulty} problems.`);
    } else if (confidence >= 4) {
      messages.push(`💪 High confidence! Consider trying harder ${problem.topic} problems to level up.`);
    }

    if (parseInt(attempts) > 2) {
      messages.push(`🔄 Multiple attempts suggest this pattern needs reinforcement. Add ${problem.topic} to your daily practice.`);
    }

    return messages.join('\n\n');
  };

  const handleSaveAnalyze = () => {
    if (!selectedProblem || !timeTaken) return;

    const updatedProblem: Problem = {
      ...selectedProblem,
      solved: true,
      timeTaken: parseInt(timeTaken),
      attemptCount: parseInt(attempts),
      confidence,
      solvedAt: new Date().toISOString().split('T')[0],
    };

    const updatedProblems = problems.map(p =>
      p.id === updatedProblem.id ? updatedProblem : p
    );

    setProblems(updatedProblems);
    localStorage.setItem('prepiq_problems', JSON.stringify(updatedProblems));

    const fb = generateFeedback(parseInt(timeTaken), selectedProblem);
    setFeedback(fb);
    setShowFeedback(true);
    setSelectedProblem(updatedProblem);
  };

  const solvedCount = problems.filter(p => p.solved).length;
  const stats = {
    total: problems.length,
    solved: solvedCount,
    easy: problems.filter(p => p.difficulty === 'Easy').length,
    medium: problems.filter(p => p.difficulty === 'Medium').length,
    hard: problems.filter(p => p.difficulty === 'Hard').length,
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Problem Tracker"
        subtitle={`${stats.solved} of ${stats.total} problems solved`}
        icon={<BarChart2 className="w-5 h-5 text-[#3B82F6]" />}
      />

      {/* Stats chips */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: 'Total', count: stats.total, color: '#3B82F6' },
          { label: 'Solved', count: stats.solved, color: '#10B981' },
          { label: 'Easy', count: stats.easy, color: '#10B981' },
          { label: 'Medium', count: stats.medium, color: '#F59E0B' },
          { label: 'Hard', count: stats.hard, color: '#EF4444' },
        ].map(s => (
          <div
            key={s.label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
            style={{
              backgroundColor: `${s.color}10`,
              borderColor: `${s.color}20`,
            }}
          >
            <span className="text-xs text-[#9CA3AF]">{s.label}</span>
            <span className="text-sm font-bold" style={{ color: s.color }}>{s.count}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Problem List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filter */}
          <Card hover={false} className="!p-4">
            <div className="flex gap-3 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1120] border border-[#1F2937] text-sm text-[#E5E7EB] placeholder-[#9CA3AF]/50 focus:outline-none focus:border-[#3B82F6]/50 transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setFilter(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === d
                      ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30'
                      : 'bg-[#1F2937]/30 text-[#9CA3AF] border border-[#1F2937]/30 hover:border-[#3B82F6]/20'
                  }`}
                >
                  {d === 'all' ? 'All' : d}
                </button>
              ))}
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs bg-[#1F2937]/30 border border-[#1F2937]/30 text-[#9CA3AF] focus:outline-none focus:border-[#3B82F6]/30"
              >
                {topics.map(t => (
                  <option key={t} value={t}>{t === 'all' ? 'All Topics' : t}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* Problem List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            <AnimatePresence>
              {filteredProblems.map((problem, i) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div
                    onClick={() => { setSelectedProblem(problem); setShowFeedback(false); setFeedback(null); }}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedProblem?.id === problem.id
                        ? 'bg-[#3B82F6]/10 border-[#3B82F6]/30 shadow-[0_0_20px_rgba(59,130,246,0.08)]'
                        : 'bg-[#111827]/60 border-[#1F2937]/40 hover:border-[#1F2937] hover:bg-[#111827]/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {problem.solved ? (
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#9CA3AF]/40 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#E5E7EB] truncate">{problem.title}</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">{problem.topic}</p>
                      </div>
                    </div>
                    <TopicBadge
                      topic={problem.difficulty}
                      variant={problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}
                      size="sm"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel - Problem Details & Tracking */}
        <div className="lg:col-span-7 space-y-5">
          {selectedProblem ? (
            <>
              <Card hover={false} glow="blue">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-[#E5E7EB]">{selectedProblem.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <TopicBadge topic={selectedProblem.topic} variant="neutral" />
                      <TopicBadge
                        topic={selectedProblem.difficulty}
                        variant={selectedProblem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}
                      />
                    </div>
                  </div>
                  {selectedProblem.solved && (
                    <div className="px-3 py-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
                      <span className="text-xs font-medium text-[#10B981]">✓ Solved</span>
                    </div>
                  )}
                </div>

                {/* Tracking Section */}
                <div className="space-y-5 pt-4 border-t border-[#1F2937]/50">
                  <h4 className="text-sm font-semibold text-[#E5E7EB] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8B5CF6]" />
                    Track Your Attempt
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#9CA3AF] mb-1.5">Time Taken (min)</label>
                      <input
                        type="number"
                        value={timeTaken}
                        onChange={(e) => setTimeTaken(e.target.value)}
                        placeholder="e.g., 25"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-[#1F2937] text-sm text-[#E5E7EB] placeholder-[#9CA3AF]/40 focus:outline-none focus:border-[#3B82F6]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#9CA3AF] mb-1.5">Attempts</label>
                      <input
                        type="number"
                        value={attempts}
                        onChange={(e) => setAttempts(e.target.value)}
                        min="1"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-[#1F2937] text-sm text-[#E5E7EB] placeholder-[#9CA3AF]/40 focus:outline-none focus:border-[#3B82F6]/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Confidence Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-[#9CA3AF]">Confidence Level</label>
                      <span className="text-xs font-semibold text-[#E5E7EB]">{confidence}/5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={confidence}
                      onChange={(e) => setConfidence(parseInt(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3B82F6 0%, #8B5CF6 ${(confidence / 5) * 100}%, #1F2937 ${(confidence / 5) * 100}%, #1F2937 100%)`,
                      }}
                    />
                    <div className="flex justify-between mt-1">
                      {['Low', 'Below Avg', 'Average', 'Good', 'Confident'].map((l, i) => (
                        <span key={l} className={`text-[10px] ${confidence === i + 1 ? 'text-[#3B82F6]' : 'text-[#9CA3AF]/40'}`}>
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveAnalyze}
                    disabled={!timeTaken}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#3B82F6]/20"
                  >
                    <Send className="w-4 h-4" />
                    Save & Analyze
                  </button>
                </div>
              </Card>

              {/* AI Feedback */}
              <AnimatePresence>
                {showFeedback && feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      hover={false}
                      className="!bg-gradient-to-br !from-[#3B82F6]/8 !to-[#8B5CF6]/8 !border-[#3B82F6]/20"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                        <h4 className="text-sm font-semibold text-[#E5E7EB]">AI Performance Feedback</h4>
                      </div>
                      <div className="space-y-2">
                        {feedback.split('\n\n').map((line, i) => (
                          <p key={i} className="text-sm text-[#9CA3AF] leading-relaxed">{line}</p>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <Card hover={false} className="!flex !items-center !justify-center !min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center">
                  <BarChart2 className="w-8 h-8 text-[#3B82F6]/40" />
                </div>
                <p className="text-sm text-[#9CA3AF]">Select a problem to view details</p>
                <p className="text-xs text-[#9CA3AF]/60 mt-1">Track your progress and get AI feedback</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
