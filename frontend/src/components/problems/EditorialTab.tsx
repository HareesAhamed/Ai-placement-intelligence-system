import { useEffect, useState } from 'react';

import { Card } from '../ui/Card';
import { fetchProblemEditorial } from '../../services/api';
import type { EditorialResult } from '../../types/coding';

interface EditorialTabProps {
  problemId: number;
}

export function EditorialTab({ problemId }: EditorialTabProps) {
  const [loading, setLoading] = useState(false);
  const [editorial, setEditorial] = useState<EditorialResult | null>(null);

  useEffect(() => {
    setLoading(true);
    void (async () => {
      try {
        const result = await fetchProblemEditorial(problemId);
        setEditorial(result);
      } finally {
        setLoading(false);
      }
    })();
  }, [problemId]);

  return (
    <Card hover={false} className="space-y-3 border-[#1F2937] bg-[#0B1220]">
      <h3 className="text-sm font-semibold text-[#E2E8F0]">Editorial</h3>
      {loading ? <p className="text-xs text-[#94A3B8]">Loading editorial...</p> : null}
      {editorial ? (
        <div className="space-y-2 text-sm text-[#CBD5E1]">
          <p>{editorial.concept_explanation}</p>
          <div>
            <p className="text-xs uppercase tracking-wide text-[#94A3B8]">Step-by-step</p>
            <ul className="mt-1 space-y-1 text-xs">
              {editorial.step_by_step.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-[#C7D2FE]">Optimized idea: {editorial.optimized_code}</p>
          {editorial.tutorial_link ? (
            <a href={editorial.tutorial_link} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#60A5FA] underline underline-offset-2">
              Linked tutorial
            </a>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
