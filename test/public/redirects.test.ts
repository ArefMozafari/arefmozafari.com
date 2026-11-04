import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('public/_redirects', () => {
  it('should send www to the apex permanently, keeping the path', () => {
    const rules = readFileSync('public/_redirects', 'utf8');

    expect(rules).toContain('https://www.arefmozafari.com/* https://arefmozafari.com/:splat 301');
  });
});
