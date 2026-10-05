import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import HomePage from './features/marketing/HomePage';
import HowItWorksPage from './features/marketing/HowItWorksPage';
import ArtistsPage from './features/marketing/ArtistsPage';
import CuratorsPage from './features/marketing/CuratorsPage';
import GalleriesPage from './features/marketing/GalleriesPage';
import AnalyticsPage from './features/analytics/AnalyticsPage';
import ProfilePage from './features/profile/ProfilePage';
import ProfileEditPage from './features/profile/ProfileEditPage';
import ExhibitionsListPage from './features/exhibitions/ExhibitionsListPage';
import ExhibitionCreatePage from './features/exhibitions/ExhibitionCreatePage';
import ExhibitionDetailPage from './features/exhibitions/ExhibitionDetailPage';
import ExhibitionEditPage from './features/exhibitions/ExhibitionEditPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import RequireAuth from './features/auth/RequireAuth';
import VersionPage from './features/version/VersionPage';
import { useMessages } from './i18n/useI18n';

// The CV builder pulls in the PDF/Word generators, so it loads on demand.
const CvPage = lazy(() => import('./features/cv/CvPage'));
import './App.css';

function PageLoading() {
  return <p className="muted state-message">{useMessages().common.loading}</p>;
}

/** Narrow centred wrapper for the functional workspace pages. */
function Shell({ children }: { children: ReactNode }) {
  return <div className="shell shell--narrow">{children}</div>;
}

function App() {
  return (
    <div className="app">
      <SiteHeader />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<HowItWorksPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/curators" element={<CuratorsPage />} />
          <Route path="/galleries" element={<GalleriesPage />} />
          <Route
            path="/exhibitions"
            element={
              <RequireAuth>
                <ExhibitionsListPage />
              </RequireAuth>
            }
          />
          {/* The public archive is gone; old links land on the private list. */}
          <Route path="/archive" element={<Navigate to="/exhibitions" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/exhibitions/new"
            element={
              <RequireAuth>
                <Shell>
                  <ExhibitionCreatePage />
                </Shell>
              </RequireAuth>
            }
          />
          <Route path="/exhibitions/:id" element={<ExhibitionDetailPage />} />
          <Route
            path="/exhibitions/:id/edit"
            element={
              <RequireAuth>
                <Shell>
                  <ExhibitionEditPage />
                </Shell>
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Shell>
                  <ProfilePage />
                </Shell>
              </RequireAuth>
            }
          />
          <Route
            path="/profile/cv"
            element={
              <RequireAuth>
                <Suspense fallback={<PageLoading />}>
                  <CvPage />
                </Suspense>
              </RequireAuth>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <RequireAuth>
                <Shell>
                  <ProfileEditPage />
                </Shell>
              </RequireAuth>
            }
          />
          <Route
            path="/analytics"
            element={
              <RequireAuth>
                <Shell>
                  <AnalyticsPage />
                </Shell>
              </RequireAuth>
            }
          />
          {/* Unlisted on purpose: nothing links here, and the page sets noindex. */}
          <Route
            path="/version"
            element={
              <Shell>
                <VersionPage />
              </Shell>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
