// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { execSync } from 'node:child_process';
import { lastModified } from './src/lib/sitemap-lastmod.ts';

/**
 * When the site last changed: the last commit's date, so the weekly rebuild does not tell
 * crawlers the pages changed. Outside a checkout the build moment stands in.
 */
function lastChanged() {
  try {
    return new Date(execSync('git log -1 --format=%cI', { encoding: 'utf8' }).trim());
  } catch {
    return new Date();
  }
}

const changed = lastChanged();

export default defineConfig({
  site: 'https://arefmozafari.com',
  integrations: [
    sitemap({
      serialize: (item) => ({ ...item, lastmod: lastModified(item.url, changed) }),
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
