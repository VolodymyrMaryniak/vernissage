import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ExhibitionWrite } from '../../types/exhibition';
import { updateExhibition } from '../../api/exhibitionsApi';
import ExhibitionForm from './ExhibitionForm';
import { useExhibition } from './useExhibition';

export default function ExhibitionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exhibition, loading, error: loadError } = useExhibition(id);

  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (loading || !exhibition) {
    return <p className="muted state-message">{loadError ?? 'Loading…'}</p>;
  }

  const handleUpdate = async (payload: ExhibitionWrite) => {
    setSubmitting(true);
    setSaveError(null);
    try {
      await updateExhibition(exhibition.id, payload);
      navigate(`/exhibitions/${exhibition.id}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update exhibition');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ExhibitionForm
      initial={exhibition}
      submitting={submitting}
      error={saveError}
      onSubmit={handleUpdate}
      onCancel={() => navigate(`/exhibitions/${exhibition.id}`)}
    />
  );
}
