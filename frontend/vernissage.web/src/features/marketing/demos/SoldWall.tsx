import { useState } from 'react';
import { useMessages } from '../../../i18n/useI18n';
import { fmt } from '../../../i18n/format';
import { euro } from './money';

const WORKS = [
  { id: 1, title: 'Afterimage I', medium: 'oilLinen', price: 2400, tone: 'peony' },
  { id: 2, title: 'Blackout, Podil', medium: 'print', price: 900, tone: 'ink' },
  { id: 3, title: 'Small Hours', medium: 'oilBoard', price: 1600, tone: 'olive' },
  { id: 4, title: 'Afterimage II', medium: 'oilLinen', price: 2400, tone: 'sand' },
  { id: 5, title: 'Window, 4 a.m.', medium: 'gouache', price: 750, tone: 'dusk' },
  { id: 6, title: 'Тиха вода', medium: 'light', price: 5200, tone: 'night' },
] as const;


/** Opening night: click a work to put the red "sold" dot on it; the tally keeps count. */
export default function SoldWall() {
  const t = useMessages().artists.soldWall;
  const [sold, setSold] = useState<Set<number>>(new Set([1]));
  const toggle = (id: number) =>
    setSold((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const revenue = WORKS.filter((w) => sold.has(w.id)).reduce((sum, w) => sum + w.price, 0);

  return (
    <div className="sold-wall">
      <ul className="sold-wall-works">
        {WORKS.map((w) => (
          <li key={w.id}>
            <button
              type="button"
              className={`sold-work sold-work--${w.tone}`}
              aria-pressed={sold.has(w.id)}
              onClick={() => toggle(w.id)}
            >
              <span className="sold-work-canvas" aria-hidden="true">
                {sold.has(w.id) && <span className="sold-dot" />}
              </span>
              <span className="sold-work-label">
                <span className="sold-work-title">{w.title}</span>
                <span className="sold-work-meta">
                  {t.mediums[w.medium]} · {euro(w.price)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="sold-tally" aria-live="polite">
        <p className="sold-tally-number">
          {sold.size} <span>{fmt(t.of, { n: WORKS.length })}</span>
        </p>
        <p className="sold-tally-revenue">{euro(revenue)}</p>
        <p className="sold-tally-note">{t.note}</p>
      </div>
    </div>
  );
}
