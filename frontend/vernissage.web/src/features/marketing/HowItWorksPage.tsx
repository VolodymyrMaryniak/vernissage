import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import Bloom from '../../components/Bloom';
import Icon from '../../components/Icon';
import type { IconName } from '../../components/Icon';
import RoleMixer from './demos/RoleMixer';
import { useMessages } from '../../i18n/useI18n';
import Rich from '../../i18n/Rich';
import type { Messages } from '../../i18n/en';

type InventoryKey = keyof Messages['how']['inventory'];

// What one exhibition's inventory holds: the real fields and file types of a record.
const INVENTORY: { code: string; icon: IconName; key: InventoryKey; planned?: boolean }[] = [
  { code: '01', icon: 'document', key: 'show' },
  { code: '02', icon: 'palette', key: 'works' },
  { code: '03', icon: 'document', key: 'people' },
  { code: '04', icon: 'portfolio', key: 'thinking' },
  { code: '05', icon: 'folder', key: 'room' },
  { code: '06', icon: 'bell', key: 'program' },
  { code: '07', icon: 'globe', key: 'numbers' },
  { code: '08', icon: 'vr', key: 'walkthrough', planned: true },
];

const AUDIENCES = [
  { key: 'artists', to: '/artists' },
  { key: 'curators', to: '/curators' },
  { key: 'galleries', to: '/galleries' },
] as const;

export default function HowItWorksPage() {
  const m = useMessages();
  const t = m.how;
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });

  return (
    <div className="audience audience--how">
      {/* ---- Hero ------------------------------------------------ */}
      <section className="page-hero">
        <Bloom />
        <div className="container page-hero-inner">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="display how-title">Vernissage</h1>
          <p className="how-subtitle">
            <Rich text={t.subtitle} />
          </p>
          <p className="lede">{t.lede}</p>
          <div className="hero-actions">
            <Link className="cta" to="/exhibitions/new">
              {t.start}
            </Link>
          </div>
        </div>
      </section>

      {/* ---- What an inventory holds ---------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.inventoryEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.inventoryTitle} />
            </h2>
          </div>
          <ol className="inventory-ledger">
            {INVENTORY.map((item) => (
              <li key={item.code}>
                <span className="inventory-code">INV·{item.code}</span>
                <span className="cell-icon">
                  <Icon name={item.icon} />
                </span>
                <span className="inventory-text">
                  <span className="inventory-title">
                    {t.inventory[item.key].title}
                    {item.planned && <span className="chip-mono chip-planned">{m.common.planned}</span>}
                  </span>
                  <span className="inventory-body">{t.inventory[item.key].body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Per role ------------------------------------------- */}
      <section className="section section--band">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.rolesEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.rolesTitle} />
            </h2>
          </div>
          <div className="how-audiences">
            {AUDIENCES.map(({ key, to }) => {
              const a = t.audiences[key];
              return (
                <article key={key} className={`how-audience how-audience--${key}`}>
                  <p className="eyebrow">{a.eyebrow}</p>
                  <h3>{a.title}</h3>
                  <ul>
                    {a.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <Link className="link-quiet how-audience-link" to={to}>
                    {a.link} →
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Multiple roles ------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.multiEyebrow}</p>
            <h2 className="headline">
              <Rich text={t.multiTitle} />
            </h2>
            <p className="prose">{t.multiBody}</p>
          </div>
          <RoleMixer />
        </div>
      </section>

      {/* ---- CTA band ------------------------------------------- */}
      <section className="cta-band">
        <div className="container section cta-band-inner">
          <div>
            <p className="eyebrow">{t.ctaEyebrow}</p>
            <h2 className="headline">{t.ctaTitle}</h2>
          </div>
          <div className="cta-band-actions">
            <Link className="cta" to="/register">
              {t.cta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
