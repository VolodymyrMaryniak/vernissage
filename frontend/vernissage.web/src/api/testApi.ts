const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchTestMessage(): Promise<string> {
  const response = await fetch(`${API_BASE}/api/test`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const data = await response.json();
  return data.message as string;
}
