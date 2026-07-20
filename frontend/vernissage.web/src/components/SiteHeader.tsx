import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

const NAV_LINKS = [
  { to: '/about', label: 'How it works' },
  { to: '/curators', label: 'For independent curators' },
  { to: '/galleries', label: 'For galleries' },
  { to: '/archive', label: 'Archive' },
];

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link className="wordmark" to="/">
            <span className="wordmark-name">Vernissage</span>
            <span className="wordmark-sup">·archive</span>
          </Link>

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
        <div className="hairline" />
      </header>
    </>
  );
}
