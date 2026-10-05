import { formatNumber } from '../../i18n/format';

/** File size in B / KB / MB, with the decimal separator of the active language. */
export function formatSize(bytes: number): string {
  const one = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${formatNumber(bytes / 1024, undefined, one)} KB`;
  return `${formatNumber(bytes / (1024 * 1024), undefined, one)} MB`;
}
