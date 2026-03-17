import { useState } from 'react';

import { Card } from '../ui/Card';
import { fetchProblemCodeReview } from '../../services/api';
import type { CodeLanguage, CodeReviewResult } from '../../types/coding';

interface CodeReviewPanelProps {
  problemId: number;
  language: CodeLanguage;
  code: string;
  status: string;
}

export function CodeReviewPanel({ problemId, language, code, status }: CodeReviewPanelProps) {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<CodeReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProblemCodeReview({
        problem_id: problemId,
        language,
        code,
        status,
      });
      setReview(result);
    } catch {
      setError('Code review is unavailable right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card hover={false} className="space-y-3 border-[#1F2937] bg-[#0B1220]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#E2E8F0]">Code Review</h3>
        <button
          type="button"
          onClick={() => void onRun()}
          disabled={loading}
          className="rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Reviewing...' : 'Run Review'}
        </button>
      </div>
      {error ? <p className="text-xs text-[#FCA5A5]">{error}</p> : null}
      {review ? (
        <div className="space-y-2 text-sm text-[#CBD5E1]">
          <p>{review.verdict}</p>
          <p>Time: {review.time_complexity} | Space: {review.space_complexity}</p>
          <p>Optimal: {review.optimal_solution}</p>
          <p>Alternative: {review.alternative_approach}</p>
          <div>
            <p className="text-xs uppercase tracking-wide text-[#94A3B8]">Improvements</p>
            <ul className="mt-1 space-y-1 text-xs">
              {review.improvements.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-xs text-[#94A3B8]">Run code review after submission to get optimization guidance.</p>
      )}
    </Card>
  );
}
