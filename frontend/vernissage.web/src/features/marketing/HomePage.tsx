import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import Bloom from '../../components/Bloom';
import Icon from '../../components/Icon';
import type { IconName } from '../../components/Icon';

// How many entries the "latest" strip pulls (1 featured + the rest listed).

const BENEFITS: {
  index: string;
  icon: IconName;
  title: string;
  body: string;
  planned?: boolean;
}[] = [
  {
    index: '01',
    icon: 'folder',
    title: 'Files sort themselves',
    body: 'Every show gets a Drive folder, foldered by material — masters, press, essays — filed as you upload.',
    planned: true,
  },
  {
    index: '02',
    icon: 'portfolio',
    title: 'Portfolio & CV in a click',
    body: 'Generate a portfolio or CV for an open call, grant or residency from records you already keep.',
    planned: true,
  },
  {
    index: '03',
    icon: 'bell',
    title: 'Updates while it runs',
    body: 'Push quick changes mid-show — dates, works, press — and everyone following the entry hears about it.',
    planned: true,
  },
];

const PIPELINE = [
  {
    index: '01',
    title: 'Set up the show',
    body: 'Title, dates, artists, works — a proper catalogue schema, not a blank document.',
  },
  {
    index: '02',
    title: 'Attach the material',
    body: 'Installation views, plans, audio and documents, filed by category on the entry.',
  },
  {
    index: '03',
    title: 'Sync to Drive',
    body: 'Planned: a structured Google Drive folder per show for masters, HDRs and press.',
    planned: true,
  },
  {
    index: '04',
    title: 'Publish & share',
    body: 'A public entry anyone can read, search and link to.',
  },
];

const DRIVE_FILES = [
  { path: '/installation-views', files: '42 files', size: '6.1 GB' },
  { path: '/works-masters', files: '18 files', size: '2.4 GB' },
  { path: '/press', files: '9 files', size: '84 MB' },
  { path: '/essays', files: '3 files', size: '12 MB' },
];

export default function HomePage() {
  useDocumentMeta({
    title: "Let's document your art show properly",
    description:
      'Vernissage is a structured workspace for art exhibitions — catalogue works, attach installation photography, plans and audio, and publish an entry anyone can find.',
  });

  return (
    <>
      {/* ---- Hero ------------------------------------------------ */}
      <section className="hero">
        <Bloom />
        <div className="container hero-inner">
          <div className="hero-meta">
            <span className="chip-mono">v.001</span>
            <span className="hero-meta-text">
              Workspace for artists, curators &amp; galleries
            </span>
          </div>
          <h1 className="display">
            Let&apos;s document your art show <em>properly</em>.
          </h1>
          <p className="hero-slogan">
            A show is alive for six weeks. <em>Its record is forever.</em>
          </p>
          <div className="hero-actions">
            <Link className="cta" to="/exhibitions/new">
              Document a show
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Role selection ------------------------------------- */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">Start here</p>
          <div className="role-grid role-grid--3">
            <Link className="role-card" to="/artists">
              <span className="role-card-index">01</span>
              <h3>I&apos;m an artist</h3>
              <p>Your works and shows, documented and ready to submit.</p>
              <span className="role-card-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link className="role-card" to="/curators">
              <span className="role-card-index">02</span>
              <h3>I&apos;m an independent curator</h3>
              <p>Solo workspace, portable archive, no gallery required.</p>
              <span className="role-card-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link className="role-card" to="/galleries">
              <span className="role-card-index">03</span>
              <h3>I&apos;m a gallery</h3>
              <p>A program-wide archive, with every show catalogued in one place.</p>
              <span className="role-card-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- What you get --------------------------------------- */}
      <section className="section">
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

      {/* ---- How it works --------------------------------------- */}
      <section className="section section--band">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How it works</p>
            <h2 className="headline">
              A four-step pipeline, from opening night to <em>citation</em>.
            </h2>
          </div>
          <div className="cell-grid cell-grid--4">
            {PIPELINE.map((step) => (
              <div className="cell" key={step.index}>
                <span className="cell-index">{step.index}</span>
                <h3>
                  {step.title}
                  {step.planned && <span className="chip-mono chip-planned">Planned</span>}
                </h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Integrations --------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="plaque-grid">
            {/* Google Drive */}
            <article className="plaque integration">
              <div className="integration-head">
                <span className="chip-mono">Google Drive</span>
                <span className="status">Planned</span>
              </div>
              <h3>Every show gets a home for its files.</h3>
              <p>
                A structured Drive folder per exhibition, so masters, HDRs and press never
                scatter. Until then, files attach directly to the entry.
              </p>
              <ul className="file-mono-list">
                {DRIVE_FILES.map((f) => (
                  <li key={f.path}>
                    <span className="path">{f.path}</span>
                    <span className="file-meta">
                      {f.files} · {f.size}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            {/* VR walkthroughs */}
            <article className="plaque integration">
              <div className="integration-head">
                <span className="chip-mono">VR walkthroughs</span>
                <span className="status">Planned · Matterport · 360°</span>
              </div>
              <h3>The show doesn&apos;t have to close.</h3>
              <p>
                A Matterport or 360° capture embeds alongside the catalogue — step back inside
                the room long after the walls come down.
              </p>
              <div className="vr-viewport">
                <div className="wash-aurora" aria-hidden="true" />
                <button type="button" className="pill-mono" disabled>
                  ● Enter VR walkthrough
                </button>
                <div className="vr-chips">
                  <span className="chip-mono">14 rooms</span>
                  <span className="chip-mono">4K</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ---- CTA band ------------------------------------------- */}
      <section className="cta-band">
        <div className="container section cta-band-inner">
          <div>
            <p className="eyebrow">Open access, non-commercial</p>
            <h2 className="headline">A working archive, not a portfolio site.</h2>
          </div>
          <div>
            <p className="prose">
              Start documenting your next show.
            </p>
            <div className="cta-band-actions">
              <Link className="cta" to="/exhibitions/new">
                Start documenting
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
