import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

const SETUP_STEPS = [
  {
    index: '01',
    title: 'Set up your gallery workspace',
    body: 'Invite the team, assign roles — gallery, curator, artist — so everyone works from one shared account.',
  },
  {
    index: '02',
    title: 'Document each show in the program',
    body: 'Every exhibition lands in a shared catalogue, with a shared Drive at the gallery level for masters, HDRs, and press.',
  },
  {
    index: '03',
    title: 'Publish a program-wide archive',
    body: 'Each show is citable under one gallery — a permanent, versioned record of everything you have shown.',
  },
];

const FEATURES = [
  {
    index: '01',
    title: 'Roles & permissions',
    body: 'Gallery, curator, and artist roles sit on one account, so the right people can catalogue, edit, and publish without sharing logins.',
  },
  {
    index: '02',
    title: 'Shared Drive at the gallery level',
    body: 'One Drive for the whole program, with a folder per show — installation views, works-masters, and press stay organised across every exhibition.',
  },
  {
    index: '03',
    title: 'A program-wide, versioned archive',
    body: 'Every show is indexed under the gallery, versioned as it changes, and citable as a permanent record for researchers and press.',
  },
];

export default function GalleriesPage() {
  useDocumentMeta({
    title: 'For galleries',
    description:
      'A team workspace with roles and a shared Drive, gathering every show your gallery makes into one program-wide, citable archive.',
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
            A shared team workspace with roles for gallery, curators, and artists — every show
            catalogued into one shared Drive and gathered into a program-wide archive that stays
            citable long after the walls come down.
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
              Shared roles, one Drive, a versioned <em>archive</em>.
            </h2>
          </div>
          <div className="cell-grid cell-grid--3">
            {FEATURES.map((feature) => (
              <div className="cell" key={feature.index}>
                <span className="cell-index">{feature.index}</span>
                <h3>{feature.title}</h3>
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
              Gather every show your gallery makes into one shared, versioned archive — catalogued
              by the team, synced to a shared Drive, and kept open and citable for good.
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
