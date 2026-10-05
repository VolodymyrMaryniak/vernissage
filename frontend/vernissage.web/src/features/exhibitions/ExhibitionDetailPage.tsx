import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExhibitionDetailView from './ExhibitionDetail';
import { useExhibition } from './useExhibition';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { useAuth } from '../auth/useAuth';
import MetricsSection from '../metrics/MetricsSection';
import { getMetrics } from '../../api/metricsApi';
import type { ExhibitionMetrics } from '../../types/metrics';
import ShowReel from '../reel/ShowReel';
import { isPlayable, reelFromExhibition } from '../reel/scenes';

export default function ExhibitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { exhibition, loading, error } = useExhibition(id);
  const isOwner = !!user && !!exhibition && exhibition.ownerId === user.id;

  // The owner's reel also plays the private numbers.
  const [metrics, setMetrics] = useState<ExhibitionMetrics | null>(null);
  useEffect(() => {
    if (!isOwner || !exhibition) return;
    let cancelled = false;
    getMetrics(exhibition.id)
      .then((m) => !cancelled && setMetrics(m))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [isOwner, exhibition]);

  const reel = useMemo(
    () => (exhibition ? reelFromExhibition(exhibition, isOwner ? metrics : null) : null),
    [exhibition, isOwner, metrics],
  );

  useDocumentMeta({
    title: exhibition?.name ?? 'Exhibition',
    description:
      exhibition?.explication ??
      exhibition?.aim ??
      'A documented exhibition on Vernissage.',
  });

  if (loading || !exhibition) {
    return (
      <div className="container">
        <p className="muted state-message">{error ?? 'Loading…'}</p>
      </div>
    );
  }

  return (
    <>
      <ExhibitionDetailView
        exhibition={exhibition}
        onBack={() => navigate(user ? '/exhibitions' : '/')}
        onEdit={isOwner ? () => navigate(`/exhibitions/${exhibition.id}/edit`) : null}
      />
      {reel && isPlayable(reel) && (
        <section className="container exhibition-reel" aria-labelledby="reel-heading">
          <p className="eyebrow" id="reel-heading">
            Show reel
          </p>
          <ShowReel
            data={reel}
            endLine={isOwner ? 'Your reel · the numbers are visible only to you' : undefined}
          />
        </section>
      )}
      {isOwner && (
        <div className="shell shell--narrow">
          <MetricsSection exhibitionId={exhibition.id} />
        </div>
      )}
    </>
  );
}
