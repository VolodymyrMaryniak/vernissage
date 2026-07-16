import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AnalyticsPage from './AnalyticsPage';

const SUMMARY = {
  exhibitionCount: 3,
  exhibitionsWithMetrics: 2,
  totalVisitors: 450,
  totalArtworksSold: 12,
  totalRevenue: 15000,
  totalCost: 5000,
  averageSatisfaction: 7.5,
};

describe('AnalyticsPage', () => {
  beforeEach(() => {
    localStorage.setItem('vernissage.token', 'jwt');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify(SUMMARY), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('renders aggregated stat tiles', async () => {
    render(<AnalyticsPage />);

    await waitFor(() => expect(screen.getByText('450')).toBeInTheDocument());
    expect(screen.getByText('7.5 / 10')).toBeInTheDocument();
    expect(screen.getByText('Total revenue')).toBeInTheDocument();
  });
});
