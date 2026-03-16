import { ArrowRight, BookOpenText, ExternalLink } from 'lucide-react';

import type { TutorialItem } from '../../types/coding';

type RoadmapHint = {
  dayNumber: number;
};

interface TutorialViewerProps {
  tutorial: TutorialItem;
  roadmapHint?: RoadmapHint;
  practiceProblemLinks: Array<{ label: string; href: string }>;
}

export function TutorialViewer({ tutorial, roadmapHint, practiceProblemLinks }: TutorialViewerProps) {
  return (
    <article className="rounded-2xl border border-[#222A33] bg-[#151B22] p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#E5E7EB]">{tutorial.title}</h3>
          <p className="mt-1 text-sm text-[#94A3B8]">{tutorial.topic}</p>
        </div>
        {roadmapHint ? (
          <span className="rounded-md border border-[#1D4ED8]/40 bg-[#1D4ED8]/15 px-2 py-1 text-xs text-[#93C5FD]">
            Roadmap Day {roadmapHint.dayNumber}
          </span>
        ) : null}
      </div>

      <section className="space-y-4 text-sm text-[#CBD5E1]">
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-[#9CA3AF]">Concept</p>
          <p>{tutorial.concept}</p>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-[#9CA3AF]">Time Complexity Analysis</p>
          <p>{tutorial.complexity}</p>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-[#9CA3AF]">Code Example</p>
          <pre className="overflow-x-auto rounded-xl border border-[#222A33] bg-[#0B0F14] p-3 font-mono text-xs text-[#BFDBFE]">
            {tutorial.code_example}
          </pre>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-[#9CA3AF]">Common Mistakes</p>
          <p>{tutorial.practice_tips}</p>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-[#9CA3AF]">Practice Problems</p>
          <div className="flex flex-wrap gap-2">
            {practiceProblemLinks.map((link) => (
              <a
                key={`${tutorial.topic}-${link.label}`}
                href={link.href}
                className="inline-flex items-center gap-1 rounded-md border border-[#334155] bg-[#0F141A] px-3 py-1.5 text-xs text-[#CBD5E1] hover:border-[#3B82F6]/50"
              >
                {link.label}
                <ArrowRight className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>

        {tutorial.resource_link ? (
          <a
            href={tutorial.resource_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#60A5FA] hover:text-[#93C5FD]"
          >
            <BookOpenText className="h-4 w-4" />
            Open External Resource
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </section>
    </article>
  );
}
