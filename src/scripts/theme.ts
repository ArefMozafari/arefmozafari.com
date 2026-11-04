/// The colour-scheme switch. The choice lives in localStorage under THEME_KEY; nothing
/// stored means "follow the system". A tiny inline script in the page head applies the
/// stored choice before first paint; this module wires the switches and keeps them in step.

export const THEME_KEY = 'theme';

export type ThemeChoice = 'light' | 'dark';
export type ThemeSetting = ThemeChoice | null;

const SWITCH_SELECTOR = '[data-theme-switch]';
const OPTION_SELECTOR = '[data-theme-option]';

function isThemeChoice(value: string | null | undefined): value is ThemeChoice {
  return value === 'light' || value === 'dark';
}

/// The scheme to show for a stored value and the system preference.
export function resolveTheme(stored: string | null, systemPrefersDark: boolean): ThemeChoice {
  if (isThemeChoice(stored)) {
    return stored;
  }
  return systemPrefersDark ? 'dark' : 'light';
}

/// Each option sets the scheme directly; "system" and anything unknown clear the choice.
export function settingFromOption(option: string | undefined): ThemeSetting {
  return isThemeChoice(option) ? option : null;
}

function readStored(): ThemeSetting {
  try {
    return settingFromOption(localStorage.getItem(THEME_KEY) ?? undefined);
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

/// Presses the current option on every switch on the page.
function reflect(switches: HTMLElement[], setting: ThemeSetting): void {
  const current = setting ?? 'system';
  for (const switchElement of switches) {
    for (const option of switchElement.querySelectorAll<HTMLElement>(OPTION_SELECTOR)) {
      option.setAttribute('aria-pressed', String(option.dataset.themeOption === current));
    }
  }
}

/// Wires every switch on the page once; switches kept across in-page navigations are skipped.
function wireSwitches(): void {
  const switches = [...document.querySelectorAll<HTMLElement>(SWITCH_SELECTOR)];
  reflect(switches, readStored());
  for (const switchElement of switches) {
    if (switchElement.dataset.themeWired) {
      continue;
    }
    switchElement.dataset.themeWired = 'true';
    for (const option of switchElement.querySelectorAll<HTMLElement>(OPTION_SELECTOR)) {
      option.addEventListener('click', () => {
        const setting = settingFromOption(option.dataset.themeOption);
        writeStored(setting);
        applyToDocument(setting);
        reflect(switches, setting);
      });
    }
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', wireSwitches);
  // An in-page navigation swaps the root element's attributes for the new page's, which
  // never carry the stored choice; put it back before the new page paints.
  document.addEventListener('astro:after-swap', () => applyToDocument(readStored()));
}
