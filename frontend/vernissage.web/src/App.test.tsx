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

  it('renders the app heading and the exhibitions view', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Vernissage' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ New exhibition' })).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText('No exhibitions yet. Create your first one.')).toBeInTheDocument(),
    );
  });
});
