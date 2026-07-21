/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getAppConfig } from '../../api/analyticsApi';

export interface ConfigContextValue {
  /** Whether the analytics feature is switched on server-side. */
  analyticsEnabled: boolean;
  /** True until /api/config has answered (or failed). */
  loading: boolean;
}

export const ConfigContext = createContext<ConfigContextValue | null>(null);

/**
 * Reads the server's runtime feature flags once on startup. Flags default to
 * off while loading and if the request fails, so a gated feature never flashes
 * into the UI and then disappears.
 */
export function ConfigProvider({ children }: { children: ReactNode }) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void getAppConfig()
      .then((config) => {
        if (!cancelled) setAnalyticsEnabled(config.analyticsEnabled);
      })
      .catch(() => {
        // Config is best-effort: an unreachable API just leaves flags off.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ analyticsEnabled, loading }),
    [analyticsEnabled, loading],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}
