import { describe, expect, it } from 'vitest';
import SectionLabel from '../../src/components/SectionLabel.astro';
import { render } from '../helpers/render';

describe('SectionLabel', () => {
  it('should attach the gold sign to the title, not to the whole label', async () => {
    const html = await render(SectionLabel, { title: 'Posts', note: 'a note', sign: true });

    expect(html).toMatch(/<span[^>]*class="[^"]*sign-dot[^"]*"[^>]*>Posts<\/span>/);
    expect(html).not.toMatch(/<h2[^>]*class="[^"]*sign-dot/);
  });

  it('should render the note after the title', async () => {
    const html = await render(SectionLabel, { title: 'Open source', note: 'counts at build' });

    expect(html.indexOf('Open source')).toBeLessThan(html.indexOf('counts at build'));
  });
});
