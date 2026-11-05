import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const COMPONENT_ROOTS = ['src/components', 'src/layouts', 'src/pages'];
const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|rgba?\(/;
/// A type or stacking property set to anything but a token or a neutral keyword; a plain 0 is
/// a reset, not a value.
const RAW_TYPE_OR_LAYER =
  /^\s*(line-height|letter-spacing|z-index):(?!\s*(var\(|0;|inherit|normal))/;

/// Every line of every .astro file under the component roots that matches the pattern.
function offendingLines(pattern: RegExp): string[] {
  return COMPONENT_ROOTS.flatMap(astroFiles).flatMap((file) =>
    readFileSync(file, 'utf8')
      .split('\n')
      .map((line, index) => ({ file, line: index + 1, text: line }))
      .filter(({ text }) => pattern.test(text))
      .map(({ file, line, text }) => `${file}:${line}: ${text.trim()}`),
  );
}

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
    expect(offendingLines(RAW_COLOUR)).toEqual([]);
  });

  it('should keep every line height, letter spacing and layer in tokens.css', () => {
    expect(offendingLines(RAW_TYPE_OR_LAYER)).toEqual([]);
  });
});
