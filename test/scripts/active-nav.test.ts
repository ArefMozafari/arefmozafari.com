import { describe, expect, it } from 'vitest';
import { isAtPageEnd } from '../../src/scripts/active-nav';

describe('isAtPageEnd', () => {
  it('should treat the bottom of the document as the end', () => {
    expect(isAtPageEnd({ innerHeight: 1000, scrollY: 4099, scrollHeight: 5099 })).toBe(true);
  });

  it('should allow the fractional pixel browsers leave before the bottom', () => {
    expect(isAtPageEnd({ innerHeight: 1000, scrollY: 4097.5, scrollHeight: 5099 })).toBe(true);
  });

  it('should not fire while the footer is still below the fold', () => {
    expect(isAtPageEnd({ innerHeight: 1000, scrollY: 4000, scrollHeight: 5099 })).toBe(false);
  });
});
