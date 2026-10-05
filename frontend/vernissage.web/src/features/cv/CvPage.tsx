import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { deleteCvFile, downloadCvFile, getCv, saveCv, uploadCvFile } from '../../api/cvApi';
import { listAllMyExhibitions } from '../../api/exhibitionsApi';
import { getProfile, uploadProfilePhoto } from '../../api/profileApi';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { CV_EXHIBITION_KINDS, CV_FONTS, CV_PAGE_SIZES, CV_TEMPLATES } from '../../types/cv';
import type { Cv, CvDocument, CvExhibitionKind, CvSection } from '../../types/cv';
import type { ExhibitionSummary } from '../../types/exhibition';
import type { Profile } from '../../types/profile';
import { validatePhoto } from '../profile/photo';
import { useProfilePhoto } from '../profile/useProfilePhoto';
import CvPreview from './CvPreview';
import { saveBlob, squareJpeg } from './download';
import { CV_FONT_SPECS } from './fonts';
import { buildCvModel, cvFileBase, exhibitionYears, KIND_HEADINGS, suggestedHeadline } from './model';
import { TEMPLATE_LABELS } from './theme';

const KIND_LABELS: Record<CvExhibitionKind, string> = {
  solo: 'Solo',
  group: 'Group',
  curated: 'Curated by me',
};

const SECTION_HINTS: Record<string, string> = {
  statement: 'A few sentences about your practice. Leave a blank line between paragraphs.',
  education: 'One per line, e.g. "2019–2021 — MA Fine Art, Kyiv Academy of Arts"',
  otherExhibitions: 'Shows not documented on Vernissage, one per line, e.g. "2018 — Spring Salon, Lviv"',
  awards: 'One per line, e.g. "2023 — Residency, Cité internationale des arts, Paris"',
  collections: 'One per line, e.g. "National Art Museum of Ukraine, Kyiv"',
  publications: 'One per line, e.g. "2024 — Interview, Art Ukraine magazine"',
};

const ACCEPTED_CV_FILES = '.pdf,.doc,.docx,.odt,.rtf,.txt';

