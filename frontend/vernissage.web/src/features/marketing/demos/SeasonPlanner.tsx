import { useState } from 'react';

interface Show {
  id: string;
  title: string;
  artist: string;
  start: number; // month index, 0 = January
  months: number;
  visitors: number;
  sold: number;
  revenue: number;
  costs: { label: string; amount: number }[];
}

const SHOWS: Show[] = [
  { id: 'a', title: 'Afterimage', artist: 'Olena Kovalenko', start: 0, months: 2, visitors: 1240, sold: 9, revenue: 21600, costs: [{ label: 'Production', amount: 3200 }, { label: 'Framing', amount: 1400 }, { label: 'Opening', amount: 900 }] },
  { id: 'b', title: 'Load-Bearing', artist: 'Group show', start: 2, months: 2, visitors: 860, sold: 4, revenue: 9800, costs: [{ label: 'Production', amount: 4100 }, { label: 'Shipping', amount: 2600 }, { label: 'Opening', amount: 1100 }] },
  { id: 'c', title: 'Small Hours', artist: 'Maks Kravets', start: 5, months: 2, visitors: 640, sold: 6, revenue: 8700, costs: [{ label: 'Production', amount: 1800 }, { label: 'Framing', amount: 900 }, { label: 'Opening', amount: 700 }] },
  { id: 'd', title: 'Тиха вода', artist: 'Iryna Petrenko', start: 8, months: 2, visitors: 1510, sold: 11, revenue: 26400, costs: [{ label: 'Production', amount: 5200 }, { label: 'Lighting', amount: 1900 }, { label: 'Opening', amount: 1300 }] },
  { id: 'e', title: 'Winter Salon', artist: 'Group show', start: 10, months: 2, visitors: 2030, sold: 17, revenue: 19900, costs: [{ label: 'Production', amount: 2400 }, { label: 'Framing', amount: 2100 }, { label: 'Opening', amount: 1500 }] },
];

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const euro = (n: number) => `€${n.toLocaleString('en-GB')}`;

/** The season at a glance: click a show to see what it drew, sold and cost. */
export default function SeasonPlanner() {
  const [activeId, setActiveId] = useState('d');
  const show = SHOWS.find((s) => s.id === activeId) ?? SHOWS[0];
  const totalCost = show.costs.reduce((sum, c) => sum + c.amount, 0);
  const maxCost = Math.max(...show.costs.map((c) => c.amount));

  return (
    <div className="season">
      <div className="season-calendar">
        <div className="season-months" aria-hidden="true">
          {MONTHS.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
        <div className="season-lane" role="group" aria-label="The season's shows">
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
              <span className="season-show-artist">{s.artist}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="season-detail" aria-live="polite">
        <div className="season-detail-head">
          <p className="season-detail-title">{show.title}</p>
          <p className="season-detail-artist">{show.artist}</p>
        </div>
        <dl className="season-kpis">
          <div>
            <dt>Visitors</dt>
            <dd>{show.visitors.toLocaleString('en-GB')}</dd>
          </div>
          <div>
            <dt>Works sold</dt>
            <dd>{show.sold}</dd>
          </div>
          <div>
            <dt>Sales</dt>
            <dd>{euro(show.revenue)}</dd>
          </div>
          <div>
            <dt>Costs</dt>
            <dd>{euro(totalCost)}</dd>
          </div>
        </dl>
        <ul className="season-costs">
          {show.costs.map((c) => (
            <li key={c.label}>
              <span>{c.label}</span>
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
