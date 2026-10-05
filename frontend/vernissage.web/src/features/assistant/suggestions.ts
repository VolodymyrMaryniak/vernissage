import type { ExhibitionWrite } from '../../types/exhibition';
import type { DraftField, ExhibitionDraft } from '../../api/assistantApi';
import { FIELD_SECTIONS } from '../exhibitions/fields';

/** Every field the assistant may fill, in form order, with its form label and length cap. */
export const DRAFT_FIELDS: { key: DraftField; label: string; max?: number }[] = [
  { key: 'name', label: 'Name', max: 300 },
  { key: 'startDate', label: 'Start date' },
  { key: 'endDate', label: 'End date' },
  { key: 'curator', label: 'Curator', max: 500 },
  { key: 'location', label: 'Location', max: 500 },
  { key: 'galleryLocation', label: 'Gallery / venue', max: 500 },
  { key: 'focus', label: 'Focus / topic', max: 200 },
  ...FIELD_SECTIONS.flatMap((s) =>
    s.fields.map((f) => ({ key: f.key as DraftField, label: f.label })),
  ),
];

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export interface Suggestion {
  key: DraftField;
  label: string;
  value: string;
  existing: string | null;
}

/** The usable suggestions in a draft: non-empty, well-formed dates, within length caps. */
export function suggestionsFrom(draft: ExhibitionDraft, current: ExhibitionWrite): Suggestion[] {
  return DRAFT_FIELDS.flatMap(({ key, label, max }) => {
    const raw = draft[key];
    if (typeof raw !== 'string' || raw.trim() === '') return [];
    const value = max ? raw.trim().slice(0, max) : raw.trim();
    if ((key === 'startDate' || key === 'endDate') && !DATE.test(value)) return [];
    const existing = (current[key] as string | null) ?? null;
    if (existing === value) return [];
    return [{ key, label, value, existing: existing === '' ? null : existing }];
  });
}
