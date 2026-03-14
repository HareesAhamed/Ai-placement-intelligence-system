import { useEffect, useState } from 'react';

import { AuthRequiredCard } from '../components/auth/AuthRequiredCard';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useAuth } from '../context/useAuth';
import { fetchAnalyticsSummary, fetchSubmissions } from '../services/api';
import type { AnalyticsSummary, SubmissionItem } from '../types/coding';

export default function SubmissionPage() {
  const { isAuthenticated } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setSubmissions([]);
      setAnalytics(null);
      return;
    }

    void (async () => {
      try {
        const [subs, stats] = await Promise.all([fetchSubmissions(), fetchAnalyticsSummary()]);
        setSubmissions(subs);
        setAnalytics(stats);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated]);

  return (
    <div className="space-y-6">
      <SectionHeader title="Submission History" subtitle="Track verdicts, runtime, and overall coding performance." />

      {!isAuthenticated ? (
        <AuthRequiredCard
          title="Login Required"
          message="Sign in to view your submission timeline, success rate, and runtime analytics."
        />
      ) : null}

      {isAuthenticated ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card hover={false} className="border-[#10B981]/25 bg-gradient-to-br from-[#052E2B] to-[#0B1120] p-4">
              <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Accuracy</p>
              <p className="mt-2 text-2xl font-bold text-[#10B981]">{analytics ? `${analytics.accuracy}%` : '--'}</p>
            </Card>
            <Card hover={false} className="border-[#3B82F6]/20 bg-gradient-to-br from-[#0F172A] to-[#0B1120] p-4">
              <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Attempts</p>
              <p className="mt-2 text-2xl font-bold text-[#E5E7EB]">{analytics?.attempt_count ?? '--'}</p>
            </Card>
            <Card hover={false} className="border-[#60A5FA]/25 bg-gradient-to-br from-[#0C1C33] to-[#0B1120] p-4">
              <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Avg Runtime</p>
              <p className="mt-2 text-2xl font-bold text-[#60A5FA]">{analytics ? `${analytics.avg_runtime_ms}ms` : '--'}</p>
            </Card>
          </div>

          <Card hover={false}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1F2937] text-left text-[#9CA3AF]">
                    <th className="px-3 py-2">Problem</th>
                    <th className="px-3 py-2">Language</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Runtime</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-3 py-4 text-[#9CA3AF]" colSpan={5}>
                        Loading submissions...
                      </td>
                    </tr>
                  ) : submissions.length === 0 ? (
                    <tr>
                      <td className="px-3 py-4 text-[#9CA3AF]" colSpan={5}>
                        No submissions yet.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-[#1F2937]/50">
                        <td className="px-3 py-3 text-[#CBD5E1]">#{submission.problem_id}</td>
                        <td className="px-3 py-3 text-[#CBD5E1]">{submission.language}</td>
                        <td className="px-3 py-3 text-[#E5E7EB]">{submission.status}</td>
                        <td className="px-3 py-3 text-[#CBD5E1]">{submission.runtime_ms ?? '-'}ms</td>
                        <td className="px-3 py-3 text-[#9CA3AF]">{new Date(submission.created_at).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
