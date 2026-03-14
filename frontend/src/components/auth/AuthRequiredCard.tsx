import { Lock } from 'lucide-react';

import { Card } from '../ui/Card';
import { useAuth } from '../../context/useAuth';

interface AuthRequiredCardProps {
  title: string;
  message: string;
}

export function AuthRequiredCard({ title, message }: AuthRequiredCardProps) {
  const { openAuthModal } = useAuth();

  return (
    <Card hover={false} className="border-[#1D4ED8]/30 bg-gradient-to-br from-[#0F172A] to-[#111827] p-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#1D4ED8]/30 bg-[#1D4ED8]/15 px-3 py-1 text-xs font-semibold text-[#93C5FD]">
            <Lock className="h-3.5 w-3.5" /> Secure Access
          </div>
          <h3 className="text-lg font-bold text-[#E5E7EB]">{title}</h3>
          <p className="mt-1 text-sm text-[#9CA3AF]">{message}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openAuthModal('login')}
            className="rounded-lg border border-[#1F2937] bg-[#111827] px-4 py-2 text-sm font-semibold text-[#E5E7EB] hover:bg-[#1F2937]"
          >
            Login
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
          >
            Register
          </button>
        </div>
      </div>
    </Card>
  );
}
