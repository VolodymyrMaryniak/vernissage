import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

const STEPS = [
  {
    index: '01',
    title: 'Open a workspace',
    body: 'Solo, portable, no gallery required. Your archive travels with you from show to show.',
  },
  {
    index: '02',
    title: 'Document the exhibition',
    body: 'Catalogue works, dates, installation views and the accompanying essay in one place.',
  },
  {
    index: '03',
    title: 'Publish to the archive',
    body: 'A public page that stands as the record long after the walls come down.',
  },
];

const WORKS = [
  {
    no: '01',
    title: 'Threshold (Antechamber)',
    medium: 'Plaster, pigment',
    year: '2024',
    status: 'catalogued' as const,
  },
  {
    no: '02',
    title: 'Load-Bearing',
    medium: 'Steel, felt',
    year: '2024',
    status: 'catalogued' as const,
  },
  {
    no: '03',
    title: 'Soft Wall (i–iv)',
    medium: 'Video, sound',
    year: '2023',
    status: 'draft' as const,
  },
  {
    no: '04',
    title: 'Interior, Facing North',
    medium: 'Graphite on paper',
    year: '2025',
    status: 'catalogued' as const,
  },
  {
    no: '05',
    title: 'Untitled (Scaffold)',
    medium: 'Cast concrete',
    year: '2025',
    status: 'draft' as const,
  },
];

export default function CuratorsPage() {
  useDocumentMeta({
    title: 'For independent curators',
    description:
      'A solo workspace for cataloguing and documenting exhibitions, and a portable archive that stays with you from show to show.',
  });

  return (
    <>
      {/* ---- Hero ------------------------------------------------ */}
      <section className="page-hero">
        <div className="wash-drift" aria-hidden="true" />
        <div className="container page-hero-inner">
          <p className="eyebrow">For independent curators</p>
          <h1 className="display">
            A workspace built for the way exhibitions are <em>actually</em> made.
          </h1>
          <p className="lede">
            Work on your own terms — one curator, one catalogue at a time — and keep a portable
            record of every show you make, from first checklist to published page.
          </p>
          <div className="hero-actions">
            <Link className="cta" to="/exhibitions/new">
              Open a workspace
            </Link>
            <Link className="cta cta--secondary" to="/archive">
              Browse the archive
            </Link>
          </div>
        </div>
      </section>

      {/* ---- How it works --------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How it works</p>
            <h2 className="headline">Three steps, from empty room to citation.</h2>
          </div>
          <div className="cell-grid cell-grid--3">
            {STEPS.map((step) => (
              <div className="cell" key={step.index}>
                <span className="cell-index">{step.index}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Workspace preview ---------------------------------- */}
      <section className="section section--band">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Inside the workspace</p>
            <h2 className="headline">A catalogue that keeps its own record.</h2>
          </div>
          <div className="plaque dashboard">
            <div className="dashboard-topbar">
              <span className="name">Soft Architectures</span>
              <span className="pill-mono">Workspace</span>
              <span className="saved">Draft · saved 2m ago</span>
            </div>
            <div className="dashboard-body">
              <aside className="dashboard-side">
                <div className="side-group">
                  <span className="side-label">Exhibitions</span>
                  <span className="side-item is-active">● Soft Architectures</span>
                  <span className="side-item">Quiet Quartet</span>
                  <span className="side-item">The Long Walk</span>
                </div>
                <div className="side-group">
                  <span className="side-label">Sections</span>
                  <span className="side-item">Overview</span>
                  <span className="side-item is-active">Works (18)</span>
                  <span className="side-item">Installation views</span>
                  <span className="side-item">Essay</span>
                  <span className="side-item">Press</span>
                </div>
              </aside>
              <div className="dashboard-main">
                <table className="mock-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Title</th>
                      <th>Medium</th>
                      <th>Year</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WORKS.map((work) => (
                      <tr key={work.no}>
                        <td className="num">{work.no}</td>
                        <td>{work.title}</td>
                        <td>{work.medium}</td>
                        <td className="num">{work.year}</td>
                        <td>
                          {work.status === 'catalogued' ? (
                            <span className="status-pill status-pill--catalogued">Catalogued</span>
                          ) : (
                            <span className="status-pill status-pill--draft">Draft</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA band ------------------------------------------- */}
      <section className="cta-band">
        <div className="container section cta-band-inner">
          <div>
            <p className="eyebrow">Early access</p>
            <h2 className="headline">Request early access.</h2>
          </div>
          <div>
            <p className="prose">
              We are opening workspaces to independent curators a few at a time. Leave an address
              and we will be in touch when the next set is ready.
            </p>
            <form className="request-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="you@studio.com" aria-label="Email" />
              <button type="submit" className="cta">
                Request access
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
