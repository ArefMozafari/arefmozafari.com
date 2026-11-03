import { describe, expect, it } from 'vitest';
import { memoizeAsync } from '../../src/lib/memo';

describe('memoizeAsync', () => {
  it('should call the loader once per key and reuse the settled value', async () => {
    let calls = 0;
    const load = memoizeAsync(async (key: string) => {
      calls += 1;
      return `${key}!`;
    });

    const [first, second] = await Promise.all([load('a'), load('a')]);
    const third = await load('a');

    expect(calls).toBe(1);
    expect([first, second, third]).toEqual(['a!', 'a!', 'a!']);
  });

  it('should keep separate values for separate keys', async () => {
    const load = memoizeAsync(async (key: string) => key.toUpperCase());

    expect(await load('a')).toBe('A');
    expect(await load('b')).toBe('B');
  });

  it('should not cache a failed null answer so the next call retries', async () => {
    let calls = 0;
    const load = memoizeAsync(async () => {
      calls += 1;
      return calls === 1 ? null : 'ok';
    });

    expect(await load('a')).toBeNull();
    expect(await load('a')).toBe('ok');
  });
});
