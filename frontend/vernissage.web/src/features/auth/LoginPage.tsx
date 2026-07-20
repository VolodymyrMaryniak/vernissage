import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { useAuth } from './useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  useDocumentMeta({
    title: 'Sign in',
    description: 'Sign in to your Vernissage workspace.',
  });

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
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Workspace</p>
        <h1>Sign in</h1>
        <p className="auth-sub">Pick up where you left off documenting your shows.</p>

        {/* Google OAuth is not wired up yet — shown but disabled. */}
        <button type="button" className="btn-google" disabled title="Coming soon">
          Continue with Google
        </button>

        <div className="auth-divider">or</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="banner banner-error">{error}</p>}

          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit" className="cta btn-block" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-foot">
          No workspace yet? <Link to="/register">Open one</Link>
        </p>
      </div>
    </div>
  );
}
