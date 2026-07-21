import { afterEach, describe, expect, it, vi } from 'vitest';
import { UNAUTHORIZED_EVENT, apiFetch, getToken, setToken } from './http';

function respondWith(status: number) {
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status })));
}

describe('apiFetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('drops the stored token and announces a 401', async () => {
    setToken('expired-jwt');
    const onUnauthorized = vi.fn();
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    respondWith(401);

    await apiFetch('/api/profile');

    expect(getToken()).toBeNull();
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  });

  it('stays quiet on a 401 when no token was sent', async () => {
    const onUnauthorized = vi.fn();
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    respondWith(401);

    // A rejected sign-in attempt must not look like an expired session.
    await apiFetch('/api/auth/login', { method: 'POST' });

    expect(onUnauthorized).not.toHaveBeenCalled();
    window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  });

  it('leaves the token alone on a successful response', async () => {
    setToken('good-jwt');
    respondWith(200);

    await apiFetch('/api/profile');

    expect(getToken()).toBe('good-jwt');
  });
});
