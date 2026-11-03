import { describe, expect, it } from 'vitest';
import { resolveTheme, settingFromOption, THEME_KEY } from '../../src/scripts/theme';

describe('resolveTheme', () => {
  it('should follow the system when nothing is stored', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });

  it('should honour a stored choice over the system', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('should ignore a stored value it does not recognise', () => {
    expect(resolveTheme('blue', true)).toBe('dark');
  });
});

describe('settingFromOption', () => {
  it('should map the option the visitor pressed straight to a setting', () => {
    expect(settingFromOption('system')).toBeNull();
    expect(settingFromOption('light')).toBe('light');
    expect(settingFromOption('dark')).toBe('dark');
  });

  it('should treat an unknown option as system', () => {
    expect(settingFromOption('sepia')).toBeNull();
  });
});

describe('THEME_KEY', () => {
  it('should be the one storage key both the inline script and the switch read', () => {
    expect(THEME_KEY).toBe('theme');
  });
});
