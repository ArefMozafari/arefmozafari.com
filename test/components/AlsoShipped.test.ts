import { describe, expect, it } from 'vitest';
import AlsoShipped from '../../src/components/AlsoShipped.astro';
import { render } from '../helpers/render';

describe('AlsoShipped', () => {
  it('should render a row without a url as plain text, with no filler word', async () => {
    const html = await render(AlsoShipped, {
      items: [
        { id: 'fediverse', order: 1, name: 'Fediverse video app', note: 'torrent-based delivery' },
      ],
    });

    expect(html).toContain('Fediverse video app');
    expect(html).not.toContain('internal');
    expect(html).not.toMatch(/<a /);
  });

  it('should link a row that has a url', async () => {
    const html = await render(AlsoShipped, {
      items: [
        {
          id: 'foxhole',
          order: 1,
          name: 'Foxhole artillery calculator',
          note: 'community tool',
          url: 'https://github.com/ArefMozafari/FoxholeArtillery-mobile',
        },
      ],
    });

    expect(html).toContain('href="https://github.com/ArefMozafari/FoxholeArtillery-mobile"');
    expect(html).not.toContain('internal');
  });
});
