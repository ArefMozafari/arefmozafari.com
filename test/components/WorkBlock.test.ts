import { describe, expect, it } from 'vitest';
import corepassImage from '../../src/assets/works/corepass.png';
import WorkBlock from '../../src/components/WorkBlock.astro';
import { render } from '../helpers/render';

const corepass = {
  name: 'CorePass',
  order: 1,
  kicker: 'Blockchain identity & wallet',
  word: ['CorePass'],
  artifact: { kind: 'poster', image: corepassImage, alt: 'The store card of the identity app' },
  receipts: [
    { label: 'App Store ↗', url: 'https://apps.apple.com/app/corepass-id/id1644928641' },
    {
      label: 'Google Play ↗',
      url: 'https://play.google.com/store/apps/details?id=net.corepass.app',
    },
  ],
};

describe('WorkBlock', () => {
  it('should render every receipt as an external link', async () => {
    const html = await render(WorkBlock, { work: corepass, index: 0 }, { default: 'desc' });

    for (const receipt of corepass.receipts) {
      expect(html).toContain(`href="${receipt.url}"`);
    }
    expect(html).toMatch(/rel="noopener/);
  });

  it('should name the work once, as the heading inside the block', async () => {
    const html = await render(WorkBlock, { work: corepass, index: 0 }, { default: 'desc' });

    expect(html.match(/CorePass/g)?.length).toBe(1);
    expect(html).toMatch(/<h3[^>]*>[\s\S]*CorePass[\s\S]*<\/h3>/);
    expect(html).not.toMatch(/<a[^>]*>\s*CorePass\s*<\/a>/);
  });

  it('should keep the kicker out of the heading text', async () => {
    const html = await render(WorkBlock, { work: corepass, index: 0 }, { default: 'desc' });

    expect(html).toMatch(/<h3[^>]*>\s*CorePass\s*<\/h3>/);
    expect(html).toContain('Blockchain identity &amp; wallet');
  });

  it('should load only the first block eagerly, with priority', async () => {
    const first = await render(WorkBlock, { work: corepass, index: 0 }, { default: 'desc' });
    const second = await render(WorkBlock, { work: corepass, index: 1 }, { default: 'desc' });

    expect(first).toMatch(/<img[^>]*loading="eager"/);
    expect(first).toMatch(/<img[^>]*fetchpriority="high"/);
    expect(second).toMatch(/<img[^>]*loading="lazy"/);
    expect(second).not.toContain('fetchpriority="high"');
  });

  it('should not offer a 2x poster the source cannot fill', async () => {
    // The CorePass card is 1200px wide, under the 1880px a 2x candidate would need.
    const html = await render(WorkBlock, { work: corepass, index: 0 }, { default: 'desc' });

    expect(html).not.toMatch(/\s2x"/);
  });

  it('should render a poster artifact as a plain image, with no phone chrome', async () => {
    const html = await render(WorkBlock, { work: corepass, index: 0 }, { default: 'desc' });

    expect(html).toMatch(/class="[^"]*poster[^"]*"/);
    expect(html).not.toMatch(/class="[^"]*phone[^"]*"/);
  });

  it('should give a landscape poster the wide variant', async () => {
    const html = await render(WorkBlock, { work: corepass, index: 0 }, { default: 'desc' });

    expect(html).toMatch(/class="[^"]*poster--wide[^"]*"/);
    expect(html).toContain('alt="The store card of the identity app"');
  });

  it('should zero-pad the index', async () => {
    const html = await render(WorkBlock, { work: corepass, index: 0 }, { default: 'desc' });

    expect(html).toContain('>01<');
  });

  it('should render the hint in bold when the work has one', async () => {
    const demo = {
      ...corepass,
      name: 'Flutter Password Validator',
      word: ['Password', 'Validator'],
      artifact: { kind: 'demo', alt: 'The widget' },
      hint: 'Try it: the phone runs the real widget, compiled for the web.',
    };

    const html = await render(WorkBlock, { work: demo, index: 2 }, { default: 'desc' });

    expect(html).toMatch(
      /<b[^>]*>Try it: the phone runs the real widget, compiled for the web\.<\/b>/,
    );
    expect(html).toContain('>03<');
  });
});
