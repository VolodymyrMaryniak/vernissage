/** The languages the site is translated into. English is the default and the source text. */
export type Locale = 'en' | 'fr' | 'uk';

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALES: { code: Locale; name: string; short: string }[] = [
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'fr', name: 'Français', short: 'FR' },
  { code: 'uk', name: 'Українська', short: 'UA' },
];

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'fr' || value === 'uk';
}

const STORAGE_KEY = 'vernissage.locale';

/** The visitor's saved choice; English when there is none (we don't guess from the browser). */
export function savedLocale(): Locale {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isLocale(value) ? value : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Storage blocked (private mode): the choice lasts for this visit only.
  }
}

// The active locale, for plain helpers (date/number formatting) that run outside React.
// The provider updates it before re-rendering, so every render sees the current value.
let current: Locale = DEFAULT_LOCALE;

export function currentLocale(): Locale {
  return current;
}

export function setCurrentLocale(locale: Locale): void {
  current = locale;
  if (typeof document !== 'undefined') document.documentElement.lang = locale;
}
