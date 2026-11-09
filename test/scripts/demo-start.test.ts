import { describe, expect, it } from 'vitest';
import { LOADING_LABEL, startDemo, startFromButton } from '../../src/scripts/demo-start';

/** The attributes the start path touches, on a plain object so no DOM is needed. */
function fakeIframe(dataSource: string | undefined) {
  const listeners: Array<() => void> = [];
  return {
    src: '',
    dataset: { src: dataSource } as { src?: string },
    addEventListener(_type: 'load', listener: () => void) {
      listeners.push(listener);
    },
    /** Fires what the real iframe fires once the demo document has loaded. */
    load() {
      listeners.forEach((listener) => listener());
    },
  };
}

/** The attributes the start button exposes, on a plain object. */
function fakeButton() {
  const attributes: Record<string, string> = {};
  return {
    disabled: false,
    hidden: false,
    textContent: 'Run the live widget' as string | null,
    setAttribute(name: string, value: string) {
      attributes[name] = value;
    },
    attributes,
  };
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

describe('startFromButton', () => {
  it('should start the demo and turn the button into a loading cue', () => {
    const iframe = fakeIframe('/demo/index.html');
    const button = fakeButton();

    startFromButton(button, iframe);

    expect(iframe.src).toBe('/demo/index.html');
    expect(button.disabled).toBe(true);
    expect(button.attributes['aria-busy']).toBe('true');
    expect(button.textContent).toBe(LOADING_LABEL);
    expect(button.hidden).toBe(false);
  });

  it('should retire the button once the demo document has loaded', () => {
    const iframe = fakeIframe('/demo/index.html');
    const button = fakeButton();
    startFromButton(button, iframe);

    iframe.load();

    expect(button.hidden).toBe(true);
  });
});
