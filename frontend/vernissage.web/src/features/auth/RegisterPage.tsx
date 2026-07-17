import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CREATOR_ROLES } from '../../types/auth';
import type { CreatorRole } from '../../types/auth';
import { useAuth } from './useAuth';

const ROLE_HINTS: Record<CreatorRole, string> = {
  Gallery: 'A gallery or exhibition space (B2B)',
  Curator: 'An independent art curator',
  Artist: 'An artist showing their own work',
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

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
    <div className="auth-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Account</p>
          <h2>Create an account</h2>
          <p className="page-sub">Free during beta — including analytics.</p>
        </div>
      </header>

      <form className="card auth-form" onSubmit={handleSubmit}>
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

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Register'}
        </button>

        <p className="muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
