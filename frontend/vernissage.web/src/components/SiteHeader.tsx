import { useId, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import { useAppConfig } from '../features/config/useAppConfig';

const NAV_LINKS = [
  { to: '/about', label: 'How it works' },
  { to: '/curators', label: 'For independent curators' },
  { to: '/galleries', label: 'For galleries' },
  { to: '/archive', label: 'Archive' },
];

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const { analyticsEnabled } = useAppConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  // Collapse the mobile menu whenever the route changes so it never lingers
  // open over the new page after a link is followed. Resetting during render
  // (rather than in an effect) is React's recommended way to sync state to a
  // changing value.
  const [menuPath, setMenuPath] = useState(location.pathname);
  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setMenuOpen(false);
  }

  return (
    <>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link className="wordmark" to="/">
            <span className="wordmark-name">Vernissage</span>
            <span className="wordmark-sup">·archive</span>
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={`nav-toggle-icon${menuOpen ? ' is-open' : ''}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <div className="site-header-menu" id={menuId} data-open={menuOpen}>
            <nav className="site-nav" aria-label="Primary">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="site-header-actions">
              {user ? (
                <>
                  {analyticsEnabled && (
                    <Link className="link-quiet" to="/analytics">
                      Analytics
                    </Link>
                  )}
                  <button
                    type="button"
                    className="link-quiet"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    Sign out
                  </button>
                  <Link className="pill-mono" to="/profile">
                    Workspace
                  </Link>
                </>
              ) : (
                <>
                  <Link className="link-quiet" to="/login">
                    Sign in
                  </Link>
                  <Link className="cta" to="/exhibitions/new">
                    Document a show
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="hairline" />
      </header>
    </>
  );
}
