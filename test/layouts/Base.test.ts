import { describe, expect, it } from 'vitest';
import Base from '../../src/layouts/Base.astro';
import IndexPage from '../../src/pages/index.astro';
import { SITE } from '../../src/site';
import { render } from '../helpers/render';

const article = {
  title: 'A post',
  date: new Date('2026-07-30'),
  image: { src: '/_astro/graphic.png', width: 1200, height: 1200, alt: 'The graphic' },
};

function jsonLd(html: string): { '@graph': Record<string, unknown>[] } {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  return JSON.parse(match?.[1] ?? '{}');
}

describe('Base', () => {
  it('should describe the owner as a Person with portrait, Persian name and profiles', async () => {
    const html = await render(Base, { title: 't', description: 'd' });
    const person = jsonLd(html)['@graph'].find((node) => node['@type'] === 'Person');

    expect(person).toMatchObject({
      '@id': `${SITE.domain}/#person`,
      name: SITE.name,
      alternateName: SITE.nameFa,
      url: `${SITE.domain}/`,
    });
    expect(person?.image).toMatch(/^https:\/\/arefmozafari\.com\//);
    expect(person?.sameAs).toEqual(expect.arrayContaining([SITE.linkedin, SITE.github]));
  });

  it('should add a BlogPosting by the owner on an article page', async () => {
    const html = await render(Base, { title: 't', description: 'd', article });
    const posting = jsonLd(html)['@graph'].find((node) => node['@type'] === 'BlogPosting');

    expect(posting).toMatchObject({
      headline: 'A post',
      datePublished: '2026-07-30',
      author: { '@id': `${SITE.domain}/#person` },
    });
    expect(html).toContain('<meta property="og:type" content="article"');
    expect(html).toContain('<meta property="article:published_time" content="2026-07-30"');
  });

  it('should describe the share image with size and alt, per page', async () => {
    const html = await render(Base, { title: 't', description: 'd', article });

    expect(html).toContain('content="https://arefmozafari.com/_astro/graphic.png"');
    expect(html).toContain('<meta property="og:image:width" content="1200"');
    expect(html).toContain('<meta property="og:image:alt" content="The graphic"');
    expect(html).toContain('<meta name="twitter:image:alt" content="The graphic"');
  });

  it('should fall back to the site card and website type', async () => {
    const html = await render(Base, { title: 't', description: 'd' });

    expect(html).toContain('content="https://arefmozafari.com/og.png"');
    expect(html).toContain('<meta property="og:type" content="website"');
    expect(jsonLd(html)['@graph'].some((node) => node['@type'] === 'BlogPosting')).toBe(false);
  });

  it('should set the title, description and canonical url', async () => {
    const html = await render(Base, { title: 'Aref Mozafari', description: 'A description' });

    expect(html).toContain('<title>Aref Mozafari</title>');
    expect(html).toContain('<meta name="description" content="A description"');
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/arefmozafari\.com\/?"/);
  });

  it('should offer the icon as SVG with PNG fallbacks for tabs and home screens', async () => {
    const html = await render(Base, { title: 't', description: 'd' });

    expect(html).toContain('href="/favicon.svg" type="image/svg+xml"');
    expect(html).toContain('href="/favicon-32.png" type="image/png" sizes="32x32"');
    expect(html).toContain('href="/favicon.ico" sizes="16x16 32x32 48x48"');
    expect(html).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');
  });

  it('should declare the ico before the SVG, since Google reads no SVG favicon', async () => {
    const html = await render(Base, { title: 't', description: 'd' });

    expect(html.indexOf('href="/favicon.ico"')).toBeLessThan(html.indexOf('href="/favicon.svg"'));
  });

  it('should mark a noindex page as such and give it no canonical', async () => {
    const html = await render(Base, { title: 't', description: 'd', noindex: true });

    expect(html).toContain('<meta name="robots" content="noindex"');
    expect(html).not.toContain('rel="canonical"');
  });

  it('should emit exactly one h1 across the home page', async () => {
    const html = await render(IndexPage);

    expect(html.match(/<h1\b/g)?.length).toBe(1);
  });

  it('should name the scheme on each browser-chrome colour so a stored choice can pick one', async () => {
    const html = await render(Base, { title: 't', description: 'd' });

    expect(html).toMatch(/<meta name="theme-color"[^>]*data-scheme="light"/);
    expect(html).toMatch(/<meta name="theme-color"[^>]*data-scheme="dark"/);
  });

  it('should carry the Persian name in the home title', async () => {
    const html = await render(IndexPage);

    expect(html).toContain(`<title>${SITE.name} · ${SITE.nameFa} · ${SITE.title} · `);
  });

  it('should navigate in page and keep the sidebar, header and bottom bar across pages', async () => {
    const html = await render(IndexPage);

    expect(html).toContain('<meta name="astro-view-transitions-enabled" content="true"');
    expect(html).toMatch(/<aside[^>]*data-astro-transition-persist="sidebar"/);
    expect(html).toMatch(/<header[^>]*data-astro-transition-persist="mobile-header"/);
    expect(html).toMatch(/<nav[^>]*data-astro-transition-persist="bottom-bar"/);
  });
});
