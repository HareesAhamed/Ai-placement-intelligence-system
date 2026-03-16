interface DayActivity {
  date: string;
  submissions: number;
}

interface RoadmapCalendarProps {
  entries: DayActivity[];
}

function activityColor(value: number): string {
  if (value === 0) return 'bg-[#0F141A] border-[#1E293B]';
  if (value <= 2) return 'bg-[#12324D] border-[#1D4ED8]/30';
  if (value <= 4) return 'bg-[#1D4ED8]/40 border-[#2563EB]/50';
  return 'bg-[#2563EB]/70 border-[#3B82F6]/70';
}

export function RoadmapCalendar({ entries }: RoadmapCalendarProps) {
  return (
    <div className="rounded-2xl border border-[#222A33] bg-[#151B22] p-4">
      <p className="mb-3 text-sm font-semibold text-[#E5E7EB]">Preparation Heatmap</p>
      <div className="grid grid-cols-7 gap-2">
        {entries.map((entry) => (
          <div
            key={entry.date}
            title={`${entry.date}: ${entry.submissions} submissions`}
            className={`h-8 rounded-md border ${activityColor(entry.submissions)}`}
          />
        ))}
      </div>
    </div>
  );
}
