import { useId } from 'react';
import { LOCALES, isLocale } from './locales';
import { useI18n } from './useI18n';

interface Props {
  className?: string;
  /** "buttons": EN · FR · UA side by side. "select": one compact pill that opens a list. */
  variant?: 'buttons' | 'select';
}

/** The language picker. Each language is named in its own language. */
export default function LanguageSwitcher({ className, variant = 'buttons' }: Props) {
  const { locale, setLocale, m } = useI18n();
  const id = useId();
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  if (variant === 'select') {
    return (
      <span className={`lang-select${className ? ` ${className}` : ''}`}>
        <label htmlFor={id} className="visually-hidden">
          {m.common.language}
        </label>
        {/* The pill shows the short code; the native list shows the full names. */}
        <span className="lang-select-face" aria-hidden="true">
          {current.short}
          <span className="lang-select-caret">▾</span>
        </span>
        <select
          id={id}
          value={locale}
          onChange={(e) => {
            if (isLocale(e.target.value)) setLocale(e.target.value);
          }}
        >
          {LOCALES.map((l) => (
            <option key={l.code} value={l.code} lang={l.code}>
              {l.name}
            </option>
          ))}
        </select>
      </span>
    );
  }

  return (
    <div className={`lang-switch${className ? ` ${className}` : ''}`} role="group" aria-label={m.common.language}>
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          title={l.name}
          aria-label={l.name}
          aria-pressed={locale === l.code}
          className={locale === l.code ? 'is-active' : undefined}
          onClick={() => setLocale(l.code)}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
