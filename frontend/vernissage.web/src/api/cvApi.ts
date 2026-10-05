import type { Cv, CvDocument } from '../types/cv';
import { API_BASE, apiFetch, parseJson } from './http';

const RESOURCE = `${API_BASE}/api/cv`;

export async function getCv(): Promise<Cv> {
  return parseJson<Cv>(await apiFetch(RESOURCE));
}

/** Saves the builder document; `markGenerated` records an "Update the CV". */
export async function saveCv(document: CvDocument, markGenerated = false): Promise<Cv> {
  return parseJson<Cv>(
    await apiFetch(RESOURCE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document, markGenerated }),
    }),
  );
}

export async function uploadCvFile(file: File): Promise<Cv> {
  const form = new FormData();
  form.append('file', file);
  return parseJson<Cv>(await apiFetch(`${RESOURCE}/file`, { method: 'PUT', body: form }));
}

export async function deleteCvFile(): Promise<void> {
  const response = await apiFetch(`${RESOURCE}/file`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}

/** The uploaded CV file's bytes (auth header required, so no plain link). */
export async function downloadCvFile(): Promise<Blob> {
  const response = await apiFetch(`${RESOURCE}/file`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.blob();
}
