import { describe, expect, it } from 'vitest';
import { correctYears } from '../../src/scripts/years-client';

describe('correctYears', () => {
  const start = new Date('2018-12-01');

  it('should replace the text when the build-time value is stale', () => {
    const element = { textContent: '7' };

    expect(correctYears(element, start, new Date('2026-11-03'))).toBe(true);
    expect(element.textContent).toBe('8');
  });

  it('should leave the text alone when it already matches', () => {
    const element = { textContent: '8' };

    expect(correctYears(element, start, new Date('2026-11-03'))).toBe(false);
    expect(element.textContent).toBe('8');
  });
});
