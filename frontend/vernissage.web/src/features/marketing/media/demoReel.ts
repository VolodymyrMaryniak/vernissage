import type { ReelData } from '../../reel/scenes';
import { PHOTOS } from './photos';

const photo = (src: string) => {
  const p = PHOTOS.find((x) => x.src === src)!;
  return { src: p.src, caption: p.caption, tag: p.tag };
};

/** A fictional, fully documented group show, used to demo the reel on Home. */
export const DEMO_REEL: ReelData = {
  title: 'The Long Afternoon',
  byline: 'Group show',
  venue: 'Galerie Nord, Lviv',
  dates: '12 Sep – 26 Oct 2026',
  photos: [
    photo('/media/home/gallery-room.webp'),
    photo('/media/home/hang.webp'),
    photo('/media/home/opening-crowd.webp'),
    photo('/media/home/close-look.webp'),
  ],
  works: [
    { title: 'Window, 4 a.m.', sold: true },
    { title: 'Тиха вода' },
    { title: 'Orchard Study III', sold: true },
    { title: 'Salt Line' },
    { title: 'Afterglow (diptych)', sold: true },
    { title: 'Small Hours' },
    ...Array.from({ length: 12 }, (_, i) => ({ title: `Untitled ${i + 1}`, sold: i < 4 })),
  ],
  stats: {
    visitors: 1240,
    sold: 7,
    revenue: 14600,
    satisfaction: 8.6,
    costs: [
      { label: 'Rent', amount: 3000 },
      { label: 'Framing', amount: 2400 },
      { label: 'Shipping', amount: 1150 },
      { label: 'Opening brunch', amount: 680 },
      { label: 'Printing', amount: 420 },
    ],
  },
};
