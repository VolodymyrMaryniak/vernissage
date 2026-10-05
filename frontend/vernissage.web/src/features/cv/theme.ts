import type { CvPageSize, CvTemplate } from '../../types/cv';

/**
 * Design values shared by the HTML preview, the PDF and the Word export, in
 * points, so the three renderers agree on proportions and colour.
 */
export interface CvTheme {
  accent: string;
  muted: string;
  sidebar: string | null;
  nameSize: number;
  headlineSize: number;
  bodySize: number;
  titleSize: number;
  yearWidth: number;
  margin: number;
  photoSize: number;
  /** Photo drawn as a circle (classic/modern) or a square (minimal). */
  roundPhoto: boolean;
}

export const CV_THEMES: Record<CvTemplate, CvTheme> = {
  classic: {
    accent: '#1a1715',
    muted: '#6b6460',
    sidebar: null,
    nameSize: 26,
    headlineSize: 11.5,
    bodySize: 10,
    titleSize: 9,
    yearWidth: 66,
    margin: 56,
    photoSize: 76,
    roundPhoto: true,
  },
  modern: {
    accent: '#7d1d32',
    muted: '#6b6460',
    sidebar: '#f4f1ec',
    nameSize: 22,
    headlineSize: 10.5,
    bodySize: 9.5,
    titleSize: 9.5,
    yearWidth: 60,
    margin: 40,
    photoSize: 104,
    roundPhoto: true,
  },
  minimal: {
    accent: '#7d1d32',
    muted: '#8a817b',
    sidebar: null,
    nameSize: 28,
    headlineSize: 11,
    bodySize: 9.5,
    titleSize: 8,
    yearWidth: 70,
    margin: 64,
    photoSize: 72,
    roundPhoto: false,
  },
};

/** Page dimensions in points. */
export const PAGE_POINTS: Record<CvPageSize, { width: number; height: number }> = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612, height: 792 },
};
