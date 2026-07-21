import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ExhibitionFilters, ExhibitionSummary } from '../../types/exhibition';
import { deleteExhibition, listExhibitions } from '../../api/exhibitionsApi';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { useAuth } from '../auth/useAuth';
import ExhibitionList from './ExhibitionList';
import ExhibitionSearchBar from './ExhibitionSearchBar';

const PAGE_SIZE = 20;

export default function ExhibitionsListPage() {
  const { user } = useAuth();
  useDocumentMeta({
    title: 'Archive',
    description:
      'Browse the Vernissage archive — documented exhibitions with catalogues, installation views and citable pages, open to researchers and students.',
  });

  const [summaries, setSummaries] = useState<ExhibitionSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExhibitionFilters>({});
  const [page, setPage] = useState(1);
  const hasFilters = Object.values(filters).some(Boolean);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listExhibitions({ ...filters, page, pageSize: PAGE_SIZE });
      setSummaries(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exhibitions');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  // A new search always starts from the first page of its results.
  const handleSearch = (next: ExhibitionFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this exhibition and all its media?')) return;
    try {
      await deleteExhibition(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete exhibition');
    }
  };

  return (
    <div className="container">
      <header className="archive-head">
        <p className="eyebrow">The archive</p>
        <h1 className="headline">
          Every documented show, <em>indexed</em>.
        </h1>
        <p className="lede">
          A working index of exhibitions — searchable by title, curator, city and date.
          {user ? '' : ' Browsing is open to everyone.'}
        </p>
        {user && (
          <div>
            <Link className="cta" to="/exhibitions/new">
              Document a show
            </Link>
          </div>
        )}
      </header>

      <ExhibitionSearchBar onSearch={handleSearch} showMine={user !== null} />

      <ExhibitionList
        exhibitions={summaries}
        loading={loading}
        error={error}
        filtered={hasFilters}
        currentUserId={user?.id ?? null}
        indexOffset={(page - 1) * PAGE_SIZE}
        onDelete={handleDelete}
      />

      {!loading && !error && total > PAGE_SIZE && (
        <nav className="pager" aria-label="Pagination">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Previous
          </button>
          <span className="pager-status mono-meta">
            Page {page} of {pageCount} · {total} entries
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}
