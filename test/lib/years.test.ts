import { describe, expect, it } from 'vitest';
import { yearsSince } from '../../src/lib/years';

describe('yearsSince', () => {
  const start = new Date('2018-12-01');

  it('should count only the years fully served', () => {
    expect(yearsSince(start, new Date('2026-11-03'))).toBe(7);
    expect(yearsSince(start, new Date('2027-11-30'))).toBe(8);
  });

  it('should rise on the anniversary itself', () => {
    expect(yearsSince(start, new Date('2026-12-01'))).toBe(8);
    expect(yearsSince(start, new Date('2019-12-01'))).toBe(1);
  });

  it('should return zero inside the first year', () => {
    expect(yearsSince(start, new Date('2019-03-01'))).toBe(0);
  });
});
