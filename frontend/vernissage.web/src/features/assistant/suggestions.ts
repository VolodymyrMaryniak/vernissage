import type { ExhibitionWrite } from '../../types/exhibition';
import type { DraftField, ExhibitionDraft } from '../../api/assistantApi';
import en from '../../i18n/en';
import type { Messages } from '../../i18n/en';

/** Every field the assistant may fill, in form order, with its length cap. */
export const DRAFT_FIELDS: { key: DraftField; max?: number }[] = [
  { key: 'name', max: 300 },
  { key: 'startDate' },
  { key: 'endDate' },
  { key: 'curator', max: 500 },
  { key: 'location', max: 500 },
  { key: 'galleryLocation', max: 500 },
  { key: 'focus', max: 200 },
  ...(
    [
      'aim',
      'explication',
      'investigationMaterial',
      'referencedLiterature',
      'team',
      'artworksList',
      'preOpeningDetails',
      'openingDetails',
      'eventsDetails',
      'notes',
    ] as const
  ).map((key) => ({ key })),
];

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export interface Suggestion {
  key: DraftField;
  label: string;
  value: string;
  existing: string | null;
}

/** The usable suggestions in a draft: non-empty, well-formed dates, within length caps. */
export function suggestionsFrom(
  draft: ExhibitionDraft,
  current: ExhibitionWrite,
  m: Messages = en,
): Suggestion[] {
  return DRAFT_FIELDS.flatMap(({ key, max }) => {
    const label = m.ex.fields.label[key];
    const raw = draft[key];
    if (typeof raw !== 'string' || raw.trim() === '') return [];
    const value = max ? raw.trim().slice(0, max) : raw.trim();
    if ((key === 'startDate' || key === 'endDate') && !DATE.test(value)) return [];
    const existing = (current[key] as string | null) ?? null;
    if (existing === value) return [];
    return [{ key, label, value, existing: existing === '' ? null : existing }];
  });
}
