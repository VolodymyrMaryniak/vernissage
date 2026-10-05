import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import Icon from '../../components/Icon';
import type { IconName } from '../../components/Icon';
import CvDemo from './demos/CvDemo';
import SoldWall from './demos/SoldWall';

const ALSO: { icon: IconName; title: string; body: string; planned?: boolean }[] = [
  { icon: 'document', title: 'One record per show', body: 'Dates, works, texts, installation views and audio, kept together.' },
  { icon: 'globe', title: 'A link you can send', body: 'Point a curator at a show page instead of a pile of attachments.' },
  { icon: 'folder', title: 'Files that sort themselves', body: 'A Drive folder per show, filed by material as you upload.', planned: true },
];

// The salon hang in the hero: frames of different sizes, one already sold.
const FRAMES = ['a', 'b', 'c', 'd', 'e'];

export default function ArtistsPage() {
  useDocumentMeta({
    title: 'For artists',
    description:
      'Document each show once and Vernissage keeps your CV current, your shows ready to send and a private tally of what sold.',
  });

  return (
    <div className="audience audience--artists">
      {/* ---- Hero: a studio wall -------------------------------- */}
      <section className="page-hero aud-hero">
        <div className="container aud-hero-inner">
          <div className="aud-hero-text">
            <p className="eyebrow">For artists</p>
            <h1 className="display">
              You make the work. <em>We keep the record.</em>
            </h1>
            <p className="lede">
              Document each show once, and your CV, your show pages and your sales stay up to date
              on their own.
            </p>
            <div className="hero-actions">
              <Link className="cta" to="/exhibitions/new">
                Document a show
              </Link>
              <Link className="cta cta--secondary" to="/profile/cv">
                Build your CV
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
            <p className="eyebrow">Your CV, always current</p>
            <h2 className="headline">
              Open call on Friday? <em>Your CV is already done.</em>
            </h2>
            <p className="prose">Try it: every show you document can go straight onto your CV.</p>
          </div>
          <CvDemo />
        </div>
      </section>

      {/* ---- Sold wall ----------------------------------------- */}
      <section className="section section--band">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Opening night</p>
            <h2 className="headline">
              Put a red dot on it. <em>Keep count without a spreadsheet.</em>
            </h2>
            <p className="prose">Tap a work to mark it sold.</p>
          </div>
          <SoldWall />
        </div>
      </section>

      {/* ---- Also ---------------------------------------------- */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">Also in your studio</p>
          <ul className="aud-also">
            {ALSO.map((a) => (
              <li key={a.title}>
                <span className="cell-icon">
                  <Icon name={a.icon} />
                </span>
                <h3>
                  {a.title}
                  {a.planned && <span className="chip-mono chip-planned">Planned</span>}
                </h3>
                <p>{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cta-band">
        <div className="container section cta-band-inner">
          <div>
            <p className="eyebrow">Free while in beta</p>
            <h2 className="headline">Start with your last show.</h2>
          </div>
          <div className="cta-band-actions">
            <Link className="cta" to="/exhibitions/new">
              Document a show
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
