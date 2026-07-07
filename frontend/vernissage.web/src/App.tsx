import ExhibitionsPage from './features/exhibitions/ExhibitionsPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <a className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">V</span>
            <span className="brand-name">Vernissage</span>
          </a>
          <span className="brand-tag">Exhibition records</span>
        </div>
      </header>
      <main className="app-main">
        <ExhibitionsPage />
      </main>
    </div>
  );
}

export default App;
