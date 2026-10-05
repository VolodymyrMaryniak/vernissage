// "For independent curators" and its demos (show timeline, checklist).
const curators = {
  metaTitle: 'For independent curators',
  metaDescription:
    'One place for every show you curate, from first idea to opening night, that stays yours from one institution to the next.',
  eyebrow: 'For independent curators',
  title: 'Every show you curate, *from first idea to opening night*.',
  lede: 'Keep the concept, the checklist, the team and the plans in one place, and take it with you to the next institution.',
  cta: 'Open your workspace',
  wallLabel: 'Example wall label',
  wallCount: 'Five artists · 18 works',
  wallYou: 'Curated by you',
  timelineEyebrow: 'The life of a show',
  timelineTitle: 'Six stages, *one record*.',
  timelineBody: 'Click a stage to see what you keep there.',
  checklistEyebrow: 'The checklist',
  checklistTitle: "Know what's ready *before the van arrives*.",
  checklistBody: 'Mark works as catalogued and watch the show come together.',
  portableEyebrow: 'Portable',
  portableTitle: "Institutions change. *Your record doesn't.*",
  ctaEyebrow: 'Free while in beta',
  ctaTitle: "Start with the show you're working on now.",
  checklist: {
    meta: 'Checklist · {n} works',
    progress: '{done} of {total} catalogued',
    catalogued: 'Catalogued',
    mark: 'Mark catalogued',
    mediums: {
      plaster: 'Plaster, pigment',
      steel: 'Steel, felt',
      video: 'Video, sound',
      graphite: 'Graphite on paper',
      concrete: 'Cast concrete',
    },
  },
  timeline: {
    label: 'Stages of a show',
    stages: {
      concept: {
        label: 'Concept',
        when: '6 months out',
        line: 'Write down why the show exists before anyone asks.',
        keeps: ['Aim', 'Explication', 'Focus / topic'],
      },
      research: {
        label: 'Research',
        when: '4 months out',
        line: 'Sources, readings and references, kept next to the idea they feed.',
        keeps: ['Investigation material', 'Referenced literature', 'Notes'],
      },
      checklist: {
        label: 'Checklist',
        when: '8 weeks out',
        line: 'Works, artists and the people making it happen, in one list.',
        keeps: ['Artworks list', 'Team', 'Artwork images'],
      },
      install: {
        label: 'Install',
        when: 'Install week',
        line: 'Plans and views, so the next venue can rebuild the room.',
        keeps: ['Exposition design plan', 'Lighting plan', 'Location plan', 'Expo design photos'],
      },
      opening: {
        label: 'Opening',
        when: 'Opening night',
        line: 'The night itself, and everything that happens around it.',
        keeps: ['Pre-opening details', 'Opening details', 'Events', 'Event photos', 'Audio'],
      },
      after: {
        label: 'After',
        when: 'Forever',
        line: 'The record stays yours: what worked, who came, what it cost.',
        keeps: ['Private metrics', 'VR excursion', 'Your CV'],
      },
    },
  },
};

export default curators;
