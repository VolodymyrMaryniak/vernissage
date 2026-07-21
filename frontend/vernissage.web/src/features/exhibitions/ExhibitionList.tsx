import { Link } from 'react-router-dom';
import type { ExhibitionSummary } from '../../types/exhibition';

interface Props {
  exhibitions: ExhibitionSummary[];
  loading: boolean;
  error: string | null;
  /** True when server-side filters are active (affects the empty state copy). */
  filtered: boolean;
  /** Id of the logged-in user; null when anonymous. Gates delete buttons. */
  currentUserId: string | null;
  /** Rows already shown on previous pages, so numbering continues. */
  indexOffset?: number;
  onDelete: (id: string) => void;
}

function formatYear(start: string | null, end: string | null): string | null {
  const source = start ?? end;
  if (!source) return null;
  const parsed = new Date(source);
  if (Number.isNaN(parsed.getTime())) return null;
  return String(parsed.getFullYear());
}

// A compact monogram from the exhibition name for the row thumbnail.
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
  indexOffset = 0,
  onDelete,
}: Props) {
  if (loading) {
    return <p className="archive-loading mono-meta">Loading entries…</p>;
  }

  if (error) {
    return <p className="banner banner-error">{error}</p>;
  }

  if (exhibitions.length === 0) {
    return (
      <p className="archive-empty">
        {filtered
          ? 'No exhibitions match your filters.'
          : 'No exhibitions have been documented yet.'}
      </p>
    );
  }

  return (
    <div className="index-list">
      {exhibitions.map((e, i) => {
        const year = formatYear(e.startDate, e.endDate);
        const metaParts = [year, e.location, e.focus].filter(Boolean) as string[];
        return (
          <div className="index-entry" key={e.id}>
            <Link className="index-row" to={`/exhibitions/${e.id}`}>
              <span className="index-row-index">
                {String(indexOffset + i + 1).padStart(2, '0')}
              </span>
              <span className="index-thumb" aria-hidden="true">
                {initials(e.name)}
              </span>
              <span className="index-row-main">
                <span className="index-row-title">
                  {e.name}
                  {e.curator && <span className="artist"> — {e.curator}</span>}
                </span>
              </span>
              {metaParts.length > 0 && (
                <span className="index-row-meta">
                  {metaParts.map((part, idx) => (
                    <span key={idx}>{part}</span>
                  ))}
                </span>
              )}
            </Link>
            {currentUserId !== null && e.ownerId === currentUserId && (
              <button
                type="button"
                className="btn btn-danger-ghost btn-sm index-delete"
                onClick={() => onDelete(e.id)}
              >
                Delete
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
