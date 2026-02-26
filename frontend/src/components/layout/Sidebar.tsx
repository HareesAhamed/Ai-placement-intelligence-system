import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Code2,
  Map,
  Target,
  BarChart3,
  Brain,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Problems', path: '/problems', icon: Code2 },
  { label: 'Roadmap', path: '/roadmap', icon: Map },
  { label: 'Mock Test', path: '/mock-test', icon: Target },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#0B1120]/98 backdrop-blur-2xl border-r border-[#1F2937]/40 z-50 flex flex-col">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3B82F6]/[0.02] via-transparent to-[#8B5CF6]/[0.02] pointer-events-none" />
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-20 border-b border-[#1F2937]/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] shadow-lg shadow-[#3B82F6]/20">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white">Prep</span>
          <span className="text-lg font-bold tracking-tight gradient-text">IQ</span>
          <div className="flex items-center gap-1 -mt-0.5">
            <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
            <span className="text-[10px] text-[#9CA3AF] font-medium tracking-wider uppercase">
              Intelligence
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-white bg-[#3B82F6]/10'
                  : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1F2937]/40'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full bg-gradient-to-b from-[#3B82F6] to-[#8B5CF6]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <item.icon
                  className={clsx(
                    'w-[18px] h-[18px] transition-colors',
                    isActive ? 'text-[#3B82F6]' : 'text-[#9CA3AF] group-hover:text-[#E5E7EB]'
                  )}
                />
                <span>{item.label}</span>

                {/* Active glow */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3B82F6]/5 to-transparent pointer-events-none" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-5 border-t border-[#1F2937]/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#3B82F6]/20">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#E5E7EB] truncate">Alex Chen</p>
            <p className="text-xs text-[#9CA3AF] truncate">Placement Prep</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
