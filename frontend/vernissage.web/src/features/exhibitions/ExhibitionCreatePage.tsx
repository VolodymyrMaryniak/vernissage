import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ExhibitionWrite } from '../../types/exhibition';
import { createExhibition } from '../../api/exhibitionsApi';
import ExhibitionForm from './ExhibitionForm';
import { useAuth } from '../auth/useAuth';
import { useAppConfig } from '../config/useAppConfig';
import { useMessages } from '../../i18n/useI18n';

export default function ExhibitionCreatePage() {
  const { user } = useAuth();
  const { assistantEnabled } = useAppConfig();
  const navigate = useNavigate();
  const m = useMessages();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (payload: ExhibitionWrite) => {
    setSubmitting(true);
    setError(null);
    try {
      const created = await createExhibition(payload);
      navigate(`/exhibitions/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : m.ex.form.createFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ExhibitionForm
      accountRoles={user?.roles}
      assistantEnabled={assistantEnabled}
      submitting={submitting}
      error={error}
      onSubmit={handleCreate}
      onCancel={() => navigate('/')}
    />
  );
}
