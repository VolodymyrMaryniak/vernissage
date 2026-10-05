import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import Bloom from '../../components/Bloom';
import Icon from '../../components/Icon';
import type { IconName } from '../../components/Icon';
import RoleMixer from './demos/RoleMixer';

// What one exhibition's inventory holds: the real fields and file types of a record.
const INVENTORY: { code: string; icon: IconName; title: string; body: string; planned?: boolean }[] = [
  { code: '01', icon: 'document', title: 'The show', body: 'Title, dates, city, venue, curator and focus.' },
  { code: '02', icon: 'palette', title: 'The works', body: 'The artworks list, with images of each piece.' },
  { code: '03', icon: 'document', title: 'The people', body: 'Artists, curators, designers and technicians.' },
  { code: '04', icon: 'portfolio', title: 'The thinking', body: 'Aim, curatorial text, research and literature.' },
  { code: '05', icon: 'folder', title: 'The room', body: 'Design, lighting and location plans; installation views; audio.' },
  { code: '06', icon: 'bell', title: 'The program', body: 'Pre-opening, opening night and events during the run.' },
  { code: '07', icon: 'globe', title: 'The numbers', body: 'Visitors, sales and costs, visible only to you.' },
  { code: '08', icon: 'vr', title: 'The walkthrough', body: 'A 360° or VR capture of the room.', planned: true },
];

const AUDIENCES = [
  {
    key: 'artists',
    to: '/artists',
    linkLabel: 'See it for artists',
    eyebrow: 'As an artist',
    title: 'Your shows become your CV.',
    points: [
      'Record every show you take part in, solo or group.',
      'Your CV updates from your inventory, in PDF or Word.',
      'Mark works sold and keep the totals private.',
    ],
  },
  {
    key: 'curators',
    to: '/curators',
    linkLabel: 'See it for curators',
    eyebrow: 'As a curator',
    title: 'The whole show, from idea to opening.',
    points: [
      'Concept, research, checklist, team and plans in one record.',
      'Shows you curated are kept apart on your CV.',
      'The record stays yours when you change institutions.',
    ],
  },
  {
    key: 'galleries',
    to: '/galleries',
    linkLabel: 'See it for galleries',
    eyebrow: 'As a gallery',
    title: 'The program, show by show.',
    points: [
      'Every exhibition you host in one inventory.',
      'Costs, sales and visitors for each show and the season.',
      'Analytics across the program, free while in beta.',
    ],
  },
];

export default function HowItWorksPage() {
  useDocumentMeta({
    title: 'How it works',
    description:
      'Vernissage keeps digital inventories of physical exhibitions, for artists, curators and galleries, and for anyone who is more than one of those.',
  });

  return (
    <div className="audience audience--how">
      {/* ---- Hero ------------------------------------------------ */}
      <section className="page-hero">
        <Bloom />
        <div className="container page-hero-inner">
          <p className="eyebrow">How it works</p>
          <h1 className="display how-title">Vernissage</h1>
          <p className="how-subtitle">
            Digital inventories of <em>physical exhibitions</em>.
          </p>
          <p className="lede">
            A show lives for a few weeks in a real room. Vernissage keeps a complete record of it:
            the works, the people, the plans, the photographs and the numbers.
          </p>
          <div className="hero-actions">
            <Link className="cta" to="/exhibitions/new">
              Start your inventory
            </Link>
          </div>
        </div>
      </section>

      {/* ---- What an inventory holds ---------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">One inventory per show</p>
            <h2 className="headline">
              Everything that made the show, <em>itemised</em>.
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
                    {item.title}
                    {item.planned && <span className="chip-mono chip-planned">Planned</span>}
                  </span>
                  <span className="inventory-body">{item.body}</span>
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
            <p className="eyebrow">Artist, curator or gallery</p>
            <h2 className="headline">
              Same inventory, <em>used your way</em>.
            </h2>
          </div>
          <div className="how-audiences">
            {AUDIENCES.map((a) => (
              <article key={a.key} className={`how-audience how-audience--${a.key}`}>
                <p className="eyebrow">{a.eyebrow}</p>
                <h3>{a.title}</h3>
                <ul>
                  {a.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <Link className="link-quiet how-audience-link" to={a.to}>
                  {a.linkLabel} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Multiple roles ------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">More than one hat?</p>
            <h2 className="headline">
              One account, <em>every role you have</em>.
            </h2>
            <p className="prose">
              Plenty of people exhibit and curate, or run a space and make work. Tick every role
              that&apos;s yours; for each show, mark which hat you wore, and your profile, My
              exhibitions and your CV sort themselves.
            </p>
          </div>
          <RoleMixer />
        </div>
      </section>

      {/* ---- CTA band ------------------------------------------- */}
      <section className="cta-band">
        <div className="container section cta-band-inner">
          <div>
            <p className="eyebrow">Free while in beta</p>
            <h2 className="headline">Start with the show you remember best.</h2>
          </div>
          <div className="cta-band-actions">
            <Link className="cta" to="/register">
              Open your workspace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
