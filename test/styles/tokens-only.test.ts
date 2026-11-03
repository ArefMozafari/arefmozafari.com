import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const COMPONENT_ROOTS = ['src/components', 'src/layouts', 'src/pages'];
const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|rgba?\(/;

/// Lists every .astro file under the given roots.
function astroFiles(root: string): string[] {
  return readdirSync(root).flatMap((entry) => {
    const path = join(root, entry);
    if (statSync(path).isDirectory()) {
      return astroFiles(path);
    }
    return path.endsWith('.astro') ? [path] : [];
  });
}

describe('design tokens', () => {
  it('should keep every colour in tokens.css, never in a component', () => {
    const offenders = COMPONENT_ROOTS.flatMap(astroFiles).flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .map((line, index) => ({ file, line: index + 1, text: line }))
        .filter(({ text }) => RAW_COLOUR.test(text))
        .map(({ file, line, text }) => `${file}:${line}: ${text.trim()}`),
    );

    expect(offenders).toEqual([]);
  });
});
