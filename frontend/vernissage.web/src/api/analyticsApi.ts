import type { AnalyticsSummary, AppConfig } from '../types/analytics';
import type { ExhibitionFilters } from '../types/exhibition';
import { API_BASE, apiFetch, parseJson } from './http';

export async function getAnalyticsSummary(
  filters?: ExhibitionFilters,
): Promise<AnalyticsSummary> {
  const params = new URLSearchParams();
  if (filters?.q) params.set('q', filters.q);
  if (filters?.location) params.set('location', filters.location);
  if (filters?.focus) params.set('focus', filters.focus);
  if (filters?.from) params.set('from', filters.from);
  if (filters?.to) params.set('to', filters.to);
  const query = params.toString();
  return parseJson<AnalyticsSummary>(
    await apiFetch(`${API_BASE}/api/analytics/summary${query ? `?${query}` : ''}`),
  );
}

export async function getAppConfig(): Promise<AppConfig> {
  return parseJson<AppConfig>(await fetch(`${API_BASE}/api/config`));
}
