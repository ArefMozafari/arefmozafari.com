import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** The rules under one path pattern of the Pages headers file. */
function rulesFor(pattern: string): string {
  const blocks = readFileSync('public/_headers', 'utf8').split(/\n(?=\S)/);
  return blocks.find((block) => block.startsWith(pattern)) ?? '';
}

describe('public/_headers', () => {
  it('should send the browser-hardening headers with every response', () => {
    const rules = rulesFor('/*');

    expect(rules).toContain('X-Content-Type-Options: nosniff');
    expect(rules).toContain('Referrer-Policy: strict-origin-when-cross-origin');
    expect(rules).toMatch(/Permissions-Policy: .*camera=\(\)/);
  });

  it('should keep the preview hosts out of the index', () => {
    expect(rulesFor('https://:project.pages.dev/*')).toContain('X-Robots-Tag: noindex');
  });
});
