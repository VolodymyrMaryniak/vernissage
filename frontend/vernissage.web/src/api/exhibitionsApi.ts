import type {
  ExhibitionDetail,
  ExhibitionMedia,
  ExhibitionSummary,
  ExhibitionWrite,
  MediaCategory,
} from '../types/exhibition';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const RESOURCE = `${API_BASE}/api/exhibitions`;

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = await response.json();
      if (body && typeof body.message === 'string') {
        message = body.message;
      }
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export async function listExhibitions(): Promise<ExhibitionSummary[]> {
  return parseJson<ExhibitionSummary[]>(await fetch(RESOURCE));
}

export async function getExhibition(id: string): Promise<ExhibitionDetail> {
  return parseJson<ExhibitionDetail>(await fetch(`${RESOURCE}/${id}`));
}

export async function createExhibition(payload: ExhibitionWrite): Promise<ExhibitionDetail> {
  return parseJson<ExhibitionDetail>(
    await fetch(RESOURCE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateExhibition(
  id: string,
  payload: ExhibitionWrite,
): Promise<ExhibitionDetail> {
  return parseJson<ExhibitionDetail>(
    await fetch(`${RESOURCE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteExhibition(id: string): Promise<void> {
  const response = await fetch(`${RESOURCE}/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}

export async function uploadMedia(
  exhibitionId: string,
  category: MediaCategory,
  file: File,
  caption: string | null,
): Promise<ExhibitionMedia> {
  const form = new FormData();
  form.append('category', String(category));
  form.append('file', file);
  if (caption) {
    form.append('caption', caption);
  }

  return parseJson<ExhibitionMedia>(
    await fetch(`${RESOURCE}/${exhibitionId}/media`, {
      method: 'POST',
      body: form,
    }),
  );
}

export async function deleteMedia(exhibitionId: string, mediaId: string): Promise<void> {
  const response = await fetch(`${RESOURCE}/${exhibitionId}/media/${mediaId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}

export function mediaDownloadUrl(exhibitionId: string, mediaId: string): string {
  return `${RESOURCE}/${exhibitionId}/media/${mediaId}`;
}
