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

let currentObserver: IntersectionObserver | undefined;

/// Observes the homepage sections and keeps the sidebar nav in step with scrolling.
function watchSections(): void {
  if (typeof IntersectionObserver === 'undefined') {
    return;
  }
  // The previous page's observer would still report its removed sections as gone, and at the
  // end of a short page that reads as "last section", marking Contact on every post.
  currentObserver?.disconnect();
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
  // At the very end of the page the last section is the one being read, however short it is.
  const isAtPageEnd = () =>
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      }
      if (isAtPageEnd()) {
        markActive(lastSection.id, links);
        return;
      }
      const [topSection] = sections
        .filter((section) => (visible.get(section.id) ?? 0) > 0)
        .sort((first, second) => (visible.get(second.id) ?? 0) - (visible.get(first.id) ?? 0));
      if (topSection) {
        markActive(topSection.id, links);
      }
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] },
  );
  for (const section of sections) {
    observer.observe(section);
  }
  currentObserver = observer;
}

// Runs on the first load and after every in-page navigation; each page gets its own observer.
document.addEventListener('astro:page-load', watchSections);
