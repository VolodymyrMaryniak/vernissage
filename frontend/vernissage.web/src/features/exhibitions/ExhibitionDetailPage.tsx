import { useNavigate, useParams } from 'react-router-dom';
import ExhibitionDetailView from './ExhibitionDetail';
import { useExhibition } from './useExhibition';
import { useAuth } from '../auth/useAuth';

export default function ExhibitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { exhibition, loading, error } = useExhibition(id);

  if (loading || !exhibition) {
    return <p className="muted state-message">{error ?? 'Loading…'}</p>;
  }

  const isOwner = user !== null && exhibition.ownerId === user.id;

  return (
    <ExhibitionDetailView
      exhibition={exhibition}
      onBack={() => navigate('/')}
      onEdit={isOwner ? () => navigate(`/exhibitions/${exhibition.id}/edit`) : null}
    />
  );
}
