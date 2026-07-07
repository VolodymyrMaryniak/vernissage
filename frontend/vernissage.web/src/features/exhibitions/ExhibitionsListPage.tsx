import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ExhibitionSummary } from '../../types/exhibition';
import { deleteExhibition, listExhibitions } from '../../api/exhibitionsApi';
import ExhibitionList from './ExhibitionList';

export default function ExhibitionsListPage() {
  const navigate = useNavigate();

  const [summaries, setSummaries] = useState<ExhibitionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSummaries(await listExhibitions());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exhibitions');
    } finally {
      setLoading(false);
    }
  }, []);

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
    <ExhibitionList
      exhibitions={summaries}
      loading={loading}
      error={error}
      onSelect={(id) => navigate(`/exhibitions/${id}`)}
      onCreate={() => navigate('/exhibitions/new')}
      onDelete={handleDelete}
    />
  );
}
