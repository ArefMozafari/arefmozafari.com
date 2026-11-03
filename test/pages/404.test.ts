import { describe, expect, it } from 'vitest';
import NotFoundPage from '../../src/pages/404.astro';
import { render } from '../helpers/render';

describe('404 page', () => {
  it('should say the page was not found and link home', async () => {
    const html = await render(NotFoundPage);

    expect(html).toMatch(/<h1[^>]*>[^<]*not found/i);
    expect(html).toContain('href="/"');
  });
});
