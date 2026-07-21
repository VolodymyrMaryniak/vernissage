import type { ExhibitionMedia } from '../../types/exhibition';
import { MediaCategory } from '../../types/exhibition';
import { mediaDownloadUrl } from '../../api/exhibitionsApi';

/**
 * Editorial cover for an exhibition: the first artwork image, else the first
 * image of any kind. Null when the entry has no images — callers fall back to
 * a placeholder. Note that list summaries carry no media, so only pages that
 * loaded the full detail can show a cover.
 */
export function coverUrl(exhibitionId: string, media: ExhibitionMedia[]): string | null {
  const image =
    media.find((m) => m.category === MediaCategory.ArtworkImage) ??
    media.find((m) => m.contentType.startsWith('image/'));
  return image ? mediaDownloadUrl(exhibitionId, image.id) : null;
}
