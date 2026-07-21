import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

const SETUP_STEPS = [
  {
    index: '01',
    title: 'Set up your gallery workspace',
    body: 'Open a gallery account and describe the space — name, location, focus and founding year.',
  },
  {
    index: '02',
    title: 'Document each show in the program',
    body: 'Every exhibition lands in one catalogue, with installation views, plans, audio and documents attached to the entry.',
  },
  {
    index: '03',
    title: 'Publish a program-wide archive',
    body: 'Each show gets a public page, searchable alongside everything else you have shown.',
  },
];

const FEATURES = [
  {
    index: '01',
    title: 'Creator roles',
    body: 'Gallery, curator and artist roles sit on one account in any combination, and the profile adapts to whichever apply.',
  },
  {
    index: '02',
    title: 'Shared Drive at the gallery level',
    body: 'Planned: one Drive for the whole program, with a folder per show, so installation views, works-masters and press stay organised across every exhibition.',
    planned: true,
  },
  {
    index: '03',
    title: 'A program-wide archive',
    body: 'Every show is indexed under the gallery and open to researchers and press. Team accounts and per-revision citation are planned.',
  },
];

export default function GalleriesPage() {
  useDocumentMeta({
    title: 'For galleries',
    description:
      'A workspace for galleries, gathering every show your gallery makes into one program-wide, public archive.',
  });

  return (
    <>
      {/* ---- Hero ------------------------------------------------ */}
      <section className="page-hero">
        <div className="wash-drift" aria-hidden="true" />
        <div className="container page-hero-inner">
          <p className="eyebrow">For galleries</p>
          <h1 className="display">
            One archive for the whole <em>program</em>.
          </h1>
          <p className="lede">
            A workspace built around how galleries actually work — every show catalogued in full
            and gathered into a program-wide archive that stays readable long after the walls
            come down.
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

      {/* ---- Three-step setup ----------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How it works</p>
            <h2 className="headline">
              From a single account to a <em>program</em>-wide record.
            </h2>
          </div>
          <div className="cell-grid cell-grid--3">
            {SETUP_STEPS.map((step) => (
              <div className="cell" key={step.index}>
                <span className="cell-index">{step.index}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Feature band --------------------------------------- */}
      <section className="section section--band">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Built for a team</p>
            <h2 className="headline">
              One catalogue, one <em>archive</em>.
            </h2>
          </div>
          <div className="cell-grid cell-grid--3">
            {FEATURES.map((feature) => (
              <div className="cell" key={feature.index}>
                <span className="cell-index">{feature.index}</span>
                <h3>
                  {feature.title}
                  {feature.planned && <span className="chip-mono chip-planned">Planned</span>}
                </h3>
                <p>{feature.body}</p>
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
            <h2 className="headline">One program, properly recorded.</h2>
          </div>
          <div>
            <p className="prose">
              Gather every show your gallery makes into one archive — catalogued in full, kept
              open, and readable for good.
            </p>
            <div className="cta-band-actions">
              <Link className="cta" to="/exhibitions/new">
                Document a show
              </Link>
              <Link className="cta cta--secondary" to="/archive">
                Browse the archive
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
