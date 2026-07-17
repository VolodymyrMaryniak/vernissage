import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { getMetrics, saveMetrics } from '../../api/metricsApi';
import type { CostItemWrite, ExhibitionMetrics } from '../../types/metrics';

interface Props {
  exhibitionId: string;
}

interface CostRow extends CostItemWrite {
  /** Local row key for React lists. */
  rowId: number;
}

function toNumberOrNull(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function formatMoney(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Private metrics editor shown on the exhibition detail page — the caller must
 * render it only for the exhibition's owner.
 */
export default function MetricsSection({ exhibitionId }: Props) {
  const [metrics, setMetrics] = useState<ExhibitionMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [visitors, setVisitors] = useState('');
  const [satisfaction, setSatisfaction] = useState('');
  const [sold, setSold] = useState('');
  const [revenue, setRevenue] = useState('');
  const [costRows, setCostRows] = useState<CostRow[]>([]);
  const [nextRowId, setNextRowId] = useState(0);

  const load = useCallback(async () => {
    setError(null);
    try {
      setMetrics(await getMetrics(exhibitionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    }
  }, [exhibitionId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const beginEdit = () => {
    if (!metrics) return;
    setVisitors(metrics.visitorsCount?.toString() ?? '');
    setSatisfaction(metrics.satisfaction?.toString() ?? '');
    setSold(metrics.artworksSold?.toString() ?? '');
    setRevenue(metrics.totalRevenue?.toString() ?? '');
    setCostRows(metrics.costItems.map((c, i) => ({ rowId: i, label: c.label, amount: c.amount })));
    setNextRowId(metrics.costItems.length);
    setEditing(true);
  };

  const addCostRow = () => {
    setCostRows((rows) => [...rows, { rowId: nextRowId, label: '', amount: 0 }]);
    setNextRowId((n) => n + 1);
  };

  const updateCostRow = (rowId: number, patch: Partial<CostItemWrite>) => {
    setCostRows((rows) => rows.map((r) => (r.rowId === rowId ? { ...r, ...patch } : r)));
  };

  const removeCostRow = (rowId: number) => {
    setCostRows((rows) => rows.filter((r) => r.rowId !== rowId));
  };

  const editTotalCost = useMemo(
    () => costRows.reduce((sum, r) => sum + (Number.isNaN(r.amount) ? 0 : r.amount), 0),
    [costRows],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const saved = await saveMetrics(exhibitionId, {
        visitorsCount: toNumberOrNull(visitors),
        satisfaction: toNumberOrNull(satisfaction),
        artworksSold: toNumberOrNull(sold),
        totalRevenue: toNumberOrNull(revenue),
        costItems: costRows
          .filter((r) => r.label.trim() !== '')
          .map((r) => ({ label: r.label.trim(), amount: r.amount })),
      });
      setMetrics(saved);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save metrics');
    } finally {
      setSaving(false);
    }
  };

  if (!metrics && !error) {
    return null;
  }

  return (
    <section className="card view-section metrics-section">
      <div className="section-head">
        <h3 className="view-section-title">Private metrics</h3>
        <span className="chip">Only visible to you</span>
      </div>

      {error && <p className="banner banner-error">{error}</p>}

      {metrics && !editing && (
        <>
          {metrics.updatedAtUtc === null ? (
            <p className="muted">No metrics recorded yet.</p>
          ) : (
            <dl className="meta-grid">
              <div className="meta-item">
                <dt>Visitors</dt>
                <dd>{metrics.visitorsCount ?? '—'}</dd>
              </div>
              <div className="meta-item">
                <dt>Satisfaction</dt>
                <dd>{metrics.satisfaction !== null ? `${metrics.satisfaction} / 10` : '—'}</dd>
              </div>
              <div className="meta-item">
                <dt>Artworks sold</dt>
                <dd>{metrics.artworksSold ?? '—'}</dd>
              </div>
              <div className="meta-item">
                <dt>Total revenue</dt>
                <dd>{metrics.totalRevenue !== null ? formatMoney(metrics.totalRevenue) : '—'}</dd>
              </div>
              <div className="meta-item">
                <dt>Total cost</dt>
                <dd>{formatMoney(metrics.totalCost)}</dd>
              </div>
            </dl>
          )}

          {metrics.costItems.length > 0 && (
            <ul className="cost-list">
              {metrics.costItems.map((c) => (
                <li key={c.id}>
                  <span>{c.label}</span>
                  <span>{formatMoney(c.amount)}</span>
                </li>
              ))}
            </ul>
          )}

          <button type="button" className="btn btn-primary btn-sm" onClick={beginEdit}>
            {metrics.updatedAtUtc === null ? 'Add metrics' : 'Edit metrics'}
          </button>
        </>
      )}

      {metrics && editing && (
        <form onSubmit={handleSubmit} className="metrics-form">
          <div className="field-grid">
            <label className="field">
              <span className="field-label">Number of visitors</span>
              <input type="number" min={0} value={visitors} onChange={(e) => setVisitors(e.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">Satisfaction (1–10)</span>
              <input
                type="number"
                min={1}
                max={10}
                value={satisfaction}
                onChange={(e) => setSatisfaction(e.target.value)}
              />
            </label>
            <label className="field">
              <span className="field-label">Artworks sold</span>
              <input type="number" min={0} value={sold} onChange={(e) => setSold(e.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">Total revenue</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
              />
            </label>
          </div>

          <div className="section-head">
            <h4 className="view-section-title">Cost breakdown</h4>
            <span className="muted">Total: {formatMoney(editTotalCost)}</span>
          </div>
          {costRows.map((row) => (
            <div className="cost-row" key={row.rowId}>
              <input
                type="text"
                placeholder="e.g. Framing, rent, welcome brunch…"
                maxLength={200}
                value={row.label}
                onChange={(e) => updateCostRow(row.rowId, { label: e.target.value })}
              />
              <input
                type="number"
                min={0}
                step="0.01"
                aria-label="Amount"
                value={Number.isNaN(row.amount) ? '' : row.amount}
                onChange={(e) => updateCostRow(row.rowId, { amount: Number(e.target.value) })}
              />
              <button
                type="button"
                className="btn btn-danger-ghost btn-sm"
                onClick={() => removeCostRow(row.rowId)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm" onClick={addCostRow}>
            + Add cost item
          </button>

          <div className="form-actions--inline">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save metrics'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
