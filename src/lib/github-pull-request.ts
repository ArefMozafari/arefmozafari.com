import { memoizeAsync } from './memo';

export type PullRequestState = 'open' | 'merged' | 'closed';

const GITHUB_API = 'https://api.github.com/repos/';

/** Headers GitHub expects; the token lifts the anonymous rate limit in CI. */
function githubHeaders(token: string | undefined): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'arefmozafari.com-build',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function loadPullRequestState(
  reference: string,
  fetchImplementation: typeof fetch,
  token: string | undefined,
): Promise<PullRequestState | null> {
  const [fullName, number] = reference.split('#');
  try {
    const response = await fetchImplementation(`${GITHUB_API}${fullName}/pulls/${number}`, {
      headers: githubHeaders(token),
    });
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json()) as { state?: string; merged_at?: string | null };
    if (payload.merged_at) {
      return 'merged';
    }
    return payload.state === 'open' ? 'open' : 'closed';
  } catch {
    return null;
  }
}

const memoizedPullRequestState = memoizeAsync(loadPullRequestState);

/**
 * Fetches whether a pull request is open, merged or closed without merging, once per
 * process. Returns null on any failure so the row keeps its link and loses only the state.
 */
export function fetchPullRequestState(
  fullName: string,
  number: number,
  fetchImplementation: typeof fetch = fetch,
  token: string | undefined = process.env.GITHUB_TOKEN,
): Promise<PullRequestState | null> {
  return memoizedPullRequestState(`${fullName}#${number}`, fetchImplementation, token);
}
