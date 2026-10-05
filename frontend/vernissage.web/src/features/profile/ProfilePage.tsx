import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getProfile } from '../../api/profileApi';
import type { Profile } from '../../types/profile';
import { useAppConfig } from '../config/useAppConfig';
import BusinessCard from './BusinessCard';
import { useProfilePhoto } from './useProfilePhoto';

/** True when the profile has nothing beyond the email and roles. */
function isBlank(p: Profile): boolean {
  return ![
    p.firstName,
    p.lastName,
    p.galleryName,
    p.placeOfWork,
    p.medium,
    p.focus,
    p.location,
    p.businessLocation,
    p.areasOfInterest,
    p.socialMedia,
    p.foundingYear,
  ].some((v) => v !== null && v !== undefined && String(v).trim() !== '');
}

/** "My profile": the profile shown as a business card, with a way to edit it. */
export default function ProfilePage() {
  const { analyticsEnabled } = useAppConfig();
  const location = useLocation();
  const justSaved = (location.state as { saved?: boolean } | null)?.saved === true;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const photoUrl = useProfilePhoto(profile?.hasPhoto ?? false);

  useEffect(() => {
    let cancelled = false;
    void getProfile()
      .then((p) => {
        if (!cancelled) setProfile(p);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!profile) {
    return <p className="muted state-message">{error ?? 'Loading…'}</p>;
  }

  return (
    <div className="profile-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Account</p>
          <h2>My profile</h2>
        </div>
        <nav className="workspace-links">
          <Link className="btn btn-ghost btn-sm" to="/exhibitions">
            My exhibitions
          </Link>
          {analyticsEnabled && (
            <Link className="btn btn-ghost btn-sm" to="/analytics">
              Analytics
            </Link>
          )}
        </nav>
      </header>

      {justSaved && <p className="banner banner-success">Profile saved.</p>}

      <div className="profile-card-wrap">
        <BusinessCard profile={profile} photoUrl={photoUrl} />
        <div className="profile-card-actions">
          <Link className="btn btn-primary" to="/profile/edit">
            {isBlank(profile) ? 'Complete your profile' : 'Edit profile'}
          </Link>
        </div>
      </div>
    </div>
  );
}
