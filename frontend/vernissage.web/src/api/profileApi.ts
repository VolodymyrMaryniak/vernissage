import type { Profile, ProfileWrite } from '../types/profile';
import { API_BASE, apiFetch, parseJson } from './http';

const RESOURCE = `${API_BASE}/api/profile`;

export async function getProfile(): Promise<Profile> {
  return parseJson<Profile>(await apiFetch(RESOURCE));
}

export async function updateProfile(payload: ProfileWrite): Promise<Profile> {
  return parseJson<Profile>(
    await apiFetch(RESOURCE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
}

export async function uploadProfilePhoto(file: File): Promise<Profile> {
  const form = new FormData();
  form.append('file', file);
  return parseJson<Profile>(
    await apiFetch(`${RESOURCE}/photo`, { method: 'PUT', body: form }),
  );
}

export async function deleteProfilePhoto(): Promise<void> {
  const response = await apiFetch(`${RESOURCE}/photo`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}

/** Fetches the photo as an object URL (auth header required, so no plain <img src>). */
export async function fetchProfilePhotoUrl(): Promise<string | null> {
  const response = await apiFetch(`${RESOURCE}/photo`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return URL.createObjectURL(await response.blob());
}
