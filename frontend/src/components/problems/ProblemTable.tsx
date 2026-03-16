import { Bookmark, CheckCircle2, Circle } from 'lucide-react';

import type { ProblemListItem } from '../../types/coding';

type RoadmapTag = {
  dayNumber: number;
  topic: string;
};

interface ProblemTableProps {
  rows: ProblemListItem[];
  loading: boolean;
  roadmapTags: Record<number, RoadmapTag[]>;
  onOpenProblem: (problemId: number) => void;
  onToggleBookmark: (problemId: number) => void;
  bookmarkBusyId: number | null;
}

const difficultyClass: Record<ProblemListItem['difficulty'], string> = {
  Easy: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  Medium: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  Hard: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
};

function estimatedAcceptance(item: ProblemListItem): string {
  if (item.difficulty === 'Easy') return '71%';
  if (item.difficulty === 'Medium') return '54%';
  return '38%';
}

export function ProblemTable({
  rows,
  loading,
  roadmapTags,
  onOpenProblem,
  onToggleBookmark,
  bookmarkBusyId,
}: ProblemTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#222A33] bg-[#151B22]">
      <table className="min-w-full text-sm text-[#D1D5DB]">
        <thead className="border-b border-[#222A33] bg-[#11161D] text-xs uppercase tracking-wide text-[#9CA3AF]">
          <tr>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Difficulty</th>
            <th className="px-4 py-3 text-left">Topic</th>
            <th className="px-4 py-3 text-left">Company Tags</th>
            <th className="px-4 py-3 text-left">Acceptance</th>
            <th className="px-4 py-3 text-left">Bookmark</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-[#9CA3AF]">
                Loading problems...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-[#9CA3AF]">
                No problems match the selected filters.
              </td>
            </tr>
          ) : (
            rows.map((problem) => {
              const tags = roadmapTags[problem.id] ?? [];
              return (
                <tr
                  key={problem.id}
                  className="cursor-pointer border-t border-[#222A33]/70 hover:bg-[#10161D]"
                  onClick={() => onOpenProblem(problem.id)}
                >
                  <td className="px-4 py-4">
                    {problem.solved ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-[#64748B]" />
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-[#E5E7EB]">{problem.title}</p>
                    {tags.length > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {tags.slice(0, 2).map((tag) => (
                          <span
                            key={`${problem.id}-${tag.dayNumber}`}
                            className="rounded-md border border-[#1D4ED8]/40 bg-[#1D4ED8]/15 px-2 py-0.5 text-[11px] text-[#93C5FD]"
                          >
                            Roadmap Day {tag.dayNumber}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${difficultyClass[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#CBD5E1]">{problem.topic}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.company_tags.slice(0, 3).map((company) => (
                        <span
                          key={`${problem.id}-${company}`}
                          className="rounded-md border border-[#334155] bg-[#0F141A] px-2 py-0.5 text-[11px] text-[#CBD5E1]"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#94A3B8]">{estimatedAcceptance(problem)}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleBookmark(problem.id);
                      }}
                      disabled={bookmarkBusyId === problem.id}
                      className="rounded-lg p-1.5 hover:bg-[#0B0F14] disabled:opacity-50"
                    >
                      <Bookmark
                        className={`h-4 w-4 ${problem.is_bookmarked ? 'fill-yellow-300 text-yellow-300' : 'text-[#64748B]'}`}
                      />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
