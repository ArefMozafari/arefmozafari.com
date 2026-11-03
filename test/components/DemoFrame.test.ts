import { describe, expect, it } from 'vitest';
import DemoFrame from '../../src/components/DemoFrame.astro';
import { render } from '../helpers/render';

describe('DemoFrame', () => {
  it('should lazy-load the demo iframe and keep a noscript image', async () => {
    const html = await render(DemoFrame, { fallbackAlt: 'The widget' });

    expect(html).toContain('src="/demo/index.html"');
    expect(html).toContain('loading="lazy"');
    expect(html).toMatch(/<noscript>[\s\S]*<img[^>]*alt="The widget"/);
  });

  it('should title the iframe for assistive technology', async () => {
    const html = await render(DemoFrame, { fallbackAlt: 'The widget' });

    expect(html).toMatch(/<iframe[^>]*title="Flutter Password Validator demo"/);
  });
});
