import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getAnalyticsSummary } from '../../api/analyticsApi';
import type { AnalyticsSummary } from '../../types/analytics';
import type { ExhibitionFilters } from '../../types/exhibition';
import { useAppConfig } from '../config/useAppConfig';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { useMessages } from '../../i18n/useI18n';
import { formatNumber } from '../../i18n/format';

function formatMoney(value: number): string {
  return formatNumber(value, undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AnalyticsPage() {
  const m = useMessages();
  const t = m.analytics;
  useDocumentMeta({ title: t.metaTitle });
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
      setError(err instanceof Error ? err.message : t.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [t.loadFailed]);

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
        { label: t.exhibitions, value: formatNumber(summary.exhibitionCount) },
        { label: t.withMetrics, value: formatNumber(summary.exhibitionsWithMetrics) },
        { label: t.visitors, value: formatNumber(summary.totalVisitors) },
        { label: t.sold, value: formatNumber(summary.totalArtworksSold) },
        { label: t.revenue, value: formatMoney(summary.totalRevenue) },
        { label: t.cost, value: formatMoney(summary.totalCost) },
        {
          label: t.satisfaction,
          value: summary.averageSatisfaction !== null ? `${formatNumber(summary.averageSatisfaction)} / 10` : '—',
        },
      ]
    : [];

  // Reachable by direct URL even with no nav link, so say why it's empty.
  if (!configLoading && !analyticsEnabled) {
    return (
      <div className="analytics-page">
        <header className="page-head">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2>{t.title}</h2>
          </div>
        </header>
        <p className="muted">{t.unavailable}</p>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>
            {t.title} <span className="chip">{t.badge}</span>
          </h2>
          <p className="page-sub">{t.sub}</p>
        </div>
      </header>

      <form className="search-bar card" onSubmit={handleSubmit}>
        <div className="field-grid">
          <label className="field">
            <span className="field-label">{m.ex.search.search}</span>
            <input
              type="search"
              placeholder={m.ex.search.searchPlaceholder}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">{m.ex.search.focus}</span>
            <input
              type="text"
              placeholder={m.ex.search.focusPlaceholder}
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">{m.ex.search.from}</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="field">
            <span className="field-label">{m.ex.search.to}</span>
            <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
          </label>
        </div>
        <div className="search-bar-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            {loading ? m.common.loading : t.apply}
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
        <p className="muted">{t.none}</p>
      )}
    </div>
  );
}
