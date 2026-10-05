import { describe, expect, it } from 'vitest';
import type { ExhibitionDetail } from '../../types/exhibition';
import { MediaCategory } from '../../types/exhibition';
import {
  buildScenes,
  isPlayable,
  parseWorks,
  reelFromExhibition,
  sceneAt,
  sceneStart,
  totalDuration,
} from './scenes';

const exhibition: ExhibitionDetail = {
  id: 'e1',
  name: 'Soft Wall',
  startDate: '2026-09-12',
  endDate: '2026-10-26',
  location: 'Lviv',
  focus: null,
  curator: 'O. H.',
  ownerId: 'u1',
  roles: ['Curator'],
  galleryLocation: 'Galerie Nord',
  explication: null,
  investigationMaterial: null,
  team: null,
  artworksList: '- Window, 4 a.m.\n2. Salt Line\n\n• Small Hours',
  preOpeningDetails: null,
  openingDetails: null,
  eventsDetails: null,
  notes: null,
  referencedLiterature: null,
  aim: null,
  createdAtUtc: '2026-09-01T00:00:00Z',
  updatedAtUtc: '2026-09-01T00:00:00Z',
  media: [
    { id: 'a', category: MediaCategory.ArtworkImage, fileName: 'a.jpg', contentType: 'image/jpeg', fileSize: 1, caption: 'Work', createdAtUtc: '' },
    { id: 'p', category: MediaCategory.LocationPlan, fileName: 'p.jpg', contentType: 'image/jpeg', fileSize: 1, caption: null, createdAtUtc: '' },
    { id: 'v', category: MediaCategory.ExpoDesignFull, fileName: 'v.jpg', contentType: 'image/jpeg', fileSize: 1, caption: 'View', createdAtUtc: '' },
    { id: 's', category: MediaCategory.Audio, fileName: 's.mp3', contentType: 'audio/mpeg', fileSize: 1, caption: null, createdAtUtc: '' },
  ],
};

describe('show reel scenes', () => {
  it('parses one work per line, stripping bullets and numbers', () => {
    expect(parseWorks(exhibition.artworksList)).toEqual(['Window, 4 a.m.', 'Salt Line', 'Small Hours']);
    expect(parseWorks(null)).toEqual([]);
  });

  it('builds the reel from installation views first, skipping plans and audio', () => {
    const reel = reelFromExhibition(exhibition);
    expect(reel.photos.map((p) => p.caption)).toEqual(['View', 'Work']);
    expect(reel.photos[0].tag).toBe('The room');
    expect(reel.venue).toBe('Galerie Nord, Lviv');
    expect(reel.stats).toBeNull();
  });

  it('plays the numbers and costs only when metrics are given', () => {
    const publicKinds = buildScenes(reelFromExhibition(exhibition)).map((s) => s.kind);
    expect(publicKinds).toEqual(['title', 'photo', 'photo', 'works', 'end']);

    const ownerKinds = buildScenes(
      reelFromExhibition(exhibition, {
        visitorsCount: 300,
        satisfaction: null,
        artworksSold: 2,
        totalRevenue: null,
        totalCost: 50,
        costItems: [{ id: 'c', label: 'Framing', amount: 50 }],
        updatedAtUtc: null,
      }),
    ).map((s) => s.kind);
    expect(ownerKinds).toEqual(['title', 'photo', 'photo', 'works', 'numbers', 'costs', 'end']);
  });

  it('finds the scene on screen at a given time', () => {
    const scenes = buildScenes(reelFromExhibition(exhibition));
    expect(sceneAt(scenes, 0)).toEqual({ index: 0, progress: 0 });
    const second = sceneStart(scenes, 1);
    expect(sceneAt(scenes, second + scenes[1].duration / 2).index).toBe(1);
    expect(sceneAt(scenes, totalDuration(scenes))).toEqual({ index: scenes.length - 1, progress: 1 });
  });

  it('is not playable with nothing beyond a title', () => {
    expect(isPlayable({ title: 'Empty', photos: [], works: [] })).toBe(false);
    expect(isPlayable(reelFromExhibition(exhibition))).toBe(true);
  });
});
