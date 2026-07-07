import { useCallback, useEffect, useState } from 'react';
import type { ExhibitionDetail } from '../../types/exhibition';
import { getExhibition } from '../../api/exhibitionsApi';

interface UseExhibitionResult {
  exhibition: ExhibitionDetail | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

// Loads a single exhibition by id and exposes a `reload` for refreshing after
// mutations (e.g. media uploads). Shared by the detail and edit routes.
export function useExhibition(id: string | undefined): UseExhibitionResult {
  const [exhibition, setExhibition] = useState<ExhibitionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      setExhibition(await getExhibition(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exhibition');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);

  return { exhibition, loading, error, reload };
}
