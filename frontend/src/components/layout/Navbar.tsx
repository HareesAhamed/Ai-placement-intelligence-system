import { useLocation } from 'react-router-dom';
import { BellDot, Search, Flame, Menu, LogIn, UserPlus, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/useAuth';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'AI-powered overview of your placement readiness' },
  '/problems': { title: 'Problems', subtitle: 'LeetCode-style list with premium filters, tags, bookmarks, and status' },
  '/roadmap': { title: 'Roadmap', subtitle: 'AI-generated personalized study plan' },
  '/analytics': { title: 'Analytics', subtitle: 'Deep dive into your performance metrics' },
  '/contests': { title: 'Contests', subtitle: 'Track upcoming, live, and past coding contests' },
  '/profile': { title: 'Profile', subtitle: 'Connect external coding profiles and sync platform stats' },
};

function resolvePageInfo(pathname: string): { title: string; subtitle: string } {
  if (pathname.startsWith('/problems/')) {
    return { title: 'Problem Workspace', subtitle: 'Solve, run, and submit code with real test case evaluation' };
  }
  return pageTitles[pathname] || { title: 'PrepIQ', subtitle: '' };
}

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
  const pageInfo = resolvePageInfo(location.pathname);
  const { isAuthenticated, authEmail, openAuthModal, logout } = useAuth();

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
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-xl bg-[#111827]/60 border border-[#1F2937]/40 hover:bg-[#1F2937]/60 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4 text-[#9CA3AF]" />
          </button>

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
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F97316]/10 border border-[#F97316]/20">
            <Flame className="w-3.5 h-3.5 text-[#F97316]" />
            <span className="text-xs font-semibold text-[#F97316]">7 day streak</span>
          </div>

          {/* Notification bell */}
          <button className="relative p-2.5 rounded-xl bg-[#111827]/60 border border-[#1F2937]/40 hover:bg-[#1F2937]/60 transition-colors">
            <BellDot className="w-4 h-4 text-[#9CA3AF]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#6366F1] border-2 border-[#0B1120]" />
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:block rounded-lg border border-[#1F2937]/60 bg-[#111827]/70 px-3 py-2 text-xs text-[#CBD5E1]">
                {authEmail ?? 'Authenticated'}
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-3 py-2 text-xs font-semibold text-[#FCA5A5] hover:bg-[#EF4444]/15"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#1F2937]/70 bg-[#111827]/70 px-3 py-2 text-xs font-semibold text-[#E5E7EB] hover:bg-[#1F2937]/70"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Login</span>
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8]"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
