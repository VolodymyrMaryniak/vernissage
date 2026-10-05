import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CREATOR_ROLES } from '../../types/auth';
import type { CreatorRole } from '../../types/auth';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { useAuth } from './useAuth';
import { useMessages } from '../../i18n/useI18n';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const m = useMessages();
  const t = m.auth.register;

  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState<CreatorRole[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleRole = (role: CreatorRole) => {
    setRoles((current) =>
      current.includes(role) ? current.filter((r) => r !== role) : [...current, role],
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (roles.length === 0) {
      setError(t.pickRole);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await register(email, password, roles);
      navigate('/profile', { replace: true });
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
            <span className="field-label">{t.passwordMin}</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <fieldset className="field">
            <legend className="field-label">{t.iAmA}</legend>
            {CREATOR_ROLES.map((role) => (
              <label key={role} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={roles.includes(role)}
                  onChange={() => toggleRole(role)}
                />
                <span>
                  <strong>{m.roles.name[role]}</strong>
                  <span className="muted"> — {m.roles.hint[role]}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <button type="submit" className="cta btn-block" disabled={submitting}>
            {submitting ? t.submitting : t.submit}
          </button>
        </form>

        <p className="auth-foot">
          {t.haveWorkspace} <Link to="/login">{t.signIn}</Link>
        </p>
      </div>
    </div>
  );
}
