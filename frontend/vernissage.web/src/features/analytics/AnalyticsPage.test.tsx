import { screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders, stubFetch } from '../../testUtils';
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
    stubFetch([{ url: '/api/analytics/summary', body: SUMMARY }]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('renders aggregated stat tiles', async () => {
    renderWithProviders(<AnalyticsPage />);

    await waitFor(() => expect(screen.getByText('450')).toBeInTheDocument());
    expect(screen.getByText('7.5 / 10')).toBeInTheDocument();
    expect(screen.getByText('Total revenue')).toBeInTheDocument();
  });

  it('reports the feature as unavailable when the flag is off', async () => {
    const fetchMock = stubFetch([
      { url: '/api/analytics/summary', body: SUMMARY },
      { url: '/api/config', body: { analyticsEnabled: false } },
    ]);

    renderWithProviders(<AnalyticsPage />);

    await waitFor(() =>
      expect(screen.getByText('Analytics is currently unavailable.')).toBeInTheDocument(),
    );
    // The gated endpoint is never called.
    expect(
      fetchMock.mock.calls.some(([url]) => String(url).includes('/api/analytics')),
    ).toBe(false);
  });
});
