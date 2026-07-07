import { useMemo, useState, type FormEvent } from 'react';
import type { ExhibitionDetail, ExhibitionWrite } from '../../types/exhibition';
import { FIELD_SECTIONS } from './fields';

interface Props {
  initial?: ExhibitionDetail;
  submitting: boolean;
  error: string | null;
  // When true (default) the action bar is pinned to the bottom of the viewport.
  // The edit page disables it so trailing content (media manager) can follow.
  actionsSticky?: boolean;
  onSubmit: (payload: ExhibitionWrite) => void;
  onCancel: () => void;
}

function emptyForm(initial?: ExhibitionDetail): ExhibitionWrite {
  return {
    name: initial?.name ?? '',
    startDate: initial?.startDate ?? null,
    endDate: initial?.endDate ?? null,
    location: initial?.location ?? null,
    curator: initial?.curator ?? null,
    galleryLocation: initial?.galleryLocation ?? null,
    explication: initial?.explication ?? null,
    investigationMaterial: initial?.investigationMaterial ?? null,
    team: initial?.team ?? null,
    artworksList: initial?.artworksList ?? null,
    preOpeningDetails: initial?.preOpeningDetails ?? null,
    openingDetails: initial?.openingDetails ?? null,
    eventsDetails: initial?.eventsDetails ?? null,
    notes: initial?.notes ?? null,
    referencedLiterature: initial?.referencedLiterature ?? null,
    aim: initial?.aim ?? null,
  };
}

// Count how many optional fields have been filled in, so the user gets a sense
// of how complete the record is.
function completeness(form: ExhibitionWrite): { filled: number; total: number } {
  const keys = Object.keys(form) as (keyof ExhibitionWrite)[];
  const optional = keys.filter((k) => k !== 'name');
  const filled = optional.filter((k) => {
    const v = form[k];
    return v !== null && v !== '';
  }).length;
  return { filled, total: optional.length };
}

export default function ExhibitionForm({
  initial,
  submitting,
  error,
  actionsSticky = true,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<ExhibitionWrite>(() => emptyForm(initial));

  const update = (key: keyof ExhibitionWrite, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value === '' ? null : value }));
  };

  const { filled, total } = useMemo(() => completeness(form), [form]);
  const nameEmpty = form.name.trim() === '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (nameEmpty) return;
    onSubmit({ ...form, name: form.name.trim() });
  };

  return (
    <form className="ex-form" onSubmit={handleSubmit}>
      <header className="page-head">
        <div>
          <p className="eyebrow">{initial ? 'Editing' : 'New record'}</p>
          <h2>{initial ? initial.name || 'Edit exhibition' : 'Create an exhibition'}</h2>
          <p className="page-sub">
            {filled} of {total} optional fields completed
          </p>
        </div>
      </header>

      {/* Basics --------------------------------------------------------- */}
      <section className="card form-section">
        <div className="section-head">
          <h3>Basics</h3>
          <p>The essentials that identify this exhibition.</p>
        </div>

        <label className="field">
          <span className="field-label">
            Name <span className="req">required</span>
          </span>
          <input
            type="text"
            required
            maxLength={300}
            placeholder="e.g. Light & Shadow: A Retrospective"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            autoFocus
          />
        </label>

        <div className="field-grid">
          <label className="field">
            <span className="field-label">Start date</span>
            <input
              type="date"
              value={form.startDate ?? ''}
              onChange={(e) => update('startDate', e.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">End date</span>
            <input
              type="date"
              value={form.endDate ?? ''}
              min={form.startDate ?? undefined}
              onChange={(e) => update('endDate', e.target.value)}
            />
          </label>
        </div>

        <div className="field-grid">
          <label className="field">
            <span className="field-label">Curator</span>
            <input
              type="text"
              maxLength={500}
              placeholder="Who curated the show?"
              value={form.curator ?? ''}
              onChange={(e) => update('curator', e.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">Location</span>
            <input
              type="text"
              maxLength={500}
              placeholder="City, country"
              value={form.location ?? ''}
              onChange={(e) => update('location', e.target.value)}
            />
          </label>
        </div>

        <label className="field">
          <span className="field-label">Gallery / venue</span>
          <input
            type="text"
            maxLength={500}
            placeholder="Where is it being held?"
            value={form.galleryLocation ?? ''}
            onChange={(e) => update('galleryLocation', e.target.value)}
          />
        </label>
      </section>

      {/* Grouped long-form sections ------------------------------------ */}
      {FIELD_SECTIONS.map((section) => (
        <section className="card form-section" key={section.id}>
          <div className="section-head">
            <h3>{section.title}</h3>
            <p>{section.description}</p>
          </div>

          {section.fields.map((f) => (
            <label className="field" key={f.key}>
              <span className="field-label">{f.label}</span>
              {f.multiline ? (
                <textarea
                  rows={4}
                  placeholder={f.placeholder}
                  value={(form[f.key] as string | null) ?? ''}
                  onChange={(e) => update(f.key, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  maxLength={500}
                  placeholder={f.placeholder}
                  value={(form[f.key] as string | null) ?? ''}
                  onChange={(e) => update(f.key, e.target.value)}
                />
              )}
            </label>
          ))}
        </section>
      ))}

      {error && <p className="banner banner-error">{error}</p>}

      <div className={actionsSticky ? 'form-actions' : 'form-actions form-actions--inline'}>
        <div className="form-actions-inner">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting || nameEmpty}>
            {submitting ? 'Saving…' : initial ? 'Save changes' : 'Create exhibition'}
          </button>
        </div>
      </div>
    </form>
  );
}
