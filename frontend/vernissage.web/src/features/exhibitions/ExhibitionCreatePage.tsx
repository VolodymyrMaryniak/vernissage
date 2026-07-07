import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ExhibitionWrite } from '../../types/exhibition';
import { createExhibition } from '../../api/exhibitionsApi';
import ExhibitionForm from './ExhibitionForm';

export default function ExhibitionCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (payload: ExhibitionWrite) => {
    setSubmitting(true);
    setError(null);
    try {
      const created = await createExhibition(payload);
      navigate(`/exhibitions/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create exhibition');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ExhibitionForm
      submitting={submitting}
      error={error}
      onSubmit={handleCreate}
      onCancel={() => navigate('/')}
    />
  );
}
