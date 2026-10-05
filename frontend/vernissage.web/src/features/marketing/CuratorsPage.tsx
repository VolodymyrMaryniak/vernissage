import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import ChecklistDemo from './demos/ChecklistDemo';
import ShowTimeline from './demos/ShowTimeline';

// Shows curated across institutions: the record moves with the curator.
const CAREER = [
  { year: '2026', title: 'Soft Architectures', venue: 'Voloshyn Gallery, Kyiv' },
  { year: '2025', title: 'Quiet Quartet', venue: 'Kunsthalle Wien' },
  { year: '2024', title: 'The Long Walk', venue: 'Mystetskyi Arsenal, Kyiv' },
  { year: '2023', title: 'Night Shift', venue: 'Lviv Municipal Art Center' },
];

export default function CuratorsPage() {
  useDocumentMeta({
    title: 'For independent curators',
    description:
      'One place for every show you curate, from first idea to opening night, that stays yours from one institution to the next.',
  });

  return (
    <div className="audience audience--curators">
      {/* ---- Hero: the curatorial desk --------------------------- */}
      <section className="page-hero aud-hero">
        <div className="container aud-hero-inner">
          <div className="aud-hero-text">
            <p className="eyebrow">For independent curators</p>
            <h1 className="display">
              Every show you curate, <em>from first idea to opening night</em>.
            </h1>
            <p className="lede">
              Keep the concept, the checklist, the team and the plans in one place, and take it with
              you to the next institution.
            </p>
            <div className="hero-actions">
              <Link className="cta" to="/register">
                Open your workspace
              </Link>
            </div>
          </div>
          <figure className="wall-label" aria-label="Example wall label">
            <p className="wall-label-title">Soft Architectures</p>
            <p>12 March – 30 April 2026</p>
            <p>Voloshyn Gallery, Kyiv</p>
            <p className="wall-label-rule" />
            <p>Five artists · 18 works</p>
            <p className="wall-label-you">Curated by you</p>
          </figure>
        </div>
      </section>

      {/* ---- Timeline ------------------------------------------ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">The life of a show</p>
            <h2 className="headline">
              Six stages, <em>one record</em>.
            </h2>
            <p className="prose">Click a stage to see what you keep there.</p>
          </div>
          <ShowTimeline />
        </div>
      </section>

      {/* ---- Checklist ----------------------------------------- */}
      <section className="section section--band">
        <div className="container aud-split">
          <div className="section-head">
            <p className="eyebrow">The checklist</p>
            <h2 className="headline">
              Know what&apos;s ready <em>before the van arrives</em>.
            </h2>
            <p className="prose">Mark works as catalogued and watch the show come together.</p>
          </div>
          <ChecklistDemo />
        </div>
      </section>

      {/* ---- Career strip -------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Portable</p>
            <h2 className="headline">
              Institutions change. <em>Your record doesn&apos;t.</em>
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
            <p className="eyebrow">Free while in beta</p>
            <h2 className="headline">Start with the show you&apos;re working on now.</h2>
          </div>
          <div className="cta-band-actions">
            <Link className="cta" to="/register">
              Open your workspace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
