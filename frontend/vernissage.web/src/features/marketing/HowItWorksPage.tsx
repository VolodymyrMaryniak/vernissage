import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import Icon, { type IconName } from '../../components/Icon';

const STEPS: { index: string; icon: IconName; title: string; body: string; planned?: boolean }[] = [
  {
    index: '01',
    icon: 'catalogue',
    title: 'Set up the show',
    body: 'Dates, artists and works in structured fields — searchable from day one.',
  },
  {
    index: '02',
    icon: 'folder',
    title: 'Sync to Drive',
    body: 'A Drive folder per show for masters, press and essays. Files attach to the entry for now.',
    planned: true,
  },
  {
    index: '03',
    icon: 'vr',
    title: 'Capture in VR',
    body: 'A Matterport or 360° walkthrough beside the catalogue, so the room outlives the show.',
    planned: true,
  },
  {
    index: '04',
    icon: 'globe',
    title: 'Publish & cite',
    body: 'A public page anyone can read and link to — no account needed.',
  },
];

export default function HowItWorksPage() {
  useDocumentMeta({
    title: 'How it works',
    description:
      'A four-step pipeline that carries an exhibition from opening night to a permanent, citable page.',
  });

  return (
    <>
      {/* ---- Hero ------------------------------------------------ */}
      <section className="page-hero">
        <div className="wash-drift" aria-hidden="true" />
        <div className="container page-hero-inner">
          <p className="eyebrow">How it works</p>
          <h1 className="display">
            From opening night to a <em>citable</em> page.
          </h1>
          <p className="lede">Four steps from a new show to a permanent public record.</p>
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

      {/* ---- Steps --------------------------------------------- */}
      <section className="section">
        <div className="container">
          <ol className="step-list">
            {STEPS.map((step) => (
              <li className="step" key={step.index}>
                <span className="step-icon">
                  <Icon name={step.icon} className="icon--lg" />
                </span>
                <div className="step-body">
                  <p className="eyebrow">
                    Step {step.index}
                    {step.planned && <span className="chip-mono chip-planned">Planned</span>}
                  </p>
                  <h2 className="headline">{step.title}</h2>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- CTA band ------------------------------------------- */}
      <section className="cta-band">
        <div className="container section cta-band-inner">
          <div>
            <p className="eyebrow">Open access, non-commercial</p>
            <h2 className="headline">A record worth keeping open.</h2>
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
