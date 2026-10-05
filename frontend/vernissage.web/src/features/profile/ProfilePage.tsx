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
import { useMessages } from '../../i18n/useI18n';
import { fmt } from '../../i18n/format';

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
  const m = useMessages();
  const t = m.profile;
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
        if (!cancelled) setError(err instanceof Error ? err.message : t.loadFailed);
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
  }, [t.loadFailed]);

  if (!profile) {
    return <p className="muted state-message">{error ?? m.common.loading}</p>;
  }

  const handleUploadCv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setCvMessage(null);
    if (file.size > 10 * 1024 * 1024) {
      setCvMessage(t.cv.tooLarge);
      return;
    }
    setUploading(true);
    try {
      const cv = await uploadCvFile(file);
      setCvFile(cv.uploadedFile);
      setCvMessage(fmt(t.cv.uploaded, { name: file.name }));
    } catch (err) {
      setCvMessage(err instanceof Error ? err.message : t.cv.uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadCv = async () => {
    try {
      saveBlob(await downloadCvFile(), cvFile?.fileName ?? 'CV');
    } catch (err) {
      setCvMessage(err instanceof Error ? err.message : t.cv.downloadFailed);
    }
  };

  return (
    <div className="profile-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.title}</h2>
        </div>
        <nav className="workspace-links">
          <Link className="btn btn-ghost btn-sm" to="/exhibitions">
            {m.nav.myExhibitions}
          </Link>
          {analyticsEnabled && (
            <Link className="btn btn-ghost btn-sm" to="/analytics">
              {m.nav.analytics}
            </Link>
          )}
        </nav>
      </header>

      {justSaved && <p className="banner banner-success">{t.saved}</p>}

      <div className="profile-card-wrap">
        <BusinessCard profile={profile} photoUrl={photoUrl} />
        <div className="profile-card-actions">
          <Link className="btn btn-primary" to="/profile/edit">
            {isBlank(profile) ? t.complete : t.edit}
          </Link>
        </div>
      </div>

      <section className="card form-section profile-cv" aria-labelledby="profile-cv-title">
        <div className="section-head">
          <h3 className="view-section-title" id="profile-cv-title">
            {t.cv.title}
          </h3>
        </div>
        <p className="muted">
          {cvFile ? fmt(t.cv.yourFile, { name: cvFile.fileName }) : t.cv.none}
        </p>
        {cvMessage && <p className="profile-cv-message">{cvMessage}</p>}
        <div className="profile-card-actions">
          <Link className="btn btn-primary btn-sm" to="/profile/cv">
            {t.cv.update}
          </Link>
          <label className="btn btn-ghost btn-sm">
            {uploading ? t.cv.uploading : cvFile ? t.cv.replace : t.cv.upload}
            <input type="file" accept=".pdf,.doc,.docx,.odt,.rtf,.txt" hidden onChange={handleUploadCv} />
          </label>
          {cvFile && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleDownloadCv}>
              {t.cv.download}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
