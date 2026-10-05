import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { downloadCvFile, getCv, uploadCvFile } from '../../api/cvApi';
import { getProfile } from '../../api/profileApi';
import type { CvFile } from '../../types/cv';
import type { Profile } from '../../types/profile';
import { saveBlob } from '../cv/download';
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
  const [cvFile, setCvFile] = useState<CvFile | null>(null);
  const [cvMessage, setCvMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void getProfile()
      .then((p) => {
        if (!cancelled) setProfile(p);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile');
      });
    // The CV panel is secondary: if it fails to load, the card still shows.
    void getCv()
      .then((cv) => {
        if (!cancelled) setCvFile(cv.uploadedFile);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!profile) {
    return <p className="muted state-message">{error ?? 'Loading…'}</p>;
  }

  const handleUploadCv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setCvMessage(null);
    if (file.size > 10 * 1024 * 1024) {
      setCvMessage('The CV file must be 10 MB or smaller.');
      return;
    }
    setUploading(true);
    try {
      const cv = await uploadCvFile(file);
      setCvFile(cv.uploadedFile);
      setCvMessage(`Uploaded ${file.name}.`);
    } catch (err) {
      setCvMessage(err instanceof Error ? err.message : 'Failed to upload the CV');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadCv = async () => {
    try {
      saveBlob(await downloadCvFile(), cvFile?.fileName ?? 'CV');
    } catch (err) {
      setCvMessage(err instanceof Error ? err.message : 'Failed to download the CV');
    }
  };

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

      <section className="card form-section profile-cv" aria-labelledby="profile-cv-title">
        <div className="section-head">
          <h3 className="view-section-title" id="profile-cv-title">
            CV
          </h3>
        </div>
        <p className="muted">
          {cvFile
            ? `Your CV file: ${cvFile.fileName}.`
            : 'Upload the CV you have, or build one from your profile and documented exhibitions.'}
        </p>
        {cvMessage && <p className="profile-cv-message">{cvMessage}</p>}
        <div className="profile-card-actions">
          <Link className="btn btn-primary btn-sm" to="/profile/cv">
            Update the CV
          </Link>
          <label className="btn btn-ghost btn-sm">
            {uploading ? 'Uploading…' : cvFile ? 'Replace CV file' : 'Upload CV'}
            <input type="file" accept=".pdf,.doc,.docx,.odt,.rtf,.txt" hidden onChange={handleUploadCv} />
          </label>
          {cvFile && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleDownloadCv}>
              Download CV file
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
