import type { BackendVersion } from '../types/version';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const RESOURCE = `${API_BASE}/api/version`;

export async function getBackendVersion(): Promise<BackendVersion> {
  const response = await fetch(RESOURCE);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as BackendVersion;
}
