import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders, stubFetch } from '../../testUtils';
import HomePage from './HomePage';

describe('HomePage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows no public archive: no entries, counts or archive links', async () => {
    const fetchMock = stubFetch([]);

    renderWithProviders(<HomePage />);

    expect(
      screen.getByRole('heading', { name: /document your art show properly/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText('On view in the archive')).not.toBeInTheDocument();
    expect(screen.queryByText('Latest entries')).not.toBeInTheDocument();
    expect(screen.queryByText(/exhibitions archived/)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /browse the archive/i })).not.toBeInTheDocument();
    expect(
      fetchMock.mock.calls.some(([url]) => String(url).includes('/api/exhibitions')),
    ).toBe(false);
  });

  it('marks the unbuilt integrations as planned', async () => {
    stubFetch([]);

    renderWithProviders(<HomePage />);

    expect(screen.getAllByText('Planned').length).toBeGreaterThan(0);
    expect(screen.queryByText('Connected')).not.toBeInTheDocument();
  });
});
