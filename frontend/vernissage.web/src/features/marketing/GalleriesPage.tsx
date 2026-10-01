import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import Icon, { type IconName } from '../../components/Icon';

type Cell = { index: string; icon: IconName; title: string; body: string; planned?: boolean };

const SETUP_STEPS: Cell[] = [
  { index: '01', icon: 'building', title: 'Set up your gallery', body: 'Name, location, focus.' },
  { index: '02', icon: 'catalogue', title: 'Document each show', body: 'Photos, plans, audio, documents.' },
  { index: '03', icon: 'archive', title: 'Publish the archive', body: 'Every show, searchable.' },
];

const FEATURES: Cell[] = [
  { index: '01', icon: 'users', title: 'Creator roles', body: 'Gallery, curator and artist on one account.' },
  {
    index: '02',
    icon: 'folder',
    title: 'Shared Drive',
    body: 'One Drive, a folder per show.',
    planned: true,
  },
  { index: '03', icon: 'globe', title: 'Open to researchers', body: 'Indexed under your gallery.' },
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
          <p className="lede">Every show you make, catalogued and kept in one public archive.</p>
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
                <span className="cell-icon">
                  <Icon name={step.icon} />
                </span>
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
                <span className="cell-icon">
                  <Icon name={feature.icon} />
                </span>
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
