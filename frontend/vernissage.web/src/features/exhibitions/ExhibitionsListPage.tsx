import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ExhibitionFilters, ExhibitionSummary } from '../../types/exhibition';
import { deleteExhibition, listExhibitions } from '../../api/exhibitionsApi';
import { useAuth } from '../auth/useAuth';
import ExhibitionList from './ExhibitionList';
import ExhibitionSearchBar from './ExhibitionSearchBar';

export default function ExhibitionsListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <>
      <ExhibitionSearchBar onSearch={setFilters} />
      <ExhibitionList
        exhibitions={summaries}
        loading={loading}
        error={error}
        filtered={hasFilters}
        currentUserId={user?.id ?? null}
        onSelect={(id) => navigate(`/exhibitions/${id}`)}
        onCreate={user ? () => navigate('/exhibitions/new') : null}
        onDelete={handleDelete}
      />
    </>
  );
}
