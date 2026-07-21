/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as authApi from '../../api/authApi';
import { UNAUTHORIZED_EVENT, getToken, setToken } from '../../api/http';
import type { CreatorRole, User } from '../../types/auth';

export interface AuthContextValue {
  /** Current user; null when logged out. */
  user: User | null;
  /** True while the stored token is being validated on startup. */
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, roles: CreatorRole[]) => Promise<void>;
  logout: () => void;
  /** Re-read /api/auth/me (e.g. after a profile change affecting display name). */
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(() => getToken() !== null);

  // Validate a persisted token on mount; drop it if the API rejects it.
  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    void authApi
      .getCurrentUser()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch(() => {
        if (!cancelled) setToken(null);
      })
      .finally(() => {
        if (!cancelled) setInitializing(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Any API call that hits a 401 with a stored token clears it and raises this
  // event; drop the user so the route guards redirect to the sign-in page.
  useEffect(() => {
    const handle = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, handle);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handle);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setToken(response.token);
    setUser(response.user);
  }, []);

  const register = useCallback(
    async (email: string, password: string, roles: CreatorRole[]) => {
      const response = await authApi.register({ email, password, roles });
      setToken(response.token);
      setUser(response.user);
    },
    [],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!getToken()) return;
    setUser(await authApi.getCurrentUser());
  }, []);

  const value = useMemo(
    () => ({ user, initializing, login, register, logout, refreshUser }),
    [user, initializing, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
