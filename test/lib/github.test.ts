import { describe, expect, it } from 'vitest';
import { fetchRepoCounts } from '../../src/lib/github';

describe('fetchRepoCounts', () => {
  it('should map stargazers and forks from the repo payload', async () => {
    const fetchStub = async () =>
      new Response(JSON.stringify({ stargazers_count: 33, forks_count: 46 }), { status: 200 });

    const counts = await fetchRepoCounts(
      'ArefMozafari/flutter_pw_validator',
      fetchStub as typeof fetch,
      undefined,
    );

    expect(counts).toEqual({ stars: 33, forks: 46 });
  });

  it('should return null when the API answers with an error status', async () => {
    const fetchStub = async () => new Response('rate limited', { status: 403 });

    expect(await fetchRepoCounts('a/b', fetchStub as typeof fetch, undefined)).toBeNull();
  });

  it('should return null when the network throws', async () => {
    const fetchStub = async () => {
      throw new Error('offline');
    };

    expect(await fetchRepoCounts('a/b', fetchStub as typeof fetch, undefined)).toBeNull();
  });

  it('should send the bearer token when one is given', async () => {
    let seenAuthorization = '';
    const fetchStub = async (_url: string | URL | Request, init?: RequestInit) => {
      seenAuthorization = new Headers(init?.headers).get('authorization') ?? '';
      return new Response('{}', { status: 200 });
    };

    await fetchRepoCounts('a/b', fetchStub as typeof fetch, 'token');

    expect(seenAuthorization).toBe('Bearer token');
  });

  it('should fetch each repo once per process and reuse the answer', async () => {
    let calls = 0;
    const fetchStub = async () => {
      calls += 1;
      return new Response(JSON.stringify({ stargazers_count: 1, forks_count: 2 }), { status: 200 });
    };

    const first = await fetchRepoCounts('memo/repo', fetchStub as typeof fetch, undefined);
    const second = await fetchRepoCounts('memo/repo', fetchStub as typeof fetch, undefined);

    expect(calls).toBe(1);
    expect(second).toEqual(first);
  });
});
