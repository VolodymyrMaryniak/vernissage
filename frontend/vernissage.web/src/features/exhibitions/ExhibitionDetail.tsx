import type { ExhibitionDetail } from '../../types/exhibition';
import MediaManager from './MediaManager';

interface Props {
  exhibition: ExhibitionDetail;
  onBack: () => void;
  onEdit: () => void;
  onMediaChanged: () => void;
}

function formatDateRange(start: string | null, end: string | null): string | null {
  if (!start && !end) return null;
  if (start && end) return `${start} → ${end}`;
  return start ?? end;
}

const TEXT_FIELDS: { key: keyof ExhibitionDetail; label: string }[] = [
  { key: 'location', label: 'Location' },
  { key: 'curator', label: 'Curator' },
  { key: 'galleryLocation', label: 'Gallery / Location' },
  { key: 'explication', label: 'Explication' },
  { key: 'investigationMaterial', label: 'Investigation material' },
  { key: 'team', label: 'Team' },
  { key: 'artworksList', label: 'List of artworks' },
  { key: 'preOpeningDetails', label: 'Pre-opening details' },
  { key: 'openingDetails', label: 'Opening details' },
  { key: 'eventsDetails', label: 'Events within expo details' },
  { key: 'notes', label: 'Notes' },
  { key: 'referencedLiterature', label: 'Referenced literature & research' },
  { key: 'aim', label: 'Aim' },
];

export default function ExhibitionDetailView({
  exhibition,
  onBack,
  onEdit,
  onMediaChanged,
}: Props) {
  const dates = formatDateRange(exhibition.startDate, exhibition.endDate);

  return (
    <div className="exhibition-detail">
      <div className="detail-header">
        <button type="button" className="secondary" onClick={onBack}>
          ← Back
        </button>
        <button type="button" onClick={onEdit}>
          Edit
        </button>
      </div>

      <h2>{exhibition.name}</h2>
      {dates && <p className="muted">{dates}</p>}

      <dl className="detail-fields">
        {TEXT_FIELDS.map(({ key, label }) => {
          const value = exhibition[key] as string | null;
          if (!value) return null;
          return (
            <div className="detail-field" key={key}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          );
        })}
      </dl>

      <MediaManager
        exhibitionId={exhibition.id}
        media={exhibition.media}
        onChanged={onMediaChanged}
      />
    </div>
  );
}
