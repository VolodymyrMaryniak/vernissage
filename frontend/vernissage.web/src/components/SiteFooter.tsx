import { Link } from 'react-router-dom';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <p className="footer-lead">A living memory of the exhibition world.</p>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Browse</h4>
            <ul>
              <li>
                <Link to="/archive">The archive</Link>
              </li>
              <li>
                <Link to="/about">How it works</Link>
              </li>
              <li>
                <Link to="/curators">For independent curators</Link>
              </li>
              <li>
                <Link to="/galleries">For galleries</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contribute</h4>
            <ul>
              <li>
                <Link to="/exhibitions/new">Document a show</Link>
              </li>
              <li>
                <Link to="/register">Open a workspace</Link>
              </li>
              <li>
                <Link to="/login">Sign in</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>About the project</h4>
            <p>
              Vernissage is a non-commercial archive. It exists to record exhibitions
              properly — catalogued, versioned and citable — and to keep that record open
              to researchers, students and the people who made the work.
            </p>
          </div>
        </div>

        <div className="footer-bar">
          <span>© {year} Vernissage Archive</span>
          <span>v.001 — opened summer 2026</span>
        </div>
      </div>
    </footer>
  );
}
