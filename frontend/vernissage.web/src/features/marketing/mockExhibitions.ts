/**
 * Curated, fictional exhibitions used only for the marketing surfaces
 * (home hero / featured / recently-documented). The real archive at
 * /archive is wired to the live API; these seed the editorial landing so
 * it reads well before any real records exist. Restrained, poetic titles
 * and real cities, per the design brief.
 */
export interface MockExhibition {
  slug: string;
  title: string;
  artist: string;
  gallery: string;
  city: string;
  year: string;
  dateRange: string;
  medium: string;
  works: number;
  excerpt: string;
}

export const MOCK_EXHIBITIONS: MockExhibition[] = [
  {
    slug: 'soft-architectures',
    title: 'Soft Architectures',
    artist: 'Lena Voss',
    gallery: 'Halle für Gegenwart',
    city: 'Berlin',
    year: '2025',
    dateRange: '14 Sep — 30 Nov 2025',
    medium: 'Plaster, pigment',
    works: 18,
    excerpt:
      'Eighteen cast forms map the threshold between the load-bearing and the provisional — walls that lean, thresholds that give. The catalogue records each pour in sequence.',
  },
  {
    slug: 'quiet-quartet',
    title: 'Quiet Quartet',
    artist: 'Mateo Rivas',
    gallery: 'Casa Prieto',
    city: 'Mexico City',
    year: '2025',
    dateRange: '02 Mar — 18 May 2025',
    medium: 'Video, sound',
    works: 4,
    excerpt:
      'Four synchronized channels hold a room in near-silence, each measured against the others. Installed low, at the height of a seated listener.',
  },
  {
    slug: 'the-long-walk',
    title: 'The Long Walk',
    artist: 'Amélie Fournier',
    gallery: 'Galerie du Panier',
    city: 'Marseille',
    year: '2026',
    dateRange: '11 Jan — 08 Mar 2026',
    medium: 'Textile, thread',
    works: 22,
    excerpt:
      'A single stitched line runs the length of the gallery, doubling back on itself. The wall text follows the thread rather than the works.',
  },
  {
    slug: 'figure-in-doorway',
    title: 'Figure in Doorway',
    artist: 'Haruki Sono',
    gallery: 'Shirokane Annex',
    city: 'Kyoto',
    year: '2025',
    dateRange: '20 Jun — 24 Aug 2025',
    medium: 'Oil, linen',
    works: 11,
    excerpt:
      'Eleven canvases return to one framing device — a body half-out of the room. Natural light only; the hang shifts with the season.',
  },
  {
    slug: 'ground-truth',
    title: 'Ground Truth',
    artist: 'Nadia Belkacem',
    gallery: 'Institut Contemporain',
    city: 'Lyon',
    year: '2026',
    dateRange: '03 Apr — 21 Jun 2026',
    medium: 'Photography, archive',
    works: 34,
    excerpt:
      'A survey assembled from municipal records and re-photographed sites, catalogued alongside the documents that named them.',
  },
  {
    slug: 'after-the-tide',
    title: 'After the Tide',
    artist: 'Osk Jónsdóttir',
    gallery: 'Norðurljós Room',
    city: 'Reykjavík',
    year: '2025',
    dateRange: '05 Oct — 14 Dec 2025',
    medium: 'Salt, steel',
    works: 9,
    excerpt:
      'Nine works crystallize over the run of the show; the archive versions each state weekly so the change is legible after closing.',
  },
];

export const FEATURED_EXHIBITION = MOCK_EXHIBITIONS[0];
export const RECENT_EXHIBITIONS = MOCK_EXHIBITIONS.slice(1);
export const ARCHIVED_COUNT = MOCK_EXHIBITIONS.length;
