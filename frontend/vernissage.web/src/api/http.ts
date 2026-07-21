// Shared HTTP plumbing: API base, bearer-token storage, and JSON helpers.

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const TOKEN_KEY = 'vernissage.token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/** Authorization header for the current session (empty object when logged out). */
export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function parseJson<T>(response: Response): Promise<T> {
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

/**
 * Fired when the API rejects the stored token, so the session can be dropped
 * from anywhere without the API layer depending on React state.
 */
export const UNAUTHORIZED_EVENT = 'vernissage:unauthorized';

/** fetch with the auth header attached (harmless on anonymous endpoints). */
export async function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, {
    ...init,
    headers: { ...authHeaders(), ...(init.headers ?? {}) },
  });

  // An expired or revoked token: clear it once, centrally, and let the auth
  // context log out — otherwise every page surfaces its own confusing error.
  // Only meaningful when we actually sent a token (a failed login has none).
  if (response.status === 401 && getToken()) {
    setToken(null);
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  return response;
}
