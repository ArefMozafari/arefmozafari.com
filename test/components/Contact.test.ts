import { describe, expect, it } from 'vitest';
import Contact from '../../src/components/Contact.astro';
import { SITE } from '../../src/site';
import { render } from '../helpers/render';

describe('Contact', () => {
  it('should link email, LinkedIn, GitHub and the résumé', async () => {
    const html = await render(Contact);

    expect(html).toContain(`href="mailto:${SITE.email}"`);
    expect(html).toContain(`href="${SITE.linkedin}"`);
    expect(html).toContain(`href="${SITE.github}"`);
    expect(html).toContain('href="/Aref-Mozafari-Senior-Mobile-Engineer.pdf"');
  });

  it('should save the résumé under a name that says whose it is', async () => {
    const html = await render(Contact);

    expect(html).toMatch(/download="Aref-Mozafari-Senior-Mobile-Engineer\.pdf"/);
  });

  it('should open with the fixed heading', async () => {
    expect(await render(Contact)).toMatch(/<h2[^>]*>Let's talk\.<\/h2>/);
  });
});
