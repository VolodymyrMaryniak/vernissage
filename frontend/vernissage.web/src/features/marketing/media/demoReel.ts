import type { ReelData } from '../../reel/scenes';
import { localizedPhotos } from './photos';
import en from '../../../i18n/en';
import type { Messages } from '../../../i18n/en';
import { fmt, formatDate } from '../../../i18n/format';

/** A fictional, fully documented group show, used to demo the reel on Home. */
export function demoReel(m: Messages = en): ReelData {
  const t = m.home.demoReel;
  const photos = localizedPhotos(m);
  const photo = (id: string) => {
    const p = photos.find((x) => x.id === id)!;
    return { src: p.src, caption: p.caption, tag: p.tag };
  };
  const day = (iso: string) => formatDate(iso, { day: 'numeric', month: 'short', year: 'numeric' });

  return {
    title: t.title,
    byline: t.byline,
    venue: t.venue,
    dates: `${day('2026-09-12')} – ${day('2026-10-26')}`,
    photos: [photo('galleryRoom'), photo('hang'), photo('openingCrowd'), photo('closeLook')],
    works: [
      { title: 'Window, 4 a.m.', sold: true },
      { title: 'Тиха вода' },
      { title: 'Orchard Study III', sold: true },
      { title: 'Salt Line' },
      { title: 'Afterglow (diptych)', sold: true },
      { title: 'Small Hours' },
      ...Array.from({ length: 12 }, (_, i) => ({ title: fmt(t.untitled, { n: i + 1 }), sold: i < 4 })),
    ],
    stats: {
      visitors: 1240,
      sold: 7,
      revenue: 14600,
      satisfaction: 8.6,
      costs: [
        { label: t.costs.rent, amount: 3000 },
        { label: t.costs.framing, amount: 2400 },
        { label: t.costs.shipping, amount: 1150 },
        { label: t.costs.brunch, amount: 680 },
        { label: t.costs.printing, amount: 420 },
      ],
    },
  };
}

export const DEMO_REEL = demoReel();
