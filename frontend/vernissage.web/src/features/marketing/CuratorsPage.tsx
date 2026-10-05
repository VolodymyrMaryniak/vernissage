import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import ChecklistDemo from './demos/ChecklistDemo';
import ShowTimeline from './demos/ShowTimeline';
import { useMessages } from '../../i18n/useI18n';
import Rich from '../../i18n/Rich';
import { formatDate } from '../../i18n/format';

// Shows curated across institutions: the record moves with the curator.
const CAREER = [
  { year: '2026', title: 'Soft Architectures', venue: 'Voloshyn Gallery, Kyiv' },
  { year: '2025', title: 'Quiet Quartet', venue: 'Kunsthalle Wien' },
  { year: '2024', title: 'The Long Walk', venue: 'Mystetskyi Arsenal, Kyiv' },
  { year: '2023', title: 'Night Shift', venue: 'Lviv Municipal Art Center' },
];

export default function CuratorsPage() {
  const m = useMessages();
  const t = m.curators;
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });
  const dates = `${formatDate('2026-03-12', { day: 'numeric', month: 'long' })} – ${formatDate('2026-04-30')}`;

  return (
    <div className="audience audience--curators">
      {/* ---- Hero: the curatorial desk --------------------------- */}
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
          <figure className="wall-label" aria-label={t.wallLabel}>
            <p className="wall-label-title">Soft Architectures</p>
            <p>{dates}</p>
            <p>Voloshyn Gallery, Kyiv</p>
            <p className="wall-label-rule" />
            <p>{t.wallCount}</p>
            <p className="wall-label-you">{t.wallYou}</p>
          </figure>
        </div>
      </section>

      {/* ---- Timeline ------------------------------------------ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.timelineEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.timelineTitle} />
            </h2>
            <p className="prose">{t.timelineBody}</p>
          </div>
          <ShowTimeline />
        </div>
      </section>

      {/* ---- Checklist ----------------------------------------- */}
      <section className="section section--band">
        <div className="container aud-split">
          <div className="section-head">
            <p className="eyebrow">{t.checklistEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.checklistTitle} />
            </h2>
            <p className="prose">{t.checklistBody}</p>
          </div>
          <ChecklistDemo />
        </div>
      </section>

      {/* ---- Career strip -------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.portableEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.portableTitle} />
            </h2>
          </div>
          <ol className="career-strip">
            {CAREER.map((c) => (
              <li key={c.title}>
                <span className="career-year">{c.year}</span>
                <span className="career-title">{c.title}</span>
                <span className="career-venue">{c.venue}</span>
              </li>
            ))}
          </ol>
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
