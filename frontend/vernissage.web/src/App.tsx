import { useState } from 'react';
import { fetchTestMessage } from './api/testApi';
import './App.css';

function App() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="container">
      <h1>Vernissage</h1>
      <button onClick={handleCallApi} disabled={loading}>
        {loading ? 'Loading…' : 'Call API'}
      </button>
      {message && <p className="response">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
