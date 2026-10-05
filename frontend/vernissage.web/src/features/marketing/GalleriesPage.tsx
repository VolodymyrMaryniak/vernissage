import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import MarginCalculator from './demos/MarginCalculator';
import SeasonPlanner from './demos/SeasonPlanner';

const KPIS = [
  { label: 'Visitors this season', value: '6,280', bars: [40, 55, 35, 70, 90] },
  { label: 'Works sold', value: '47', bars: [50, 30, 40, 65, 95] },
  { label: 'Net after costs', value: '€41,700', bars: [30, 45, 25, 80, 70] },
];

const TEAM = [
  { title: 'One account, every role', body: 'Gallery, curator and artist in any combination, with a profile to match.' },
  { title: 'Private by default', body: 'Costs, sales and visitor numbers are visible only to you.' },
  { title: 'Shared Drive for the program', body: 'One folder per show for views, masters and press.', planned: true },
];

export default function GalleriesPage() {
  useDocumentMeta({
    title: 'For galleries',
    description:
      'Document every show in your program and see what each one cost, sold and drew, privately and across the whole season.',
  });

  return (
    <div className="audience audience--galleries">
      {/* ---- Hero: the business view ---------------------------- */}
      <section className="page-hero aud-hero">
        <div className="container aud-hero-inner">
          <div className="aud-hero-text">
            <p className="eyebrow">For galleries &amp; institutions</p>
            <h1 className="display">
              Your program, <em>run like a business</em>.
            </h1>
            <p className="lede">
              Document every show, then see what each one cost, sold and drew, privately and across
              the whole season.
            </p>
            <div className="hero-actions">
              <Link className="cta" to="/register">
                Set up your gallery
              </Link>
            </div>
          </div>
          <ul className="kpi-tiles" aria-label="Example season figures">
            {KPIS.map((k) => (
              <li key={k.label}>
                <span className="kpi-label">{k.label}</span>
                <span className="kpi-value">{k.value}</span>
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
            <p className="eyebrow">Your season</p>
            <h2 className="headline">
              Every show in the program, <em>with its numbers</em>.
            </h2>
            <p className="prose">Click a show to open its figures.</p>
          </div>
          <SeasonPlanner />
        </div>
      </section>

      {/* ---- Margin calculator --------------------------------- */}
      <section className="section section--band">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Before you commit</p>
            <h2 className="headline">
              What will this show <em>leave you with</em>?
            </h2>
            <p className="prose">Move the sliders. Vernissage keeps the real figures for every show you run.</p>
          </div>
          <MarginCalculator />
        </div>
      </section>

      {/* ---- Team ---------------------------------------------- */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">Built for a team</p>
          <ul className="aud-also">
            {TEAM.map((t) => (
              <li key={t.title}>
                <h3>
                  {t.title}
                  {t.planned && <span className="chip-mono chip-planned">Planned</span>}
                </h3>
                <p>{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cta-band">
        <div className="container section cta-band-inner">
          <div>
            <p className="eyebrow">Analytics free while in beta</p>
            <h2 className="headline">Put this season on the record.</h2>
          </div>
          <div className="cta-band-actions">
            <Link className="cta" to="/register">
              Set up your gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
