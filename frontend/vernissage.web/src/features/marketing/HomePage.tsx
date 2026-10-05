import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import Bloom from '../../components/Bloom';
import Icon from '../../components/Icon';
import type { IconName } from '../../components/Icon';
import PhotoSlideshow from './media/PhotoSlideshow';
import { localizedPhotos } from './media/photos';
import { demoReel } from './media/demoReel';
import ShowReel from '../reel/ShowReel';
import { useMessages } from '../../i18n/useI18n';
import Rich from '../../i18n/Rich';
import { plural } from '../../i18n/format';
import type { Messages } from '../../i18n/en';

const BENEFITS: { index: string; icon: IconName; key: keyof Messages['home']['benefits'] }[] = [
  { index: '01', icon: 'folder', key: 'files' },
  { index: '02', icon: 'portfolio', key: 'portfolio' },
  { index: '03', icon: 'bell', key: 'updates' },
];

const PIPELINE: { index: string; key: keyof Messages['home']['pipeline']; planned?: boolean }[] = [
  { index: '01', key: 'setUp' },
  { index: '02', key: 'attach' },
  { index: '03', key: 'sync', planned: true },
  { index: '04', key: 'share' },
];

const DRIVE_FILES = [
  { path: '/installation-views', files: 42, size: '6.1 GB' },
  { path: '/works-masters', files: 18, size: '2.4 GB' },
  { path: '/press', files: 9, size: '84 MB' },
  { path: '/essays', files: 3, size: '12 MB' },
];

const ROLE_CARDS = [
  { to: '/artists', index: '01', key: 'artist' },
  { to: '/curators', index: '02', key: 'curator' },
  { to: '/galleries', index: '03', key: 'gallery' },
] as const;

export default function HomePage() {
  const m = useMessages();
  const t = m.home;
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });

  return (
    <>
      {/* ---- Hero ------------------------------------------------ */}
      <section className="hero">
        <Bloom />
        <div className="container hero-inner">
          <div className="hero-meta">
            <span className="chip-mono">v.001</span>
            <span className="hero-meta-text">{t.metaWorkspace}</span>
          </div>
          <h1 className="display">
            <Rich text={t.title} />
          </h1>
          <p className="hero-slogan">
            <Rich text={t.slogan} />
          </p>
          <div className="hero-actions">
            <Link className="cta" to="/exhibitions/new">
              {m.nav.documentAShow}
            </Link>
          </div>
        </div>
      </section>

      {/* ---- On view: exhibitions & opening nights ------------- */}
      <section className="section section--tight home-slides">
        <div className="container">
          <PhotoSlideshow photos={localizedPhotos(m)} />
        </div>
      </section>

      {/* ---- Role selection ------------------------------------- */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">{t.startHere}</p>
          <div className="role-grid role-grid--3">
            {ROLE_CARDS.map((card) => (
              <Link className="role-card" to={card.to} key={card.key}>
                <span className="role-card-index">{card.index}</span>
                <h3>{t.roleCards[card.key].title}</h3>
                <p>{t.roleCards[card.key].body}</p>
                <span className="role-card-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- What you get --------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.whatEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.whatTitle} />
            </h2>
          </div>
          <div className="cell-grid cell-grid--3">
            {BENEFITS.map((benefit) => (
              <div className="cell cell--icon" key={benefit.key}>
                <span className="cell-icon">
                  <Icon name={benefit.icon} />
                </span>
                <div className="cell-body">
                  <span className="cell-label">
                    <span className="cell-index">{benefit.index}</span>
                    <span className="chip-mono chip-planned">{m.common.planned}</span>
                  </span>
                  <h3>{t.benefits[benefit.key].title}</h3>
                  <p>{t.benefits[benefit.key].body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Show reel ------------------------------------------ */}
      <section className="section home-reel">
        <div className="container home-reel-inner">
          <div className="section-head home-reel-head">
            <p className="eyebrow">{t.reelEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.reelTitle} />
            </h2>
            <p className="prose">{t.reelBody}</p>
          </div>
          <ShowReel data={demoReel(m)} autoPlay endLine={t.reelEnd} />
        </div>
      </section>

      {/* ---- How it works --------------------------------------- */}
      <section className="section section--band">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.pipelineEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.pipelineTitle} />
            </h2>
          </div>
          <div className="cell-grid cell-grid--4">
            {PIPELINE.map((step) => (
              <div className="cell" key={step.index}>
                <span className="cell-index">{step.index}</span>
                <h3>
                  {t.pipeline[step.key].title}
                  {step.planned && <span className="chip-mono chip-planned">{m.common.planned}</span>}
                </h3>
                <p>{t.pipeline[step.key].body}</p>
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
                <span className="status">{m.common.planned}</span>
              </div>
              <h3>{t.drive.title}</h3>
              <p>{t.drive.body}</p>
              <ul className="file-mono-list">
                {DRIVE_FILES.map((f) => (
                  <li key={f.path}>
                    <span className="path">{f.path}</span>
                    <span className="file-meta">
                      {plural(f.files, t.drive.files)} · {f.size}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            {/* VR walkthroughs */}
            <article className="plaque integration">
              <div className="integration-head">
                <span className="chip-mono">{t.vr.chip}</span>
                <span className="status">{t.vr.status}</span>
              </div>
              <h3>{t.vr.title}</h3>
              <p>{t.vr.body}</p>
              <div className="vr-viewport">
                <div className="wash-aurora" aria-hidden="true" />
                <button type="button" className="pill-mono" disabled>
                  {t.vr.enter}
                </button>
                <div className="vr-chips">
                  <span className="chip-mono">{t.vr.rooms}</span>
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
            <p className="eyebrow">{t.ctaEyebrow}</p>
            <h2 className="headline">{t.ctaTitle}</h2>
          </div>
          <div>
            <p className="prose">{t.ctaBody}</p>
            <div className="cta-band-actions">
              <Link className="cta" to="/exhibitions/new">
                {t.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
