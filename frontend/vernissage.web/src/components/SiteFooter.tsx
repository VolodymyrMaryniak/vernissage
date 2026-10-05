import { Link } from 'react-router-dom';
import Logo from './Logo';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import ThemeToggle from '../theme/ThemeToggle';
import { useMessages } from '../i18n/useI18n';

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const m = useMessages();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <p className="footer-lead">{m.footer.lead}</p>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>{m.footer.browse}</h4>
            <ul>
              <li>
                <Link to="/about">{m.nav.howItWorks}</Link>
              </li>
              <li>
                <Link to="/artists">{m.nav.forArtists}</Link>
              </li>
              <li>
                <Link to="/curators">{m.footer.forIndependentCurators}</Link>
              </li>
              <li>
                <Link to="/galleries">{m.nav.forGalleries}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{m.footer.contribute}</h4>
            <ul>
              <li>
                <Link to="/exhibitions/new">{m.nav.documentAShow}</Link>
              </li>
              <li>
                <Link to="/register">{m.footer.openWorkspace}</Link>
              </li>
              <li>
                <Link to="/login">{m.nav.signIn}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{m.footer.about}</h4>
            <p>{m.footer.aboutText}</p>
            <div className="footer-prefs">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="footer-bar">
          <span className="footer-brand">
            <Logo size={22} />© {year} Vernissage
          </span>
          <span>{m.footer.opened}</span>
        </div>
      </div>
    </footer>
  );
}
