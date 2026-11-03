import { memoizeAsync } from './memo';

export type RepoCounts = { stars: number; forks: number };

const GITHUB_API = 'https://api.github.com/repos/';

/// Headers GitHub expects; the token lifts the anonymous rate limit in CI.
export function githubHeaders(token: string | undefined): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'arefmozafari.com-build',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function loadRepoCounts(
  fullName: string,
  fetchImplementation: typeof fetch,
  token: string | undefined,
): Promise<RepoCounts | null> {
  try {
    const response = await fetchImplementation(`${GITHUB_API}${fullName}`, {
      headers: githubHeaders(token),
    });
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

const memoizedRepoCounts = memoizeAsync(loadRepoCounts);

/// Fetches stars and forks for `owner/repo`, once per process. Returns null on any
/// failure so a rate-limited or offline build renders the row without a count.
export function fetchRepoCounts(
  fullName: string,
  fetchImplementation: typeof fetch = fetch,
  token: string | undefined = process.env.GITHUB_TOKEN,
): Promise<RepoCounts | null> {
  return memoizedRepoCounts(fullName, fetchImplementation, token);
}
