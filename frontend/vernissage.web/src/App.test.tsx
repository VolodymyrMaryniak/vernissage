import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { AuthProvider } from './features/auth/AuthContext';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    // Some routes fetch on mount (archive list, version footer); stub with
    // a benign empty response.
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } })),
    );
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

  it('redirects unknown routes back to the home page', async () => {
    renderAt('/nonsense');

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /document your art exhibition properly/i }),
      ).toBeInTheDocument(),
    );
  });
});
