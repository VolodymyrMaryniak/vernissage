import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import Icon from '../../components/Icon';
import type { IconName } from '../../components/Icon';

const BENEFITS: {
  index: string;
  icon: IconName;
  title: string;
  body: string;
  planned?: boolean;
}[] = [
  {
    index: '01',
    icon: 'palette',
    title: 'Your works, catalogued',
    body: 'Medium, dimensions, year and images in structured fields — not scattered across folders.',
  },
  {
    index: '02',
    icon: 'folder',
    title: 'Files sort themselves',
    body: 'A Drive folder per show, foldered by material — masters, press, essays — filed as you upload.',
    planned: true,
  },
  {
    index: '03',
    icon: 'portfolio',
    title: 'Portfolio & CV in a click',
    body: 'Generate a portfolio or CV for an open call, grant or residency from records you already keep.',
    planned: true,
  },
  {
    index: '04',
    icon: 'bell',
    title: 'Updates while it runs',
    body: 'Push quick changes mid-show — dates, works, press — and everyone following the entry hears about it.',
    planned: true,
  },
  {
    index: '05',
    icon: 'document',
    title: 'One record per show',
    body: 'Every exhibition you are in, kept in one place and ready to point a curator at.',
  },
  {
    index: '06',
    icon: 'globe',
    title: 'A page you can send',
    body: 'A public entry anyone can read and link to — no account needed.',
  },
];

export default function ArtistsPage() {
  useDocumentMeta({
    title: 'For artists',
    description:
      'Catalogue your works and exhibitions, keep the files in order, and generate a portfolio or CV for submissions from records you already keep.',
  });

  return (
    <>
      {/* ---- Hero ------------------------------------------------ */}
      <section className="page-hero">
        <div className="wash-drift" aria-hidden="true" />
        <div className="container page-hero-inner">
          <p className="eyebrow">For artists</p>
          <h1 className="display">
            Your work, <em>submission-ready</em>.
          </h1>
          <p className="lede">
            Document each show once. Get the portfolio, the CV and the record back.
          </p>
          <div className="hero-actions">
            <Link className="cta" to="/exhibitions/new">
              Document a show
            </Link>
            <Link className="cta cta--secondary" to="/archive">
              Browse the archive
            </Link>
          </div>
        </div>
      </section>

      {/* ---- What you get --------------------------------------- */}
      <section className="section section--band">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What you get</p>
            <h2 className="headline">
              The work around the work, <em>handled</em>.
            </h2>
          </div>
          <div className="cell-grid cell-grid--3">
            {BENEFITS.map((benefit) => (
              <div className="cell cell--icon" key={benefit.title}>
                <span className="cell-icon">
                  <Icon name={benefit.icon} />
                </span>
                <div className="cell-body">
                  <span className="cell-label">
                    <span className="cell-index">{benefit.index}</span>
                    {benefit.planned && (
                      <span className="chip-mono chip-planned">Planned</span>
                    )}
                  </span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA band ------------------------------------------- */}
      <section className="cta-band">
        <div className="container section cta-band-inner">
          <div>
            <p className="eyebrow">Open access, non-commercial</p>
            <h2 className="headline">Start with your last show.</h2>
          </div>
          <div className="cta-band-actions">
            <Link className="cta" to="/exhibitions/new">
              Document a show
            </Link>
            <Link className="cta cta--secondary" to="/archive">
              Browse the archive
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
