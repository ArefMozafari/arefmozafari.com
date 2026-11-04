const MILLISECONDS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/// Returns whole years between two dates, rounded to the nearest year.
export function yearsSince(start: Date, now: Date): number {
  return Math.round((now.getTime() - start.getTime()) / MILLISECONDS_PER_YEAR);
}
