/// How close to the viewport the demo must be before its bundle starts loading.
const START_MARGIN = '200px';

/// Starts a demo iframe by moving its data-src into src.
function startDemo(iframe: HTMLIFrameElement): void {
  const source = iframe.dataset.src;
  if (source) {
    iframe.src = source;
    delete iframe.dataset.src;
  }
}

/// Loads the Flutter demo only once its block is near the viewport, so its bundle never
/// competes with the first screens.
export function startDemosNearViewport(document: Document, window: Window): void {
  const iframes = [...document.querySelectorAll<HTMLIFrameElement>('iframe[data-src]')];
  if (iframes.length === 0) {
    return;
  }
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

document.addEventListener('astro:page-load', () => startDemosNearViewport(document, window));
