import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AppVersion from './AppVersion';

describe('AppVersion', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            version: '1.2.3',
            branch: 'develop',
            buildTimeUtc: '2026-07-12T10:00:00Z',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows frontend build info and the backend version once loaded', async () => {
    render(<AppVersion />);

    // Frontend info is available synchronously from the injected build constants.
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();

    // Backend info arrives from the /api/version fetch.
    await waitFor(() => expect(screen.getByText('1.2.3')).toBeInTheDocument());
    expect(screen.getByText('develop')).toBeInTheDocument();
  });

  it('shows an unavailable message when the backend version cannot be loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('error', { status: 500 })),
    );

    render(<AppVersion />);

    await waitFor(() => expect(screen.getByText(/Unavailable/)).toBeInTheDocument());
  });
});
