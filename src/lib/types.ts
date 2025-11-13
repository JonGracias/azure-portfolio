// src/lib/types.ts
export type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  languages: Record<string, number>
  forks_count: number;
  open_issues_count: number;
  owner: string;
  created_at: string;
  pushed_at: string;
  updated_at: string;
};
