import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pagedResponse, renderWithProviders, stubFetch } from '../../testUtils';
import ExhibitionsListPage from './ExhibitionsListPage';

const USER = { id: 'user-1', email: 'ada@example.com', roles: ['Curator'], displayName: 'Ada' };

function entry(id: string, name: string, ownerId: string | null = USER.id) {
  return {
    id,
    name,
    startDate: '2026-05-01',
    endDate: '2026-06-01',
    location: 'Kyiv',
    focus: 'Light art',
    curator: 'Ada Curator',
    ownerId,
    mediaCount: 0,
    createdAtUtc: '2026-05-01T00:00:00Z',
    updatedAtUtc: '2026-05-01T00:00:00Z',
  };
}

// 25 entries: enough for a second page at the page size of 20.
const PAGE_ONE = Array.from({ length: 20 }, (_, i) => entry(`id-${i}`, `Show ${i}`));
const PAGE_TWO = Array.from({ length: 5 }, (_, i) => entry(`id-2${i}`, `Later show ${i}`));

/** URL of the last exhibitions request. */
function lastListUrl(fetchMock: ReturnType<typeof stubFetch>): string {
  const calls = fetchMock.mock.calls
    .map(([url]) => String(url))
    .filter((url) => url.includes('/api/exhibitions'));
  return calls[calls.length - 1];
}

describe('ExhibitionsListPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('shows the first page and advances to the next one', async () => {
    let page = 1;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('/api/exhibitions')) {
          page = url.includes('page=2') ? 2 : 1;
          return new Response(
            JSON.stringify(pagedResponse(page === 1 ? PAGE_ONE : PAGE_TWO, 25, page)),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        return new Response(JSON.stringify({ analyticsEnabled: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }),
    );

    renderWithProviders(<ExhibitionsListPage />);

    await waitFor(() => expect(screen.getByText('Show 0')).toBeInTheDocument());
    expect(screen.getByText(/Page 1 of 2 · 25 entries/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Next/ }));

    await waitFor(() => expect(screen.getByText('Later show 0')).toBeInTheDocument());
    expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument();
    // Numbering continues from the previous page rather than restarting at 01.
    expect(screen.getByText('21')).toBeInTheDocument();
  });

  it('hides the pager when everything fits on one page', async () => {
    stubFetch([{ url: '/api/exhibitions', body: pagedResponse([entry('a', 'Solo show')], 1) }]);

    renderWithProviders(<ExhibitionsListPage />);

    await waitFor(() => expect(screen.getByText('Solo show')).toBeInTheDocument());
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument();
  });

  it('requests only the caller\'s entries when the "mine" toggle is used', async () => {
    localStorage.setItem('vernissage.token', 'jwt');
    const fetchMock = stubFetch([
      { url: '/api/auth/me', body: USER },
      { url: '/api/exhibitions', body: pagedResponse([entry('a', 'Solo show')], 1) },
    ]);

    renderWithProviders(<ExhibitionsListPage />);

    const toggle = await screen.findByLabelText('Only my exhibitions');
    expect(lastListUrl(fetchMock)).not.toContain('mine=true');

    await userEvent.click(toggle);

    await waitFor(() => expect(lastListUrl(fetchMock)).toContain('mine=true'));
  });

  it('does not offer the "mine" toggle to anonymous visitors', async () => {
    stubFetch([{ url: '/api/exhibitions', body: pagedResponse([]) }]);

    renderWithProviders(<ExhibitionsListPage />);

    await waitFor(() =>
      expect(screen.getByText(/no exhibitions have been documented yet/i)).toBeInTheDocument(),
    );
    expect(screen.queryByLabelText('Only my exhibitions')).not.toBeInTheDocument();
  });

  it('resets to the first page when a new search is submitted', async () => {
    const fetchMock = stubFetch([
      { url: '/api/exhibitions', body: pagedResponse(PAGE_ONE, 25) },
    ]);

    renderWithProviders(<ExhibitionsListPage />);

    await waitFor(() => expect(screen.getByText('Show 0')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /Next/ }));
    await waitFor(() => expect(lastListUrl(fetchMock)).toContain('page=2'));

    const search = screen.getByRole('search');
    await userEvent.type(within(search).getByPlaceholderText('Name or curator…'), 'light');
    await userEvent.click(within(search).getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(lastListUrl(fetchMock)).toContain('page=1'));
    expect(lastListUrl(fetchMock)).toContain('q=light');
  });
});
