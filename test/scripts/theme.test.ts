import { describe, expect, it } from 'vitest';
import {
  resolveTheme,
  settingFromOption,
  THEME_KEY,
  themeColorMedia,
} from '../../src/scripts/theme';

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

describe('themeColorMedia', () => {
  it('should let each browser-chrome colour follow the system when nothing is chosen', () => {
    expect(themeColorMedia('light', null)).toBe('(prefers-color-scheme: light)');
    expect(themeColorMedia('dark', null)).toBe('(prefers-color-scheme: dark)');
  });

  it('should apply the chosen scheme colour everywhere and silence the other', () => {
    expect(themeColorMedia('light', 'light')).toBe('all');
    expect(themeColorMedia('dark', 'light')).toBe('not all');
  });
});

describe('THEME_KEY', () => {
  it('should be the one storage key both the inline script and the switch read', () => {
    expect(THEME_KEY).toBe('theme');
  });
});
