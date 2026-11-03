import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const POSTS_ROOT = 'src/content/posts';

/// Splits a post file into its title and the first non-empty body line.
function titleAndFirstLine(file: string): { title: string; firstLine: string } {
  const text = readFileSync(file, 'utf8');
  const [, frontmatter, body] = text.split(/^---\n/m);
  const title = /^title:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim().replace(/^'|'$/g, '') ?? '';
  const firstLine =
    body
      .split('\n')
      .find((line) => line.trim() !== '')
      ?.trim() ?? '';
  return { title, firstLine };
}

describe('posts content', () => {
  it('should not repeat the title as the first line of the body', () => {
    const repeats = readdirSync(POSTS_ROOT)
      .map((folder) => join(POSTS_ROOT, folder, 'index.md'))
      .map((file) => ({ file, ...titleAndFirstLine(file) }))
      .filter(({ title, firstLine }) => firstLine.startsWith(title.slice(0, 40)))
      .map(({ file }) => file);

    expect(repeats).toEqual([]);
  });
});
