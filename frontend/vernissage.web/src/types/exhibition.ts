// Mirrors Vernissage.Api.Models.MediaCategory (numeric enum).
// Declared as a const object (+ union type) rather than a TS `enum` because
// the project compiles with `erasableSyntaxOnly`.
export const MediaCategory = {
  ArtworkImage: 0,
  ExpoDesignFull: 1,
  ExpoDesignDetail: 2,
  EventPhoto: 3,
  ExpositionDesignPlan: 4,
  LocationPlan: 5,
  Audio: 6,
  LightingPlan: 7,
  VrExcursion: 8,
} as const;

export type MediaCategory = (typeof MediaCategory)[keyof typeof MediaCategory];

export const MEDIA_CATEGORY_LABELS: Record<MediaCategory, string> = {
  [MediaCategory.ArtworkImage]: 'Artwork image',
  [MediaCategory.ExpoDesignFull]: 'Expo design (full)',
  [MediaCategory.ExpoDesignDetail]: 'Expo design (detail)',
  [MediaCategory.EventPhoto]: 'Event photo',
  [MediaCategory.ExpositionDesignPlan]: 'Exposition design plan',
  [MediaCategory.LocationPlan]: 'Location plan',
  [MediaCategory.Audio]: 'Audio',
  [MediaCategory.LightingPlan]: 'Lighting plan',
  [MediaCategory.VrExcursion]: 'VR excursion',
};

export interface ExhibitionMedia {
  id: string;
  category: MediaCategory;
  fileName: string;
  contentType: string;
  fileSize: number;
  caption: string | null;
  createdAtUtc: string;
}

export interface ExhibitionSummary {
  id: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  curator: string | null;
  mediaCount: number;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface ExhibitionDetail {
  id: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  curator: string | null;
  galleryLocation: string | null;
  explication: string | null;
  investigationMaterial: string | null;
  team: string | null;
  artworksList: string | null;
  preOpeningDetails: string | null;
  openingDetails: string | null;
  eventsDetails: string | null;
  notes: string | null;
  referencedLiterature: string | null;
  aim: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
  media: ExhibitionMedia[];
}

// Payload for create/update (dates as yyyy-MM-dd or null).
export interface ExhibitionWrite {
  name: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  curator: string | null;
  galleryLocation: string | null;
  explication: string | null;
  investigationMaterial: string | null;
  team: string | null;
  artworksList: string | null;
  preOpeningDetails: string | null;
  openingDetails: string | null;
  eventsDetails: string | null;
  notes: string | null;
  referencedLiterature: string | null;
  aim: string | null;
}
