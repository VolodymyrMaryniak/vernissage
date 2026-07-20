import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import HomePage from './features/marketing/HomePage';
import HowItWorksPage from './features/marketing/HowItWorksPage';
import CuratorsPage from './features/marketing/CuratorsPage';
import GalleriesPage from './features/marketing/GalleriesPage';
import AnalyticsPage from './features/analytics/AnalyticsPage';
import ProfilePage from './features/profile/ProfilePage';
import ExhibitionsListPage from './features/exhibitions/ExhibitionsListPage';
import ExhibitionCreatePage from './features/exhibitions/ExhibitionCreatePage';
import ExhibitionDetailPage from './features/exhibitions/ExhibitionDetailPage';
import ExhibitionEditPage from './features/exhibitions/ExhibitionEditPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import RequireAuth from './features/auth/RequireAuth';
import AppVersion from './features/version/AppVersion';
import './App.css';

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
          <Route path="/curators" element={<CuratorsPage />} />
          <Route path="/galleries" element={<GalleriesPage />} />
          <Route path="/archive" element={<ExhibitionsListPage />} />
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
            path="/analytics"
            element={
              <RequireAuth>
                <Shell>
                  <AnalyticsPage />
                </Shell>
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SiteFooter />
      <AppVersion />
    </div>
  );
}

export default App;
