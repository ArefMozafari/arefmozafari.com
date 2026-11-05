import { describe, expect, it } from 'vitest';
import { closeOnNavigation } from '../../src/scripts/mobile-menu';

/// A details element with its links, as plain objects: no DOM is needed to check the wiring.
function fakeMenu(linkCount: number) {
  const handlers: Array<() => void> = [];
  const links = Array.from({ length: linkCount }, () => ({
    addEventListener: (_type: string, handler: () => void) => handlers.push(handler),
  }));
  const menu = { open: true, querySelectorAll: () => links };
  return { menu, handlers };
}

describe('closeOnNavigation', () => {
  it('should close the menu when one of its links is followed', () => {
    const { menu, handlers } = fakeMenu(3);

    closeOnNavigation(menu);
    handlers[2]();

    expect(menu.open).toBe(false);
  });

  it('should wire every link, not only the first', () => {
    const { menu, handlers } = fakeMenu(4);

    closeOnNavigation(menu);

    expect(handlers.length).toBe(4);
  });
});
