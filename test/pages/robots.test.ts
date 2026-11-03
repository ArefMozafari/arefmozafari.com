import { describe, expect, it } from 'vitest';
import { GET } from '../../src/pages/robots.txt';

describe('robots.txt', () => {
  it('should keep crawlers out of the demo bundle and point at the sitemap', async () => {
    const body = await (await GET({} as never)).text();

    expect(body).toContain('Disallow: /demo/');
    expect(body).toContain('Sitemap: https://arefmozafari.com/sitemap-index.xml');
  });
});
