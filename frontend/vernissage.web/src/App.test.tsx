import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    // ExhibitionsPage fetches the list on mount; stub it with an empty result.
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the app brand and the exhibitions view', async () => {
    render(<App />);

    expect(screen.getByRole('link', { name: /vernissage/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Exhibitions' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '+ New exhibition' }).length).toBeGreaterThan(0);

    await waitFor(() =>
      expect(screen.getByText('No exhibitions yet. Create your first one.')).toBeInTheDocument(),
    );
  });
});
