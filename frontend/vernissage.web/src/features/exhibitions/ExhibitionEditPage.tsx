import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ExhibitionWrite } from '../../types/exhibition';
import { updateExhibition } from '../../api/exhibitionsApi';
import ExhibitionForm from './ExhibitionForm';
import MediaManager from './MediaManager';
import { useExhibition } from './useExhibition';

export default function ExhibitionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exhibition, error: loadError, reload } = useExhibition(id);

  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Gate on the data being absent (not on `loading`) so that a media
  // upload/delete — which reloads the exhibition — doesn't unmount the form
  // and discard the user's in-progress text edits.
  if (!exhibition) {
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
    <div className="ex-edit">
      <ExhibitionForm
        initial={exhibition}
        submitting={submitting}
        error={saveError}
        actionsSticky={false}
        onSubmit={handleUpdate}
        onCancel={() => navigate(`/exhibitions/${exhibition.id}`)}
      />

      <section className="card view-section">
        <MediaManager exhibitionId={exhibition.id} media={exhibition.media} onChanged={reload} />
      </section>
    </div>
  );
}
