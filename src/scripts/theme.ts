/// The colour-scheme switch. The choice lives in localStorage under THEME_KEY; nothing
/// stored means "follow the system". A tiny inline script in the page head applies the
/// stored choice before first paint; this module wires the switch and keeps it in step.

export const THEME_KEY = 'theme';

export type ThemeChoice = 'light' | 'dark';
export type ThemeSetting = ThemeChoice | null;

const SWITCH_SELECTOR = '[data-theme-switch]';
const OPTION_SELECTOR = '[data-theme-option]';

const LABELS: Record<'system' | ThemeChoice, string> = {
  system: 'Colour scheme: follows the system. Click to change.',
  light: 'Colour scheme: light. Click to change.',
  dark: 'Colour scheme: dark. Click to change.',
};

function isThemeChoice(value: string | null): value is ThemeChoice {
  return value === 'light' || value === 'dark';
}

/// The scheme to show for a stored value and the system preference.
export function resolveTheme(stored: string | null, systemPrefersDark: boolean): ThemeChoice {
  if (isThemeChoice(stored)) {
    return stored;
  }
  return systemPrefersDark ? 'dark' : 'light';
}

/// The switch cycles system → light → dark → system.
export function nextTheme(current: ThemeSetting): ThemeSetting {
  if (current === null) {
    return 'light';
  }
  return current === 'light' ? 'dark' : null;
}

function readStored(): ThemeSetting {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return isThemeChoice(value) ? value : null;
  } catch {
    return null;
  }
}

function writeStored(setting: ThemeSetting): void {
  try {
    if (setting === null) {
      localStorage.removeItem(THEME_KEY);
    } else {
      localStorage.setItem(THEME_KEY, setting);
    }
  } catch {
    // Private windows may refuse storage; the page still switches for this visit.
  }
}

/// Puts the setting on the root element, where tokens.css reads it.
function applyToDocument(setting: ThemeSetting): void {
  if (setting === null) {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = setting;
  }
}

/// Marks the current option on one switch and updates its spoken label.
function reflect(switchElement: HTMLElement, setting: ThemeSetting): void {
  const current = setting ?? 'system';
  for (const option of switchElement.querySelectorAll<HTMLElement>(OPTION_SELECTOR)) {
    if (option.dataset.themeOption === current) {
      option.setAttribute('aria-current', 'true');
    } else {
      option.removeAttribute('aria-current');
    }
  }
  switchElement.setAttribute('aria-label', LABELS[current]);
}

function wireSwitches(): void {
  const switches = [...document.querySelectorAll<HTMLElement>(SWITCH_SELECTOR)];
  let setting = readStored();
  for (const switchElement of switches) {
    reflect(switchElement, setting);
    switchElement.addEventListener('click', () => {
      setting = nextTheme(setting);
      writeStored(setting);
      applyToDocument(setting);
      for (const other of switches) {
        reflect(other, setting);
      }
    });
  }
}

if (typeof document !== 'undefined') {
  wireSwitches();
}
