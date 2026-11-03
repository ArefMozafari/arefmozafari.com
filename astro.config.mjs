// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { lastModified } from './src/lib/sitemap-lastmod.ts';

const built = new Date();

export default defineConfig({
  site: 'https://arefmozafari.com',
  integrations: [
    sitemap({
      serialize: (item) => ({ ...item, lastmod: lastModified(item.url, built) }),
    }),
  ],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-display',
      weights: [400, 500, 800],
      subsets: ['latin'],
    },
  ],
});
