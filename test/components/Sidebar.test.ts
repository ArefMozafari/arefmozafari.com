import { describe, expect, it } from 'vitest';
import Sidebar from '../../src/components/Sidebar.astro';
import { render } from '../helpers/render';

const sections = [
  { id: 'work', label: 'Work' },
  { id: 'open-source', label: 'Open source' },
  { id: 'posts', label: 'Posts' },
  { id: 'contact', label: 'Contact' },
];

describe('Sidebar', () => {
  it('should mark the Persian name as right-to-left Persian', async () => {
    const html = await render(Sidebar, { years: 8, sections });

    expect(html).toMatch(/<p[^>]*lang="fa"[^>]*dir="rtl"/);
    expect(html).toContain('عارف مظفری');
  });

  it('should render the role line with the computed years', async () => {
    const html = await render(Sidebar, { years: 8, sections });

    expect(html).toContain('data-career-start="2018-12-01"');
    expect(html).toMatch(/8<\/span> years: wallets, call SDKs, marketplaces\./);
  });

  it('should link every section with a plain anchor', async () => {
    const html = await render(Sidebar, { years: 8, sections });

    for (const section of sections) {
      expect(html).toContain(`href="/#${section.id}"`);
    }
  });

  it('should never say relocation', async () => {
    expect(await render(Sidebar, { years: 8, sections })).not.toMatch(/relocat/i);
  });

  it('should separate the contact links with spaced dots', async () => {
    const html = await render(Sidebar, { years: 8, sections });
    const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');

    expect(text).toContain('GitHub · LinkedIn · CV');
  });

  it('should render the name as the only h1', async () => {
    const html = await render(Sidebar, { years: 8, sections });

    expect(html.match(/<h1\b/g)?.length).toBe(1);
    expect(html).toMatch(/<h1[^>]*>\s*Aref\s*<br[^>]*>\s*Mozafari/);
  });
});
