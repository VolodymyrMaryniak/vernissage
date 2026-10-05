import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import Icon from '../../components/Icon';
import type { IconName } from '../../components/Icon';
import CvDemo from './demos/CvDemo';
import SoldWall from './demos/SoldWall';
import { useMessages } from '../../i18n/useI18n';
import Rich from '../../i18n/Rich';
import type { Messages } from '../../i18n/en';

const ALSO: { icon: IconName; key: keyof Messages['artists']['also']; planned?: boolean }[] = [
  { icon: 'document', key: 'record' },
  { icon: 'globe', key: 'link' },
  { icon: 'folder', key: 'files', planned: true },
];

// The salon hang in the hero: frames of different sizes, one already sold.
const FRAMES = ['a', 'b', 'c', 'd', 'e'];

export default function ArtistsPage() {
  const m = useMessages();
  const t = m.artists;
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });

  return (
    <div className="audience audience--artists">
      {/* ---- Hero: a studio wall -------------------------------- */}
      <section className="page-hero aud-hero">
        <div className="container aud-hero-inner">
          <div className="aud-hero-text">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="display">
              <Rich text={t.title} />
            </h1>
            <p className="lede">{t.lede}</p>
            <div className="hero-actions">
              <Link className="cta" to="/exhibitions/new">
                {m.nav.documentAShow}
              </Link>
              <Link className="cta cta--secondary" to="/profile/cv">
                {t.buildCv}
              </Link>
            </div>
          </div>
          <div className="salon-hang" aria-hidden="true">
            {FRAMES.map((f) => (
              <span key={f} className={`salon-frame salon-frame--${f}`}>
                {f === 'b' && <span className="sold-dot" />}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CV demo ------------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.cvEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.cvTitle} />
            </h2>
            <p className="prose">{t.cvBody}</p>
          </div>
          <CvDemo />
        </div>
      </section>

      {/* ---- Sold wall ----------------------------------------- */}
      <section className="section section--band">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.soldEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.soldTitle} />
            </h2>
            <p className="prose">{t.soldBody}</p>
          </div>
          <SoldWall />
        </div>
      </section>

      {/* ---- Also ---------------------------------------------- */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">{t.alsoEyebrow}</p>
          <ul className="aud-also">
            {ALSO.map((a) => (
              <li key={a.key}>
                <span className="cell-icon">
                  <Icon name={a.icon} />
                </span>
                <h3>
                  {t.also[a.key].title}
                  {a.planned && <span className="chip-mono chip-planned">{m.common.planned}</span>}
                </h3>
                <p>{t.also[a.key].body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cta-band">
        <div className="container section cta-band-inner">
          <div>
            <p className="eyebrow">{t.ctaEyebrow}</p>
            <h2 className="headline">{t.ctaTitle}</h2>
          </div>
          <div className="cta-band-actions">
            <Link className="cta" to="/exhibitions/new">
              {m.nav.documentAShow}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
