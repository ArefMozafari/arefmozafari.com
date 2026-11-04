import { describe, expect, it } from 'vitest';
import OpenSource from '../../src/components/OpenSource.astro';
import { render } from '../helpers/render';

const rows = [
  {
    name: 'flutter_pw_validator',
    description: 'Password validation widget for Flutter',
    url: 'https://github.com/ArefMozafari/flutter_pw_validator',
  },
  {
    name: 'dart-lang/ai',
    description: 'Upstream contribution',
    url: 'https://github.com/dart-lang/ai/pull/731',
    note: 'PR #731 · in review',
  },
];

describe('OpenSource', () => {
  it('should link each repo by name and show its one-line description', async () => {
    const html = await render(OpenSource, { rows });

    expect(html).toContain('href="https://github.com/ArefMozafari/flutter_pw_validator"');
    expect(html).toContain('Password validation widget for Flutter');
  });

  it('should show a note only on the rows that have one', async () => {
    const html = await render(OpenSource, { rows });

    expect(html).toContain('PR #731 · in review');
    expect(html.match(/in review/g)?.length).toBe(1);
  });

  it('should carry no counts', async () => {
    expect(await render(OpenSource, { rows })).not.toMatch(/★|likes|forks|pts/);
  });
});
