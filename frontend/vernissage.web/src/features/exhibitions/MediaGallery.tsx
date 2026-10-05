import { useState } from 'react';
import type { ExhibitionMedia } from '../../types/exhibition';
import { useMessages } from '../../i18n/useI18n';
import { formatSize } from './formatSize';
import { mediaDownloadUrl } from '../../api/exhibitionsApi';
import Lightbox from './Lightbox';

interface Props {
  exhibitionId: string;
  media: ExhibitionMedia[];
}

const isImage = (m: ExhibitionMedia) => m.contentType.startsWith('image/');
const isAudio = (m: ExhibitionMedia) => m.contentType.startsWith('audio/');

// Read-only presentation of an exhibition's media: images are shown inline as a
// gallery; everything else is listed with an individual download link (audio
// also gets an inline player). Uploading/removing lives on the edit page.
export default function MediaGallery({ exhibitionId, media }: Props) {
  const t = useMessages().ex.media;
  const images = media.filter(isImage);
  const files = media.filter((m) => !isImage(m));
  // Index of the image shown in the lightbox, or null when it's closed.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="media-gallery">
      <h3 className="view-section-title">
        {t.title}
        {media.length > 0 && <span className="count-badge">{media.length}</span>}
      </h3>

      {media.length === 0 && <p className="muted media-empty">{t.empty}</p>}

      {images.length > 0 && (
        <div className="gallery-grid">
          {images.map((m, i) => {
            const url = mediaDownloadUrl(exhibitionId, m.id);
            return (
              <figure className="gallery-item" key={m.id}>
                <button
                  type="button"
                  className="gallery-thumb"
                  onClick={() => setLightboxIndex(i)}
                  title={t.openPreview}
                >
                  <img src={url} alt={m.caption ?? m.fileName} loading="lazy" />
                </button>
                <figcaption className="gallery-cap">
                  <span className="gallery-cat">{t.category[m.category]}</span>
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
                    <span className="media-cat-inline">{t.category[m.category]}</span>
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
                  {t.download}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          exhibitionId={exhibitionId}
          images={images}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
