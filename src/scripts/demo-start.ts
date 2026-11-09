/** The attributes a demo iframe needs; typed loosely so the move can be checked without a DOM. */
interface DemoIframe {
  src: string;
  dataset: { src?: string };
  addEventListener(type: 'load', listener: () => void): void;
}

/** The attributes the start button needs; typed loosely for the same reason. */
interface DemoStartButton {
  disabled: boolean;
  /** The DOM types this as `boolean | string` for the until-found value. */
  hidden: boolean | string;
  textContent: string | null;
  setAttribute(name: string, value: string): void;
}

/** What the start button says while the Flutter bundle, several megabytes, comes down. */
export const LOADING_LABEL = 'Loading the widget…';
const START_BUTTON_SELECTOR = 'button[data-demo-start]';
const IFRAME_SELECTOR = 'iframe[data-src]';
/**
 * Desktop, as tokens.css defines it; wide screens are usually on wired connections, so the
 * demo may load by itself there. Narrower screens wait for the button.
 */
const AUTO_START_QUERY = '(min-width: 1024px)';
/** How close to the viewport the demo must be before it starts by itself. */
const START_MARGIN = '200px';

/** Starts a demo iframe by moving its data-src into src. */
export function startDemo(iframe: DemoIframe): void {
  const source = iframe.dataset.src;
  if (source) {
    iframe.src = source;
    delete iframe.dataset.src;
  }
}

/**
 * Starts the demo from its button. The button becomes the loading cue until the demo
 * document has loaded, then retires; a tap into a multi-megabyte wait would otherwise look
 * like nothing happened.
 */
export function startFromButton(button: DemoStartButton, iframe: DemoIframe): void {
  startDemo(iframe);
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  button.textContent = LOADING_LABEL;
  iframe.addEventListener('load', () => {
    button.hidden = true;
  });
}

/**
 * Starts each demo once its block is near the viewport, so its bundle never competes with
 * the first screens.
 */
function startNearViewport(iframes: HTMLIFrameElement[]): void {
  if (!('IntersectionObserver' in window)) {
    iframes.forEach(startDemo);
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          startDemo(entry.target as HTMLIFrameElement);
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: START_MARGIN },
  );
  iframes.forEach((iframe) => observer.observe(iframe));
}

/** The Flutter bundle weighs several megabytes: desktops get it on approach, phones on request. */
function wireDemoStarts(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>(START_BUTTON_SELECTOR)) {
    button.addEventListener('click', () => {
      const iframe = button.parentElement?.querySelector<HTMLIFrameElement>(IFRAME_SELECTOR);
      if (iframe) {
        startFromButton(button, iframe);
      } else {
        button.hidden = true;
      }
    });
  }
  if (window.matchMedia(AUTO_START_QUERY).matches) {
    startNearViewport([...document.querySelectorAll<HTMLIFrameElement>(IFRAME_SELECTOR)]);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', wireDemoStarts);
}
