import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, ExternalLink } from 'lucide-react';

import { Card } from '../components/ui/Card';
import { fetchTutorials } from '../services/api';
import type { TutorialItem } from '../types/coding';

export default function Tutorials() {
  const [tutorials, setTutorials] = useState<TutorialItem[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    void (async () => {
      const data = await fetchTutorials();
      setTutorials(data);
    })();
  }, []);

  const filtered = useMemo(
    () => tutorials.filter((item) => `${item.topic} ${item.title}`.toLowerCase().includes(query.toLowerCase())),
    [tutorials, query]
  );

  return (
    <div className="space-y-6">
      <Card hover={false} className="space-y-3 border-[#1F2937] bg-[#0E1628]">
        <div className="flex items-center gap-2">
          <BookOpenText className="h-5 w-5 text-[#3B82F6]" />
          <h2 className="text-lg font-semibold text-[#E2E8F0]">Tutorial Library</h2>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by topic"
          className="h-11 w-full rounded-xl border border-[#1F2937] bg-[#0B1120] px-3 text-sm text-[#E2E8F0]"
        />
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((tutorial) => (
          <Card key={tutorial.topic} hover={false} className="space-y-3 border-[#1F2937] bg-[#0E1628]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-[#E2E8F0]">{tutorial.title}</h3>
              <span className="rounded-full border border-[#334155] bg-[#0F172A] px-2.5 py-1 text-xs text-[#CBD5E1]">
                {tutorial.topic}
              </span>
            </div>
            <p className="text-sm text-[#CBD5E1]">{tutorial.concept}</p>
            <p className="text-xs text-[#94A3B8]">Complexity: {tutorial.complexity}</p>
            <pre className="overflow-x-auto rounded-xl border border-[#1F2937] bg-[#0B1120] p-3 text-xs text-[#BFDBFE]">
              {tutorial.code_example}
            </pre>
            <p className="text-sm text-[#CBD5E1]">{tutorial.practice_tips}</p>
            {tutorial.resource_link ? (
              <a
                href={tutorial.resource_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#60A5FA] hover:text-[#93C5FD]"
              >
                Open Resource
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
