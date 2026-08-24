import { Link } from 'react-router-dom';
import Logo from './Logo';

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
              A non-commercial archive that records exhibitions properly — catalogued,
              versioned and citable — and keeps that record open.
            </p>
          </div>
        </div>

        <div className="footer-bar">
          <span className="footer-brand">
            <Logo size={22} />© {year} Vernissage Archive
          </span>
          <span>v.001 — opened summer 2026</span>
        </div>
      </div>
    </footer>
  );
}
