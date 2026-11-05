import type { OpenSourceRow } from '../components/OpenSource.astro';
import { parsePullRequest } from '../content/schemas';
import { fetchPullRequestState, type PullRequestState } from './github-pull-request';

export type RepoData = {
  name: string;
  description: string;
  url: string;
  pullRequest?: string;
  note?: string;
};

/** How a pull request's state is fetched; injected so tests never reach the network. */
export type PullRequestStateFetcher = (
  fullName: string,
  number: number,
) => Promise<PullRequestState | null>;

const PULL_REQUEST_STATE_TEXT: Record<PullRequestState, string> = {
  open: 'in review',
  merged: 'merged',
  closed: 'closed',
};

/** Appends the live pull request state to the row's note when it is known. */
function noteWithState(
  note: string | undefined,
  state: PullRequestState | null,
): string | undefined {
  if (!state) {
    return note;
  }
  return note ? `${note} · ${PULL_REQUEST_STATE_TEXT[state]}` : PULL_REQUEST_STATE_TEXT[state];
}

/** Turns one repo entry into a row, fetching the pull request state when the entry names one. */
async function toRow(repo: RepoData, fetchState: PullRequestStateFetcher): Promise<OpenSourceRow> {
  const pullRequest = repo.pullRequest ? parsePullRequest(repo.pullRequest) : undefined;
  const state = pullRequest ? await fetchState(pullRequest.fullName, pullRequest.number) : null;
  return {
    name: repo.name,
    description: repo.description,
    url: repo.url,
    note: noteWithState(repo.note, state),
  };
}

/**
 * Under the test runner the pages render with the plain notes: a unit suite never waits on
 * GitHub, and a stub cannot be passed through a page render.
 */
const defaultFetcher: PullRequestStateFetcher = process.env.VITEST
  ? () => Promise.resolve(null)
  : (fullName, number) => fetchPullRequestState(fullName, number);

/** Builds the open-source rows for the homepage, in the order given. */
export function buildOpenSourceRows(
  repos: RepoData[],
  fetchState: PullRequestStateFetcher = defaultFetcher,
): Promise<OpenSourceRow[]> {
  return Promise.all(repos.map((repo) => toRow(repo, fetchState)));
}
