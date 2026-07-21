import { useContext } from 'react';
import { ConfigContext } from './ConfigContext';
import type { ConfigContextValue } from './ConfigContext';

export function useAppConfig(): ConfigContextValue {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useAppConfig must be used within a ConfigProvider');
  }
  return context;
}
