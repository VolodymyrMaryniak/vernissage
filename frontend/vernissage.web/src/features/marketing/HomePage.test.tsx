import { screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { pagedResponse, renderWithProviders, stubFetch } from '../../testUtils';
import HomePage from './HomePage';

function entry(id: string, name: string) {
  return {
    id,
    name,
    startDate: '2026-05-01',
    endDate: '2026-06-01',
    location: 'Kyiv',
    focus: 'Light art',
    curator: 'Ada Curator',
    ownerId: null,
    mediaCount: 3,
    createdAtUtc: '2026-05-01T00:00:00Z',
    updatedAtUtc: '2026-05-01T00:00:00Z',
  };
}

describe('HomePage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('features real archive entries and the live count', async () => {
    stubFetch([
      {
        url: '/api/exhibitions',
        body: pagedResponse([entry('a', 'Northern Lights'), entry('b', 'Second Show')], 42),
      },
    ]);

    renderWithProviders(<HomePage />);

    await waitFor(() =>
      expect(screen.getByText(/42 exhibitions archived/)).toBeInTheDocument(),
    );
    // First entry is the featured block, the rest fill the latest strip.
    expect(screen.getByRole('link', { name: 'Northern Lights' })).toHaveAttribute(
      'href',
      '/exhibitions/a',
    );
    expect(screen.getByText('Second Show').closest('a')).toHaveAttribute(
      'href',
      '/exhibitions/b',
    );
  });

  it('drops the archive sections when nothing is documented yet', async () => {
    stubFetch([{ url: '/api/exhibitions', body: pagedResponse([], 0) }]);

    renderWithProviders(<HomePage />);

    await waitFor(() =>
      expect(screen.getByText(/0 exhibitions archived/)).toBeInTheDocument(),
    );
    expect(screen.queryByText('On view in the archive')).not.toBeInTheDocument();
    expect(screen.queryByText('Latest entries')).not.toBeInTheDocument();
    // The hero and its calls to action still render.
    expect(
      screen.getByRole('heading', { name: /document your art exhibition properly/i }),
    ).toBeInTheDocument();
  });

  it('marks the unbuilt integrations as planned', async () => {
    stubFetch([{ url: '/api/exhibitions', body: pagedResponse([], 0) }]);

    renderWithProviders(<HomePage />);

    expect(screen.getAllByText('Planned').length).toBeGreaterThan(0);
    expect(screen.queryByText('Connected')).not.toBeInTheDocument();
  });
});
