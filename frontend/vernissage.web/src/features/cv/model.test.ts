import { describe, expect, it } from 'vitest';
import type { CvDocument } from '../../types/cv';
import type { ExhibitionSummary } from '../../types/exhibition';
import type { Profile } from '../../types/profile';
import { buildCvModel, cvFileBase, exhibitionYears, parseLine, suggestedHeadline } from './model';

const PROFILE: Profile = {
  id: 'u1',
  email: 'olena@example.com',
  roles: ['Artist'],
  displayName: 'Olena Kovalenko',
  galleryName: null,
  businessLocation: null,
  focus: null,
  foundingYear: null,
  firstName: 'Olena',
  lastName: 'Kovalenko',
  socialMedia: '@olena',
  placeOfWork: null,
  areasOfInterest: null,
  location: 'Kyiv',
  medium: 'Painting',
  hasPhoto: false,
};

function show(id: string, name: string, startDate: string, extra: Partial<ExhibitionSummary> = {}): ExhibitionSummary {
  return {
    id,
    name,
    startDate,
    endDate: startDate,
    location: 'Kyiv',
    focus: null,
    curator: null,
    galleryLocation: null,
    ownerId: 'u1',
    roles: [],
    mediaCount: 0,
    createdAtUtc: '2026-01-01T00:00:00Z',
    updatedAtUtc: '2026-01-01T00:00:00Z',
    ...extra,
  };
}

function doc(patch: Partial<CvDocument> = {}): CvDocument {
  return {
    template: 'classic',
    font: 'garamond',
    pageSize: 'A4',
    headline: null,
    includePhoto: true,
    includeContact: true,
    includeExhibitions: true,
    exhibitions: [],
    sections: [
      { key: 'statement', title: 'Statement', include: true, text: null },
      { key: 'education', title: 'Education', include: true, text: null },
    ],
    ...patch,
  };
}

describe('buildCvModel', () => {
  it('groups chosen exhibitions by kind, newest first, with venue and curator', () => {
    const shows = [
      show('a', 'Old Group Show', '2019-03-01'),
      show('b', 'Solo One', '2024-05-01', { galleryLocation: 'Voloshyn Gallery', curator: 'Iryna' }),
      show('c', 'New Group Show', '2025-01-10'),
      show('d', 'Not chosen', '2025-02-01'),
      show('e', 'My Curated Show', '2023-02-01', { curator: 'Olena Kovalenko' }),
    ];
    const model = buildCvModel(
      PROFILE,
      doc({
        exhibitions: [
          { exhibitionId: 'a', kind: 'group' },
          { exhibitionId: 'b', kind: 'solo' },
          { exhibitionId: 'c', kind: 'group' },
          { exhibitionId: 'e', kind: 'curated' },
        ],
      }),
      shows,
    );

    expect(model.sections.map((s) => s.title)).toEqual([
      'Solo exhibitions',
      'Group exhibitions',
      'Curated exhibitions',
    ]);
    expect(model.sections[0].entries[0]).toEqual({
      year: '2024',
      title: 'Solo One',
      detail: 'Voloshyn Gallery, Kyiv. Curated by Iryna',
      italicTitle: true,
    });
    expect(model.sections[1].entries.map((e) => e.title)).toEqual(['New Group Show', 'Old Group Show']);
    // Your own curated show doesn't say "curated by" you.
    expect(model.sections[2].entries[0].detail).toBe('Kyiv');
  });

  it('leaves out exhibitions when they are switched off, and empty sections', () => {
    const model = buildCvModel(
      PROFILE,
      doc({ includeExhibitions: false, exhibitions: [{ exhibitionId: 'a', kind: 'solo' }] }),
      [show('a', 'Hidden', '2024-01-01')],
    );

    expect(model.sections).toEqual([]);
  });

  it('turns free-text lines into entries and keeps the statement as prose first', () => {
    const model = buildCvModel(
      PROFILE,
      doc({
        sections: [
          { key: 'education', title: 'Education', include: true, text: '2016–2018 — MA Fine Art\n\nSummer school, Lviv' },
          { key: 'statement', title: 'Statement', include: true, text: 'First paragraph\ncontinues.\n\nSecond.' },
          { key: 'awards', title: 'Awards', include: false, text: '2020 — Hidden prize' },
        ],
      }),
      [],
    );

    expect(model.sections.map((s) => s.title)).toEqual(['Statement', 'Education']);
    expect(model.sections[0].prose).toBe(true);
    expect(model.sections[0].entries.map((e) => e.title)).toEqual(['First paragraph continues.', 'Second.']);
    expect(model.sections[1].entries).toEqual([
      { year: '2016–2018', title: 'MA Fine Art', detail: null, italicTitle: false },
      { year: null, title: 'Summer school, Lviv', detail: null, italicTitle: false },
    ]);
  });

  it('includes contact details only when asked', () => {
    expect(buildCvModel(PROFILE, doc(), []).contact).toEqual(['olena@example.com', 'Kyiv', '@olena']);
    expect(buildCvModel(PROFILE, doc({ includeContact: false }), []).contact).toEqual([]);
  });
});

describe('CV helpers', () => {
  it.each([
    ['2024 — Residency, Paris', '2024', 'Residency, Paris'],
    ['2019-2021: MA Fine Art', '2019–2021', 'MA Fine Art'],
    ['2020 – present Teaching', '2020–present', 'Teaching'],
    ['National Art Museum, Kyiv', null, 'National Art Museum, Kyiv'],
    ['1999 Spring Salon', '1999', 'Spring Salon'],
  ])('parses "%s"', (line, year, title) => {
    expect(parseLine(line)).toMatchObject({ year, title });
  });

  it('shows a range only for a show spanning New Year', () => {
    expect(exhibitionYears({ startDate: '2023-12-01', endDate: '2024-01-20' })).toBe('2023–2024');
    expect(exhibitionYears({ startDate: '2024-05-01', endDate: '2024-06-01' })).toBe('2024');
    expect(exhibitionYears({ startDate: null, endDate: null })).toBeNull();
  });

  it('suggests a headline and a file name from the profile', () => {
    expect(suggestedHeadline(PROFILE)).toBe('Artist · Painting · Kyiv');
    expect(cvFileBase({ name: 'Олена Коваленко' })).toBe('Олена-Коваленко-CV');
    expect(cvFileBase({ name: '!!!' })).toBe('Vernissage-CV');
  });
});
