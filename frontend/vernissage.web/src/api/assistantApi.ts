import type { ExhibitionWrite } from '../types/exhibition';
import { API_BASE, apiFetch, parseJson } from './http';

const RESOURCE = `${API_BASE}/api/assistant`;

/** Text fields the assistant can suggest; null means the source didn't say. */
export type DraftField = Exclude<keyof ExhibitionWrite, 'roles'>;

export type ExhibitionDraft = Partial<Record<DraftField, string | null>> & {
  /** What was filled in and what is still missing. */
  summary: string;
};

export type ImproveMode = 'polish' | 'shorten';

async function assistantJson<T>(response: Response): Promise<T> {
  if (response.status === 429) {
    throw new Error("You've used the assistant a lot this hour. Please try again a bit later.");
  }
  return parseJson<T>(response);
}

export async function draftExhibition(input: {
  notes?: string;
  file?: File | null;
}): Promise<ExhibitionDraft> {
  const form = new FormData();
  if (input.notes?.trim()) form.append('notes', input.notes);
  if (input.file) form.append('file', input.file);
  return assistantJson<ExhibitionDraft>(
    await apiFetch(`${RESOURCE}/draft`, { method: 'POST', body: form }),
  );
}

export async function improveText(input: {
  field: string;
  text: string;
  mode: ImproveMode;
  exhibitionName?: string;
}): Promise<string> {
  const result = await assistantJson<{ text: string }>(
    await apiFetch(`${RESOURCE}/improve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  );
  return result.text;
}
