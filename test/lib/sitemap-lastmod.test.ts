import { describe, expect, it } from 'vitest';
import { lastModified } from '../../src/lib/sitemap-lastmod';

describe('lastModified', () => {
  const changed = new Date('2026-11-04T10:00:00Z');

  it('should date a post page by the date in its slug', () => {
    expect(lastModified('https://arefmozafari.com/posts/2026-07-30-some-post/', changed)).toBe(
      '2026-07-30',
    );
  });

  it('should date every other page by the given change date', () => {
    expect(lastModified('https://arefmozafari.com/', changed)).toBe('2026-11-04');
  });
});
