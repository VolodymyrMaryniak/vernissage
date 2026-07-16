import type { ExhibitionMetrics, MetricsWrite } from '../types/metrics';
import { API_BASE, apiFetch, parseJson } from './http';

function resource(exhibitionId: string): string {
  return `${API_BASE}/api/exhibitions/${exhibitionId}/metrics`;
}

export async function getMetrics(exhibitionId: string): Promise<ExhibitionMetrics> {
  return parseJson<ExhibitionMetrics>(await apiFetch(resource(exhibitionId)));
}

export async function saveMetrics(
  exhibitionId: string,
  payload: MetricsWrite,
): Promise<ExhibitionMetrics> {
  return parseJson<ExhibitionMetrics>(
    await apiFetch(resource(exhibitionId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
}
