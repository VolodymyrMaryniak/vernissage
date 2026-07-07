import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App', () => {
  beforeEach(() => {
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
    expect(screen.getAllByRole('button', { name: '+ New exhibition' }).length).toBeGreaterThan(0);

    await waitFor(() =>
      expect(screen.getByText('No exhibitions yet. Create your first one.')).toBeInTheDocument(),
    );
  });

  it('renders the create form at /exhibitions/new', () => {
    renderAt('/exhibitions/new');

    expect(screen.getByRole('heading', { name: 'Create an exhibition' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create exhibition' })).toBeInTheDocument();
  });

  it('redirects unknown routes back to the list', async () => {
    renderAt('/nonsense');

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Exhibitions' })).toBeInTheDocument(),
    );
  });
});
