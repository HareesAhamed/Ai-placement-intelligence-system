import { useEffect, useMemo, useState } from 'react';
import { Search, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ProblemTable } from '../components/problems/ProblemTable';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/useAuth';
import { fetchProblems, fetchRoadmap, toggleProblemBookmark } from '../services/api';
import type { ProblemListItem } from '../types/coding';

const PAGE_SIZE = 12;

export default function Problems() {
  const [tab, setTab] = useState<'all' | 'premium'>('all');
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [allOptionsData, setAllOptionsData] = useState<ProblemListItem[]>([]);
  const [roadmapTags, setRoadmapTags] = useState<Record<number, Array<{ dayNumber: number; topic: string }>>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('all');
  const [topic, setTopic] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [roadmapFilter, setRoadmapFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [bookmarkBusyId, setBookmarkBusyId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    void (async () => {
      const optionsData = await fetchProblems({ tab: 'all', page: 1, page_size: 100 });
      setAllOptionsData(optionsData);

      if (isAuthenticated) {
        try {
          const roadmap = await fetchRoadmap();
          const map: Record<number, Array<{ dayNumber: number; topic: string }>> = {};

          for (const item of optionsData) {
            const tags = roadmap.days
              .filter((day) => day.topic.toLowerCase() === item.topic.toLowerCase())
              .map((day) => ({ dayNumber: day.day_number, topic: day.topic }));
            if (tags.length > 0) {
              map[item.id] = tags;
            }
          }
          setRoadmapTags(map);
        } catch {
          setRoadmapTags({});
        }
      }
    })();
  }, [isAuthenticated]);

  useEffect(() => {
    setPage(1);
  }, [tab, company, topic, statusFilter, difficulty, roadmapFilter, search]);

  const filteredRows = useMemo(() => {
    if (roadmapFilter !== 'roadmap') return problems;
    return problems.filter((problem) => (roadmapTags[problem.id] ?? []).length > 0);
  }, [problems, roadmapFilter, roadmapTags]);

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
      <Card hover={false} className="border-[#222A33] bg-[#151B22] p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setTab('all')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === 'all' ? 'bg-[#1D4ED8] text-white' : 'bg-[#11161D] text-[#94A3B8] hover:text-white'
            }`}
          >
            All Problems
          </button>
          <button
            onClick={() => setTab('premium')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === 'premium' ? 'bg-[#312E81] text-[#E0E7FF]' : 'bg-[#11161D] text-[#94A3B8] hover:text-white'
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
              className="h-11 w-full rounded-xl border border-[#222A33] bg-[#0B0F14] pl-10 pr-3 text-sm text-[#E2E8F0] placeholder:text-[#64748B]"
            />
          </div>

          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="h-11 rounded-xl border border-[#222A33] bg-[#0B0F14] px-3 text-sm text-[#E2E8F0]"
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
            className="h-11 rounded-xl border border-[#222A33] bg-[#0B0F14] px-3 text-sm text-[#E2E8F0]"
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
            className="h-11 rounded-xl border border-[#222A33] bg-[#0B0F14] px-3 text-sm text-[#E2E8F0]"
          >
            <option value="all">Status</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
            <option value="bookmarked">Bookmarked</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="h-11 rounded-xl border border-[#222A33] bg-[#0B0F14] px-3 text-sm text-[#E2E8F0]"
          >
            <option value="all">Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={roadmapFilter}
            onChange={(e) => setRoadmapFilter(e.target.value)}
            className="h-11 rounded-xl border border-[#222A33] bg-[#0B0F14] px-3 text-sm text-[#E2E8F0]"
          >
            <option value="all">Roadmap</option>
            <option value="roadmap">In Roadmap</option>
          </select>
        </div>
      </Card>

      <ProblemTable
        rows={filteredRows}
        loading={loading}
        roadmapTags={roadmapTags}
        onOpenProblem={(problemId) => navigate(`/problems/${problemId}`)}
        onToggleBookmark={(problemId) => void onToggleBookmark(problemId)}
        bookmarkBusyId={bookmarkBusyId}
      />

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="rounded-lg border border-[#222A33] bg-[#11161D] px-3 py-2 text-sm text-[#CBD5E1] disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm text-[#94A3B8]">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={problems.length < PAGE_SIZE}
          className="rounded-lg border border-[#222A33] bg-[#11161D] px-3 py-2 text-sm text-[#CBD5E1] disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
