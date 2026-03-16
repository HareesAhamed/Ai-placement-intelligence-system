import { useEffect, useMemo, useState } from 'react';
import { BookOpenText } from 'lucide-react';

import { AuthRequiredCard } from '../components/auth/AuthRequiredCard';
import { TutorialViewer } from '../components/tutorials/TutorialViewer';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/useAuth';
import { fetchRoadmap, fetchTutorials } from '../services/api';
import type { TutorialItem } from '../types/coding';

export default function Tutorials() {
  const { isAuthenticated } = useAuth();
  const [tutorials, setTutorials] = useState<TutorialItem[]>([]);
  const [roadmapDaysByTopic, setRoadmapDaysByTopic] = useState<Record<string, number>>({});
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    void (async () => {
      setLoading(true);
      try {
        const [data, roadmap] = await Promise.all([
          fetchTutorials(),
          fetchRoadmap().catch(() => null),
        ]);
        setTutorials(data);

        if (roadmap) {
          const topicMap: Record<string, number> = {};
          for (const day of roadmap.days) {
            if (!(day.topic in topicMap)) {
              topicMap[day.topic] = day.day_number;
            }
          }
          setRoadmapDaysByTopic(topicMap);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated]);

  const filtered = useMemo(
    () => tutorials.filter((item) => `${item.topic} ${item.title}`.toLowerCase().includes(query.toLowerCase())),
    [tutorials, query]
  );

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
        <AuthRequiredCard
          title="Login Required"
          message="Sign in to view structured tutorials linked to your AI roadmap."
        />
      ) : null}

      <Card hover={false} className="space-y-3 border-[#222A33] bg-[#151B22]">
        <div className="flex items-center gap-2">
          <BookOpenText className="h-5 w-5 text-[#3B82F6]" />
          <h2 className="text-lg font-semibold text-[#E2E8F0]">Tutorial Modules</h2>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by topic, concept, or module"
          className="h-11 w-full rounded-xl border border-[#222A33] bg-[#0B0F14] px-3 text-sm text-[#E2E8F0]"
        />
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {loading ? (
          <Card hover={false} className="border-[#222A33] bg-[#151B22] text-sm text-[#94A3B8]">
            Loading tutorials...
          </Card>
        ) : null}

        {!loading && filtered.length === 0 ? (
          <Card hover={false} className="border-[#222A33] bg-[#151B22] text-sm text-[#94A3B8]">
            No tutorial modules match your query.
          </Card>
        ) : null}

        {filtered.map((tutorial) => (
          <TutorialViewer
            key={tutorial.topic}
            tutorial={tutorial}
            roadmapHint={
              roadmapDaysByTopic[tutorial.topic]
                ? { dayNumber: roadmapDaysByTopic[tutorial.topic] }
                : undefined
            }
            practiceProblemLinks={[
              { label: 'Beginner Problems', href: '/problems?difficulty=Easy' },
              { label: 'Intermediate Problems', href: '/problems?difficulty=Medium' },
              { label: 'Interview Problems', href: '/problems?difficulty=Hard' },
            ]}
          />
        ))}
      </div>
    </div>
  );
}
