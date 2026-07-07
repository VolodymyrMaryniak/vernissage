import { MEDIA_CATEGORY_LABELS, type ExhibitionMedia } from '../../types/exhibition';
import { mediaDownloadUrl } from '../../api/exhibitionsApi';

interface Props {
  exhibitionId: string;
  media: ExhibitionMedia[];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const isImage = (m: ExhibitionMedia) => m.contentType.startsWith('image/');
const isAudio = (m: ExhibitionMedia) => m.contentType.startsWith('audio/');

// Read-only presentation of an exhibition's media: images are shown inline as a
// gallery; everything else is listed with an individual download link (audio
// also gets an inline player). Uploading/removing lives on the edit page.
export default function MediaGallery({ exhibitionId, media }: Props) {
  const images = media.filter(isImage);
  const files = media.filter((m) => !isImage(m));

  return (
    <div className="media-gallery">
      <h3 className="view-section-title">
        Media &amp; documents
        {media.length > 0 && <span className="count-badge">{media.length}</span>}
      </h3>

      {media.length === 0 && <p className="muted media-empty">No media yet.</p>}

      {images.length > 0 && (
        <div className="gallery-grid">
          {images.map((m) => {
            const url = mediaDownloadUrl(exhibitionId, m.id);
            return (
              <figure className="gallery-item" key={m.id}>
                <a
                  className="gallery-thumb"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  title="Open full size"
                >
                  <img src={url} alt={m.caption ?? m.fileName} loading="lazy" />
                </a>
                <figcaption className="gallery-cap">
                  <span className="gallery-cat">{MEDIA_CATEGORY_LABELS[m.category]}</span>
                  {m.caption && <span className="gallery-caption-text">{m.caption}</span>}
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}

      {files.length > 0 && (
        <ul className="file-list">
          {files.map((m) => {
            const url = mediaDownloadUrl(exhibitionId, m.id);
            const audio = isAudio(m);
            return (
              <li className="file-item" key={m.id}>
                <span className="file-icon" aria-hidden="true">
                  {audio ? '♪' : '📄'}
                </span>
                <div className="file-body">
                  <span className="file-name">{m.fileName}</span>
                  <span className="file-sub">
                    <span className="media-cat-inline">{MEDIA_CATEGORY_LABELS[m.category]}</span>
                    {m.caption && <span> · {m.caption}</span>}
                    <span> · {formatSize(m.fileSize)}</span>
                  </span>
                  {audio && <audio className="file-audio" controls src={url} />}
                </div>
                <a
                  className="btn btn-ghost btn-sm file-download"
                  href={url}
                  download={m.fileName}
                >
                  Download
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
