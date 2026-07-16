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
    // The list route fetches on mount; stub it with an empty result.
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the app brand and the exhibitions list at the root route', async () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: /vernissage/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Exhibitions' })).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('No exhibitions yet.')).toBeInTheDocument());
  });

  it('hides the create CTA and offers login for anonymous visitors', async () => {
    renderAt('/');

    expect(screen.queryByRole('button', { name: '+ New exhibition' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('No exhibitions yet.')).toBeInTheDocument());
  });

  it('redirects anonymous users from /exhibitions/new to the login page', async () => {
    renderAt('/exhibitions/new');

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument(),
    );
  });

  it('redirects unknown routes back to the list', async () => {
    renderAt('/nonsense');

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Exhibitions' })).toBeInTheDocument(),
    );
  });
});
