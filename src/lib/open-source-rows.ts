import type { OpenSourceRow } from '../components/OpenSource.astro';
import { parsePullRequest } from '../content/schemas';
import { fetchRepoCounts, type RepoCounts } from './github';
import { fetchPullRequestState, type PullRequestState } from './github-pull-request';
import { fetchPackageScore, type PackageScore } from './pubdev';

export type RepoData = {
  name: string;
  description: string;
  url: string;
  github?: string;
  pub?: string;
  pullRequest?: string;
  note?: string;
};

/// The three live sources a row can draw from. Injected so tests never reach the network.
export type Fetchers = {
  fetchRepoCounts: (fullName: string) => Promise<RepoCounts | null>;
  fetchPackageScore: (name: string) => Promise<PackageScore | null>;
  fetchPullRequestState: (fullName: string, number: number) => Promise<PullRequestState | null>;
};

const LIVE_FETCHERS: Fetchers = {
  fetchRepoCounts: (fullName) => fetchRepoCounts(fullName),
  fetchPackageScore: (name) => fetchPackageScore(name),
  fetchPullRequestState: (fullName, number) => fetchPullRequestState(fullName, number),
};

const PULL_REQUEST_STATE_TEXT: Record<PullRequestState, string> = {
  open: 'in review',
  merged: 'merged',
  closed: 'closed',
};

/// Appends the live pull request state to the row's note when it is known.
function noteWithState(
  note: string | undefined,
  state: PullRequestState | null,
): string | undefined {
  if (!state) {
    return note;
  }
  return note ? `${note} · ${PULL_REQUEST_STATE_TEXT[state]}` : PULL_REQUEST_STATE_TEXT[state];
}

/// Turns one repo entry into a row, fetching whatever live data its fields ask for.
async function toRow(repo: RepoData, fetchers: Fetchers): Promise<OpenSourceRow> {
  const pullRequest = repo.pullRequest ? parsePullRequest(repo.pullRequest) : undefined;
  const [counts, score, state] = await Promise.all([
    repo.github ? fetchers.fetchRepoCounts(repo.github) : null,
    repo.pub ? fetchers.fetchPackageScore(repo.pub) : null,
    pullRequest ? fetchers.fetchPullRequestState(pullRequest.fullName, pullRequest.number) : null,
  ]);
  return {
    name: repo.name,
    description: repo.description,
    url: repo.url,
    counts,
    score,
    note: noteWithState(repo.note, state),
  };
}

/// Builds the open-source rows for the homepage, in the order given.
export function buildOpenSourceRows(
  repos: RepoData[],
  fetchers: Fetchers = LIVE_FETCHERS,
): Promise<OpenSourceRow[]> {
  return Promise.all(repos.map((repo) => toRow(repo, fetchers)));
}
