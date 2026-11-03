import { describe, expect, it } from 'vitest';
import Lead from '../../src/components/Lead.astro';
import { render } from '../helpers/render';

describe('Lead', () => {
  it('should be the second-level heading that opens the work section', async () => {
    const html = await render(Lead);
    const text = html
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    expect(html).toMatch(/<h2\b/);
    expect(text).toBe('Three things I shipped that you can open right now.');
  });

  it('should carry the gold underline sign on one phrase', async () => {
    expect(await render(Lead)).toMatch(/<u class="sign-underline"[^>]*>open right now<\/u>/);
  });

  it('should not carry the receipts disclaimer', async () => {
    expect(await render(Lead)).not.toMatch(/internal metrics/i);
  });
});
