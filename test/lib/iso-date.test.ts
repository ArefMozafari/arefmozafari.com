import { describe, expect, it } from 'vitest';
import { isoDate } from '../../src/lib/iso-date';

describe('isoDate', () => {
  it('should give the calendar date alone, in UTC', () => {
    expect(isoDate(new Date('2026-07-30T23:59:00Z'))).toBe('2026-07-30');
  });
});
