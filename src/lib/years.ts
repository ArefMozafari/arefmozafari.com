/**
 * Returns the whole years served between two dates: the count rises on each anniversary of
 * the start and never before, so the page never claims a year that is not yet complete.
 */
export function yearsSince(start: Date, now: Date): number {
  const years = now.getUTCFullYear() - start.getUTCFullYear();
  const beforeAnniversary =
    now.getUTCMonth() < start.getUTCMonth() ||
    (now.getUTCMonth() === start.getUTCMonth() && now.getUTCDate() < start.getUTCDate());
  return beforeAnniversary ? years - 1 : years;
}
