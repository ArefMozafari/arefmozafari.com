// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://arefmozafari.com',
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-display',
      weights: [400, 500, 800],
      subsets: ['latin'],
    },
    {
      provider: fontProviders.google(),
      name: 'Vazirmatn',
      cssVariable: '--font-fa',
      weights: [800],
      subsets: ['arabic'],
    },
  ],
});
