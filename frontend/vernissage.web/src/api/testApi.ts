const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchTestMessage(): Promise<string> {
  const response = await fetch(`${API_BASE}/api/test`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const data = await response.json();
  return data.message as string;
}

export async function fetchAnotherTestMessage(): Promise<string> {
  const response = await fetch(`${API_BASE}/api/test/another`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const data = await response.json();
  return data.message as string;
}

export async function checkDbConnection(): Promise<boolean> {
  const response = await fetch(`${API_BASE}/api/test/db-check`);
  if (!response.ok && response.status !== 503) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const data = await response.json();
  return data.connected as boolean;
}
