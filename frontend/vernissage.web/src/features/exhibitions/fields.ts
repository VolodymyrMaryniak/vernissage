import type { ExhibitionWrite } from '../../types/exhibition';

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

export const FIELD_SECTIONS: FieldSection[] = [
  {
    id: 'concept',
    title: 'Concept & research',
    description: 'The idea behind the exhibition and the material it draws on.',
    fields: [
      { key: 'aim', label: 'Aim', multiline: true, placeholder: 'What is this exhibition trying to achieve?' },
      { key: 'explication', label: 'Explication', multiline: true, placeholder: 'The curatorial statement or wall text.' },
      {
        key: 'investigationMaterial',
        label: 'Investigation material',
        multiline: true,
        placeholder: 'Sources, archives and research feeding the show.',
      },
      {
        key: 'referencedLiterature',
        label: 'Referenced literature & research',
        multiline: true,
        placeholder: 'Books, papers and citations.',
      },
    ],
  },
  {
    id: 'people',
    title: 'People & artworks',
    description: 'Who made it happen and what is on display.',
    fields: [
      { key: 'team', label: 'Team', multiline: true, placeholder: 'Curators, designers, technicians, contributors.' },
      { key: 'artworksList', label: 'List of artworks', multiline: true, placeholder: 'Works featured in the exhibition.' },
    ],
  },
  {
    id: 'program',
    title: 'Program & events',
    description: 'Everything happening around the exhibition.',
    fields: [
      { key: 'preOpeningDetails', label: 'Pre-opening details', multiline: true },
      { key: 'openingDetails', label: 'Opening details', multiline: true },
      { key: 'eventsDetails', label: 'Events within expo', multiline: true },
    ],
  },
  {
    id: 'notes',
    title: 'Notes',
    description: 'Anything else worth recording.',
    fields: [{ key: 'notes', label: 'Notes', multiline: true }],
  },
];
