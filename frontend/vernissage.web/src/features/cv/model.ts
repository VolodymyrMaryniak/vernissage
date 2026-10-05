import type { CvDocument, CvExhibitionKind, CvFont, CvPageSize, CvTemplate } from '../../types/cv';
import type { ExhibitionSummary } from '../../types/exhibition';
import type { Profile } from '../../types/profile';

/**
 * A CV reduced to what every renderer (HTML preview, PDF, Word) needs: plain
 * text grouped into sections of dated entries. Building it once keeps the three
 * outputs identical in content; they differ only in styling.
 */
export interface CvModel {
  template: CvTemplate;
  font: CvFont;
  pageSize: CvPageSize;
  name: string;
  headline: string | null;
  /** Shown only when the document includes contact details. */
  contact: string[];
  sections: CvModelSection[];
}

export interface CvModelSection {
  title: string;
  entries: CvEntry[];
  /** Paragraphs set full width (the statement), rather than dated entries. */
  prose?: boolean;
}

export interface CvEntry {
  /** Year or range shown in the left column, e.g. "2024" or "2019–2021". */
  year: string | null;
  /** Main text; for exhibitions, the show's title (set in italics). */
  title: string;
  /** Secondary text after the title, e.g. "Gallery X, Kyiv. Curated by Y". */
  detail: string | null;
  /** Set the title in italics (exhibition titles, by CV convention). */
  italicTitle: boolean;
}

export const KIND_HEADINGS: Record<CvExhibitionKind, string> = {
  solo: 'Solo exhibitions',
  group: 'Group exhibitions',
  curated: 'Curated exhibitions',
};

const KIND_ORDER: CvExhibitionKind[] = ['solo', 'group', 'curated'];

/** The person's (or gallery's) name for the CV heading. */
export function cvName(profile: Profile): string {
  const person = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim();
  return person || profile.galleryName || profile.displayName || profile.email;
}

/** A sensible default headline from the profile, e.g. "Artist · Painting · Kyiv". */
export function suggestedHeadline(profile: Profile): string {
  const parts = [profile.roles.join(' & '), profile.medium ?? profile.focus, profile.location ?? profile.businessLocation];
  return parts.filter((p) => p && p.trim()).join(' · ');
}

function year(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value.slice(0, 4));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** "2024", or "2023–2024" for a show spanning New Year. */
export function exhibitionYears(e: Pick<ExhibitionSummary, 'startDate' | 'endDate'>): string | null {
  const start = year(e.startDate);
  const end = year(e.endDate);
  if (start && end && end !== start) return `${start}–${end}`;
  return start || end ? String(start ?? end) : null;
}

function exhibitionEntry(e: ExhibitionSummary, kind: CvExhibitionKind): CvEntry {
  const place = [e.galleryLocation, e.location].filter((p) => p && p.trim()).join(', ');
  // Your own curated show doesn't need "curated by" you.
  const curator = kind !== 'curated' && e.curator ? `Curated by ${e.curator}` : null;
  const detail = [place, curator].filter(Boolean).join('. ');
  return { year: exhibitionYears(e), title: e.name, detail: detail || null, italicTitle: true };
}

// "2019 — MA Fine Art", "2019–2021: Residency", "2020 - present Teaching" …
const LEADING_YEAR =
  /^((?:19|20)\d{2}(?:\s*[–—-]\s*(?:(?:19|20)\d{2}|present|now|today))?)\s*(?:[—–:,.|-]\s*)?(.+)$/i;

/** One line of a free-text section, with a leading year split into the year column. */
export function parseLine(line: string): CvEntry {
  const match = LEADING_YEAR.exec(line.trim());
  if (match) {
    return { year: match[1].replace(/\s*[–—-]\s*/, '–'), title: match[2].trim(), detail: null, italicTitle: false };
  }
  return { year: null, title: line.trim(), detail: null, italicTitle: false };
}

/**
 * Builds the CV content from the profile, the builder document and the user's
 * exhibitions. Exhibitions are grouped under solo/group/curated headings (newest
 * first); empty sections are left out.
 */
export function buildCvModel(
  profile: Profile,
  document: CvDocument,
  exhibitions: ExhibitionSummary[],
): CvModel {
  const byId = new Map(exhibitions.map((e) => [e.id, e]));
  const sections: CvModelSection[] = [];

  const statement = document.sections.find((s) => s.key === 'statement');
  const freeText = document.sections.filter((s) => s.include && s.text?.trim());

  // The statement reads as prose, so it leads and isn't split into dated lines.
  if (statement && freeText.includes(statement)) {
    sections.push({
      title: statement.title,
      prose: true,
      entries: statement
        .text!.split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => ({ year: null, title: p.replace(/\s*\n\s*/g, ' '), detail: null, italicTitle: false })),
    });
  }

  if (document.includeExhibitions) {
    for (const kind of KIND_ORDER) {
      const entries = document.exhibitions
        .filter((c) => c.kind === kind && byId.has(c.exhibitionId))
        .map((c) => byId.get(c.exhibitionId)!)
        .sort((a, b) => (b.startDate ?? b.endDate ?? '').localeCompare(a.startDate ?? a.endDate ?? ''))
        .map((e) => exhibitionEntry(e, kind));
      if (entries.length > 0) sections.push({ title: KIND_HEADINGS[kind], entries });
    }
  }

  for (const section of freeText) {
    if (section === statement) continue;
    const entries = section
      .text!.split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map(parseLine);
    if (entries.length > 0) sections.push({ title: section.title, entries });
  }

  const contact = document.includeContact
    ? [
        profile.email,
        profile.location ?? profile.businessLocation,
        profile.socialMedia,
      ].filter((c): c is string => Boolean(c && c.trim()))
    : [];

  return {
    template: document.template,
    font: document.font,
    pageSize: document.pageSize,
    name: cvName(profile),
    headline: document.headline?.trim() || null,
    contact,
    sections,
  };
}

/** File name for downloads, e.g. "Ada-Lovelace-CV". */
export function cvFileBase(model: Pick<CvModel, 'name'>): string {
  const slug = model.name
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'Vernissage'}-CV`;
}
