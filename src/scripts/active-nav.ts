const SECTION_SELECTOR = 'main section[id]';
const NAV_LINK_SELECTOR = 'aside nav a[href^="#"]';

/// Marks the sidebar link of the section nearest the top of the viewport.
function markActive(sectionId: string, links: HTMLAnchorElement[]): void {
  for (const link of links) {
    const isActive = link.getAttribute('href') === `#${sectionId}`;
    if (isActive) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  }
}

/// Observes the homepage sections and keeps the sidebar nav in step with scrolling.
function watchSections(): void {
  if (typeof IntersectionObserver === 'undefined') {
    return;
  }
  const links = [...document.querySelectorAll<HTMLAnchorElement>(NAV_LINK_SELECTOR)];
  const sections = [...document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)];
  if (links.length === 0 || sections.length === 0) {
    return;
  }
  const visible = new Map<string, number>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
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
}

watchSections();
