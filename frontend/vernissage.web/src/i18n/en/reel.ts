import type { PluralForms } from '../format';

// The show reel: a short film generated from an exhibition's inventory.
const reel = {
  region: 'Show reel: {title}',
  badge: 'Generated from the inventory',
  play: 'Play reel',
  pause: 'Pause reel',
  replay: 'Replay reel',
  scenes: 'Scenes',
  scene: 'Scene {n}: {label}',
  sceneLabel: {
    title: 'Title',
    photo: 'Photograph',
    works: 'The works',
    numbers: 'The numbers',
    costs: 'The costs',
    end: 'End',
  },
  presents: 'Vernissage presents',
  works: 'The works · {n}',
  more: { one: 'and {n} more', other: 'and {n} more' } as PluralForms,
  sold: 'sold',
  numbers: 'The numbers · private to you',
  visitors: 'Visitors',
  worksSold: 'Works sold',
  ofTotal: 'of {n}',
  revenue: 'Revenue',
  satisfaction: 'Satisfaction',
  costs: 'Where the money went · {total}',
  margin: 'Margin',
  endLine: 'Documented on Vernissage',
  /** Inventory section a photo belongs to, by media category. */
  tag: { works: 'The works', room: 'The room', program: 'The program', thinking: 'The thinking' },
};

export default reel;
