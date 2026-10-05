/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import en from './en';
import type { Messages } from './en';
import { DEFAULT_LOCALE, saveLocale, setCurrentLocale } from './locales';
import { setCurrentMessages } from './current';
import type { Locale } from './locales';

export interface I18nValue {
  locale: Locale;
  /** The active dictionary: `m.home.title`. Fully typed, so a missing key fails the build. */
  m: Messages;
  setLocale: (locale: Locale) => void;
}

// English without a provider (tests, isolated renders), so components never need one to work.
export const I18nContext = createContext<I18nValue>({
  locale: DEFAULT_LOCALE,
  m: en,
  setLocale: () => undefined,
});

/** French and Ukrainian are split into their own chunks and fetched on first use. */
export async function loadMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case 'fr':
      return (await import('./fr')).default;
    case 'uk':
      return (await import('./uk')).default;
    default:
      return en;
  }
}

interface Props {
  children: ReactNode;
  initialLocale?: Locale;
  /** The dictionary for `initialLocale`, preloaded so the first paint is already translated. */
  initialMessages?: Messages;
}

export function I18nProvider({ children, initialLocale = DEFAULT_LOCALE, initialMessages = en }: Props) {
  const [state, setState] = useState<{ locale: Locale; m: Messages }>(() => {
    setCurrentLocale(initialLocale);
    setCurrentMessages(initialMessages);
    return { locale: initialLocale, m: initialMessages };
  });

  useEffect(() => {
    setCurrentLocale(state.locale);
  }, [state.locale]);

  const setLocale = useCallback((locale: Locale) => {
    saveLocale(locale);
    void loadMessages(locale).then((m) => {
      setCurrentLocale(locale);
      setCurrentMessages(m);
      setState({ locale, m });
    });
  }, []);

  const value = useMemo(() => ({ ...state, setLocale }), [state, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
