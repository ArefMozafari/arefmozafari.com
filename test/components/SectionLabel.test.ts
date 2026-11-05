import { describe, expect, it } from 'vitest';
import SectionLabel from '../../src/components/SectionLabel.astro';
import { render } from '../helpers/render';

describe('SectionLabel', () => {
  it('should attach the gold sign to the title, not to the whole label', async () => {
    const html = await render(SectionLabel, { title: 'Posts', note: 'a note', sign: true });

    expect(html).toMatch(/<span[^>]*class="[^"]*sign-dot[^"]*"[^>]*>Posts<\/span>/);
    expect(html).not.toMatch(/<h2[^>]*class="[^"]*sign-dot/);
  });

  it('should keep the note out of the heading, after it', async () => {
    const html = await render(SectionLabel, { title: 'Also shipped', note: 'earlier work' });

    expect(html).toMatch(/<h2[^>]*>(?:(?!<\/h2>).)*Also shipped(?:(?!<\/h2>).)*<\/h2>/s);
    expect(html).not.toMatch(/<h2[^>]*>(?:(?!<\/h2>).)*earlier work/s);
    expect(html).toMatch(/<\/h2>\s*<p[^>]*class="[^"]*note[^"]*"[^>]*>earlier work<\/p>/);
  });
});
