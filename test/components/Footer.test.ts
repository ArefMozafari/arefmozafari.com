import { describe, expect, it } from 'vitest';
import Footer from '../../src/components/Footer.astro';
import { SITE } from '../../src/site';
import { render } from '../helpers/render';

describe('Footer', () => {
  it('should link the source repository', async () => {
    expect(await render(Footer)).toContain(`href="${SITE.repo}"`);
  });

  it('should show the current year', async () => {
    expect(await render(Footer)).toContain(`Aref Mozafari · ${new Date().getFullYear()}`);
  });

  it('should carry no attribution to any tool', async () => {
    expect(await render(Footer)).not.toMatch(/claude|anthropic|generated/i);
  });
});
