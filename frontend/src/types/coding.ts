export type CodeLanguage = 'cpp' | 'python' | 'java' | 'javascript';

export interface CodingProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  topic_tags: string[];
  is_premium: boolean;
  description: string;
  input_format?: string | null;
  output_format?: string | null;
  constraints?: string | null;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  company_tags: string[];
  hints: string[];
  solved: boolean;
  is_bookmarked: boolean;
}

export interface ProblemListItem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  topic_tags: string[];
  company_tags: string[];
  is_premium: boolean;
  solved: boolean;
  is_bookmarked: boolean;
}

export interface ExecutePayload {
  language: CodeLanguage;
  code: string;
  input: string;
}

export interface ExecuteResult {
  output: string;
  stderr: string;
  runtime: string;
  status: string;
}

export interface SubmissionResult {
  submission_id: number;
  status: string;
  passed: number;
  total: number;
  runtime_ms: number | null;
  memory_kb: number | null;
}

export interface SubmissionItem {
  id: number;
  problem_id: number;
  language: CodeLanguage;
  status: string;
  runtime_ms: number | null;
  memory_kb: number | null;
  created_at: string;
}

export interface AnalyticsSummary {
  accuracy: number;
  attempt_count: number;
  avg_runtime_ms: number;
  topic_success_rate: Record<string, number>;
  difficulty_distribution: Record<string, number>;
}

export interface PlatformAccount {
  id: number;
  platform: string;
  username: string;
}

export interface PlatformAccountPayload {
  platform: 'leetcode' | 'geeksforgeeks';
  username: string;
}

export interface PlatformStat {
  platform: string;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  total_solved: number;
  topics: string[];
  latest_submission_at: string | null;
}

export interface ContestItem {
  id: number;
  platform: string;
  name: string;
  start_time: string;
  duration: number;
  url: string;
  section: 'upcoming' | 'live' | 'past';
}

export interface SurveyPayload {
  current_year: '2nd' | '3rd' | 'Final';
  dsa_experience_level: 'Beginner' | 'Intermediate' | 'Advanced';
  target_companies: string[];
  weekly_study_hours: number;
  preferred_language: 'cpp' | 'java' | 'python';
  preparation_start_date: string;
  goal_timeline_months: 3 | 6;
}

export interface SurveyResponse extends SurveyPayload {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface AssessmentProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  description: string;
  input_format?: string | null;
  output_format?: string | null;
  constraints?: string | null;
  examples: Array<{ input: string; output: string; explanation?: string }>;
}

export interface AssessmentSubmitResult {
  attempt_id: number;
  status: string;
  passed: number;
  total: number;
  runtime_ms: number | null;
}

export interface AssessmentSummary {
  attempts: number;
  solved: number;
  accuracy: number;
  avg_runtime_ms: number;
  difficulty_success_rate: Record<string, number>;
  topic_accuracy: Record<string, number>;
  last_attempt_at: string | null;
}

export interface RoadmapDay {
  id: number;
  day_number: number;
  week_number: number;
  topic: string;
  problems_count: number;
  tutorial_title: string | null;
  tutorial_link: string | null;
  estimated_minutes: number;
  task_type: string;
  is_completed: boolean;
}

export interface RoadmapPlan {
  id: number;
  start_date: string;
  week_number: number;
  generated_reason: string;
  ai_feedback: string | null;
  created_at: string;
  days: RoadmapDay[];
}

export interface TopicStrength {
  topic: string;
  attempts: number;
  accuracy: number;
  avg_runtime_ms: number;
  weakness_score: number;
  classification: 'weak' | 'average' | 'strong';
}

export interface TutorialItem {
  topic: string;
  title: string;
  concept: string;
  code_example: string;
  complexity: string;
  practice_tips: string;
  resource_link: string | null;
}
