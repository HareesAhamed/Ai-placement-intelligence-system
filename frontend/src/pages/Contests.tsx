import { useEffect, useState } from 'react';
import { CalendarClock, ExternalLink, Radio } from 'lucide-react';

import { Card } from '../components/ui/Card';
import { fetchContests, syncContests } from '../services/api';
import type { ContestItem } from '../types/coding';

export default function Contests() {
  const [section, setSection] = useState<'all' | 'upcoming' | 'live' | 'past'>('upcoming');
  const [contests, setContests] = useState<ContestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (nextSection: 'all' | 'upcoming' | 'live' | 'past') => {
    setLoading(true);
    try {
      const data = await fetchContests(nextSection);
      setContests(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(section);
  }, [section]);

  const onRefresh = async () => {
    setLoading(true);
    try {
      await syncContests();
      await load(section);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(['upcoming', 'live', 'past'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setSection(item)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize ${
                section === item ? 'bg-[#2563EB] text-white' : 'bg-[#111827] text-[#94A3B8]'
              }`}
            >
              {item} Contests
            </button>
          ))}
        </div>
        <button onClick={() => void onRefresh()} className="rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-2 text-sm text-[#CBD5E1]">
          Sync Contests
        </button>
      </div>

      {loading ? <Card hover={false}>Loading contests...</Card> : null}

      {!loading && contests.length === 0 ? <Card hover={false}>No contests found for this section.</Card> : null}

      {!loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {contests.map((contest) => (
            <Card key={contest.id} hover={false} className="space-y-4 border-[#1F2937] bg-[#0E1628]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#94A3B8]">{contest.platform}</p>
                  <h3 className="mt-1 text-base font-semibold text-[#E2E8F0]">{contest.name}</h3>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    contest.section === 'live' ? 'bg-rose-500/20 text-rose-300' : 'bg-[#1E293B] text-[#CBD5E1]'
                  }`}
                >
                  {contest.section}
                </span>
              </div>

              <div className="space-y-2 text-sm text-[#CBD5E1]">
                <p className="inline-flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-[#60A5FA]" />
                  {new Date(contest.start_time).toLocaleString()}
                </p>
                <p className="inline-flex items-center gap-2">
                  <Radio className="h-4 w-4 text-[#F59E0B]" />
                  Duration: {contest.duration} min
                </p>
              </div>

              <a
                href={contest.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-3 py-2 text-xs font-semibold text-white"
              >
                Register
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
