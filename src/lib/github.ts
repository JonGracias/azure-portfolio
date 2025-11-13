// src/lib/github.ts
export async function fetchRepos() {
  const user = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }

  const data = await res.json();

  // Fetch languages for each repo in parallel
  const repos = await Promise.all(
    data.map(async (r: any) => {
      let languages: Record<string, number> = {};
      try {
        const langRes = await fetch(r.languages_url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (langRes.ok) languages = await langRes.json();
      } catch (err) {
        console.warn(`Failed to fetch languages for ${r.name}`, err);
      }

      // Repo Map
      return {
        id: r.id,
        name: r.name,
        html_url: r.html_url,
        description: r.description,
        stargazers_count: r.stargazers_count,
        language: r.language,
        languages,
        forks_count: r.forks_count,
        open_issues_count: r.open_issues_count,
        owner: r.owner?.login ?? "",
        created_at: r.created_at,
        pushed_at: r.pushed_at,
        updated_at: r.updated_at,
      };
    })
  );

  return repos;
}
