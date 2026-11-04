const SECTION_SELECTOR = 'main section[id]';
const NAV_LINK_SELECTOR = 'aside nav a[href*="#"]';

/// Marks the sidebar link of the section nearest the top of the viewport.
function markActive(sectionId: string, links: HTMLAnchorElement[]): void {
  for (const link of links) {
    const isActive = (link.getAttribute('href') ?? '').endsWith(`#${sectionId}`);
    if (isActive) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  }
}

/// The scroll geometry the page-end rule reads, so the rule can be checked without a window.
interface ScrollGeometry {
  innerHeight: number;
  scrollY: number;
  scrollHeight: number;
}

// Browsers can stop a fraction of a pixel short of the bottom.
const PAGE_END_TOLERANCE = 2;

/// Whether the viewport has reached the bottom of the document, where the last section is the
/// one being read however short it is.
export function isAtPageEnd({ innerHeight, scrollY, scrollHeight }: ScrollGeometry): boolean {
  return innerHeight + scrollY >= scrollHeight - PAGE_END_TOLERANCE;
}

let currentObserver: IntersectionObserver | undefined;
let currentScrollWatch: AbortController | undefined;

/// Observes the homepage sections and keeps the sidebar nav in step with scrolling.
function watchSections(): void {
  if (typeof IntersectionObserver === 'undefined') {
    return;
  }
  // The previous page's observer would still report its removed sections as gone, and at the
  // end of a short page that reads as "last section", marking Contact on every post.
  currentObserver?.disconnect();
  currentScrollWatch?.abort();
  const links = [...document.querySelectorAll<HTMLAnchorElement>(NAV_LINK_SELECTOR)];
  const sections = [...document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)];
  if (sections.length === 0) {
    // A page without sections, such as a post, marks nothing; the nav is kept from the
    // previous page and would otherwise still show its last mark.
    markActive('', links);
    return;
  }
  const visible = new Map<string, number>();
  const lastSection = sections[sections.length - 1];
  const atPageEnd = () =>
    isAtPageEnd({
      innerHeight: window.innerHeight,
      scrollY: window.scrollY,
      scrollHeight: document.documentElement.scrollHeight,
    });
  const markCurrent = () => {
    if (atPageEnd()) {
      markActive(lastSection.id, links);
      return;
    }
    const [topSection] = sections
      .filter((section) => (visible.get(section.id) ?? 0) > 0)
      .sort((first, second) => (visible.get(second.id) ?? 0) - (visible.get(first.id) ?? 0));
    if (topSection) {
      markActive(topSection.id, links);
    }
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      }
      markCurrent();
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] },
  );
  for (const section of sections) {
    observer.observe(section);
  }
  // The last pixels of a scroll change no intersection, so the page-end rule would never run
  // for a visitor who wheels down to the footer; every scroll re-checks it.
  const scrollWatch = new AbortController();
  window.addEventListener('scroll', markCurrent, { passive: true, signal: scrollWatch.signal });
  currentObserver = observer;
  currentScrollWatch = scrollWatch;
}

// Runs on the first load and after every in-page navigation; each page gets its own observer.
if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', watchSections);
}
