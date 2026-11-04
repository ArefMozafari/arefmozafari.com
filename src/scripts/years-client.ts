import { yearsSince } from '../lib/years';

const YEARS_SELECTOR = '[data-years][data-career-start]';

/// Rewrites the rendered years when the build-time value has gone stale.
/// Returns true only when the text changed.
export function correctYears(
  element: { textContent: string | null },
  start: Date,
  now: Date,
): boolean {
  const current = String(yearsSince(start, now));
  if (element.textContent === current) {
    return false;
  }
  element.textContent = current;
  return true;
}

/// Corrects every years element on the page from its own start-date attribute.
function correctAllYears(): void {
  for (const element of document.querySelectorAll<HTMLElement>(YEARS_SELECTOR)) {
    const start = new Date(element.dataset.careerStart ?? '');
    if (!Number.isNaN(start.getTime())) {
      correctYears(element, start, new Date());
    }
  }
}

if (typeof document !== 'undefined') {
  correctAllYears();
}
