import { describe, expect, it } from 'vitest';
import Lead from '../../src/components/Lead.astro';
import { render } from '../helpers/render';

describe('Lead', () => {
  it('should be the second-level heading that opens the work section', async () => {
    const html = await render(Lead);

    expect(html).toMatch(/<h2[^>]*>Three things I shipped that you can open right now\.<\/h2>/);
  });

  it('should carry the receipts rule with the underline sign', async () => {
    const html = await render(Lead);

    expect(html).toMatch(
      /<u class="sign-underline"[^>]*>If you can't check it, it isn't here\.<\/u>/,
    );
  });
});
