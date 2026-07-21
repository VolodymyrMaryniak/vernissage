import type {
  ExhibitionDetail,
  ExhibitionFilters,
  ExhibitionMedia,
  ExhibitionSummary,
  ExhibitionWrite,
  MediaCategory,
  PagedResult,
} from '../types/exhibition';
import { API_BASE, apiFetch, parseJson } from './http';

const RESOURCE = `${API_BASE}/api/exhibitions`;

function buildQuery(filters?: ExhibitionFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.location) params.set('location', filters.location);
  if (filters.focus) params.set('focus', filters.focus);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.mine) params.set('mine', 'true');
  if (filters.page) params.set('page', String(filters.page));
  if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function listExhibitions(
  filters?: ExhibitionFilters,
): Promise<PagedResult<ExhibitionSummary>> {
  return parseJson<PagedResult<ExhibitionSummary>>(
    await apiFetch(`${RESOURCE}${buildQuery(filters)}`),
  );
}

export async function getExhibition(id: string): Promise<ExhibitionDetail> {
  return parseJson<ExhibitionDetail>(await apiFetch(`${RESOURCE}/${id}`));
}

export async function createExhibition(payload: ExhibitionWrite): Promise<ExhibitionDetail> {
  return parseJson<ExhibitionDetail>(
    await apiFetch(RESOURCE, {
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
    await apiFetch(`${RESOURCE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteExhibition(id: string): Promise<void> {
  const response = await apiFetch(`${RESOURCE}/${id}`, { method: 'DELETE' });
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
    await apiFetch(`${RESOURCE}/${exhibitionId}/media`, {
      method: 'POST',
      body: form,
    }),
  );
}

export async function deleteMedia(exhibitionId: string, mediaId: string): Promise<void> {
  const response = await apiFetch(`${RESOURCE}/${exhibitionId}/media/${mediaId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}

export function mediaDownloadUrl(exhibitionId: string, mediaId: string): string {
  return `${RESOURCE}/${exhibitionId}/media/${mediaId}`;
}