/** The kind a newly added exhibition starts as: curators curate, artists show. */
function defaultKind(profile: Profile): CvExhibitionKind {
  return profile.roles.includes('Curator') && !profile.roles.includes('Artist') ? 'curated' : 'group';
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * The CV builder: keep your own CV file, and generate a designed CV from your
 * profile and documented exhibitions, downloadable as PDF or Word.
 */
export default function CvPage() {
  useDocumentMeta({ title: 'CV' });

  const [profile, setProfile] = useState<Profile | null>(null);
  const [cv, setCv] = useState<Cv | null>(null);
  const [doc, setDoc] = useState<CvDocument | null>(null);
  const [exhibitions, setExhibitions] = useState<ExhibitionSummary[]>([]);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photoVersion, setPhotoVersion] = useState(0);
  const photoUrl = useProfilePhoto(profile?.hasPhoto ?? false, photoVersion);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([getProfile(), getCv(), listAllMyExhibitions()])
      .then(([p, c, list]) => {
        if (cancelled) return;
        setProfile(p);
        setCv(c);
        setExhibitions(list);
        // A CV that has never been saved starts with every show and a suggested headline.
        setDoc(
          c.updatedAtUtc
            ? c.document
            : {
                ...c.document,
                headline: c.document.headline ?? (suggestedHeadline(p) || null),
                exhibitions: list.map((e) => ({ exhibitionId: e.id, kind: defaultKind(p) })),
              },
        );
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load your CV');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const model = useMemo(
    () => (profile && doc ? buildCvModel(profile, doc, exhibitions) : null),
    [profile, doc, exhibitions],
  );

  if (!profile || !cv || !doc || !model) {
    return <p className="muted state-message">{error ?? 'Loading…'}</p>;
  }

  const selected = new Map(doc.exhibitions.map((e) => [e.exhibitionId, e.kind]));
  const baseline = cv.generatedAtUtc;
  const isNew = (e: ExhibitionSummary) => baseline !== null && e.createdAtUtc > baseline;
  const previewPhoto = doc.includePhoto ? photoUrl : null;

  const edit = (patch: Partial<CvDocument>) => {
    setDoc((d) => (d ? { ...d, ...patch } : d));
    setDirty(true);
    setNotice(null);
  };

  const editSection = (key: string, patch: Partial<CvSection>) =>
    edit({ sections: doc.sections.map((s) => (s.key === key ? { ...s, ...patch } : s)) });

  const moveSection = (index: number, delta: number) => {
    const next = [...doc.sections];
    const [moved] = next.splice(index, 1);
    next.splice(index + delta, 0, moved);
    edit({ sections: next });
  };

  const toggleExhibition = (id: string) =>
    edit({
      exhibitions: selected.has(id)
        ? doc.exhibitions.filter((e) => e.exhibitionId !== id)
        : [...doc.exhibitions, { exhibitionId: id, kind: defaultKind(profile) }],
    });

  const setKind = (id: string, kind: CvExhibitionKind) =>
    edit({ exhibitions: doc.exhibitions.map((e) => (e.exhibitionId === id ? { ...e, kind } : e)) });

  /** Runs an async action with a busy label and error reporting. */
  const run = async (label: string, action: () => Promise<void>) => {
    setBusy(label);
    setError(null);
    setNotice(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(null);
    }
  };

  const handleSave = () =>
    run('save', async () => {
      const saved = await saveCv(doc);
      setCv(saved);
      setDoc(saved.document);
      setDirty(false);
      setNotice('CV saved.');
    });

  // "Update the CV": pull in exhibitions documented since the last update and
  // the latest profile details, then save.
  const handleUpdate = () =>
    run('update', async () => {
      const [fresh, latestProfile] = await Promise.all([listAllMyExhibitions(), getProfile()]);
      const since = cv.generatedAtUtc ?? cv.updatedAtUtc;
      const added = fresh.filter((e) => !selected.has(e.id) && (since === null || e.createdAtUtc > since));
      const next: CvDocument = {
        ...doc,
        exhibitions: [
          ...doc.exhibitions,
          ...added.map((e) => ({ exhibitionId: e.id, kind: defaultKind(latestProfile) })),
        ],
      };
      const saved = await saveCv(next, true);
      setExhibitions(fresh);
      setProfile(latestProfile);
      setPhotoVersion((v) => v + 1);
      setCv(saved);
      setDoc(saved.document);
      setDirty(false);
      setNotice(
        added.length > 0
          ? `CV updated: added ${added.length} new exhibition${added.length === 1 ? '' : 's'}.`
          : 'CV updated. No new exhibitions since the last update.',
      );
    });

  const photoForExport = async () => (previewPhoto ? squareJpeg(previewPhoto) : null);

  const handlePdf = () =>
    run('pdf', async () => {
      const [{ renderCvPdf }, photo] = await Promise.all([import('./cvPdf'), photoForExport()]);
      saveBlob(await renderCvPdf(model, photo?.dataUrl ?? null), `${cvFileBase(model)}.pdf`);
    });

  const handleDocx = () =>
    run('docx', async () => {
      const [{ renderCvDocx }, photo] = await Promise.all([import('./cvDocx'), photoForExport()]);
      saveBlob(await renderCvDocx(model, photo?.bytes ?? null), `${cvFileBase(model)}.docx`);
    });

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const invalid = validatePhoto(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    void run('photo', async () => {
      setProfile(await uploadProfilePhoto(file));
      setPhotoVersion((v) => v + 1);
    });
  };

  const handleUploadCv = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('The CV file must be 10 MB or smaller.');
      return;
    }
    void run('upload', async () => {
      const updated = await uploadCvFile(file);
      setCv((c) => (c ? { ...c, uploadedFile: updated.uploadedFile } : updated));
      setNotice(`Uploaded ${file.name}.`);
    });
  };

  const handleDownloadOwn = () =>
    run('download', async () => {
      saveBlob(await downloadCvFile(), cv.uploadedFile?.fileName ?? 'CV');
    });

  const handleRemoveOwn = () => {
    if (!window.confirm('Remove your uploaded CV file?')) return;
    void run('remove', async () => {
      await deleteCvFile();
      setCv((c) => (c ? { ...c, uploadedFile: null } : c));
    });
  };

  const addSection = () =>
    edit({
      sections: [
        ...doc.sections,
        { key: `custom-${Date.now()}`, title: 'New section', include: true, text: '' },
      ],
    });

  return (
    <div className="container cv-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Account</p>
          <h2>Your CV</h2>
          <p className="page-sub">
            {cv.generatedAtUtc
              ? `Last updated ${formatDate(cv.generatedAtUtc)}.`
              : 'Built from your profile and your documented exhibitions.'}
          </p>
        </div>
        <nav className="workspace-links">
          <Link className="btn btn-ghost btn-sm" to="/profile">
            ← Back to profile
          </Link>
        </nav>
      </header>

      {error && <p className="banner banner-error">{error}</p>}
      {notice && <p className="banner banner-success">{notice}</p>}

      <div className="cv-toolbar card">
        <div className="cv-toolbar-main">
          <button type="button" className="btn btn-primary" onClick={handleUpdate} disabled={busy !== null}>
            {busy === 'update' ? 'Updating…' : 'Update the CV'}
          </button>
          <span className="muted cv-toolbar-hint">Adds newly documented exhibitions and your latest profile details.</span>
        </div>
        <div className="cv-toolbar-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleSave} disabled={busy !== null || !dirty}>
            {busy === 'save' ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handlePdf} disabled={busy !== null}>
            {busy === 'pdf' ? 'Preparing PDF…' : 'Download PDF'}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleDocx} disabled={busy !== null}>
            {busy === 'docx' ? 'Preparing Word…' : 'Download Word'}
          </button>
        </div>
      </div>

      <div className="cv-builder">
        <div className="cv-controls">
          {/* ---- Uploaded CV file ------------------------------------ */}
          <section className="card form-section">
            <div className="section-head">
              <h3 className="view-section-title">Your CV file</h3>
            </div>
            {cv.uploadedFile ? (
              <div className="cv-file-row">
                <div>
                  <p className="cv-file-name">{cv.uploadedFile.fileName}</p>
                  <p className="muted cv-file-meta">
                    {formatSize(cv.uploadedFile.fileSize)} · uploaded {formatDate(cv.uploadedFile.uploadedAtUtc)}
                  </p>
                </div>
                <div className="cv-file-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={handleDownloadOwn} disabled={busy !== null}>
                    Download
                  </button>
                  <label className="btn btn-ghost btn-sm">
                    Replace
                    <input type="file" accept={ACCEPTED_CV_FILES} hidden onChange={handleUploadCv} />
                  </label>
                  <button type="button" className="btn btn-danger-ghost btn-sm" onClick={handleRemoveOwn} disabled={busy !== null}>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="cv-file-row">
                <p className="muted">Keep the CV you already have here: PDF, Word, ODT, RTF or text, up to 10 MB.</p>
                <label className="btn btn-ghost btn-sm">
                  {busy === 'upload' ? 'Uploading…' : 'Upload CV'}
                  <input type="file" accept={ACCEPTED_CV_FILES} hidden onChange={handleUploadCv} />
                </label>
              </div>
            )}
          </section>

          {/* ---- Design --------------------------------------------- */}
          <section className="card form-section">
            <div className="section-head">
              <h3 className="view-section-title">Design</h3>
            </div>
            <fieldset className="cv-choice-group">
              <legend className="field-label">Layout</legend>
              <div className="cv-choices cv-choices--3">
                {CV_TEMPLATES.map((key) => (
                  <label key={key} className={`cv-choice${doc.template === key ? ' is-selected' : ''}`}>
                    <input type="radio" name="cv-template" checked={doc.template === key} onChange={() => edit({ template: key })} />
                    <span className={`cv-thumb cv-thumb--${key}`} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                    <span className="cv-choice-label">{TEMPLATE_LABELS[key].label}</span>
                    <span className="cv-choice-blurb">{TEMPLATE_LABELS[key].blurb}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="cv-choice-group">
              <legend className="field-label">Typeface</legend>
              <div className="cv-choices cv-choices--4">
                {CV_FONTS.map((key) => (
                  <label key={key} className={`cv-choice cv-choice--font${doc.font === key ? ' is-selected' : ''}`}>
                    <input type="radio" name="cv-font" checked={doc.font === key} onChange={() => edit({ font: key })} />
                    <span className="cv-font-sample" style={{ fontFamily: `'${CV_FONT_SPECS[key].family}'` }}>
                      Aa
                    </span>
                    <span className="cv-choice-label">{CV_FONT_SPECS[key].label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="cv-choice-group">
              <legend className="field-label">Paper</legend>
              <div className="cv-segmented">
                {CV_PAGE_SIZES.map((size) => (
                  <label key={size} className={doc.pageSize === size ? 'is-selected' : undefined}>
                    <input type="radio" name="cv-page" checked={doc.pageSize === size} onChange={() => edit({ pageSize: size })} />
                    {size === 'A4' ? 'A4' : 'US Letter'}
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          {/* ---- About you ------------------------------------------ */}
          <section className="card form-section">
            <div className="section-head">
              <h3 className="view-section-title">About you</h3>
              <Link className="link-quiet" to="/profile/edit">
                Edit profile details
              </Link>
            </div>
            <label className="field">
              <span className="field-label">Headline</span>
              <input
                type="text"
                maxLength={300}
                placeholder={suggestedHeadline(profile) || 'e.g. Visual artist, based in Kyiv'}
                value={doc.headline ?? ''}
                onChange={(e) => edit({ headline: e.target.value || null })}
              />
            </label>
            <div className="cv-toggles">
              <label className="checkbox-row">
                <input type="checkbox" checked={doc.includePhoto} onChange={(e) => edit({ includePhoto: e.target.checked })} />
                <span>Photo</span>
              </label>
              <label className="btn btn-ghost btn-sm">
                {busy === 'photo' ? 'Uploading…' : profile.hasPhoto ? 'Change photo' : 'Add photo'}
                <input type="file" accept="image/*" hidden onChange={handlePhoto} />
              </label>
              <label className="checkbox-row">
                <input type="checkbox" checked={doc.includeContact} onChange={(e) => edit({ includeContact: e.target.checked })} />
                <span>Contact details (email, location, social)</span>
              </label>
            </div>
          </section>

          {/* ---- Exhibitions ---------------------------------------- */}
          <section className="card form-section">
            <div className="section-head">
              <h3 className="view-section-title">Exhibitions</h3>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={doc.includeExhibitions}
                  onChange={(e) => edit({ includeExhibitions: e.target.checked })}
                />
                <span>Include</span>
              </label>
            </div>
            {exhibitions.length === 0 ? (
              <p className="muted">
                No documented exhibitions yet. <Link to="/exhibitions/new">Document a show</Link> and it can go on your CV.
              </p>
            ) : (
              <>
                <div className="cv-exh-bulk">
                  <span className="muted">
                    {doc.exhibitions.length} of {exhibitions.length} on the CV
                  </span>
                  <button
                    type="button"
                    className="link-quiet"
                    onClick={() =>
                      edit({
                        exhibitions: exhibitions.map((e) => ({
                          exhibitionId: e.id,
                          kind: selected.get(e.id) ?? defaultKind(profile),
                        })),
                      })
                    }
                  >
                    Select all
                  </button>
                  <button type="button" className="link-quiet" onClick={() => edit({ exhibitions: [] })}>
                    Clear
                  </button>
                </div>
                <ul className={`cv-exh-list${doc.includeExhibitions ? '' : ' is-off'}`}>
                  {exhibitions.map((e) => {
                    const kind = selected.get(e.id);
                    const place = [e.galleryLocation, e.location].filter(Boolean).join(', ');
                    return (
                      <li key={e.id} className={kind ? 'is-selected' : undefined}>
                        <label className="cv-exh-check">
                          <input type="checkbox" checked={kind !== undefined} onChange={() => toggleExhibition(e.id)} />
                          <span>
                            <span className="cv-exh-name">
                              {e.name}
                              {isNew(e) && <span className="cv-new">New</span>}
                            </span>
                            <span className="cv-exh-meta">{[exhibitionYears(e), place].filter(Boolean).join(' · ')}</span>
                          </span>
                        </label>
                        {kind && (
                          <select
                            aria-label={`Heading for ${e.name}`}
                            value={kind}
                            onChange={(ev) => setKind(e.id, ev.target.value as CvExhibitionKind)}
                          >
                            {CV_EXHIBITION_KINDS.map((k) => (
                              <option key={k} value={k} title={KIND_HEADINGS[k]}>
                                {KIND_LABELS[k]}
                              </option>
                            ))}
                          </select>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </section>

          {/* ---- Free-text sections --------------------------------- */}
          <section className="card form-section">
            <div className="section-head">
              <h3 className="view-section-title">Sections</h3>
              <button type="button" className="link-quiet" onClick={addSection}>
                + Add section
              </button>
            </div>
            <div className="cv-sections">
              {doc.sections.map((section, index) => (
                <div key={section.key} className={`cv-section-edit${section.include ? '' : ' is-off'}`}>
                  <div className="cv-section-edit-head">
                    <input
                      type="checkbox"
                      aria-label={`Include ${section.title}`}
                      checked={section.include}
                      onChange={(e) => editSection(section.key, { include: e.target.checked })}
                    />
                    <input
                      type="text"
                      className="cv-section-title-input"
                      aria-label="Section title"
                      maxLength={120}
                      value={section.title}
                      onChange={(e) => editSection(section.key, { title: e.target.value })}
                    />
                    <span className="cv-section-order">
                      <button type="button" className="link-quiet" aria-label={`Move ${section.title} up`} disabled={index === 0} onClick={() => moveSection(index, -1)}>
                        ↑
                      </button>
                      <button
                        type="button"
                        className="link-quiet"
                        aria-label={`Move ${section.title} down`}
                        disabled={index === doc.sections.length - 1}
                        onClick={() => moveSection(index, 1)}
                      >
                        ↓
                      </button>
                      {section.key.startsWith('custom-') && (
                        <button
                          type="button"
                          className="link-quiet"
                          aria-label={`Remove ${section.title}`}
                          onClick={() => edit({ sections: doc.sections.filter((s) => s.key !== section.key) })}
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  </div>
                  <textarea
                    rows={section.key === 'statement' ? 4 : 3}
                    maxLength={20000}
                    placeholder={SECTION_HINTS[section.key] ?? 'One entry per line. Start a line with a year to put it in the year column.'}
                    value={section.text ?? ''}
                    onChange={(e) => editSection(section.key, { text: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ---- Live preview ------------------------------------------- */}
        <div className="cv-preview-col">
          <p className="eyebrow cv-preview-label">Preview</p>
          <CvPreview model={model} photoUrl={previewPhoto} />
        </div>
      </div>
    </div>
  );
}
