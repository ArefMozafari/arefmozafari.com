export type RepoCounts = { stars: number; forks: number };

const GITHUB_API = 'https://api.github.com/repos/';

/// Fetches stars and forks for `owner/repo`. Returns null on any failure so a
/// rate-limited or offline build renders the row without a count.
export async function fetchRepoCounts(
  fullName: string,
  fetchImplementation: typeof fetch = fetch,
  token: string | undefined = process.env.GITHUB_TOKEN,
): Promise<RepoCounts | null> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  try {
    const response = await fetchImplementation(`${GITHUB_API}${fullName}`, { headers });
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json()) as {
      stargazers_count?: number;
      forks_count?: number;
    };
    return { stars: payload.stargazers_count ?? 0, forks: payload.forks_count ?? 0 };
  } catch {
    return null;
  }
}
