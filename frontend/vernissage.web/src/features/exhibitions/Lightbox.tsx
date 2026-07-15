import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MEDIA_CATEGORY_LABELS, type ExhibitionMedia } from '../../types/exhibition';
import { mediaDownloadUrl } from '../../api/exhibitionsApi';

interface Props {
  exhibitionId: string;
  images: ExhibitionMedia[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

// Full-screen modal preview for gallery images. Renders through a portal so the
// backdrop always covers the viewport regardless of where it's mounted, and
// supports keyboard navigation (Esc to close, ← / → to page between images).
export default function Lightbox({
  exhibitionId,
  images,
  index,
  onIndexChange,
  onClose,
}: Props) {
  const current = images[index];

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    document.addEventListener('keydown', onKey);
    // Prevent the page behind the overlay from scrolling.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, goPrev, goNext]);

  if (!current) return null;

  const url = mediaDownloadUrl(exhibitionId, current.id);
  const hasMultiple = images.length > 1;

  return createPortal(
    <div
      className="lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={current.caption ?? current.fileName}
      onClick={onClose}
    >
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close preview">
        ×
      </button>

      {hasMultiple && (
        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
        >
          ‹
        </button>
      )}

      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img className="lightbox-img" src={url} alt={current.caption ?? current.fileName} />
        <figcaption className="lightbox-cap">
          <span className="lightbox-cat">{MEDIA_CATEGORY_LABELS[current.category]}</span>
          {current.caption && <span className="lightbox-caption-text">{current.caption}</span>}
          <span className="lightbox-meta">
            <span className="lightbox-file">{current.fileName}</span>
            {hasMultiple && (
              <span className="lightbox-count">
                {index + 1} / {images.length}
              </span>
            )}
            <a className="btn btn-ghost btn-sm" href={url} download={current.fileName}>
              Download
            </a>
          </span>
        </figcaption>
      </figure>

      {hasMultiple && (
        <button
          type="button"
          className="lightbox-nav lightbox-next"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
        >
          ›
        </button>
      )}
    </div>,
    document.body,
  );
}
