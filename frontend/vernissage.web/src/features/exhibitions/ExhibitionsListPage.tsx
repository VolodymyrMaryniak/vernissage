import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ExhibitionFilters, ExhibitionSummary } from '../../types/exhibition';
import { deleteExhibition, listExhibitions } from '../../api/exhibitionsApi';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { useAuth } from '../auth/useAuth';
import ExhibitionList from './ExhibitionList';
import ExhibitionSearchBar from './ExhibitionSearchBar';

export default function ExhibitionsListPage() {
  const { user } = useAuth();
  useDocumentMeta({
    title: 'Archive',
    description:
      'Browse the Vernissage archive — documented exhibitions with catalogues, installation views and citable pages, open to researchers and students.',
  });

  const [summaries, setSummaries] = useState<ExhibitionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExhibitionFilters>({});
  const hasFilters = Object.values(filters).some(Boolean);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSummaries(await listExhibitions(filters));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exhibitions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

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

      <ExhibitionSearchBar onSearch={setFilters} />

      <ExhibitionList
        exhibitions={summaries}
        loading={loading}
        error={error}
        filtered={hasFilters}
        currentUserId={user?.id ?? null}
        onDelete={handleDelete}
      />
    </div>
  );
}
