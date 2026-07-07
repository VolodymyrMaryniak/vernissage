import { useNavigate, useParams } from 'react-router-dom';
import ExhibitionDetailView from './ExhibitionDetail';
import { useExhibition } from './useExhibition';

export default function ExhibitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exhibition, loading, error, reload } = useExhibition(id);

  if (loading || !exhibition) {
    return <p className="muted state-message">{error ?? 'Loading…'}</p>;
  }

  return (
    <ExhibitionDetailView
      exhibition={exhibition}
      onBack={() => navigate('/')}
      onEdit={() => navigate(`/exhibitions/${exhibition.id}/edit`)}
      onMediaChanged={reload}
    />
  );
}
