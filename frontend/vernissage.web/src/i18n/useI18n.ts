import { useContext } from 'react';
import { I18nContext } from './I18nContext';
import type { I18nValue } from './I18nContext';

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}

/** Shorthand for the active dictionary. */
export function useMessages() {
  return useContext(I18nContext).m;
}
