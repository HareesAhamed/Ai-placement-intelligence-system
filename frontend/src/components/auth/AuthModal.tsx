import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogIn, UserPlus, X } from 'lucide-react';

import { useAuth } from '../../context/useAuth';

export function AuthModal() {
  const {
    authModalOpen,
    authMode,
    closeAuthModal,
    openAuthModal,
    login,
    register,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(
    () => (authMode === 'login' ? 'Welcome Back' : 'Create Your Account'),
    [authMode]
  );

  const subtitle = useMemo(
    () =>
      authMode === 'login'
        ? 'Log in to run and submit code with tracked analytics.'
        : 'Register to unlock coding submissions and your personal history.',
    [authMode]
  );

  const resetForm = () => {
    setPassword('');
    setError(null);
    if (authMode === 'login') {
      setFullName('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (authMode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password, fullName.trim() || undefined);
      }
      setPassword('');
    } catch {
      setError(
        authMode === 'login'
          ? 'Login failed. Check your credentials and try again.'
          : 'Registration failed. This email may already be in use.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (mode: 'login' | 'register') => {
    openAuthModal(mode);
    resetForm();
  };

  return (
    <AnimatePresence>
      {authModalOpen ? (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAuthModal}
            className="fixed inset-0 z-[120] bg-[#020617]/75 backdrop-blur-md"
            aria-label="Close auth dialog"
          />
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 top-1/2 z-[121] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[#1F2937]/80 bg-[#0B1120]/95 shadow-2xl shadow-black/40"
          >
            <div className="relative border-b border-[#1F2937]/60 bg-gradient-to-r from-[#1D4ED8]/15 via-transparent to-[#0EA5E9]/10 px-5 py-4">
              <button
                onClick={closeAuthModal}
                className="absolute right-4 top-4 rounded-lg border border-[#1F2937] bg-[#0F172A] p-1.5 text-[#9CA3AF] hover:text-[#E5E7EB]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-lg font-bold text-[#E5E7EB]">{title}</p>
              <p className="mt-1 text-xs text-[#94A3B8]">{subtitle}</p>
            </div>

            <div className="px-5 pt-4">
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#1F2937]/70 bg-[#0F172A] p-1">
                <button
                  onClick={() => switchMode('login')}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    authMode === 'login'
                      ? 'bg-[#1D4ED8]/30 text-[#BFDBFE]'
                      : 'text-[#94A3B8] hover:text-[#E2E8F0]'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => switchMode('register')}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    authMode === 'register'
                      ? 'bg-[#0EA5E9]/30 text-[#BAE6FD]'
                      : 'text-[#94A3B8] hover:text-[#E2E8F0]'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              {authMode === 'register' ? (
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
                    Full Name
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Chen"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2.5 text-sm text-[#E5E7EB] placeholder-[#6B7280] focus:border-[#3B82F6]/60 focus:outline-none"
                  />
                </div>
              ) : null}

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="you@prepiq.ai"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2.5 text-sm text-[#E5E7EB] placeholder-[#6B7280] focus:border-[#3B82F6]/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2.5 text-sm text-[#E5E7EB] placeholder-[#6B7280] focus:border-[#3B82F6]/60 focus:outline-none"
                />
              </div>

              {error ? (
                <p className="rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-xs text-[#FCA5A5]">
                  {error}
                </p>
              ) : null}

              <button
                disabled={submitting}
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#1D4ED8]/30 transition hover:from-[#1D4ED8] hover:to-[#0284C7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {authMode === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {submitting ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
