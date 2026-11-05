#!/usr/bin/env node
// Fails a production build when a required image or document is missing, so a
// placeholder can never ship. Local builds only warn.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REQUIRED_ASSETS = [
  'src/assets/portrait.jpg',
  'src/assets/works/corepass.png',
  'src/assets/works/ring.png',
  'src/assets/works/foxhole.png',
  'public/og.png',
  'public/Aref-Mozafari-Senior-Mobile-Engineer.pdf',
  'public/demo-fallback.png',
  'public/demo/index.html',
];

/** Returns the required paths that do not exist under the root directory. */
export function missingAssets(rootDirectory, requiredPaths, existsImplementation = existsSync) {
  return requiredPaths.filter((path) => !existsImplementation(join(rootDirectory, path)));
}

function main() {
  const rootDirectory = fileURLToPath(new URL('..', import.meta.url));
  const missing = missingAssets(rootDirectory, REQUIRED_ASSETS);
  if (missing.length === 0) {
    return;
  }
  const isProduction = process.env.CI === 'true' || process.env.NODE_ENV === 'production';
  const lines = missing.map((path) => `  - ${path}`).join('\n');
  if (isProduction) {
    console.error(`Missing required assets:\n${lines}`);
    process.exit(1);
  }
  console.warn(`Warning: missing assets (allowed outside CI):\n${lines}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
