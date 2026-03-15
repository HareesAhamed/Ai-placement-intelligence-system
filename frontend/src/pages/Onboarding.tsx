import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';

import { AuthRequiredCard } from '../components/auth/AuthRequiredCard';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/useAuth';
import { fetchSurvey, submitSurvey } from '../services/api';
import type { SurveyPayload } from '../types/coding';

const initialState: SurveyPayload = {
  current_year: '3rd',
  dsa_experience_level: 'Beginner',
  target_companies: [],
  weekly_study_hours: 8,
  preferred_language: 'python',
  preparation_start_date: new Date().toISOString().slice(0, 10),
  goal_timeline_months: 6,
};

export default function Onboarding() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [form, setForm] = useState<SurveyPayload>(initialState);
  const [companiesInput, setCompaniesInput] = useState('Amazon, Google');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    void (async () => {
      try {
        const survey = await fetchSurvey();
        setForm({
          current_year: survey.current_year,
          dsa_experience_level: survey.dsa_experience_level,
          target_companies: survey.target_companies,
          weekly_study_hours: survey.weekly_study_hours,
          preferred_language: survey.preferred_language,
          preparation_start_date: survey.preparation_start_date,
          goal_timeline_months: survey.goal_timeline_months,
        });
        setCompaniesInput(survey.target_companies.join(', '));
      } catch {
        // No survey yet.
      }
    })();
  }, [isAuthenticated]);

  const companies = useMemo(
    () => companiesInput.split(',').map((item) => item.trim()).filter(Boolean),
    [companiesInput]
  );

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setSaving(true);
    setSaved(false);
    try {
      await submitSurvey({ ...form, target_companies: companies });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
        <AuthRequiredCard
          title="Login Required"
          message="Sign in to submit your onboarding survey and unlock personalized roadmap generation."
        />
      ) : null}

      <Card hover={false} className="space-y-5 border-[#1F2937] bg-[#0E1628]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#3B82F6]" />
          <h2 className="text-lg font-semibold text-[#E2E8F0]">Onboarding Survey</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm text-[#CBD5E1]">
            <span>Current Year</span>
            <select
              value={form.current_year}
              onChange={(event) => setForm((prev) => ({ ...prev, current_year: event.target.value as SurveyPayload['current_year'] }))}
              className="h-11 w-full rounded-xl border border-[#1F2937] bg-[#0B1120] px-3"
            >
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="Final">Final</option>
            </select>
          </label>

          <label className="space-y-1 text-sm text-[#CBD5E1]">
            <span>DSA Experience</span>
            <select
              value={form.dsa_experience_level}
              onChange={(event) => setForm((prev) => ({ ...prev, dsa_experience_level: event.target.value as SurveyPayload['dsa_experience_level'] }))}
              className="h-11 w-full rounded-xl border border-[#1F2937] bg-[#0B1120] px-3"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </label>

          <label className="space-y-1 text-sm text-[#CBD5E1] md:col-span-2">
            <span>Target Companies (comma separated)</span>
            <input
              value={companiesInput}
              onChange={(event) => setCompaniesInput(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#1F2937] bg-[#0B1120] px-3"
              placeholder="Amazon, Google, Microsoft"
            />
          </label>

          <label className="space-y-1 text-sm text-[#CBD5E1]">
            <span>Weekly Study Hours</span>
            <input
              type="number"
              min={1}
              max={80}
              value={form.weekly_study_hours}
              onChange={(event) => setForm((prev) => ({ ...prev, weekly_study_hours: Number(event.target.value) }))}
              className="h-11 w-full rounded-xl border border-[#1F2937] bg-[#0B1120] px-3"
            />
          </label>

          <label className="space-y-1 text-sm text-[#CBD5E1]">
            <span>Preferred Language</span>
            <select
              value={form.preferred_language}
              onChange={(event) => setForm((prev) => ({ ...prev, preferred_language: event.target.value as SurveyPayload['preferred_language'] }))}
              className="h-11 w-full rounded-xl border border-[#1F2937] bg-[#0B1120] px-3"
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </label>

          <label className="space-y-1 text-sm text-[#CBD5E1]">
            <span>Preparation Start Date</span>
            <input
              type="date"
              value={form.preparation_start_date}
              onChange={(event) => setForm((prev) => ({ ...prev, preparation_start_date: event.target.value }))}
              className="h-11 w-full rounded-xl border border-[#1F2937] bg-[#0B1120] px-3"
            />
          </label>

          <label className="space-y-1 text-sm text-[#CBD5E1]">
            <span>Goal Timeline</span>
            <select
              value={form.goal_timeline_months}
              onChange={(event) => setForm((prev) => ({ ...prev, goal_timeline_months: Number(event.target.value) as 3 | 6 }))}
              className="h-11 w-full rounded-xl border border-[#1F2937] bg-[#0B1120] px-3"
            >
              <option value={3}>3 months</option>
              <option value={6}>6 months</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void handleSubmit()}
            disabled={saving}
            className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Survey'}
          </button>
          {saved ? <p className="text-sm text-[#22C55E]">Survey saved. You can now generate roadmap.</p> : null}
        </div>
      </Card>
    </div>
  );
}
