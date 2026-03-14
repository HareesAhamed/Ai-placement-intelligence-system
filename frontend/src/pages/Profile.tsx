import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

import { AuthRequiredCard } from '../components/auth/AuthRequiredCard';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/useAuth';
import {
  fetchPlatformAccounts,
  fetchPlatformStats,
  syncPlatformStats,
  upsertPlatformAccount,
} from '../services/api';
import type { PlatformAccount, PlatformStat } from '../types/coding';

export default function Profile() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [accounts, setAccounts] = useState<PlatformAccount[]>([]);
  const [stats, setStats] = useState<PlatformStat[]>([]);
  const [leetcode, setLeetcode] = useState('');
  const [gfg, setGfg] = useState('');
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    const [accountData, statsData] = await Promise.all([fetchPlatformAccounts(), fetchPlatformStats()]);
    setAccounts(accountData);
    setStats(statsData);
    setLeetcode(accountData.find((item) => item.platform === 'leetcode')?.username ?? '');
    setGfg(accountData.find((item) => item.platform === 'geeksforgeeks')?.username ?? '');
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onSave = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setLoading(true);
    try {
      if (leetcode.trim()) {
        await upsertPlatformAccount({ platform: 'leetcode', username: leetcode.trim() });
      }
      if (gfg.trim()) {
        await upsertPlatformAccount({ platform: 'geeksforgeeks', username: gfg.trim() });
      }
      await syncPlatformStats();
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const onSync = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setLoading(true);
    try {
      await syncPlatformStats();
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
        <AuthRequiredCard
          title="Login Required"
          message="Connect your LeetCode and GeeksForGeeks profiles to auto-sync solved counts, topics, and submission patterns."
        />
      ) : null}

      <Card hover={false} className="space-y-4 border-[#1F2937] bg-[#0E1628]">
        <h2 className="text-lg font-semibold text-[#E2E8F0]">Platform Connectors</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-[#94A3B8]">LeetCode Username</label>
            <input
              value={leetcode}
              onChange={(event) => setLeetcode(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#1F2937] bg-[#0B1120] px-3 text-sm text-[#E2E8F0]"
              placeholder="e.g. john_doe"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-[#94A3B8]">GeeksForGeeks Username</label>
            <input
              value={gfg}
              onChange={(event) => setGfg(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#1F2937] bg-[#0B1120] px-3 text-sm text-[#E2E8F0]"
              placeholder="e.g. john_gfg"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => void onSave()} disabled={loading} className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            Save & Sync
          </button>
          <button
            onClick={() => void onSync()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#1F2937] bg-[#111827] px-4 py-2 text-sm text-[#CBD5E1] disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            Sync Now
          </button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((stat) => (
          <Card key={stat.platform} hover={false} className="space-y-3 border-[#1F2937] bg-[#0E1628]">
            <h3 className="text-base font-semibold text-[#E2E8F0]">{stat.platform}</h3>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-300">Easy {stat.easy_solved}</div>
              <div className="rounded-lg bg-amber-500/10 p-2 text-amber-300">Medium {stat.medium_solved}</div>
              <div className="rounded-lg bg-rose-500/10 p-2 text-rose-300">Hard {stat.hard_solved}</div>
              <div className="rounded-lg bg-[#1E293B] p-2 text-[#CBD5E1]">Total {stat.total_solved}</div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#94A3B8]">Topics</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {stat.topics.length > 0 ? (
                  stat.topics.map((topic) => (
                    <span key={`${stat.platform}-${topic}`} className="rounded-full border border-[#334155] bg-[#0F172A] px-2.5 py-1 text-xs text-[#CBD5E1]">
                      {topic}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#64748B]">No topic distribution found</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isAuthenticated && accounts.length === 0 ? (
        <Card hover={false} className="text-sm text-[#94A3B8]">Connect at least one platform to see synced stats.</Card>
      ) : null}
    </div>
  );
}
