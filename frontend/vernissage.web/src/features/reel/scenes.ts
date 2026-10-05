import type { ExhibitionDetail } from '../../types/exhibition';
import { MediaCategory } from '../../types/exhibition';
import type { ExhibitionMetrics } from '../../types/metrics';
import { mediaDownloadUrl } from '../../api/exhibitionsApi';

/**
 * Everything a show reel plays back. The reel is generated from this, never
 * authored: each scene appears only when the inventory has the data for it.
 */
export interface ReelData {
  title: string;
  dates?: string | null;
  venue?: string | null;
  byline?: string | null;
  photos: { src: string; caption?: string | null; tag?: string | null }[];
  works: { title: string; sold?: boolean }[];
  /** Private outcome numbers; pass only to the show's owner. */
  stats?: ReelStats | null;
}

export interface ReelStats {
  visitors?: number | null;
  sold?: number | null;
  revenue?: number | null;
  /** 1–10. */
  satisfaction?: number | null;
  costs?: { label: string; amount: number }[];
}

export type Scene =
  | { kind: 'title'; duration: number }
  | { kind: 'photo'; duration: number; photo: ReelData['photos'][number]; index: number }
  | { kind: 'works'; duration: number }
  | { kind: 'numbers'; duration: number }
  | { kind: 'costs'; duration: number }
  | { kind: 'end'; duration: number };

export const MAX_PHOTOS = 4;
export const MAX_WORKS = 6;

const hasValue = (n: number | null | undefined): n is number => typeof n === 'number';

export function hasNumbers(stats: ReelStats | null | undefined): stats is ReelStats {
  return (
    !!stats &&
    [stats.visitors, stats.sold, stats.revenue, stats.satisfaction].some(hasValue)
  );
}

/** The reel's running order, in seconds per scene. */
export function buildScenes(data: ReelData): Scene[] {
  const scenes: Scene[] = [{ kind: 'title', duration: 3.4 }];
  data.photos.slice(0, MAX_PHOTOS).forEach((photo, index) =>
    scenes.push({ kind: 'photo', duration: 3.2, photo, index }),
  );
  if (data.works.length > 0) scenes.push({ kind: 'works', duration: 4.2 });
  if (hasNumbers(data.stats)) scenes.push({ kind: 'numbers', duration: 4.6 });
  if (data.stats?.costs?.length) scenes.push({ kind: 'costs', duration: 4.2 });
  scenes.push({ kind: 'end', duration: 3 });
  return scenes;
}

export function totalDuration(scenes: Scene[]): number {
  return scenes.reduce((sum, s) => sum + s.duration, 0);
}

/** Which scene is on screen at `time`, and how far through it (0–1). */
export function sceneAt(scenes: Scene[], time: number): { index: number; progress: number } {
  let start = 0;
  for (let i = 0; i < scenes.length; i++) {
    const end = start + scenes[i].duration;
    if (time < end || i === scenes.length - 1) {
      return { index: i, progress: Math.min(1, Math.max(0, (time - start) / scenes[i].duration)) };
    }
    start = end;
  }
  return { index: 0, progress: 0 };
}

export function sceneStart(scenes: Scene[], index: number): number {
  return scenes.slice(0, index).reduce((sum, s) => sum + s.duration, 0);
}

/** One work per non-empty line of the free-text artworks list, bullets stripped. */
export function parseWorks(artworksList: string | null): string[] {
  if (!artworksList) return [];
  return artworksList
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*•·–]|\d+[.)])\s*/, '').trim())
    .filter(Boolean);
}

const PHOTO_TAGS: Partial<Record<MediaCategory, string>> = {
  [MediaCategory.ArtworkImage]: 'The works',
  [MediaCategory.ExpoDesignFull]: 'The room',
  [MediaCategory.ExpoDesignDetail]: 'The room',
  [MediaCategory.EventPhoto]: 'The program',
};

function formatDay(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * The reel for a documented exhibition: its images (installation views first),
 * its works list and, when given (owner only), its private metrics.
 */
export function reelFromExhibition(
  exhibition: ExhibitionDetail,
  metrics?: ExhibitionMetrics | null,
): ReelData {
  const order = [
    MediaCategory.ExpoDesignFull,
    MediaCategory.EventPhoto,
    MediaCategory.ArtworkImage,
    MediaCategory.ExpoDesignDetail,
  ];
  const images = exhibition.media
    .filter((m) => m.contentType.startsWith('image/') && order.includes(m.category as never))
    .sort((a, b) => order.indexOf(a.category as never) - order.indexOf(b.category as never));

  const start = formatDay(exhibition.startDate);
  const end = formatDay(exhibition.endDate);

  return {
    title: exhibition.name,
    dates: start && end ? `${start} – ${end}` : (start ?? end),
    venue: [exhibition.galleryLocation, exhibition.location].filter(Boolean).join(', ') || null,
    byline: exhibition.curator,
    photos: images.map((m) => ({
      src: mediaDownloadUrl(exhibition.id, m.id),
      caption: m.caption,
      tag: PHOTO_TAGS[m.category] ?? null,
    })),
    works: parseWorks(exhibition.artworksList).map((title) => ({ title })),
    stats: metrics
      ? {
          visitors: metrics.visitorsCount,
          sold: metrics.artworksSold,
          revenue: metrics.totalRevenue,
          satisfaction: metrics.satisfaction,
          costs: metrics.costItems.map((c) => ({ label: c.label, amount: c.amount })),
        }
      : null,
  };
}

/** Worth playing only when there is something beyond the title card. */
export function isPlayable(data: ReelData): boolean {
  return data.photos.length > 0 || data.works.length > 0 || hasNumbers(data.stats);
}
