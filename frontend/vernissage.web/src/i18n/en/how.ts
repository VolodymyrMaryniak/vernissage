// "How it works": Vernissage as digital inventories of physical exhibitions.
const how = {
  metaTitle: 'How it works',
  metaDescription:
    'Vernissage keeps digital inventories of physical exhibitions, for artists, curators and galleries, and for anyone who is more than one of those.',
  eyebrow: 'How it works',
  subtitle: 'Digital inventories of *physical exhibitions*.',
  lede: 'A show lives for a few weeks in a real room. Vernissage keeps a complete record of it: the works, the people, the plans, the photographs and the numbers.',
  start: 'Start your inventory',
  inventoryEyebrow: 'One inventory per show',
  inventoryTitle: 'Everything that made the show, *itemised*.',
  inventory: {
    show: { title: 'The show', body: 'Title, dates, city, venue, curator and focus.' },
    works: { title: 'The works', body: 'The artworks list, with images of each piece.' },
    people: { title: 'The people', body: 'Artists, curators, designers and technicians.' },
    thinking: { title: 'The thinking', body: 'Aim, curatorial text, research and literature.' },
    room: { title: 'The room', body: 'Design, lighting and location plans; installation views; audio.' },
    program: { title: 'The program', body: 'Pre-opening, opening night and events during the run.' },
    numbers: { title: 'The numbers', body: 'Visitors, sales and costs, visible only to you.' },
    walkthrough: { title: 'The walkthrough', body: 'A 360° or VR capture of the room.' },
  },
  rolesEyebrow: 'Artist, curator or gallery',
  rolesTitle: 'Same inventory, *used your way*.',
  audiences: {
    artists: {
      eyebrow: 'As an artist',
      title: 'Your shows become your CV.',
      points: [
        'Record every show you take part in, solo or group.',
        'Your CV updates from your inventory, in PDF or Word.',
        'Mark works sold and keep the totals private.',
      ],
      link: 'See it for artists',
    },
    curators: {
      eyebrow: 'As a curator',
      title: 'The whole show, from idea to opening.',
      points: [
        'Concept, research, checklist, team and plans in one record.',
        'Shows you curated are kept apart on your CV.',
        'The record stays yours when you change institutions.',
      ],
      link: 'See it for curators',
    },
    galleries: {
      eyebrow: 'As a gallery',
      title: 'The program, show by show.',
      points: [
        'Every exhibition you host in one inventory.',
        'Costs, sales and visitors for each show and the season.',
        'Analytics across the program, free while in beta.',
      ],
      link: 'See it for galleries',
    },
  },
  multiEyebrow: 'More than one hat?',
  multiTitle: 'One account, *every role you have*.',
  multiBody:
    'Plenty of people exhibit and curate, or run a space and make work. Tick every role that’s yours; for each show, mark which hat you wore, and your profile, My exhibitions and your CV sort themselves.',
  ctaEyebrow: 'Free while in beta',
  ctaTitle: 'Start with the show you remember best.',
  cta: 'Open your workspace',
  mixer: {
    step1: 'Tick every role that’s yours',
    noRole: 'No role yet',
    yourName: 'Your Name',
    step2: 'For each show, say which hat you wore',
    pickOne: 'Pick at least one role.',
    step3: 'Everything sorts itself',
    adds: {
      Artist: ['Medium on your profile', 'Solo & group shows on your CV', 'Works sold per show'],
      Curator: ['Place of work on your profile', '“Curated by me” on your CV', 'Checklist, team & research per show'],
      Gallery: ['Gallery name, focus & founding year', 'Season figures across the program', 'Costs & visitors per show'],
    },
    filtered: 'My exhibitions filtered by role',
  },
};

export default how;
