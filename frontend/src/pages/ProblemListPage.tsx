import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TopicBadge } from '../components/ui/TopicBadge';
import { fetchProblems } from '../services/api';
import type { CodingProblem } from '../types/coding';

export default function ProblemListPage() {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchProblems();
        setProblems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      problems.filter((problem) => {
        const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
        const matchesDifficulty = difficulty === 'all' || problem.difficulty === difficulty;
        return matchesSearch && matchesDifficulty;
      }),
    [problems, search, difficulty]
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Coding Problems"
        subtitle="Practice with interview-style questions and real code execution"
      />

      <Card hover={false} className="space-y-4 border-[#1D4ED8]/20 bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#111827]">
        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title"
            className="min-w-[220px] flex-1 rounded-lg border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-sm text-[#E5E7EB] placeholder-[#6B7280]"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-lg border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-sm text-[#E5E7EB]"
          >
            <option value="all">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F2937] text-left text-[#9CA3AF]">
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Difficulty</th>
                <th className="px-3 py-2">Topic</th>
                <th className="px-3 py-2">Solved</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-3 py-4 text-[#9CA3AF]" colSpan={4}>
                    Loading problems...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-[#9CA3AF]" colSpan={4}>
                    No problems found.
                  </td>
                </tr>
              ) : (
                filtered.map((problem) => (
                  <tr
                    key={problem.id}
                    className="cursor-pointer border-b border-[#1F2937]/50 transition hover:bg-[#1E293B]/35"
                    onClick={() => navigate(`/coding/problems/${problem.id}`)}
                  >
                    <td className="px-3 py-3 text-[#E5E7EB]">{problem.title}</td>
                    <td className="px-3 py-3">
                      <TopicBadge topic={problem.difficulty} variant={problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'} />
                    </td>
                    <td className="px-3 py-3 text-[#CBD5E1]">{problem.topic}</td>
                    <td className="px-3 py-3 text-[#CBD5E1]">{problem.solved ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
