export type CodeLanguage = 'cpp' | 'java';

export interface CodingProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  description: string;
  input_format?: string | null;
  output_format?: string | null;
  constraints?: string | null;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  company_tags: string[];
  hints: string[];
  solved?: boolean;
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
}

export interface SubmissionItem {
  id: number;
  problem_id: number;
  language: CodeLanguage;
  status: string;
  runtime_ms: number | null;
  created_at: string;
}

export interface AnalyticsSummary {
  accuracy: number;
  attempt_count: number;
  avg_runtime_ms: number;
  topic_success_rate: Record<string, number>;
  difficulty_distribution: Record<string, number>;
}
