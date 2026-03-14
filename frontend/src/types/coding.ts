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
