/** The site's colour scheme. Light is the default; dark is the visitor's choice. */
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'vernissage.theme';

/** Fired whenever the theme changes, so every toggle on the page stays in step. */
export const THEME_EVENT = 'vernissage:theme';

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function subscribeTheme(onChange: () => void): () => void {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

export function savedTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/** Sets `<html data-theme>` (which the CSS keys off) and remembers the choice. */
export function applyTheme(theme: Theme, persist = false): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  // Native controls (date pickers, scrollbars) follow the chosen scheme, not the OS.
  root.style.colorScheme = theme;
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme);
  window.dispatchEvent(new Event(THEME_EVENT));
  if (!persist) return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage blocked: the choice lasts for this visit only.
  }
}
