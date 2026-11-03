import { describe, expect, it } from 'vitest';
import { fetchPackageScore } from '../../src/lib/pubdev';

describe('fetchPackageScore', () => {
  it('should map points, likes and downloads from the score payload', async () => {
    const fetchStub = async () =>
      new Response(
        JSON.stringify({ grantedPoints: 160, likeCount: 176, downloadCount30Days: 2864 }),
        { status: 200 },
      );

    const score = await fetchPackageScore('flutter_pw_validator', fetchStub as typeof fetch);

    expect(score).toEqual({ points: 160, likes: 176, downloads30Days: 2864 });
  });

  it('should return null when pub.dev is unreachable', async () => {
    const fetchStub = async () => {
      throw new Error('blocked');
    };

    expect(await fetchPackageScore('x', fetchStub as typeof fetch)).toBeNull();
  });

  it('should fetch each package once per process and reuse the answer', async () => {
    let calls = 0;
    const fetchStub = async () => {
      calls += 1;
      return new Response(
        JSON.stringify({ grantedPoints: 1, likeCount: 2, downloadCount30Days: 3 }),
        {
          status: 200,
        },
      );
    };

    await fetchPackageScore('memo_package', fetchStub as typeof fetch);
    await fetchPackageScore('memo_package', fetchStub as typeof fetch);

    expect(calls).toBe(1);
  });

  it('should return null when pub.dev answers with an error status', async () => {
    const fetchStub = async () => new Response('not found', { status: 404 });

    expect(await fetchPackageScore('x', fetchStub as typeof fetch)).toBeNull();
  });
});
