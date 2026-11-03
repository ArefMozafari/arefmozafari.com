import { describe, expect, it } from 'vitest';
import squareGraphic from '../../src/content/posts/2026-07-30-performance-win-700pct/graphic.png';
import portraitGraphic from '../../src/content/posts/2026-10-01-pr-evidence-proof-pr3/graphic.png';
import PostCard from '../../src/components/PostCard.astro';
import { render } from '../helpers/render';

const post = {
  id: '2026-07-30-performance-win-700pct',
  data: {
    title: 'I made hashing in one of my Flutter apps 700% faster.',
    date: new Date('2026-07-30'),
    linkedinActivityId: '7486157038834782208',
    graphic: squareGraphic,
    alt: 'Post graphic',
  },
};

const portraitPost = {
  id: '2026-08-05-ai-era-glossary',
  data: { ...post.data, graphic: portraitGraphic, linkedinActivityId: '7492512595346817024' },
};

describe('PostCard', () => {
  it('should link to the LinkedIn original by activity id', async () => {
    const html = await render(PostCard, { post });

    expect(html).toContain(
      'href="https://www.linkedin.com/feed/update/urn:li:activity:7486157038834782208"',
    );
  });

  it('should link the title to the post page on this site', async () => {
    const html = await render(PostCard, { post });

    expect(html).toContain('href="/posts/2026-07-30-performance-win-700pct/"');
  });

  it('should keep the graphic at its own aspect ratio', async () => {
    const html = await render(PostCard, { post: portraitPost });

    expect(html).toMatch(/<img[^>]*width="\d+"[^>]*height="\d+"/);
    expect(html).not.toContain('aspect-ratio');
  });

  it('should name LinkedIn in the outbound link text', async () => {
    expect(await render(PostCard, { post })).toContain('On LinkedIn ↗');
  });

  it('should show the month and year only', async () => {
    expect(await render(PostCard, { post })).toContain('Jul 2026');
  });
});
