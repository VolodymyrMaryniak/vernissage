import type { ExhibitionSummary } from '../../types/exhibition';

interface Props {
  exhibitions: ExhibitionSummary[];
  loading: boolean;
  error: string | null;
  /** True when server-side filters are active (affects the empty state copy). */
  filtered: boolean;
  /** Id of the logged-in user; null when anonymous. Gates delete buttons. */
  currentUserId: string | null;
  onSelect: (id: string) => void;
  /** Null hides the create CTA (anonymous visitors browse read-only). */
  onCreate: (() => void) | null;
  onDelete: (id: string) => void;
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateRange(start: string | null, end: string | null): string {
  const s = formatDate(start);
  const e = formatDate(end);
  if (s && e) return `${s} – ${e}`;
  return s ?? e ?? 'Dates TBD';
}

// A compact monogram from the exhibition name for the card avatar.
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '—';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default function ExhibitionList({
  exhibitions,
  loading,
  error,
  filtered,
  currentUserId,
  onSelect,
  onCreate,
  onDelete,
}: Props) {
  return (
    <div className="ex-list">
      <header className="page-head">
        <div>
          <p className="eyebrow">Collection</p>
          <h2>Exhibitions</h2>
          <p className="page-sub">
            {exhibitions.length === 0
              ? 'Nothing here yet'
              : `${exhibitions.length} record${exhibitions.length === 1 ? '' : 's'}`}
          </p>
        </div>
        {onCreate && (
          <button type="button" className="btn btn-primary" onClick={onCreate}>
            + New exhibition
          </button>
        )}
      </header>

      {loading && (
        <div className="card-grid" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div className="card ex-card ex-card-skeleton" key={i} />
          ))}
        </div>
      )}
      {error && <p className="banner banner-error">{error}</p>}

      {!loading && !error && exhibitions.length === 0 && filtered && (
        <p className="muted no-results">No exhibitions match your filters.</p>
      )}

      {!loading && !error && exhibitions.length === 0 && !filtered && (
        <div className="empty-state card">
          <div className="empty-emoji" aria-hidden="true">🖼️</div>
          <p className="empty-title">No exhibitions yet.</p>
          <p className="muted">Start documenting shows, artworks and events in one place.</p>
          {onCreate && (
            <button type="button" className="btn btn-primary" onClick={onCreate}>
              + New exhibition
            </button>
          )}
        </div>
      )}

      {!loading && !error && exhibitions.length > 0 && (
        <div className="card-grid">
          {exhibitions.map((e) => (
            <article
              key={e.id}
              className="card ex-card"
              role="button"
              tabIndex={0}
              onClick={() => onSelect(e.id)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.preventDefault();
                  onSelect(e.id);
                }
              }}
            >
              <div className="ex-card-top">
                <span className="ex-avatar" aria-hidden="true">
                  {initials(e.name)}
                </span>
                {e.mediaCount > 0 && (
                  <span className="chip" title={`${e.mediaCount} media item(s)`}>
                    {e.mediaCount} media
                  </span>
                )}
              </div>

              <h3 className="ex-card-title">{e.name}</h3>
              <p className="ex-card-dates">{formatDateRange(e.startDate, e.endDate)}</p>

              <dl className="ex-card-meta">
                {e.curator && (
                  <div>
                    <dt>Curator</dt>
                    <dd>{e.curator}</dd>
                  </div>
                )}
                {e.location && (
                  <div>
                    <dt>Location</dt>
                    <dd>{e.location}</dd>
                  </div>
                )}
                {e.focus && (
                  <div>
                    <dt>Focus</dt>
                    <dd>{e.focus}</dd>
                  </div>
                )}
              </dl>

              <div className="ex-card-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onSelect(e.id);
                  }}
                >
                  View
                </button>
                {currentUserId !== null && e.ownerId === currentUserId && (
                  <button
                    type="button"
                    className="btn btn-danger-ghost btn-sm"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onDelete(e.id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
