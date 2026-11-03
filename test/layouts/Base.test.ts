import { describe, expect, it } from 'vitest';
import Base from '../../src/layouts/Base.astro';
import IndexPage from '../../src/pages/index.astro';
import { SITE } from '../../src/site';
import { render } from '../helpers/render';

describe('Base', () => {
  it('should emit a Person JSON-LD block with the LinkedIn and GitHub profiles', async () => {
    const html = await render(Base, { title: 't', description: 'd' });

    expect(html).toContain('"@type":"Person"');
    expect(html).toContain(SITE.linkedin);
    expect(html).toContain(SITE.github);
  });

  it('should set the title, description and canonical url', async () => {
    const html = await render(Base, { title: 'Aref Mozafari', description: 'A description' });

    expect(html).toContain('<title>Aref Mozafari</title>');
    expect(html).toContain('<meta name="description" content="A description"');
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/arefmozafari\.com\/?"/);
  });

  it('should emit exactly one h1 across the home page', async () => {
    const html = await render(IndexPage);

    expect(html.match(/<h1\b/g)?.length).toBe(1);
  });
});
