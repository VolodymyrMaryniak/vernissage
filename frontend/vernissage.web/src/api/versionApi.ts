import type { BackendVersion } from '../types/version';
import { API_BASE } from './http';

const RESOURCE = `${API_BASE}/api/version`;

export async function getBackendVersion(): Promise<BackendVersion> {
  const response = await fetch(RESOURCE);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as BackendVersion;
}
