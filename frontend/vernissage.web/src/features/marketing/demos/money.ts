import { formatNumber } from '../../../i18n/format';

/** Whole euros in the active language's format, e.g. €2,400 / 2 400 € / 2400 €. */
export function euro(n: number): string {
  // A typographic minus for losses, wherever the language puts the sign.
  return formatNumber(Math.round(n), undefined, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).replace('-', '−');
}
