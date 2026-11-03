import { describe, expect, it } from 'vitest';
import OpenSource from '../../src/components/OpenSource.astro';
import { render } from '../helpers/render';

describe('OpenSource', () => {
  it('should render the repo link without a count when both sources are null', async () => {
    const html = await render(OpenSource, {
      rows: [
        {
          name: 'pr-evidence',
          description: 'd',
          url: 'https://github.com/ArefMozafari/pr-evidence',
          counts: null,
          score: null,
        },
      ],
    });

    expect(html).toContain('href="https://github.com/ArefMozafari/pr-evidence"');
    expect(html).not.toMatch(/★|likes/);
  });

  it('should prefer GitHub counts over the pub.dev score', async () => {
    const html = await render(OpenSource, {
      rows: [
        {
          name: 'n',
          description: 'd',
          url: 'https://x.y',
          counts: { stars: 33, forks: 46 },
          score: { points: 160, likes: 176, downloads30Days: 1 },
        },
      ],
    });

    expect(html).toContain('33 ★ · 46 forks');
    expect(html).not.toContain('likes');
  });

  it('should show the pub.dev score when GitHub counts are missing', async () => {
    const html = await render(OpenSource, {
      rows: [
        {
          name: 'n',
          description: 'd',
          url: 'https://x.y',
          counts: null,
          score: { points: 160, likes: 176, downloads30Days: 1 },
        },
      ],
    });

    expect(html).toContain('176 likes · 160 pts');
  });

  it('should show the note when there is nothing to count', async () => {
    const html = await render(OpenSource, {
      rows: [
        {
          name: 'dart-lang/ai',
          description: 'd',
          url: 'https://github.com/dart-lang/ai/pull/731',
          counts: null,
          score: null,
          note: 'PR #731 · in review',
        },
      ],
    });

    expect(html).toContain('PR #731 · in review');
  });
});
