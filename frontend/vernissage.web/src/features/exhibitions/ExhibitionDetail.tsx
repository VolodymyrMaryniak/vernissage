import type { ExhibitionDetail } from '../../types/exhibition';
import { FIELD_SECTIONS } from './fields';
import MediaGallery from './MediaGallery';

interface Props {
  exhibition: ExhibitionDetail;
  onBack: () => void;
  onEdit: () => void;
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateRange(start: string | null, end: string | null): string | null {
  const s = formatDate(start);
  const e = formatDate(end);
  if (s && e) return `${s} – ${e}`;
  return s ?? e;
}

function formatTimestamp(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// "Basics" fields shown as a metadata grid at the top rather than as prose.
const META_FIELDS: { key: keyof ExhibitionDetail; label: string }[] = [
  { key: 'curator', label: 'Curator' },
  { key: 'location', label: 'Location' },
  { key: 'galleryLocation', label: 'Gallery / venue' },
];

export default function ExhibitionDetailView({ exhibition, onBack, onEdit }: Props) {
  const dates = formatDateRange(exhibition.startDate, exhibition.endDate);
  const meta = META_FIELDS.map(({ key, label }) => ({
    label,
    value: exhibition[key] as string | null,
  })).filter((m) => m.value);

  return (
    <article className="ex-view">
      <button type="button" className="btn btn-ghost btn-back" onClick={onBack}>
        ← All exhibitions
      </button>

      {/* Hero header --------------------------------------------------- */}
      <header className="view-hero card">
        <div className="view-hero-body">
          <p className="eyebrow">Exhibition</p>
          <h2>{exhibition.name}</h2>
          {dates && (
            <p className="view-dates">
              <span className="dot" aria-hidden="true" />
              {dates}
            </p>
          )}

          {meta.length > 0 && (
            <dl className="meta-grid">
              {meta.map((m) => (
                <div className="meta-item" key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="view-hero-actions">
          <button type="button" className="btn btn-primary" onClick={onEdit}>
            Edit
          </button>
        </div>
      </header>

      {/* Content sections ---------------------------------------------- */}
      {FIELD_SECTIONS.map((section) => {
        const populated = section.fields
          .map((f) => ({ label: f.label, value: exhibition[f.key] as string | null }))
          .filter((f) => f.value);
        if (populated.length === 0) return null;

        return (
          <section className="card view-section" key={section.id}>
            <h3 className="view-section-title">{section.title}</h3>
            <dl className="detail-fields">
              {populated.map((f) => (
                <div className="detail-field" key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}

      <section className="card view-section">
        <MediaGallery exhibitionId={exhibition.id} media={exhibition.media} />
      </section>

      <p className="view-footnote">
        Created {formatTimestamp(exhibition.createdAtUtc)} · Last updated{' '}
        {formatTimestamp(exhibition.updatedAtUtc)}
      </p>
    </article>
  );
}
