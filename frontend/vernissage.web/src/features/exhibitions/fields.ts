import type { ExhibitionWrite } from '../../types/exhibition';
import type { Messages } from '../../i18n/en';

// A single editable/viewable text field.
export interface FieldDef {
  key: keyof ExhibitionWrite;
  label: string;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
}

// Text fields grouped into meaningful sections. Both the create/edit form and
// the read-only view page iterate over these so the two stay in sync.
export interface FieldSection {
  id: string;
  title: string;
  description: string;
  fields: FieldDef[];
}

type SectionId = keyof Messages['ex']['fields']['sections'];
type TextKey = keyof Messages['ex']['fields']['label'] & keyof ExhibitionWrite;

const LAYOUT: { id: SectionId; fields: TextKey[] }[] = [
  { id: 'concept', fields: ['aim', 'explication', 'investigationMaterial', 'referencedLiterature'] },
  { id: 'people', fields: ['team', 'artworksList'] },
  { id: 'program', fields: ['preOpeningDetails', 'openingDetails', 'eventsDetails'] },
  { id: 'notes', fields: ['notes'] },
];

/** The long-text sections, labelled in the active language. */
export function fieldSections(m: Messages): FieldSection[] {
  const f = m.ex.fields;
  const placeholders = f.placeholder as Partial<Record<TextKey, string>>;
  return LAYOUT.map(({ id, fields }) => ({
    id,
    title: f.sections[id].title,
    description: f.sections[id].description,
    fields: fields.map((key) => ({
      key,
      label: f.label[key],
      multiline: true,
      placeholder: placeholders[key],
    })),
  }));
}
