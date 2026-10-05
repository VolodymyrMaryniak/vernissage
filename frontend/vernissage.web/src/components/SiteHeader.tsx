import { useId, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import { useAppConfig } from '../features/config/useAppConfig';
import Logo from './Logo';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import ThemeToggle from '../theme/ThemeToggle';
import { useMessages } from '../i18n/useI18n';

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const { analyticsEnabled } = useAppConfig();
  const m = useMessages();
  const NAV_LINKS = [
    { to: '/about', label: m.nav.howItWorks },
    { to: '/artists', label: m.nav.forArtists },
    { to: '/curators', label: m.nav.forCurators },
    { to: '/galleries', label: m.nav.forGalleries },
  ];
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
            <Logo className="wordmark-logo" size={30} />
            <span className="wordmark-name">Vernissage</span>
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? m.nav.closeMenu : m.nav.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={`nav-toggle-icon${menuOpen ? ' is-open' : ''}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <div className="site-header-menu" id={menuId} data-open={menuOpen}>
            <nav className="site-nav" aria-label={m.nav.primary}>
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
              <ThemeToggle />
              <LanguageSwitcher variant="select" />
              {user ? (
                <>
                  <Link className="link-quiet" to="/exhibitions">
                    {m.nav.myExhibitions}
                  </Link>
                  {analyticsEnabled && (
                    <Link className="link-quiet" to="/analytics">
                      {m.nav.analytics}
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
                    {m.nav.signOut}
                  </button>
                  <Link className="pill-mono" to="/profile">
                    {m.nav.workspace}
                  </Link>
                </>
              ) : (
                <>
                  <Link className="link-quiet" to="/login">
                    {m.nav.signIn}
                  </Link>
                  <Link className="cta" to="/exhibitions/new">
                    {m.nav.documentAShow}
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
