import { useSyncExternalStore } from 'react';
import { applyTheme, currentTheme, subscribeTheme } from './theme';
import type { Theme } from './theme';
import { useMessages } from '../i18n/useI18n';

/** Light / dark switch: a sun or a moon, labelled by what it switches to. */
export default function ThemeToggle({ className }: { className?: string }) {
  const t = useMessages().common.theme;
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, () => 'light' as Theme);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle${className ? ` ${className}` : ''}`}
      aria-label={theme === 'dark' ? t.toLight : t.toDark}
      title={theme === 'dark' ? t.toLight : t.toDark}
      aria-pressed={theme === 'dark'}
      onClick={() => {
        applyTheme(next, true);
      }}
    >
      {theme === 'dark' ? (
        // Sun: switch back to light.
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
          </g>
        </svg>
      ) : (
        // Moon: switch to dark.
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
          <path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6Z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
