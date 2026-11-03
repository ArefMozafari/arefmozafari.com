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

  it('should combine stars and pub.dev likes when both exist', async () => {
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

    expect(html).toContain('33 ★ · 176 likes');
    expect(html).not.toContain('forks');
  });

  it('should show stars and forks when only GitHub counts exist', async () => {
    const html = await render(OpenSource, {
      rows: [
        {
          name: 'n',
          description: 'd',
          url: 'https://x.y',
          counts: { stars: 19, forks: 1 },
          score: null,
        },
      ],
    });

    expect(html).toContain('19 ★ · 1 forks');
  });

  it('should show nothing for a repo nobody has starred yet', async () => {
    const html = await render(OpenSource, {
      rows: [
        {
          name: 'n',
          description: 'd',
          url: 'https://x.y',
          counts: { stars: 0, forks: 0 },
          score: null,
        },
      ],
    });

    expect(html).not.toMatch(/0 ★|forks/);
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
