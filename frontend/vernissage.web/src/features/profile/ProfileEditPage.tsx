import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteProfilePhoto, getProfile, updateProfile, uploadProfilePhoto } from '../../api/profileApi';
import { CREATOR_ROLES } from '../../types/auth';
import type { CreatorRole } from '../../types/auth';
import type { Profile, ProfileWrite } from '../../types/profile';
import { useAuth } from '../auth/useAuth';
import { useProfilePhoto } from './useProfilePhoto';
import { validatePhoto } from './photo';
import { useMessages } from '../../i18n/useI18n';
import type { Messages } from '../../i18n/en';

function toWrite(profile: Profile): ProfileWrite {
  return {
    roles: profile.roles,
    galleryName: profile.galleryName,
    businessLocation: profile.businessLocation,
    focus: profile.focus,
    foundingYear: profile.foundingYear,
    firstName: profile.firstName,
    lastName: profile.lastName,
    socialMedia: profile.socialMedia,
    placeOfWork: profile.placeOfWork,
    areasOfInterest: profile.areasOfInterest,
    location: profile.location,
    medium: profile.medium,
  };
}

interface TextFieldDef {
  key: keyof Omit<ProfileWrite, 'roles' | 'foundingYear'>;
  label: string;
  placeholder?: string;
}

function galleryFields(t: Messages['profile']['form']): TextFieldDef[] {
  return [
    { key: 'galleryName', label: t.galleryName },
    { key: 'businessLocation', label: t.businessLocation, placeholder: t.cityCountry },
    { key: 'focus', label: t.focus, placeholder: t.focusPlaceholder },
  ];
}

function personFields(t: Messages['profile']['form']): TextFieldDef[] {
  return [
    { key: 'firstName', label: t.firstName },
    { key: 'lastName', label: t.lastName },
    { key: 'socialMedia', label: t.socialMedia, placeholder: t.socialMediaPlaceholder },
    { key: 'placeOfWork', label: t.placeOfWork },
    { key: 'areasOfInterest', label: t.areasOfInterest },
    { key: 'location', label: t.location, placeholder: t.cityCountry },
  ];
}

/** The profile form. Saving returns to the business-card view at /profile. */
export default function ProfileEditPage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const m = useMessages();
  const t = m.profile.form;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<ProfileWrite | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [photoVersion, setPhotoVersion] = useState(0);
  const photoUrl = useProfilePhoto(profile?.hasPhoto ?? false, photoVersion);

  useEffect(() => {
    let cancelled = false;
    void getProfile()
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
        setForm(toWrite(p));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : m.profile.loadFailed);
      });
    return () => {
      cancelled = true;
    };
  }, [m.profile.loadFailed]);

  if (!form || !profile) {
    return <p className="muted state-message">{error ?? m.common.loading}</p>;
  }

  const update = (key: keyof ProfileWrite, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value === '' ? null : value } : prev));
  };

  const toggleRole = (role: CreatorRole) => {
    setForm((prev) => {
      if (!prev) return prev;
      const roles = prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const isGallery = form.roles.includes('Gallery');
  const isPerson = form.roles.includes('Curator') || form.roles.includes('Artist');
  const isArtist = form.roles.includes('Artist');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.roles.length === 0) {
      setError(m.auth.register.pickRole);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateProfile(form);
      await refreshUser();
      // Back to the card, which shows a one-off "saved" confirmation.
      navigate('/profile', { state: { saved: true } });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.saveFailed);
      setSaving(false);
    }
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError(null);
    const invalid = validatePhoto(file, t);
    if (invalid) {
      setError(invalid);
      return;
    }
    try {
      const updated = await uploadProfilePhoto(file);
      setProfile(updated);
      setPhotoVersion((v) => v + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.uploadPhotoFailed);
    }
  };

  const handlePhotoDelete = async () => {
    setError(null);
    try {
      await deleteProfilePhoto();
      setProfile((p) => (p ? { ...p, hasPhoto: false } : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : t.removePhotoFailed);
    }
  };

  return (
    <div className="profile-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{m.profile.eyebrow}</p>
          <h2>{t.title}</h2>
          <p className="page-sub">{profile.email}</p>
        </div>
        <nav className="workspace-links">
          <Link className="btn btn-ghost btn-sm" to="/profile">
            {t.back}
          </Link>
        </nav>
      </header>

      {error && <p className="banner banner-error">{error}</p>}

      <section className="card form-section">
        <div className="section-head">
          <h3 className="view-section-title">{t.photo}</h3>
        </div>
        <div className="profile-photo-row">
          {photoUrl ? (
            <img className="profile-photo" src={photoUrl} alt={t.photoAlt} />
          ) : (
            <span className="ex-avatar" aria-hidden="true">
              {(profile.displayName || profile.email).slice(0, 2).toUpperCase()}
            </span>
          )}
          <label className="btn btn-ghost btn-sm">
            {profile.hasPhoto ? t.replacePhoto : t.uploadPhoto}
            <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          </label>
          {profile.hasPhoto && (
            <button type="button" className="btn btn-danger-ghost btn-sm" onClick={handlePhotoDelete}>
              {m.common.remove}
            </button>
          )}
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <section className="card form-section">
          <div className="section-head">
            <h3 className="view-section-title">{t.roles}</h3>
          </div>
          {CREATOR_ROLES.map((role) => (
            <label key={role} className="checkbox-row">
              <input
                type="checkbox"
                checked={form.roles.includes(role)}
                onChange={() => toggleRole(role)}
              />
              <span>{m.roles.name[role]}</span>
            </label>
          ))}
        </section>

        {isGallery && (
          <section className="card form-section">
            <div className="section-head">
              <h3 className="view-section-title">{t.gallery}</h3>
            </div>
            <div className="field-grid">
              {galleryFields(t).map((f) => (
                <label className="field" key={f.key}>
                  <span className="field-label">{f.label}</span>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={form[f.key] ?? ''}
                    onChange={(e) => update(f.key, e.target.value)}
                  />
                </label>
              ))}
              <label className="field">
                <span className="field-label">{t.foundingYear}</span>
                <input
                  type="number"
                  min={1000}
                  max={9999}
                  value={form.foundingYear ?? ''}
                  onChange={(e) => {
                    setForm((prev) =>
                      prev
                        ? { ...prev, foundingYear: e.target.value === '' ? null : Number(e.target.value) }
                        : prev,
                    );
                  }}
                />
              </label>
            </div>
          </section>
        )}

        {isPerson && (
          <section className="card form-section">
            <div className="section-head">
              <h3 className="view-section-title">{t.aboutYou}</h3>
            </div>
            <div className="field-grid">
              {personFields(t).map((f) => (
                <label className="field" key={f.key}>
                  <span className="field-label">{f.label}</span>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={form[f.key] ?? ''}
                    onChange={(e) => update(f.key, e.target.value)}
                  />
                </label>
              ))}
              {isArtist && (
                <label className="field">
                  <span className="field-label">{t.medium}</span>
                  <input
                    type="text"
                    placeholder={t.mediumPlaceholder}
                    value={form.medium ?? ''}
                    onChange={(e) => update('medium', e.target.value)}
                  />
                </label>
              )}
            </div>
          </section>
        )}

        <div className="form-actions--inline">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? m.common.saving : t.save}
          </button>
          <Link className="btn btn-ghost" to="/profile">
            {m.common.cancel}
          </Link>
        </div>
      </form>
    </div>
  );
}
