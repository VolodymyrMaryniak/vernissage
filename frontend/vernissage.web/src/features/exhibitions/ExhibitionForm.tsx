import { useState, type FormEvent } from 'react';
import type { ExhibitionDetail, ExhibitionWrite } from '../../types/exhibition';

interface Props {
  initial?: ExhibitionDetail;
  submitting: boolean;
  error: string | null;
  onSubmit: (payload: ExhibitionWrite) => void;
  onCancel: () => void;
}

type TextField = {
  key: keyof ExhibitionWrite;
  label: string;
  multiline?: boolean;
};

// Long-form text areas (order roughly follows the exhibition brief).
const TEXT_FIELDS: TextField[] = [
  { key: 'location', label: 'Location' },
  { key: 'curator', label: 'Curator' },
  { key: 'galleryLocation', label: 'Gallery / Location' },
  { key: 'explication', label: 'Explication', multiline: true },
  { key: 'investigationMaterial', label: 'Investigation material', multiline: true },
  { key: 'team', label: 'Team', multiline: true },
  { key: 'artworksList', label: 'List of artworks', multiline: true },
  { key: 'preOpeningDetails', label: 'Pre-opening details', multiline: true },
  { key: 'openingDetails', label: 'Opening details', multiline: true },
  { key: 'eventsDetails', label: 'Events within expo details', multiline: true },
  { key: 'notes', label: 'Notes', multiline: true },
  { key: 'referencedLiterature', label: 'Referenced literature & research', multiline: true },
  { key: 'aim', label: 'Aim', multiline: true },
];

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

export default function ExhibitionForm({ initial, submitting, error, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<ExhibitionWrite>(() => emptyForm(initial));

  const update = (key: keyof ExhibitionWrite, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value === '' ? null : value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, name: form.name.trim() });
  };

  return (
    <form className="exhibition-form" onSubmit={handleSubmit}>
      <h2>{initial ? 'Edit exhibition' : 'New exhibition'}</h2>

      <label className="field">
        <span>Name *</span>
        <input
          type="text"
          required
          maxLength={300}
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Start date</span>
          <input
            type="date"
            value={form.startDate ?? ''}
            onChange={(e) => update('startDate', e.target.value)}
          />
        </label>
        <label className="field">
          <span>End date</span>
          <input
            type="date"
            value={form.endDate ?? ''}
            onChange={(e) => update('endDate', e.target.value)}
          />
        </label>
      </div>

      {TEXT_FIELDS.map((f) => (
        <label className="field" key={f.key}>
          <span>{f.label}</span>
          {f.multiline ? (
            <textarea
              rows={3}
              value={(form[f.key] as string | null) ?? ''}
              onChange={(e) => update(f.key, e.target.value)}
            />
          ) : (
            <input
              type="text"
              maxLength={500}
              value={(form[f.key] as string | null) ?? ''}
              onChange={(e) => update(f.key, e.target.value)}
            />
          )}
        </label>
      ))}

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={submitting || form.name.trim() === ''}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
