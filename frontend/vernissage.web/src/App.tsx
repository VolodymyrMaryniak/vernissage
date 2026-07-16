import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ExhibitionsListPage from './features/exhibitions/ExhibitionsListPage';
import ExhibitionCreatePage from './features/exhibitions/ExhibitionCreatePage';
import ExhibitionDetailPage from './features/exhibitions/ExhibitionDetailPage';
import ExhibitionEditPage from './features/exhibitions/ExhibitionEditPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import RequireAuth from './features/auth/RequireAuth';
import { useAuth } from './features/auth/useAuth';
import AppVersion from './features/version/AppVersion';
import './App.css';

function HeaderNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <nav className="header-nav">
        <Link className="btn btn-ghost btn-sm" to="/login">
          Log in
        </Link>
        <Link className="btn btn-primary btn-sm" to="/register">
          Register
        </Link>
      </nav>
    );
  }

  return (
    <nav className="header-nav">
      <span className="header-user" title={user.email}>
        {user.displayName || user.email}
      </span>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => {
          logout();
          navigate('/');
        }}
      >
        Log out
      </button>
    </nav>
  );
}

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <Link className="brand" to="/">
            <span className="brand-mark" aria-hidden="true">V</span>
            <span className="brand-name">Vernissage</span>
          </Link>
          <span className="brand-tag">Exhibition records</span>
          <HeaderNav />
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ExhibitionsListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/exhibitions/new"
            element={
              <RequireAuth>
                <ExhibitionCreatePage />
              </RequireAuth>
            }
          />
          <Route path="/exhibitions/:id" element={<ExhibitionDetailPage />} />
          <Route
            path="/exhibitions/:id/edit"
            element={
              <RequireAuth>
                <ExhibitionEditPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AppVersion />
    </div>
  );
}

export default App;
