import type { ExhibitionDetail } from '../../types/exhibition';
import { FIELD_SECTIONS } from './fields';
import { coverUrl } from './cover';
import MediaGallery from './MediaGallery';

interface Props {
  exhibition: ExhibitionDetail;
  onBack: () => void;
  /** Null hides the edit action (viewer is not the owner). */
  onEdit: (() => void) | null;
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

// Aside metadata blocks.
const ASIDE_FIELDS: { key: keyof ExhibitionDetail; label: string }[] = [
  { key: 'curator', label: 'Curator' },
  { key: 'galleryLocation', label: 'Gallery / venue' },
  { key: 'location', label: 'City' },
  { key: 'focus', label: 'Focus / topic' },
];

export default function ExhibitionDetailView({ exhibition, onBack, onEdit }: Props) {
  const dates = formatDateRange(exhibition.startDate, exhibition.endDate);
  const cover = coverUrl(exhibition.id, exhibition.media);

  const metaStrip = [exhibition.galleryLocation, exhibition.location, dates].filter(
    Boolean,
  ) as string[];

  const aside = ASIDE_FIELDS.map(({ key, label }) => ({
    label,
    value: exhibition[key] as string | null,
  })).filter((m) => m.value);

  return (
    <article>
      {/* Editorial hero -------------------------------------------------- */}
      <header className="exhibition-hero">
        <div className="exhibition-cover">{cover && <img src={cover} alt={exhibition.name} />}</div>
        <div className="container exhibition-headings">
          <button type="button" className="link-quiet" onClick={onBack}>
            ← Back to the archive
          </button>
          <p className="eyebrow">Exhibition</p>
          {metaStrip.length > 0 && (
            <p className="mono-meta">
              {metaStrip.map((part, i) => (
                <span key={i} style={{ display: 'contents' }}>
                  {i > 0 && <span className="sep">·</span>}
                  <span>{part}</span>
                </span>
              ))}
            </p>
          )}
          <h1 className="title">{exhibition.name}</h1>
          {exhibition.curator && <p className="artist">{exhibition.curator}</p>}
        </div>
      </header>

      {/* Body + aside ---------------------------------------------------- */}
      <div className="container exhibition-cols">
        <div>
          {FIELD_SECTIONS.map((section) => {
            const populated = section.fields
              .map((f) => ({ label: f.label, value: exhibition[f.key] as string | null }))
              .filter((f) => f.value);
            if (populated.length === 0) return null;

            return (
              <section className="exhibition-body-section" key={section.id}>
                <p className="eyebrow">{section.title}</p>
                {populated.map((f) => (
                  <div className="detail-field" key={f.label} style={{ marginBottom: '1.25rem' }}>
                    <dt
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-mute)',
                        marginBottom: '4px',
                      }}
                    >
                      {f.label}
                    </dt>
                    <dd className="section-prose" style={{ margin: 0 }}>
                      {f.value}
                    </dd>
                  </div>
                ))}
              </section>
            );
          })}

          <section className="exhibition-body-section">
            <p className="eyebrow">Installation views &amp; media</p>
            <MediaGallery exhibitionId={exhibition.id} media={exhibition.media} />
          </section>

          <p className="mono-meta" style={{ marginTop: '32px' }}>
            <span>Created {formatTimestamp(exhibition.createdAtUtc)}</span>
            <span className="sep">·</span>
            <span>Updated {formatTimestamp(exhibition.updatedAtUtc)}</span>
          </p>
        </div>

        <aside className="exhibition-aside">
          {dates && (
            <div className="aside-block">
              <dt>Dates</dt>
              <dd>{dates}</dd>
            </div>
          )}
          {aside.map((m) => (
            <div className="aside-block" key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
          {onEdit && (
            <button type="button" className="cta" onClick={onEdit}>
              Edit this entry
            </button>
          )}
        </aside>
      </div>
    </article>
  );
}
