import { useEffect, useMemo, useState } from 'react';
import { Bookmark, CheckCircle2, Circle, Search, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Card } from '../components/ui/Card';
import { useAuth } from '../context/useAuth';
import { fetchProblems, toggleProblemBookmark } from '../services/api';
import type { ProblemListItem } from '../types/coding';

const PAGE_SIZE = 12;

const difficultyClass: Record<ProblemListItem['difficulty'], string> = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

export default function Problems() {
  const [tab, setTab] = useState<'all' | 'premium'>('all');
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [allOptionsData, setAllOptionsData] = useState<ProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('all');
  const [topic, setTopic] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [page, setPage] = useState(1);
  const [bookmarkBusyId, setBookmarkBusyId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    void (async () => {
      const optionsData = await fetchProblems({ tab: 'all', page: 1, page_size: 100 });
      setAllOptionsData(optionsData);
    })();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [tab, company, topic, statusFilter, difficulty, search]);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const result = await fetchProblems({
          tab,
          page,
          page_size: PAGE_SIZE,
          search: search.trim() || undefined,
          company: company === 'all' ? undefined : company,
          topic: topic === 'all' ? undefined : topic,
          difficulty: difficulty === 'all' ? undefined : difficulty,
          status: statusFilter === 'all' ? undefined : statusFilter,
        });
        setProblems(result);
      } finally {
        setLoading(false);
      }
    })();
  }, [tab, page, company, topic, statusFilter, difficulty, search]);

  const companies = useMemo(() => {
    const set = new Set<string>();
    for (const item of allOptionsData) {
      for (const tag of item.company_tags) set.add(tag);
    }
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [allOptionsData]);

  const topics = useMemo(() => {
    const set = new Set<string>();
    for (const item of allOptionsData) {
      for (const tag of item.topic_tags) set.add(tag);
    }
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [allOptionsData]);

  const onToggleBookmark = async (problemId: number) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setBookmarkBusyId(problemId);
    try {
      const result = await toggleProblemBookmark(problemId);
      setProblems((prev) =>
        prev.map((item) => (item.id === problemId ? { ...item, is_bookmarked: result.bookmarked } : item))
      );
    } finally {
      setBookmarkBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card hover={false} className="border-[#1E293B] bg-[#0F172A]/80 p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setTab('all')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === 'all' ? 'bg-[#1D4ED8] text-white' : 'bg-[#111827] text-[#94A3B8] hover:text-white'
            }`}
          >
            All Problems
          </button>
          <button
            onClick={() => setTab('premium')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === 'premium' ? 'bg-[#312E81] text-[#E0E7FF]' : 'bg-[#111827] text-[#94A3B8] hover:text-white'
            }`}
          >
            <Shield className="h-4 w-4" />
            Premium
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems"
              className="h-11 w-full rounded-xl border border-[#1F2937] bg-[#0B1120] pl-10 pr-3 text-sm text-[#E2E8F0] placeholder:text-[#64748B]"
            />
          </div>

          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="h-11 rounded-xl border border-[#1F2937] bg-[#0B1120] px-3 text-sm text-[#E2E8F0]"
          >
            {companies.map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? 'Companies' : item}
              </option>
            ))}
          </select>

          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="h-11 rounded-xl border border-[#1F2937] bg-[#0B1120] px-3 text-sm text-[#E2E8F0]"
          >
            {topics.map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? 'Topics' : item}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-[#1F2937] bg-[#0B1120] px-3 text-sm text-[#E2E8F0]"
          >
            <option value="all">Status</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
            <option value="bookmarked">Bookmarked</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="h-11 rounded-xl border border-[#1F2937] bg-[#0B1120] px-3 text-sm text-[#E2E8F0]"
          >
            <option value="all">Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </Card>

      <Card hover={false} className="overflow-hidden border-[#1E293B] bg-[#0B1220] p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#111827] text-left text-xs uppercase tracking-wide text-[#94A3B8]">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Problem Name</th>
                <th className="px-4 py-3">Topic Tags</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Bookmark</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-5 text-[#94A3B8]" colSpan={5}>
                    Loading problems...
                  </td>
                </tr>
              ) : problems.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-[#94A3B8]" colSpan={5}>
                    No problems match the current filters.
                  </td>
                </tr>
              ) : (
                problems.map((problem) => (
                  <tr
                    key={problem.id}
                    className="cursor-pointer border-t border-[#1F2937]/70 text-[#E2E8F0] transition hover:bg-[#16243E]/45"
                    onClick={() => navigate(`/problems/${problem.id}`)}
                  >
                    <td className="px-4 py-4">
                      {problem.solved ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-[#475569]" />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="font-medium">{problem.title}</p>
                        {problem.is_premium ? (
                          <span className="inline-flex items-center rounded-md border border-[#4338CA]/40 bg-[#312E81]/40 px-2 py-0.5 text-[11px] font-semibold text-[#C7D2FE]">
                            Premium
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {problem.topic_tags.map((tag) => (
                          <span
                            key={`${problem.id}-${tag}`}
                            className="rounded-full border border-[#334155] bg-[#0F172A] px-2.5 py-0.5 text-xs text-[#CBD5E1]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${difficultyClass[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        className="rounded-lg p-1.5 text-[#64748B] transition hover:bg-[#1E293B]"
                        disabled={bookmarkBusyId === problem.id}
                        onClick={(event) => {
                          event.stopPropagation();
                          void onToggleBookmark(problem.id);
                        }}
                      >
                        <Bookmark
                          className={`h-5 w-5 ${
                            problem.is_bookmarked ? 'fill-yellow-300 text-yellow-300' : 'text-[#64748B]'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="rounded-lg border border-[#1F2937] bg-[#111827] px-3 py-2 text-sm text-[#CBD5E1] disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm text-[#94A3B8]">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={problems.length < PAGE_SIZE}
          className="rounded-lg border border-[#1F2937] bg-[#111827] px-3 py-2 text-sm text-[#CBD5E1] disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
