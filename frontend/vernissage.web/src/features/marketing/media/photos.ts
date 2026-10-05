import en from '../../../i18n/en';
import type { Messages } from '../../../i18n/en';

/**
 * Exhibition and opening-night photography for the marketing pages. All of it is
 * Creative Commons (CC BY / BY-SA 2.0) from Flickr, resized to WebP in
 * `public/media/home`; the licence requires the credit shown next to each photo.
 */
export interface MarketingPhoto {
  /** Key of the photo's caption and alt text in the dictionary (`m.home.photos`). */
  id: PhotoId;
  src: string;
  alt: string;
  /** Short caption shown over the photo, in the inventory voice. */
  caption: string;
  /** Which inventory section the moment belongs to. */
  tag: string;
  creator: string;
  sourceUrl: string;
  license: 'CC BY 2.0' | 'CC BY-SA 2.0';
}

type PhotoId = keyof Messages['home']['photos'];

const LICENSE_URL: Record<MarketingPhoto['license'], string> = {
  'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/',
  'CC BY-SA 2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
};

export function licenseUrl(photo: MarketingPhoto): string {
  return LICENSE_URL[photo.license];
}

const SOURCES: Omit<MarketingPhoto, 'alt' | 'caption' | 'tag'>[] = [
  {
    id: 'openingCrowd',
    src: '/media/home/opening-crowd.webp',
    creator: 'Gareth1953 All Right Now',
    sourceUrl: 'https://www.flickr.com/photos/40837632@N05/5651234278',
    license: 'CC BY 2.0',
  },
  {
    id: 'closeLook',
    src: '/media/home/close-look.webp',
    creator: 'Joey Z1',
    sourceUrl: 'https://www.flickr.com/photos/45958601@N02/48608464588',
    license: 'CC BY 2.0',
  },
  {
    id: 'nightWindows',
    src: '/media/home/night-windows.webp',
    creator: 'kohlmann.sascha',
    sourceUrl: 'https://www.flickr.com/photos/96323831@N06/10533605746',
    license: 'CC BY-SA 2.0',
  },
  {
    id: 'galleryRoom',
    src: '/media/home/gallery-room.webp',
    creator: 'Mark B. Schlemmer',
    sourceUrl: 'https://www.flickr.com/photos/28066281@N03/5673775742',
    license: 'CC BY 2.0',
  },
  {
    id: 'glasses',
    src: '/media/home/glasses.webp',
    creator: "Nic's events",
    sourceUrl: 'https://www.flickr.com/photos/68457656@N00/2489690363',
    license: 'CC BY-SA 2.0',
  },
  {
    id: 'hang',
    src: '/media/home/hang.webp',
    creator: 'Marcus Grbac',
    sourceUrl: 'https://www.flickr.com/photos/7876549@N07/52089213503',
    license: 'CC BY 2.0',
  },
  {
    id: 'readingRoom',
    src: '/media/home/reading-room.webp',
    creator: 'mrdannynavarro',
    sourceUrl: 'https://www.flickr.com/photos/21283177@N00/1023609988',
    license: 'CC BY-SA 2.0',
  },
];

const TAGS: Record<PhotoId, keyof Messages['reel']['tag']> = {
  openingCrowd: 'program',
  closeLook: 'works',
  nightWindows: 'room',
  galleryRoom: 'room',
  glasses: 'program',
  hang: 'works',
  readingRoom: 'thinking',
};

/** The photos with captions, alt text and inventory tags in the active language. */
export function localizedPhotos(m: Messages = en): MarketingPhoto[] {
  return SOURCES.map((p) => ({
    ...p,
    alt: m.home.photos[p.id].alt,
    caption: m.home.photos[p.id].caption,
    tag: m.reel.tag[TAGS[p.id]],
  }));
}

export const PHOTOS = localizedPhotos();
