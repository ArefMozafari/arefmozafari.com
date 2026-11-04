import { describe, expect, it } from 'vitest';
import { fetchPullRequestState } from '../../src/lib/github-pull-request';

const respond =
  (payload: unknown, status = 200) =>
  async () =>
    new Response(JSON.stringify(payload), { status });

describe('fetchPullRequestState', () => {
  it('should report an open pull request as open', async () => {
    const state = await fetchPullRequestState(
      'dart-lang/ai',
      731,
      respond({ state: 'open', merged_at: null }) as typeof fetch,
      undefined,
    );

    expect(state).toBe('open');
  });

  it('should report a merged pull request as merged', async () => {
    const state = await fetchPullRequestState(
      'a/b',
      1,
      respond({ state: 'closed', merged_at: '2026-11-10T10:00:00Z' }) as typeof fetch,
      undefined,
    );

    expect(state).toBe('merged');
  });

  it('should report a closed unmerged pull request as closed', async () => {
    const state = await fetchPullRequestState(
      'a/b',
      2,
      respond({ state: 'closed', merged_at: null }) as typeof fetch,
      undefined,
    );

    expect(state).toBe('closed');
  });

  it('should return null when the API fails', async () => {
    const state = await fetchPullRequestState(
      'a/b',
      3,
      respond({}, 403) as typeof fetch,
      undefined,
    );

    expect(state).toBeNull();
  });

  it('should fetch each pull request once per process and reuse the answer', async () => {
    let calls = 0;
    const fetchStub = async () => {
      calls += 1;
      return new Response(JSON.stringify({ state: 'open', merged_at: null }), { status: 200 });
    };

    await fetchPullRequestState('memo/repo', 9, fetchStub as typeof fetch, undefined);
    await fetchPullRequestState('memo/repo', 9, fetchStub as typeof fetch, undefined);

    expect(calls).toBe(1);
  });
});
