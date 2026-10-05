import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import Bloom from '../../components/Bloom';
import Icon from '../../components/Icon';
import type { IconName } from '../../components/Icon';

const STEPS: {
  index: string;
  icon: IconName;
  title: string;
  body: string;
  planned?: boolean;
}[] = [
  {
    index: 'Step 01',
    icon: 'document',
    title: 'Set up the show',
    body: 'Dates, artists and works in structured fields — searchable from day one.',
  },
  {
    index: 'Step 02',
    icon: 'folder',
    title: 'Sync to Drive',
    body: 'A Drive folder per show for masters, press and essays. Files attach to the entry for now.',
    planned: true,
  },
  {
    index: 'Step 03',
    icon: 'vr',
    title: 'Capture in VR',
    body: 'A Matterport or 360° walkthrough beside the catalogue, so the room outlives the show.',
    planned: true,
  },
  {
    index: 'Step 04',
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
        <Bloom />
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
          </div>
        </div>
      </section>

      {/* ---- The four steps ------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="cell-grid cell-grid--2">
            {STEPS.map((step) => (
              <div className="cell cell--icon" key={step.index}>
                <span className="cell-icon">
                  <Icon name={step.icon} />
                </span>
                <div className="cell-body">
                  <span className="cell-label">
                    <span className="cell-index">{step.index}</span>
                    {step.planned && <span className="chip-mono chip-planned">Planned</span>}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
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
            <h2 className="headline">A record worth keeping open.</h2>
          </div>
          <div className="cta-band-actions">
            <Link className="cta" to="/exhibitions/new">
              Document a show
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
