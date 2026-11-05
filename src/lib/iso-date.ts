/** The calendar date of a moment as `yyyy-mm-dd`, in UTC, for datetime attributes and feeds. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
