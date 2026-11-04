import { describe, expect, it } from 'vitest';
import ThemeSwitch from '../../src/components/ThemeSwitch.astro';
import { render } from '../helpers/render';

describe('ThemeSwitch', () => {
  it('should offer one button per scheme inside a labelled group', async () => {
    const html = await render(ThemeSwitch);

    expect(html).toMatch(/<fieldset[^>]*data-theme-switch/);
    expect(html).toMatch(/<legend[^>]*>Colour scheme<\/legend>/);
    expect(html.match(/<button[^>]*data-theme-option=/g)?.length).toBe(3);
  });

  it('should mark system as the pressed option by default', async () => {
    const html = await render(ThemeSwitch);

    expect(html).toMatch(/data-theme-option="system"[^>]*aria-pressed="true"/);
    expect(html).toMatch(/data-theme-option="light"[^>]*aria-pressed="false"/);
    expect(html).toMatch(/data-theme-option="dark"[^>]*aria-pressed="false"/);
  });
});
