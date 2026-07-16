import { useCallback, useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  deleteProfilePhoto,
  fetchProfilePhotoUrl,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from '../../api/profileApi';
import { CREATOR_ROLES } from '../../types/auth';
import type { CreatorRole } from '../../types/auth';
import type { Profile, ProfileWrite } from '../../types/profile';
import { useAuth } from '../auth/useAuth';

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

const GALLERY_FIELDS: TextFieldDef[] = [
  { key: 'galleryName', label: 'Gallery name' },
  { key: 'businessLocation', label: 'Business location', placeholder: 'City, country' },
  { key: 'focus', label: 'Focus', placeholder: 'e.g. Contemporary sculpture' },
];

const PERSON_FIELDS: TextFieldDef[] = [
  { key: 'firstName', label: 'Name' },
  { key: 'lastName', label: 'Surname' },
  { key: 'socialMedia', label: 'Social media', placeholder: 'Links or handles' },
  { key: 'placeOfWork', label: 'Place of work' },
  { key: 'areasOfInterest', label: 'Areas of interest' },
  { key: 'location', label: 'Location', placeholder: 'City, country' },
];

export default function ProfilePage() {
  const { refreshUser } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<ProfileWrite | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadPhoto = useCallback(async (hasPhoto: boolean) => {
    setPhotoUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    if (!hasPhoto) return;
    try {
      setPhotoUrl(await fetchProfilePhotoUrl());
    } catch {
      // Photo failing to load is not fatal for the page.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void getProfile()
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
        setForm(toWrite(p));
        void loadPhoto(p.hasPhoto);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile');
      });
    return () => {
      cancelled = true;
    };
  }, [loadPhoto]);

  if (!form || !profile) {
    return <p className="muted state-message">{error ?? 'Loading…'}</p>;
  }

  const update = (key: keyof ProfileWrite, value: string) => {
    setSaved(false);
    setForm((prev) => (prev ? { ...prev, [key]: value === '' ? null : value } : prev));
  };

  const toggleRole = (role: CreatorRole) => {
    setSaved(false);
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
      setError('Select at least one role.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProfile(form);
      setProfile(updated);
      setForm(toWrite(updated));
      setSaved(true);
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError(null);
    try {
      const updated = await uploadProfilePhoto(file);
      setProfile(updated);
      await loadPhoto(updated.hasPhoto);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    }
  };

  const handlePhotoDelete = async () => {
    setError(null);
    try {
      await deleteProfilePhoto();
      setProfile((p) => (p ? { ...p, hasPhoto: false } : p));
      await loadPhoto(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove photo');
    }
  };

  return (
    <div className="profile-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Account</p>
          <h2>My profile</h2>
          <p className="page-sub">{profile.email}</p>
        </div>
      </header>

      {error && <p className="banner banner-error">{error}</p>}
      {saved && <p className="banner banner-success">Profile saved.</p>}

      <section className="card form-section">
        <div className="section-head">
          <h3 className="view-section-title">Photo</h3>
        </div>
        <div className="profile-photo-row">
          {photoUrl ? (
            <img className="profile-photo" src={photoUrl} alt="Profile" />
          ) : (
            <span className="ex-avatar" aria-hidden="true">
              {(profile.displayName || profile.email).slice(0, 2).toUpperCase()}
            </span>
          )}
          <label className="btn btn-ghost btn-sm">
            {profile.hasPhoto ? 'Replace photo' : 'Upload photo'}
            <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          </label>
          {profile.hasPhoto && (
            <button type="button" className="btn btn-danger-ghost btn-sm" onClick={handlePhotoDelete}>
              Remove
            </button>
          )}
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <section className="card form-section">
          <div className="section-head">
            <h3 className="view-section-title">Roles</h3>
          </div>
          {CREATOR_ROLES.map((role) => (
            <label key={role} className="checkbox-row">
              <input
                type="checkbox"
                checked={form.roles.includes(role)}
                onChange={() => toggleRole(role)}
              />
              <span>{role}</span>
            </label>
          ))}
        </section>

        {isGallery && (
          <section className="card form-section">
            <div className="section-head">
              <h3 className="view-section-title">Gallery</h3>
            </div>
            <div className="field-grid">
              {GALLERY_FIELDS.map((f) => (
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
                <span className="field-label">Year of founding</span>
                <input
                  type="number"
                  min={1000}
                  max={9999}
                  value={form.foundingYear ?? ''}
                  onChange={(e) => {
                    setSaved(false);
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
              <h3 className="view-section-title">About you</h3>
            </div>
            <div className="field-grid">
              {PERSON_FIELDS.map((f) => (
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
                  <span className="field-label">Medium</span>
                  <input
                    type="text"
                    placeholder="e.g. Painting, photography"
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
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
