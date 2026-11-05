/// What the menu needs to be: a details element holding links; typed loosely so the wiring
/// can be checked without a DOM.
interface Menu {
  open: boolean;
  querySelectorAll: (selector: string) => Iterable<{
    addEventListener: (type: 'click', handler: () => void) => void;
  }>;
}

const MENU_SELECTOR = 'details[data-menu]';

/// Closes the menu as soon as one of its links is followed: the header persists across
/// in-page navigations, so an open panel would otherwise stay over the next page.
export function closeOnNavigation(menu: Menu): void {
  for (const link of menu.querySelectorAll('a')) {
    link.addEventListener('click', () => {
      menu.open = false;
    });
  }
}

// The header is wired once: it is kept across in-page navigations, listeners included.
if (typeof document !== 'undefined') {
  for (const menu of document.querySelectorAll<HTMLDetailsElement>(MENU_SELECTOR)) {
    closeOnNavigation(menu);
  }
}
