import { Lightbulb, Building2 } from 'lucide-react';

import { Card } from '../ui/Card';
import { TopicBadge } from '../ui/TopicBadge';
import type { CodingProblem } from '../../types/coding';

interface ProblemStatementPanelProps {
  problem: CodingProblem;
}

export function ProblemStatementPanel({ problem }: ProblemStatementPanelProps) {
  return (
    <Card className="space-y-5" hover={false}>
      <div>
        <h2 className="text-xl font-bold text-[#E5E7EB]">{problem.title}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <TopicBadge topic={problem.difficulty} variant={problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'} />
          <TopicBadge topic={problem.topic} variant="strong" />
        </div>
      </div>

      <section>
        <h3 className="mb-1 text-sm font-semibold text-[#E5E7EB]">Description</h3>
        <p className="whitespace-pre-wrap text-sm leading-6 text-[#CBD5E1]">{problem.description}</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[#E5E7EB]">Examples</h3>
        {problem.examples.map((example, idx) => (
          <div key={`${problem.id}-${idx}`} className="rounded-lg border border-[#1F2937] bg-[#0F172A]/70 p-3 text-xs text-[#CBD5E1]">
            <p className="mb-1 text-[#E5E7EB]">Example {idx + 1}</p>
            <p><span className="text-[#93C5FD]">Input:</span> {example.input}</p>
            <p><span className="text-[#93C5FD]">Output:</span> {example.output}</p>
            {example.explanation ? <p><span className="text-[#93C5FD]">Explanation:</span> {example.explanation}</p> : null}
          </div>
        ))}
      </section>

      {problem.constraints ? (
        <section>
          <h3 className="mb-1 text-sm font-semibold text-[#E5E7EB]">Constraints</h3>
          <pre className="whitespace-pre-wrap rounded-lg border border-[#1F2937] bg-[#0F172A]/70 p-3 text-xs text-[#CBD5E1]">{problem.constraints}</pre>
        </section>
      ) : null}

      {problem.company_tags.length > 0 ? (
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#E5E7EB]">
            <Building2 className="h-4 w-4 text-[#8B5CF6]" /> Company Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {problem.company_tags.map((tag) => (
              <span key={tag} className="rounded-full border border-[#1F2937] bg-[#111827] px-2 py-1 text-xs text-[#A5B4FC]">
                {tag}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {problem.hints.length > 0 ? (
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#E5E7EB]">
            <Lightbulb className="h-4 w-4 text-[#F59E0B]" /> Hints
          </h3>
          <ul className="space-y-1 text-xs text-[#CBD5E1]">
            {problem.hints.map((hint) => (
              <li key={hint} className="rounded-md border border-[#1F2937] bg-[#0F172A]/70 px-2 py-1.5">
                {hint}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Card>
  );
}
