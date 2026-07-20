import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import {
  ARCHIVED_COUNT,
  FEATURED_EXHIBITION,
  RECENT_EXHIBITIONS,
} from './mockExhibitions';

const PIPELINE = [
  {
    index: '01',
    title: 'Set up the show',
    body: 'Title, dates, artists, works — a proper catalogue schema, not a blank document.',
  },
  {
    index: '02',
    title: 'Sync to Drive',
    body: 'Every show gets a Google Drive folder for masters, HDRs, and press.',
  },
  {
    index: '03',
    title: 'Capture in VR',
    body: 'Upload a Matterport / 360° walkthrough. Visitors step back inside.',
  },
  {
    index: '04',
    title: 'Publish & cite',
    body: 'Permanent Vernissage URL, versioned, indexed, researcher-ready.',
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
    title: 'Document your art exhibition properly',
    description:
      'Vernissage is a structured workspace and public archive for art exhibitions — catalogue works, sync installation photography to Google Drive, capture VR walkthroughs, and publish a citable page.',
  });

  return (
    <>
      {/* ---- Hero ------------------------------------------------ */}
      <section className="hero">
        <div className="wash-drift" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-meta">
            <span className="chip-mono">v.001</span>
            <span className="hero-meta-text">
              Workspace for curators &amp; galleries · {ARCHIVED_COUNT} exhibitions archived
            </span>
          </div>
          <h1 className="display">
            Document your art exhibition <em>properly</em>.
          </h1>
          <p className="lede">
            A structured workspace for cataloguing works, syncing installation photography to
            Google Drive, capturing VR walkthroughs, and publishing a permanent, citable page
            for every show you make.
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

      {/* ---- Role selection ------------------------------------- */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">Start here</p>
          <div className="role-grid">
            <Link className="role-card" to="/curators">
              <span className="role-card-index">01</span>
              <h3>I&apos;m an independent curator</h3>
              <p>Solo workspace, portable archive, no gallery required.</p>
              <span className="role-card-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link className="role-card" to="/galleries">
              <span className="role-card-index">02</span>
              <h3>I&apos;m a gallery</h3>
              <p>Team workspace, roles, shared Drive, program-wide archive.</p>
              <span className="role-card-arrow" aria-hidden="true">
                →
              </span>
            </Link>
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
                <h3>{step.title}</h3>
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
                <span className="status">
                  <span className="dot-live" aria-hidden="true" />
                  Connected
                </span>
              </div>
              <h3>Documenting a show means creating a home for its files.</h3>
              <p>
                Opening an exhibition provisions a structured Drive folder at
                <code> /Exhibitions/&#123;Year&#125;/&#123;Show&#125;/</code> with subfolders for
                every kind of material — so masters, HDRs and press never scatter.
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
                <span className="status">Matterport · 360°</span>
              </div>
              <h3>The show doesn&apos;t have to close.</h3>
              <p>
                Attach a Matterport or 360° capture and it embeds alongside the catalogue.
                Long after the walls come down, visitors can step back inside the room.
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

      {/* ---- On view in the archive ----------------------------- */}
      <section className="section section--band">
        <div className="container">
          <p className="eyebrow">On view in the archive</p>
          <div className="featured">
            <Link className="featured-frame" to="/archive" aria-label="Browse the archive">
              <span className="featured-placeholder wash-aurora" aria-hidden="true">
                <span className="mono-meta">Installation view</span>
              </span>
            </Link>
            <div className="featured-body">
              <p className="mono-meta">
                <span>{FEATURED_EXHIBITION.gallery}</span>
                <span className="sep">·</span>
                <span>{FEATURED_EXHIBITION.city}</span>
              </p>
              <h2 className="title">{FEATURED_EXHIBITION.title}</h2>
              <p className="artist">{FEATURED_EXHIBITION.artist}</p>
              <p className="excerpt">{FEATURED_EXHIBITION.excerpt}</p>
              <p className="mono-meta">
                <span>{FEATURED_EXHIBITION.dateRange}</span>
                <span className="sep">·</span>
                <span>{FEATURED_EXHIBITION.works} works</span>
                <span className="sep">·</span>
                <span>{FEATURED_EXHIBITION.medium}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Recently documented -------------------------------- */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">Latest entries</p>
          <h2 className="headline">Recently documented shows.</h2>
          <div className="index-list">
            {RECENT_EXHIBITIONS.map((e, i) => (
              <div className="index-entry" key={e.slug}>
                <Link className="index-row" to="/archive">
                  <span className="index-row-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="index-thumb wash-vernissage" aria-hidden="true" />
                  <span className="index-row-main">
                    <span className="index-row-title">
                      {e.title}
                      <span className="artist"> — {e.artist}</span>
                    </span>
                  </span>
                  <span className="index-row-meta">
                    <span>{e.gallery}</span>
                    <span>
                      {e.year} · {e.city}
                    </span>
                  </span>
                </Link>
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
            <h2 className="headline">A working archive, not a portfolio site.</h2>
          </div>
          <div>
            <p className="prose">
              Vernissage exists to record exhibitions properly and keep that record open. Start
              documenting your own, or read what others have already catalogued.
            </p>
            <div className="cta-band-actions">
              <Link className="cta" to="/exhibitions/new">
                Start documenting
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
