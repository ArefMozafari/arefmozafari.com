import { describe, expect, it } from 'vitest';
import { missingAssets } from '../../tools/check-assets.mjs';

describe('missingAssets', () => {
  it('should list only the paths that do not exist', () => {
    const exists = (path: unknown) => String(path).endsWith('og.png');

    expect(missingAssets('/r', ['public/og.png', 'src/assets/portrait.jpg'], exists)).toEqual([
      'src/assets/portrait.jpg',
    ]);
  });

  it('should return an empty list when every asset exists', () => {
    expect(missingAssets('/r', ['a', 'b'], () => true)).toEqual([]);
  });

  it('should resolve each path under the root directory', () => {
    const seen: string[] = [];
    const exists = (path: unknown) => {
      seen.push(String(path));
      return true;
    };

    missingAssets('/root', ['public/og.png'], exists);

    expect(seen).toEqual(['/root/public/og.png']);
  });
});
