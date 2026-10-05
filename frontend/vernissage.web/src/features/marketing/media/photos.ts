/**
 * Exhibition and opening-night photography for the marketing pages. All of it is
 * Creative Commons (CC BY / BY-SA 2.0) from Flickr, resized to WebP in
 * `public/media/home`; the licence requires the credit shown next to each photo.
 */
export interface MarketingPhoto {
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

const LICENSE_URL: Record<MarketingPhoto['license'], string> = {
  'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/',
  'CC BY-SA 2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
};

export function licenseUrl(photo: MarketingPhoto): string {
  return LICENSE_URL[photo.license];
}

export const PHOTOS: MarketingPhoto[] = [
  {
    src: '/media/home/opening-crowd.webp',
    alt: 'A packed crowd at a gallery opening, under a tall window hung with yellow stripes',
    caption: 'Opening night, a full room',
    tag: 'The program',
    creator: 'Gareth1953 All Right Now',
    sourceUrl: 'https://www.flickr.com/photos/40837632@N05/5651234278',
    license: 'CC BY 2.0',
  },
  {
    src: '/media/home/close-look.webp',
    alt: 'A visitor looks closely at a large painting of a woman embracing a fox',
    caption: 'A close look at the work',
    tag: 'The works',
    creator: 'Joey Z1',
    sourceUrl: 'https://www.flickr.com/photos/45958601@N02/48608464588',
    license: 'CC BY 2.0',
  },
  {
    src: '/media/home/night-windows.webp',
    alt: 'Three arched gallery windows lit at night, with visitors silhouetted inside',
    caption: 'Vernissage, after dark',
    tag: 'The room',
    creator: 'kohlmann.sascha',
    sourceUrl: 'https://www.flickr.com/photos/96323831@N06/10533605746',
    license: 'CC BY-SA 2.0',
  },
  {
    src: '/media/home/gallery-room.webp',
    alt: 'A sunlit gallery with abstract paintings on white walls and two white benches',
    caption: 'Installation view, room one',
    tag: 'The room',
    creator: 'Mark B. Schlemmer',
    sourceUrl: 'https://www.flickr.com/photos/28066281@N03/5673775742',
    license: 'CC BY 2.0',
  },
  {
    src: '/media/home/glasses.webp',
    alt: 'Rows of empty wine glasses waiting on a table before an opening',
    caption: 'An hour before the doors open',
    tag: 'The program',
    creator: "Nic's events",
    sourceUrl: 'https://www.flickr.com/photos/68457656@N00/2489690363',
    license: 'CC BY-SA 2.0',
  },
  {
    src: '/media/home/hang.webp',
    alt: 'Visitors at an opening in front of a wall hung with a grid of framed works',
    caption: 'The hang, grid of sixteen',
    tag: 'The works',
    creator: 'Marcus Grbac',
    sourceUrl: 'https://www.flickr.com/photos/7876549@N07/52089213503',
    license: 'CC BY 2.0',
  },
  {
    src: '/media/home/reading-room.webp',
    alt: 'Visitors leaning over long vitrine tables in a bright white exhibition hall',
    caption: 'Archive tables, during the run',
    tag: 'The thinking',
    creator: 'mrdannynavarro',
    sourceUrl: 'https://www.flickr.com/photos/21283177@N00/1023609988',
    license: 'CC BY-SA 2.0',
  },
];
