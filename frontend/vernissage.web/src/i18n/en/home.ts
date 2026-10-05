import type { PluralForms } from '../format';

// The Home page, its slideshow and the demo reel.
const home = {
  metaTitle: "Let's document your art show properly",
  metaDescription:
    'Vernissage is a structured workspace for art exhibitions — catalogue works, attach installation photography, plans and audio, and publish an entry anyone can find.',
  metaWorkspace: 'Workspace for artists, curators & galleries',
  title: "Let's document your art show *properly*.",
  slogan: 'A show is alive for six weeks. *Its record is forever.*',
  startHere: 'Start here',
  roleCards: {
    artist: { title: "I'm an artist", body: 'Your works and shows, documented and ready to submit.' },
    curator: { title: "I'm an independent curator", body: 'Solo workspace, portable archive, no gallery required.' },
    gallery: { title: "I'm a gallery", body: 'A program-wide archive, with every show catalogued in one place.' },
  },
  whatEyebrow: 'What you get',
  whatTitle: 'The work around the work, *handled*.',
  benefits: {
    files: {
      title: 'Files sort themselves',
      body: 'Every show gets a Drive folder, foldered by material — masters, press, essays — filed as you upload.',
    },
    portfolio: {
      title: 'Portfolio & CV in a click',
      body: 'Generate a portfolio or CV for an open call, grant or residency from records you already keep.',
    },
    updates: {
      title: 'Updates while it runs',
      body: 'Push quick changes mid-show — dates, works, press — and everyone following the entry hears about it.',
    },
  },
  reelEyebrow: 'Show reels',
  reelTitle: 'Every documented show *plays back*.',
  reelBody:
    'Vernissage turns an inventory into a short film: installation views, the works, then the numbers. Visitors, sales and costs appear only in your own reel.',
  reelEnd: 'Inventory complete · 18 works · 4 photographs',
  pipelineEyebrow: 'How it works',
  pipelineTitle: 'A four-step pipeline, from opening night to *citation*.',
  pipeline: {
    setUp: { title: 'Set up the show', body: 'Title, dates, artists, works — a proper catalogue schema, not a blank document.' },
    attach: { title: 'Attach the material', body: 'Installation views, plans, audio and documents, filed by category on the entry.' },
    sync: { title: 'Sync to Drive', body: 'Planned: a structured Google Drive folder per show for masters, HDRs and press.' },
    share: { title: 'Publish & share', body: 'A public entry anyone can read, search and link to.' },
  },
  drive: {
    title: 'Every show gets a home for its files.',
    body: 'A structured Drive folder per exhibition, so masters, HDRs and press never scatter. Until then, files attach directly to the entry.',
    files: { one: '{n} file', other: '{n} files' } as PluralForms,
  },
  vr: {
    chip: 'VR walkthroughs',
    status: 'Planned · Matterport · 360°',
    title: "The show doesn't have to close.",
    body: 'A Matterport or 360° capture embeds alongside the catalogue — step back inside the room long after the walls come down.',
    enter: '● Enter VR walkthrough',
    rooms: '14 rooms',
  },
  ctaEyebrow: 'Open access, non-commercial',
  ctaTitle: 'A working archive, not a portfolio site.',
  ctaBody: 'Start documenting your next show.',
  cta: 'Start documenting',
  slideshow: {
    region: 'Exhibitions and opening nights',
    slide: '{n} of {total}',
    previous: 'Previous photo',
    next: 'Next photo',
    play: 'Play slideshow',
    pause: 'Pause slideshow',
    choose: 'Choose a photo',
    photo: 'Photo {n}: {caption}',
    credit: 'Photo:',
  },
  photos: {
    openingCrowd: {
      caption: 'Opening night, a full room',
      alt: 'A packed crowd at a gallery opening, under a tall window hung with yellow stripes',
    },
    closeLook: {
      caption: 'A close look at the work',
      alt: 'A visitor looks closely at a large painting of a woman embracing a fox',
    },
    nightWindows: {
      caption: 'Vernissage, after dark',
      alt: 'Three arched gallery windows lit at night, with visitors silhouetted inside',
    },
    galleryRoom: {
      caption: 'Installation view, room one',
      alt: 'A sunlit gallery with abstract paintings on white walls and two white benches',
    },
    glasses: {
      caption: 'An hour before the doors open',
      alt: 'Rows of empty wine glasses waiting on a table before an opening',
    },
    hang: {
      caption: 'The hang, grid of sixteen',
      alt: 'Visitors at an opening in front of a wall hung with a grid of framed works',
    },
    readingRoom: {
      caption: 'Archive tables, during the run',
      alt: 'Visitors leaning over long vitrine tables in a bright white exhibition hall',
    },
  },
  demoReel: {
    title: 'The Long Afternoon',
    byline: 'Group show',
    venue: 'Galerie Nord, Lviv',
    untitled: 'Untitled {n}',
    costs: {
      rent: 'Rent',
      framing: 'Framing',
      shipping: 'Shipping',
      brunch: 'Opening brunch',
      printing: 'Printing',
    },
  },
};

export default home;
