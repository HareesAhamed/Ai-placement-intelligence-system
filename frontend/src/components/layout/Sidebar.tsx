import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gauge,
  CodeXml,
  Compass,
  PieChart,
  BookOpenText,
  Cpu,
  Wand2,
  X,
  Trophy,
  UserCircle2,
  ClipboardList,
} from 'lucide-react';
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', path: '/', icon: Gauge },
  { label: 'Problems', path: '/problems', icon: CodeXml },
  { label: 'Roadmap', path: '/roadmap', icon: Compass },
  { label: 'Analytics', path: '/analytics', icon: PieChart },
  { label: 'Tutorials', path: '/tutorials', icon: BookOpenText },
  { label: 'Onboarding', path: '/onboarding', icon: ClipboardList },
  { label: 'Contests', path: '/contests', icon: Trophy },
  { label: 'Profile', path: '/profile', icon: UserCircle2 },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-20 border-b border-[#1F2937]/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1D4ED8]">
          <Cpu className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white">Prep</span>
          <span className="text-lg font-bold tracking-tight text-[#60A5FA]">IQ</span>
          <div className="flex items-center gap-1 -mt-0.5">
            <Wand2 className="w-3 h-3 text-[#06B6D4]" />
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
            onClick={onNavigate}
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
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-8 rounded-r-full bg-[#3B82F6]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <item.icon
                  className={clsx(
                    'w-4.5 h-4.5 transition-colors',
                    isActive ? 'text-[#3B82F6]' : 'text-[#9CA3AF] group-hover:text-[#E5E7EB]'
                  )}
                />
                <span>{item.label}</span>

                {/* Active glow */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-linear-to-r from-[#3B82F6]/5 to-transparent pointer-events-none" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-5 border-t border-[#1F2937]/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#E5E7EB] truncate">Alex Chen</p>
            <p className="text-xs text-[#9CA3AF] truncate">Placement Prep</p>
          </div>
        </div>
      </div>
    </>
  );
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 w-65 bg-[#0B1120]/98 backdrop-blur-2xl border-r border-[#1F2937]/40 z-50 hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-[#020617]/70 backdrop-blur-sm z-40 lg:hidden"
              aria-label="Close menu overlay"
            />
            <motion.aside
              initial={{ x: -280, opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0.5 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed left-0 top-0 bottom-0 w-65 bg-[#0B1120] border-r border-[#1F2937]/60 z-50 flex flex-col lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute right-3 top-3 p-2 rounded-lg bg-[#111827]/70 border border-[#1F2937]/60"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-[#9CA3AF]" />
              </button>
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
