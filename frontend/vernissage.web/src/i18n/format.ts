import { currentLocale } from './locales';
import type { Locale } from './locales';

/** Fills `{name}` placeholders: fmt('Hello {name}', { name: 'Iryna' }). */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export interface PluralForms {
  one: string;
  few?: string;
  many?: string;
  other: string;
}

/**
 * Picks the plural form for `n` by the language's own rules (Ukrainian has
 * one/few/many) and fills `{n}` with the formatted number.
 */
export function plural(n: number, forms: PluralForms, locale: Locale = currentLocale()): string {
  const rule = new Intl.PluralRules(locale).select(n) as keyof PluralForms;
  const template = forms[rule] ?? forms.other;
  return template.replace(/\{n\}/g, formatNumber(n, locale));
}

export function formatNumber(
  value: number,
  locale: Locale = currentLocale(),
  options?: Intl.NumberFormatOptions,
): string {
  return value.toLocaleString(locale, options);
}

/** A yyyy-MM-dd or ISO date in the active language; the input back when it isn't a date. */
export function formatDate(
  value: string | null | undefined,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
  locale: Locale = currentLocale(),
): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(locale, options);
}
