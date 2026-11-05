import { describe, expect, it } from 'vitest';
import { startDemo } from '../../src/scripts/demo-start';

/** The two attributes startDemo touches, on a plain object so no DOM is needed. */
function fakeIframe(dataSource: string | undefined) {
  return { src: '', dataset: { src: dataSource } as { src?: string } };
}

describe('startDemo', () => {
  it('should move the held url into src so the bundle loads', () => {
    const iframe = fakeIframe('/demo/index.html');

    startDemo(iframe);

    expect(iframe.src).toBe('/demo/index.html');
    expect(iframe.dataset.src).toBeUndefined();
  });

  it('should leave an iframe that already started alone', () => {
    const iframe = fakeIframe(undefined);
    iframe.src = '/demo/index.html';

    startDemo(iframe);

    expect(iframe.src).toBe('/demo/index.html');
  });
});
