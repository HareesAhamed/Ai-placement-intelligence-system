interface StatCard {
  label: string;
  value: string;
  sub?: string;
}

interface ProfileStatsProps {
  stats: StatCard[];
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((item) => (
        <div key={item.label} className="rounded-2xl border border-[#222A33] bg-[#151B22] p-4">
          <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">{item.label}</p>
          <p className="mt-2 text-xl font-semibold text-[#E5E7EB]">{item.value}</p>
          {item.sub ? <p className="mt-1 text-xs text-[#94A3B8]">{item.sub}</p> : null}
        </div>
      ))}
    </div>
  );
}
