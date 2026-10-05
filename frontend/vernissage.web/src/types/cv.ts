// Mirrors Vernissage.Api.Dtos.CvDtos (owner-only).

export const CV_TEMPLATES = ['classic', 'modern', 'minimal'] as const;
export type CvTemplate = (typeof CV_TEMPLATES)[number];

export const CV_FONTS = ['garamond', 'times', 'helvetica', 'courier'] as const;
export type CvFont = (typeof CV_FONTS)[number];

export const CV_PAGE_SIZES = ['A4', 'Letter'] as const;
export type CvPageSize = (typeof CV_PAGE_SIZES)[number];

export const CV_EXHIBITION_KINDS = ['solo', 'group', 'curated'] as const;
export type CvExhibitionKind = (typeof CV_EXHIBITION_KINDS)[number];

export interface CvExhibition {
  exhibitionId: string;
  kind: CvExhibitionKind;
}

/** A free-text section; each non-empty line of `text` is one entry. */
export interface CvSection {
  key: string;
  title: string;
  include: boolean;
  text: string | null;
}

export interface CvDocument {
  template: CvTemplate;
  font: CvFont;
  pageSize: CvPageSize;
  headline: string | null;
  includePhoto: boolean;
  includeContact: boolean;
  includeExhibitions: boolean;
  exhibitions: CvExhibition[];
  sections: CvSection[];
}

export interface CvFile {
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadedAtUtc: string;
}

export interface Cv {
  document: CvDocument;
  /** Last time "Update the CV" was pressed; null if never. */
  generatedAtUtc: string | null;
  /** Null until the CV is first saved. */
  updatedAtUtc: string | null;
  uploadedFile: CvFile | null;
}
