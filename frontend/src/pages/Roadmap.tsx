import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Route, CircleCheckBig, CircleDashed, Briefcase, Medal, Layers } from 'lucide-react';

import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeader } from '../components/ui/SectionHeader';

import { userPerformance, companyPatterns } from '../data/mockData';
import { analyzeWeaknesses } from '../utils/weaknessEngine';
import { generateRoadmap, markDayComplete, getRoadmapProgress, getTopicProgress } from '../utils/roadmapEngine';
import { getCompanyReadinessBreakdown } from '../utils/readinessEngine';

export default function Roadmap() {
  const weaknessData = useMemo(() => analyzeWeaknesses(userPerformance), []);
  const weakTopics = useMemo(
    () => weaknessData.map(w => w.topic), []
  );

  const [roadmap, setRoadmap] = useState(() => generateRoadmap(weakTopics));
  const progress = useMemo(() => getRoadmapProgress(roadmap), [roadmap]);
  const topicProgress = useMemo(() => getTopicProgress(roadmap), [roadmap]);
  const companyReadiness = useMemo(
    () => getCompanyReadinessBreakdown(userPerformance, companyPatterns), []
  );

  const handleDayComplete = (day: number) => {
    markDayComplete(day);
    setRoadmap(prev =>
      prev.map(d => d.day === day ? { ...d, completed: true } : d)
    );
  };

  const topicColorMap: Record<string, string> = {
    'Array': '#3B82F6',
    'String': '#10B981',
    'DP': '#EF4444',
    'Graph': '#F59E0B',
    'Tree': '#8B5CF6',
    'Linked List': '#EC4899',
    'Stack': '#06B6D4',
    'Queue': '#14B8A6',
    'Binary Search': '#6366F1',
    'Backtracking': '#F97316',
    'Greedy': '#84CC16',
    'Heap': '#A855F7',
    'Mock Interview': '#3B82F6',
  };

  const getTopicColor = (topic: string): string => topicColorMap[topic] || '#3B82F6';

  const companyIcons: Record<string, string> = {
    Amazon: '📦', Google: '🔍', Meta: '👤', Apple: '🍎',
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="AI Study Roadmap"
        subtitle="30-day personalized plan based on your weakness analysis"
        icon={<Route className="w-5 h-5 text-[#6366F1]" />}
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/20">
              <Medal className="w-4 h-4 text-[#6366F1]" />
              <span className="text-sm font-semibold text-[#6366F1]">{progress}% Complete</span>
            </div>
          </div>
        }
      />

      {/* Overall progress */}
      <Card hover={false} className="!p-5">
        <ProgressBar
          value={progress}
          label="Overall Roadmap Progress"
          color={progress >= 70 ? 'green' : progress >= 40 ? 'yellow' : 'blue'}
          size="lg"
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left - Progress */}
        <div className="lg:col-span-4 space-y-5">
          {/* Topic Progress */}
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6366F1]" />
              Topic-wise Progress
            </h3>
            <div className="space-y-4">
              {topicProgress.map((tp) => (
                <ProgressBar
                  key={tp.topic}
                  label={tp.topic}
                  sublabel={`${tp.completed}/${tp.total} days`}
                  value={tp.percentage}
                  color={
                    tp.topic === 'Mock Interview' ? 'purple' :
                    tp.percentage >= 60 ? 'green' :
                    tp.percentage >= 30 ? 'yellow' : 'red'
                  }
                  size="sm"
                />
              ))}
            </div>
          </Card>

          {/* Company Readiness Cards */}
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#F59E0B]" />
              Company Readiness
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {companyReadiness.map((c) => (
                <motion.div
                  key={c.company}
                  whileHover={{ scale: 1.03 }}
                  className="relative p-4 rounded-xl border border-[#1F2937]/60 bg-[#0B1120]/60 text-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(180deg, transparent, ${c.readiness >= 60 ? '#10B98108' : '#EF444408'})` }}
                  />
                  <span className="text-2xl mb-2 block">{companyIcons[c.company] || '🏢'}</span>
                  <p className="text-xs text-[#9CA3AF] font-medium">{c.company}</p>
                  <p className={`text-xl font-bold mt-1 ${
                    c.readiness >= 70 ? 'text-[#10B981]' :
                    c.readiness >= 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                  }`}>
                    {c.readiness}%
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right - 30-Day Grid */}
        <div className="lg:col-span-8">
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-[#E5E7EB] mb-5 flex items-center gap-2">
              <Route className="w-4 h-4 text-[#06B6D4]" />
              30-Day Study Plan
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {roadmap.map((day, i) => {
                const color = getTopicColor(day.topic);
                return (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    onClick={() => !day.completed && handleDayComplete(day.day)}
                    className={`relative p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                      day.completed
                        ? 'bg-[#10B981]/10 border-[#10B981]/30'
                        : day.isMockInterview
                        ? 'bg-gradient-to-br from-[#3B82F6]/10 to-[#8B5CF6]/10 border-[#3B82F6]/20'
                        : 'bg-[#0B1120]/60 border-[#1F2937]/40 hover:border-[#3B82F6]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">Day {day.day}</span>
                      {day.completed ? (
                        <CircleCheckBig className="w-3.5 h-3.5 text-[#10B981]" />
                      ) : (
                        <CircleDashed className="w-3.5 h-3.5 text-[#9CA3AF]/30" />
                      )}
                    </div>
                    <p className="text-xs font-medium truncate" style={{ color }}>
                      {day.topic}
                    </p>
                    <p className="text-[10px] text-[#9CA3AF] mt-1">
                      {day.isMockInterview ? '📝 Mock' : `${day.problems} problems`}
                    </p>

                    {/* Bottom accent line */}
                    <div
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full opacity-30"
                      style={{ backgroundColor: color }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-[#1F2937]/30">
              <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Topics:</span>
              {Object.entries(topicColorMap).filter(([t]) => t !== 'Mock Interview').slice(0, 8).map(([topic, color]) => (
                <div key={topic} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-[#9CA3AF]">{topic}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
