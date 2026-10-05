import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './useAuth';
import { useMessages } from '../../i18n/useI18n';

/** Route guard: redirects to /login (remembering where from) when logged out. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, initializing } = useAuth();
  const location = useLocation();
  const m = useMessages();

  if (initializing) {
    return <p className="muted state-message">{m.common.loading}</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
