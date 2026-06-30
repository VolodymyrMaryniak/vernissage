import { useState } from 'react';
import { checkDbConnection, fetchTestMessage } from './api/testApi';
import './App.css';

function App() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [dbLoading, setDbLoading] = useState(false);

  const handleCallApi = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const result = await fetchTestMessage();
      setMessage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckDbConnection = async () => {
    setDbLoading(true);
    setDbError(null);
    setDbConnected(null);
    try {
      const result = await checkDbConnection();
      setDbConnected(result);
    } catch (err) {
      setDbError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setDbLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Vernissage</h1>
      <button onClick={handleCallApi} disabled={loading}>
        {loading ? 'Loading…' : 'Call API'}
      </button>
      {message && <p className="response">{message}</p>}
      {error && <p className="error">{error}</p>}

      <button onClick={handleCheckDbConnection} disabled={dbLoading}>
        {dbLoading ? 'Checking…' : 'Check DB Connection'}
      </button>
      {dbConnected !== null && (
        <p className={dbConnected ? 'response' : 'error'}>
          {dbConnected ? 'Database connected' : 'Database not connected'}
        </p>
      )}
      {dbError && <p className="error">{dbError}</p>}
    </div>
  );
}

export default App;
