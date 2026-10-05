import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import MarginCalculator from './demos/MarginCalculator';
import SeasonPlanner from './demos/SeasonPlanner';
import { euro } from './demos/money';
import { useMessages } from '../../i18n/useI18n';
import Rich from '../../i18n/Rich';
import { formatNumber } from '../../i18n/format';
import type { Messages } from '../../i18n/en';

const KPIS: { key: keyof Messages['galleries']['kpis']; value: () => string; bars: number[] }[] = [
  { key: 'visitors', value: () => formatNumber(6280), bars: [40, 55, 35, 70, 90] },
  { key: 'sold', value: () => formatNumber(47), bars: [50, 30, 40, 65, 95] },
  { key: 'net', value: () => euro(41700), bars: [30, 45, 25, 80, 70] },
];

const TEAM: { key: keyof Messages['galleries']['team']; planned?: boolean }[] = [
  { key: 'roles' },
  { key: 'private' },
  { key: 'drive', planned: true },
];

export default function GalleriesPage() {
  const m = useMessages();
  const t = m.galleries;
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });

  return (
    <div className="audience audience--galleries">
      {/* ---- Hero: the business view ---------------------------- */}
      <section className="page-hero aud-hero">
        <div className="container aud-hero-inner">
          <div className="aud-hero-text">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="display">
              <Rich text={t.title} />
            </h1>
            <p className="lede">{t.lede}</p>
            <div className="hero-actions">
              <Link className="cta" to="/register">
                {t.cta}
              </Link>
            </div>
          </div>
          <ul className="kpi-tiles" aria-label={t.kpiLabel}>
            {KPIS.map((k) => (
              <li key={k.key}>
                <span className="kpi-label">{t.kpis[k.key]}</span>
                <span className="kpi-value">{k.value()}</span>
                <span className="kpi-bars" aria-hidden="true">
                  {k.bars.map((b, i) => (
                    <span key={i} style={{ height: `${b}%` }} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Season planner ------------------------------------ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.seasonEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.seasonTitle} />
            </h2>
            <p className="prose">{t.seasonBody}</p>
          </div>
          <SeasonPlanner />
        </div>
      </section>

      {/* ---- Margin calculator --------------------------------- */}
      <section className="section section--band">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.marginEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.marginTitle} />
            </h2>
            <p className="prose">{t.marginBody}</p>
          </div>
          <MarginCalculator />
        </div>
      </section>

      {/* ---- Team ---------------------------------------------- */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">{t.teamEyebrow}</p>
          <ul className="aud-also">
            {TEAM.map((item) => (
              <li key={item.key}>
                <h3>
                  {t.team[item.key].title}
                  {item.planned && <span className="chip-mono chip-planned">{m.common.planned}</span>}
                </h3>
                <p>{t.team[item.key].body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cta-band">
        <div className="container section cta-band-inner">
          <div>
            <p className="eyebrow">{t.ctaEyebrow}</p>
            <h2 className="headline">{t.ctaTitle}</h2>
          </div>
          <div className="cta-band-actions">
            <Link className="cta" to="/register">
              {t.cta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
