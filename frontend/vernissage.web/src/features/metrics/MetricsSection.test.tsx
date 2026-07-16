import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MetricsSection from './MetricsSection';

const EMPTY_METRICS = {
  visitorsCount: null,
  satisfaction: null,
  artworksSold: null,
  totalRevenue: null,
  totalCost: 0,
  costItems: [],
  updatedAtUtc: null,
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('MetricsSection', () => {
  beforeEach(() => {
    localStorage.setItem('vernissage.token', 'jwt');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('shows an empty state then saves entered metrics', async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.method === 'PUT') {
        return jsonResponse({
          ...EMPTY_METRICS,
          visitorsCount: 120,
          totalCost: 500,
          costItems: [{ id: 'c1', label: 'Rent', amount: 500 }],
          updatedAtUtc: '2026-07-16T00:00:00Z',
        });
      }
      return jsonResponse(EMPTY_METRICS);
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<MetricsSection exhibitionId="ex1" />);

    await waitFor(() => expect(screen.getByText('No metrics recorded yet.')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: 'Add metrics' }));
    await userEvent.type(screen.getByLabelText('Number of visitors'), '120');
    await userEvent.click(screen.getByRole('button', { name: 'Save metrics' }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/exhibitions/ex1/metrics'),
        expect.objectContaining({ method: 'PUT' }),
      ),
    );
    await waitFor(() => expect(screen.getByText('120')).toBeInTheDocument());
  });
});
