import { useNavigate, useParams } from 'react-router-dom';
import ExhibitionDetailView from './ExhibitionDetail';
import { useExhibition } from './useExhibition';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { useAuth } from '../auth/useAuth';
import MetricsSection from '../metrics/MetricsSection';

export default function ExhibitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { exhibition, loading, error } = useExhibition(id);

  useDocumentMeta({
    title: exhibition?.name ?? 'Exhibition',
    description:
      exhibition?.explication ??
      exhibition?.aim ??
      'A documented exhibition in the Vernissage archive.',
  });

  if (loading || !exhibition) {
    return (
      <div className="container">
        <p className="muted state-message">{error ?? 'Loading…'}</p>
      </div>
    );
  }

  const isOwner = user !== null && exhibition.ownerId === user.id;

  return (
    <>
      <ExhibitionDetailView
        exhibition={exhibition}
        onBack={() => navigate('/archive')}
        onEdit={isOwner ? () => navigate(`/exhibitions/${exhibition.id}/edit`) : null}
      />
      {isOwner && (
        <div className="shell shell--narrow">
          <MetricsSection exhibitionId={exhibition.id} />
        </div>
      )}
    </>
  );
}
