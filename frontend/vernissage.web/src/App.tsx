import { Link, Navigate, Route, Routes } from 'react-router-dom';
import ExhibitionsListPage from './features/exhibitions/ExhibitionsListPage';
import ExhibitionCreatePage from './features/exhibitions/ExhibitionCreatePage';
import ExhibitionDetailPage from './features/exhibitions/ExhibitionDetailPage';
import ExhibitionEditPage from './features/exhibitions/ExhibitionEditPage';
import AppVersion from './features/version/AppVersion';
import './App.css';

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
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ExhibitionsListPage />} />
          <Route path="/exhibitions/new" element={<ExhibitionCreatePage />} />
          <Route path="/exhibitions/:id" element={<ExhibitionDetailPage />} />
          <Route path="/exhibitions/:id/edit" element={<ExhibitionEditPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AppVersion />
    </div>
  );
}

export default App;
