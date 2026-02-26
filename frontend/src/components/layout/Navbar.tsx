import { useLocation } from 'react-router-dom';
import { Bell, Search, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'AI-powered overview of your placement readiness' },
  '/problems': { title: 'Problems', subtitle: 'Track and analyze your problem-solving patterns' },
  '/roadmap': { title: 'Roadmap', subtitle: 'AI-generated personalized study plan' },
  '/mock-test': { title: 'Mock Test', subtitle: 'Simulate real interview assessments' },
  '/analytics': { title: 'Analytics', subtitle: 'Deep dive into your performance metrics' },
};

export function Navbar() {
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || { title: 'PrepIQ', subtitle: '' };

  return (
    <header className="sticky top-0 z-40 h-20 bg-[#0B1120]/70 backdrop-blur-2xl border-b border-[#1F2937]/30">
      <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/[0.01] to-[#8B5CF6]/[0.01] pointer-events-none" />
      <div className="flex items-center justify-between h-full px-8">
        {/* Left side - Page title */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-lg font-bold text-[#E5E7EB]">{pageInfo.title}</h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{pageInfo.subtitle}</p>
        </motion.div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search problems, topics..."
              className="w-64 pl-10 pr-4 py-2 rounded-xl bg-[#111827]/80 border border-[#1F2937]/60 text-sm text-[#E5E7EB] placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#3B82F6]/50 focus:ring-1 focus:ring-[#3B82F6]/20 transition-all"
            />
            <kbd className="absolute right-3 text-[10px] text-[#9CA3AF]/40 border border-[#1F2937] rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </div>

          {/* Streak indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20">
            <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-xs font-semibold text-[#F59E0B]">7 day streak</span>
          </div>

          {/* Notification bell */}
          <button className="relative p-2.5 rounded-xl bg-[#111827]/60 border border-[#1F2937]/40 hover:bg-[#1F2937]/60 transition-colors">
            <Bell className="w-4 h-4 text-[#9CA3AF]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#3B82F6] border-2 border-[#0B1120]" />
          </button>
        </div>
      </div>
    </header>
  );
}
