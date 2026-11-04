import { describe, expect, it } from 'vitest';
import DemoFrame from '../../src/components/DemoFrame.astro';
import { render } from '../helpers/render';

describe('DemoFrame', () => {
  it('should hold the demo url off the iframe until a script starts it', async () => {
    const html = await render(DemoFrame, { fallbackAlt: 'The widget' });

    expect(html).toMatch(/<iframe[^>]*data-src="\/demo\/index\.html"/);
    expect(html).not.toMatch(/<iframe[^>]*\ssrc=/);
  });

  it('should keep a noscript image', async () => {
    const html = await render(DemoFrame, { fallbackAlt: 'The widget' });

    expect(html).toMatch(/<noscript>[\s\S]*<img[^>]*alt="The widget"/);
  });

  it('should paint the fallback under the iframe so it shows while loading and without scripts', async () => {
    const html = await render(DemoFrame, { fallbackAlt: 'The widget' });

    expect(html).toMatch(
      /class="[^"]*screen[^"]*"[^>]*style="[^"]*background-image:\s*url\(['"]?\/demo-fallback\.png/,
    );
  });

  it('should title the iframe for assistive technology', async () => {
    const html = await render(DemoFrame, { fallbackAlt: 'The widget' });

    expect(html).toMatch(/<iframe[^>]*title="Flutter Password Validator demo"/);
  });
});
