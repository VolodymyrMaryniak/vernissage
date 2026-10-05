import { useState } from 'react';
import { useMessages } from '../../../i18n/useI18n';
import { currentLocale } from '../../../i18n/locales';
import { formatNumber } from '../../../i18n/format';
import type { Messages } from '../../../i18n/en';
import { euro } from './money';

type CostKey = keyof Messages['galleries']['season']['cost'];

interface Show {
  id: string;
  title: string;
  /** Null for a group show. */
  artist: string | null;
  start: number; // month index, 0 = January
  months: number;
  visitors: number;
  sold: number;
  revenue: number;
  costs: { label: CostKey; amount: number }[];
}

const SHOWS: Show[] = [
  { id: 'a', title: 'Afterimage', artist: 'Olena Kovalenko', start: 0, months: 2, visitors: 1240, sold: 9, revenue: 21600, costs: [{ label: 'production', amount: 3200 }, { label: 'framing', amount: 1400 }, { label: 'opening', amount: 900 }] },
  { id: 'b', title: 'Load-Bearing', artist: null, start: 2, months: 2, visitors: 860, sold: 4, revenue: 9800, costs: [{ label: 'production', amount: 4100 }, { label: 'shipping', amount: 2600 }, { label: 'opening', amount: 1100 }] },
  { id: 'c', title: 'Small Hours', artist: 'Maks Kravets', start: 5, months: 2, visitors: 640, sold: 6, revenue: 8700, costs: [{ label: 'production', amount: 1800 }, { label: 'framing', amount: 900 }, { label: 'opening', amount: 700 }] },
  { id: 'd', title: 'Тиха вода', artist: 'Iryna Petrenko', start: 8, months: 2, visitors: 1510, sold: 11, revenue: 26400, costs: [{ label: 'production', amount: 5200 }, { label: 'lighting', amount: 1900 }, { label: 'opening', amount: 1300 }] },
  { id: 'e', title: 'Winter Salon', artist: null, start: 10, months: 2, visitors: 2030, sold: 17, revenue: 19900, costs: [{ label: 'production', amount: 2400 }, { label: 'framing', amount: 2100 }, { label: 'opening', amount: 1500 }] },
];

/** Narrow month initials in the active language (J F M … / J F M … / С Л Б …). */
function monthInitials(): string[] {
  const f = new Intl.DateTimeFormat(currentLocale(), { month: 'narrow' });
  return Array.from({ length: 12 }, (_, i) => f.format(new Date(2026, i, 1)));
}

/** The season at a glance: click a show to see what it drew, sold and cost. */
export default function SeasonPlanner() {
  const t = useMessages().galleries.season;
  const [activeId, setActiveId] = useState('d');
  const show = SHOWS.find((s) => s.id === activeId) ?? SHOWS[0];
  const totalCost = show.costs.reduce((sum, c) => sum + c.amount, 0);
  const maxCost = Math.max(...show.costs.map((c) => c.amount));

  return (
    <div className="season">
      <div className="season-calendar">
        <div className="season-months" aria-hidden="true">
          {monthInitials().map((mo, i) => (
            <span key={i}>{mo}</span>
          ))}
        </div>
        <div className="season-lane" role="group" aria-label={t.shows}>
          {SHOWS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={s.id === activeId}
              className="season-show"
              style={{ gridColumn: `${s.start + 1} / span ${s.months}` }}
              onClick={() => setActiveId(s.id)}
            >
              <span className="season-show-title">{s.title}</span>
              <span className="season-show-artist">{s.artist ?? t.groupShow}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="season-detail" aria-live="polite">
        <div className="season-detail-head">
          <p className="season-detail-title">{show.title}</p>
          <p className="season-detail-artist">{show.artist ?? t.groupShow}</p>
        </div>
        <dl className="season-kpis">
          <div>
            <dt>{t.visitors}</dt>
            <dd>{formatNumber(show.visitors)}</dd>
          </div>
          <div>
            <dt>{t.sold}</dt>
            <dd>{show.sold}</dd>
          </div>
          <div>
            <dt>{t.sales}</dt>
            <dd>{euro(show.revenue)}</dd>
          </div>
          <div>
            <dt>{t.costs}</dt>
            <dd>{euro(totalCost)}</dd>
          </div>
        </dl>
        <ul className="season-costs">
          {show.costs.map((c) => (
            <li key={c.label}>
              <span>{t.cost[c.label]}</span>
              <span className="season-cost-bar" aria-hidden="true">
                <span style={{ width: `${(c.amount / maxCost) * 100}%` }} />
              </span>
              <span>{euro(c.amount)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
