import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { useAuth } from './useAuth';
import { useMessages } from '../../i18n/useI18n';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const m = useMessages();
  const t = m.auth.login;

  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.failed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container auth-shell">
      <div className="auth-card">
        <p className="eyebrow">{m.auth.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="auth-sub">{t.sub}</p>

        {/* Google OAuth is not wired up yet — shown but disabled. */}
        <button type="button" className="btn-google" disabled title={m.common.comingSoon}>
          {m.auth.google}
        </button>

        <div className="auth-divider">{m.common.or}</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="banner banner-error">{error}</p>}

          <label className="field">
            <span className="field-label">{m.auth.email}</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">{m.auth.password}</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit" className="cta btn-block" disabled={submitting}>
            {submitting ? t.submitting : t.submit}
          </button>
        </form>

        <p className="auth-foot">
          {t.noWorkspace} <Link to="/register">{t.openOne}</Link>
        </p>
      </div>
    </div>
  );
}
