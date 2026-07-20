import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CREATOR_ROLES } from '../../types/auth';
import type { CreatorRole } from '../../types/auth';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { useAuth } from './useAuth';

const ROLE_HINTS: Record<CreatorRole, string> = {
  Gallery: 'A gallery or exhibition space',
  Curator: 'An independent art curator',
  Artist: 'An artist showing their own work',
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  useDocumentMeta({
    title: 'Open a workspace',
    description: 'Create a Vernissage workspace to document and archive your exhibitions.',
  });

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
      setError('Select at least one role.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await register(email, password, roles);
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Workspace</p>
        <h1>Open a workspace</h1>
        <p className="auth-sub">Free during beta — including analytics.</p>

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
            <span className="field-label">Password (min. 8 characters)</span>
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
            <legend className="field-label">I am a… (choose all that apply)</legend>
            {CREATOR_ROLES.map((role) => (
              <label key={role} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={roles.includes(role)}
                  onChange={() => toggleRole(role)}
                />
                <span>
                  <strong>{role}</strong>
                  <span className="muted"> — {ROLE_HINTS[role]}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <button type="submit" className="cta btn-block" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="auth-foot">
          Already have a workspace? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
