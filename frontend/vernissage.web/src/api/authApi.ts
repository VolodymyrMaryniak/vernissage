import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth';
import { API_BASE, apiFetch, parseJson } from './http';

const RESOURCE = `${API_BASE}/api/auth`;

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return parseJson<AuthResponse>(
    await fetch(`${RESOURCE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return parseJson<AuthResponse>(
    await fetch(`${RESOURCE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
}

export async function getCurrentUser(): Promise<User> {
  return parseJson<User>(await apiFetch(`${RESOURCE}/me`));
}
