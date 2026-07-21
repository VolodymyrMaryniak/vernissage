import { render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import VersionPage from './VersionPage';

describe('VersionPage', () => {
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
    render(<VersionPage />);

    // Frontend info is available synchronously from the injected build constants.
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();

    // Backend info arrives from the /api/version fetch. Scope the branch assertion
    // to the Backend section: the frontend's own branch (__APP_BRANCH__) is also
    // "develop" whenever CI builds on the develop branch, so an unscoped getByText
    // would match two elements and throw.
    await waitFor(() => expect(screen.getByText('1.2.3')).toBeInTheDocument());
    const backendSection = screen.getByRole('heading', { name: 'Backend' }).closest('section');
    expect(backendSection).not.toBeNull();
    expect(within(backendSection as HTMLElement).getByText('develop')).toBeInTheDocument();
  });

  it('shows an unavailable message when the backend version cannot be loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('error', { status: 500 })),
    );

    render(<VersionPage />);

    await waitFor(() => expect(screen.getByText(/Unavailable/)).toBeInTheDocument());
  });
});
