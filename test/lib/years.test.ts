import { describe, expect, it } from 'vitest';
import { yearsSince } from '../../src/lib/years';

describe('yearsSince', () => {
  const start = new Date('2018-12-01');

  it('should round down before the half year', () => {
    expect(yearsSince(start, new Date('2026-11-03'))).toBe(8);
    expect(yearsSince(start, new Date('2027-05-31'))).toBe(8);
  });

  it('should round up after the half year', () => {
    expect(yearsSince(start, new Date('2027-06-02'))).toBe(9);
  });

  it('should return zero inside the first half year', () => {
    expect(yearsSince(start, new Date('2019-03-01'))).toBe(0);
  });
});
