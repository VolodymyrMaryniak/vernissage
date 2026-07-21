import { screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { pagedResponse, renderWithProviders, stubFetch } from './testUtils';

function renderAt(path: string) {
  return renderWithProviders(<App />, { route: path });
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    // Several routes fetch on mount (home, archive list, build info); answer
    // the list endpoint with an empty page and everything else with {}.
    stubFetch([{ url: '/api/exhibitions', body: pagedResponse([]) }]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the wordmark and the marketing home at the root route', () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: /vernissage/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /document your art exhibition properly/i }),
    ).toBeInTheDocument();
  });

  it('offers sign in and the document CTA for anonymous visitors', () => {
    renderAt('/');

    expect(screen.getAllByRole('link', { name: 'Sign in' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Document a show' }).length).toBeGreaterThan(0);
  });

  it('renders the archive index at /archive', async () => {
    renderAt('/archive');

    expect(screen.getByRole('heading', { name: /indexed/i })).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText(/no exhibitions have been documented yet/i)).toBeInTheDocument(),
    );
  });

  it('redirects anonymous users from /exhibitions/new to the sign-in page', async () => {
    renderAt('/exhibitions/new');

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument(),
    );
  });

  it('serves build info at the unlisted /version route', async () => {
    renderAt('/version');

    expect(screen.getByRole('heading', { name: 'Build info' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Frontend' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Backend' })).toBeInTheDocument();
    // Deliberately unlisted: no link in the header or footer points at it.
    expect(screen.queryByRole('link', { name: /build info|version/i })).not.toBeInTheDocument();
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).not.toBeNull());
  });

  it('redirects unknown routes back to the home page', async () => {
    renderAt('/nonsense');

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /document your art exhibition properly/i }),
      ).toBeInTheDocument(),
    );
  });
});
