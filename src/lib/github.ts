// src/lib/github.ts
export async function fetchRepos() {
  const user = process.env.GITHUB_USERNAME!;
  const token = process.env.GITHUB_TOKEN;

  const res = await fetch(
    `https://api.github.com/users/${user}/repos?per_page=100&sort=updated`,
    {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }

  const data = await res.json();

  // ✅ Map to your Repo type
  return data.map((r: any) => ({
    id: r.id,
    name: r.name,
    html_url: r.html_url,
    description: r.description,
    stargazers_count: r.stargazers_count,
    language: r.language,
    forks_count: r.forks_count,
    open_issues_count: r.open_issues_count,
    updated_at: r.updated_at,
    owner: r.owner?.login ?? "",
  }));
}
