import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getAnalyticsSummary } from '../../api/analyticsApi';
import type { AnalyticsSummary } from '../../types/analytics';
import type { ExhibitionFilters } from '../../types/exhibition';
import { useAppConfig } from '../config/useAppConfig';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

function formatMoney(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AnalyticsPage() {
  useDocumentMeta({ title: 'Analytics' });
  const { analyticsEnabled, loading: configLoading } = useAppConfig();

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [focus, setFocus] = useState('');
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const load = useCallback(async (filters: ExhibitionFilters) => {
    setLoading(true);
    setError(null);
    try {
      setSummary(await getAnalyticsSummary(filters));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // The API 404s when the feature is off; don't ask for data we can't have.
    if (!analyticsEnabled) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load({});
  }, [load, analyticsEnabled]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void load({
      q: q.trim() || undefined,
      focus: focus.trim() || undefined,
      from: from || undefined,
      to: to || undefined,
    });
  };

  const stats = summary
    ? [
        { label: 'Exhibitions', value: String(summary.exhibitionCount) },
        { label: 'With metrics', value: String(summary.exhibitionsWithMetrics) },
        { label: 'Visitors', value: summary.totalVisitors.toLocaleString() },
        { label: 'Artworks sold', value: summary.totalArtworksSold.toLocaleString() },
        { label: 'Total revenue', value: formatMoney(summary.totalRevenue) },
        { label: 'Total cost', value: formatMoney(summary.totalCost) },
        {
          label: 'Avg. satisfaction',
          value: summary.averageSatisfaction !== null ? `${summary.averageSatisfaction} / 10` : '—',
        },
      ]
    : [];

  // Reachable by direct URL even with no nav link, so say why it's empty.
  if (!configLoading && !analyticsEnabled) {
    return (
      <div className="analytics-page">
        <header className="page-head">
          <div>
            <p className="eyebrow">Insights</p>
            <h2>Analytics</h2>
          </div>
        </header>
        <p className="muted">Analytics is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>
            Analytics <span className="chip">Pro — free during beta</span>
          </h2>
          <p className="page-sub">Aggregated from your own exhibitions&apos; private metrics.</p>
        </div>
      </header>

      <form className="search-bar card" onSubmit={handleSubmit}>
        <div className="field-grid">
          <label className="field">
            <span className="field-label">Search</span>
            <input
              type="search"
              placeholder="Name or curator…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">Focus / topic</span>
            <input
              type="text"
              placeholder="e.g. Light art"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">From</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="field">
            <span className="field-label">To</span>
            <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
          </label>
        </div>
        <div className="search-bar-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            {loading ? 'Loading…' : 'Apply filters'}
          </button>
        </div>
      </form>

      {error && <p className="banner banner-error">{error}</p>}

      {summary && (
        <div className="stat-grid">
          {stats.map((s) => (
            <div className="card stat-tile" key={s.label}>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {summary && summary.exhibitionsWithMetrics === 0 && (
        <p className="muted">
          No metrics recorded yet — open one of your exhibitions and add private metrics to see
          numbers here.
        </p>
      )}
    </div>
  );
}
