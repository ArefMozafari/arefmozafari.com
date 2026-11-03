import { describe, expect, it } from 'vitest';
import ThemeSwitch from '../../src/components/ThemeSwitch.astro';
import { render } from '../helpers/render';

describe('ThemeSwitch', () => {
  it('should be a button that names its job for assistive technology', async () => {
    const html = await render(ThemeSwitch);

    expect(html).toMatch(/<button[^>]*type="button"[^>]*data-theme-switch/);
    expect(html).toMatch(/aria-label="Colour scheme: follows the system\. Click to change\."/);
  });

  it('should show the three states, with system marked current by default', async () => {
    const html = await render(ThemeSwitch);

    expect(html).toContain('>System<');
    expect(html).toContain('>Light<');
    expect(html).toContain('>Dark<');
    expect(html).toMatch(/data-theme-option="system"[^>]*aria-current="true"/);
  });
});
