import type { ExhibitionSummary } from '../../types/exhibition';

interface Props {
  exhibitions: ExhibitionSummary[];
  loading: boolean;
  error: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start && !end) return '—';
  if (start && end) return `${start} → ${end}`;
  return start ?? end ?? '—';
}

export default function ExhibitionList({
  exhibitions,
  loading,
  error,
  onSelect,
  onCreate,
  onDelete,
}: Props) {
  return (
    <div className="exhibition-list">
      <div className="list-header">
        <h2>Exhibitions</h2>
        <button type="button" onClick={onCreate}>
          + New exhibition
        </button>
      </div>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && exhibitions.length === 0 && (
        <p className="muted">No exhibitions yet. Create your first one.</p>
      )}

      {exhibitions.length > 0 && (
        <table className="list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Dates</th>
              <th>Curator</th>
              <th>Location</th>
              <th>Media</th>
              <th aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {exhibitions.map((e) => (
              <tr key={e.id}>
                <td>
                  <button type="button" className="link" onClick={() => onSelect(e.id)}>
                    {e.name}
                  </button>
                </td>
                <td>{formatDateRange(e.startDate, e.endDate)}</td>
                <td>{e.curator ?? '—'}</td>
                <td>{e.location ?? '—'}</td>
                <td>{e.mediaCount}</td>
                <td>
                  <button
                    type="button"
                    className="link-danger"
                    onClick={() => onDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
