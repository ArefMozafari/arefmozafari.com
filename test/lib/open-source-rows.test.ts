import { describe, expect, it } from 'vitest';
import { buildOpenSourceRows } from '../../src/lib/open-source-rows';

const fetchers = {
  fetchRepoCounts: async () => ({ stars: 33, forks: 46 }),
  fetchPackageScore: async () => ({ points: 160, likes: 176, downloads30Days: 1 }),
  fetchPullRequestState: async () => 'open' as const,
};

const failingFetchers = {
  fetchRepoCounts: async () => null,
  fetchPackageScore: async () => null,
  fetchPullRequestState: async () => null,
};

describe('buildOpenSourceRows', () => {
  it('should fetch counts only for the sources a repo names', async () => {
    const [row] = await buildOpenSourceRows(
      [{ name: 'n', description: 'd', url: 'https://x.y', github: 'a/b' }],
      fetchers,
    );

    expect(row.counts).toEqual({ stars: 33, forks: 46 });
    expect(row.score).toBeNull();
  });

  it('should append the live pull request state to the note', async () => {
    const [row] = await buildOpenSourceRows(
      [
        {
          name: 'n',
          description: 'd',
          url: 'https://x.y',
          pullRequest: 'dart-lang/ai#731',
          note: 'PR #731',
        },
      ],
      fetchers,
    );

    expect(row.note).toBe('PR #731 · in review');
  });

  it('should keep the plain note when the pull request state is unknown', async () => {
    const [row] = await buildOpenSourceRows(
      [
        {
          name: 'n',
          description: 'd',
          url: 'https://x.y',
          pullRequest: 'dart-lang/ai#731',
          note: 'PR #731',
        },
      ],
      failingFetchers,
    );

    expect(row.note).toBe('PR #731');
  });

  it('should keep the rows in the order given', async () => {
    const rows = await buildOpenSourceRows(
      [
        { name: 'first', description: 'd', url: 'https://x.y' },
        { name: 'second', description: 'd', url: 'https://x.y' },
      ],
      failingFetchers,
    );

    expect(rows.map((row) => row.name)).toEqual(['first', 'second']);
  });
});
