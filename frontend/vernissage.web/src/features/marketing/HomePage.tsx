import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { listExhibitions } from '../../api/exhibitionsApi';
import type { ExhibitionSummary } from '../../types/exhibition';

// How many entries the "latest" strip pulls (1 featured + the rest listed).
const LATEST_COUNT = 5;

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

function formatYear(entry: ExhibitionSummary): string | null {
  const source = entry.startDate ?? entry.endDate;
  if (!source) return null;
  const parsed = new Date(source);
  return Number.isNaN(parsed.getTime()) ? null : String(parsed.getFullYear());
}

function formatDateRange(entry: ExhibitionSummary): string | null {
  const format = (value: string | null) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? value
      : parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };
  const start = format(entry.startDate);
  const end = format(entry.endDate);
  if (start && end) return `${start} – ${end}`;
  return start ?? end;
}

export default function HomePage() {
  useDocumentMeta({
    title: 'Document your art exhibition properly',
    description:
      'Vernissage is a structured workspace and public archive for art exhibitions — catalogue works, attach installation photography, plans and audio, and publish an entry anyone can find.',
  });

  const [latest, setLatest] = useState<ExhibitionSummary[]>([]);
  const [archivedCount, setArchivedCount] = useState<number | null>(null);

  // The archive drives the counts and the entries shown below; a failure just
  // leaves the marketing sections out rather than breaking the landing page.
  useEffect(() => {
    let cancelled = false;
    void listExhibitions({ page: 1, pageSize: LATEST_COUNT })
      .then((result) => {
        if (cancelled) return;
        setLatest(result.items);
        setArchivedCount(result.total);
      })
      .catch(() => {
        // Non-fatal: keep the hero and CTAs.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [featured, ...rest] = latest;

  return (
    <>
      {/* ---- Hero ------------------------------------------------ */}
      <section className="hero">
        <div className="wash-drift" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-meta">
            <span className="chip-mono">v.001</span>
            <span className="hero-meta-text">
              Workspace for curators &amp; galleries
              {archivedCount !== null && ` · ${archivedCount} exhibitions archived`}
            </span>
          </div>
          <h1 className="display">
            Document your art exhibition <em>properly</em>.
          </h1>
          <p className="hero-slogan">
            A show is alive for six weeks. <em>Its record is forever.</em>
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
              <p>A program-wide archive, with every show catalogued in one place.</p>
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

      {/* ---- On view in the archive ----------------------------- */}
      {featured && (
        <section className="section section--band">
          <div className="container">
            <p className="eyebrow">On view in the archive</p>
            <div className="featured">
              <Link
                className="featured-frame"
                to={`/exhibitions/${featured.id}`}
                aria-label={`Open ${featured.name}`}
              >
                {/* Summaries carry no media, so the frame stays a placeholder. */}
                <span className="featured-placeholder wash-aurora" aria-hidden="true">
                  <span className="mono-meta">Installation view</span>
                </span>
              </Link>
              <div className="featured-body">
                {(featured.location ?? featured.focus) && (
                  <p className="mono-meta">
                    {[featured.location, featured.focus].filter(Boolean).map((part, i) => (
                      <span key={i} style={{ display: 'contents' }}>
                        {i > 0 && <span className="sep">·</span>}
                        <span>{part}</span>
                      </span>
                    ))}
                  </p>
                )}
                <h2 className="title">
                  <Link to={`/exhibitions/${featured.id}`}>{featured.name}</Link>
                </h2>
                {featured.curator && <p className="artist">{featured.curator}</p>}
                <p className="mono-meta">
                  {formatDateRange(featured) && <span>{formatDateRange(featured)}</span>}
                  {formatDateRange(featured) && featured.mediaCount > 0 && (
                    <span className="sep">·</span>
                  )}
                  {featured.mediaCount > 0 && <span>{featured.mediaCount} files</span>}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---- Recently documented -------------------------------- */}
      {rest.length > 0 && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">Latest entries</p>
            <h2 className="headline">Recently documented shows.</h2>
            <div className="index-list">
              {rest.map((e, i) => (
                <div className="index-entry" key={e.id}>
                  <Link className="index-row" to={`/exhibitions/${e.id}`}>
                    <span className="index-row-index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="index-thumb wash-vernissage" aria-hidden="true" />
                    <span className="index-row-main">
                      <span className="index-row-title">
                        {e.name}
                        {e.curator && <span className="artist"> — {e.curator}</span>}
                      </span>
                    </span>
                    <span className="index-row-meta">
                      {e.location && <span>{e.location}</span>}
                      {formatYear(e) && <span>{formatYear(e)}</span>}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- CTA band ------------------------------------------- */}
      <section className="cta-band">
        <div className="container section cta-band-inner">
          <div>
            <p className="eyebrow">Open access, non-commercial</p>
            <h2 className="headline">A working archive, not a portfolio site.</h2>
          </div>
          <div>
            <p className="prose">
              Start documenting your own, or read what others have catalogued.
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
