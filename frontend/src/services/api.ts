import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import type {
  AnalyticsSummary,
  CodingProblem,
  ExecutePayload,
  ExecuteResult,
  SubmissionItem,
  SubmissionResult,
} from '../types/coding';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
export const TOKEN_KEY = 'prepiq_auth_token';
export const AUTH_EMAIL_KEY = 'prepiq_auth_email';

type AuthPayload = {
  access_token: string;
  token_type: string;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function persistAuthToken(token: string, email?: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  if (email) {
    localStorage.setItem(AUTH_EMAIL_KEY, email);
  }
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function getStoredAuthEmail(): string | null {
  return localStorage.getItem(AUTH_EMAIL_KEY);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
}

export async function registerUser(payload: {
  email: string;
  password: string;
  full_name?: string;
}): Promise<void> {
  const res = await api.post<AuthPayload>('/auth/register', payload);
  persistAuthToken(res.data.access_token, payload.email);
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<void> {
  const res = await api.post<AuthPayload>('/auth/login', payload);
  persistAuthToken(res.data.access_token, payload.email);
}

export async function registerDemoUser(): Promise<void> {
  const existingToken = localStorage.getItem(TOKEN_KEY);
  if (existingToken) return;

  const email = 'demo@prepiq.ai';
  const password = 'DemoPass123!';

  try {
    const registerRes = await api.post<AuthPayload>('/auth/register', {
      email,
      password,
      full_name: 'PrepIQ Demo',
    });
    persistAuthToken(registerRes.data.access_token, email);
  } catch {
    const loginRes = await api.post<AuthPayload>('/auth/login', { email, password });
    persistAuthToken(loginRes.data.access_token, email);
  }
}

export async function fetchProblems(params?: { difficulty?: string; topic?: string }): Promise<CodingProblem[]> {
  const res = await api.get<CodingProblem[]>('/problems', { params });
  return res.data;
}

export async function fetchProblem(problemId: number): Promise<CodingProblem> {
  const res = await api.get<CodingProblem>(`/problems/${problemId}`);
  return res.data;
}

export async function executeCode(payload: ExecutePayload): Promise<ExecuteResult> {
  const res = await api.post<ExecuteResult>('/execute', payload);
  return res.data;
}

export async function submitCode(payload: {
  problem_id: number;
  language: 'cpp' | 'java';
  code: string;
}): Promise<SubmissionResult> {
  const res = await api.post<SubmissionResult>('/submissions', payload);
  return res.data;
}

export async function fetchSubmissions(): Promise<SubmissionItem[]> {
  const res = await api.get<SubmissionItem[]>('/submissions');
  return res.data;
}

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const res = await api.get<AnalyticsSummary>('/submissions/analytics/summary');
  return res.data;
}
