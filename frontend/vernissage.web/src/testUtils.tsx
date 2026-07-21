import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from './features/auth/AuthContext';
import { ConfigProvider } from './features/config/ConfigContext';

interface RenderOptions {
  /** Initial router entry; defaults to "/". */
  route?: string;
}

/**
 * Renders a component inside the providers the app mounts in main.tsx, so
 * components are exercised with the same context they get in production.
 */
export function renderWithProviders(ui: ReactElement, { route = '/' }: RenderOptions = {}) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>
      <ConfigProvider>
        <AuthProvider>{children}</AuthProvider>
      </ConfigProvider>
    </MemoryRouter>
  );
  return render(ui, { wrapper: Wrapper });
}

export interface StubbedRoute {
  /** Matched with String.includes against the request URL. */
  url: string;
  body?: unknown;
  status?: number;
}

/**
 * Stubs global fetch, answering each request with the first route whose `url`
 * the request URL contains. Unmatched requests get an empty 200 object, and
 * `/api/config` defaults to every feature enabled unless a route overrides it.
 */
export function stubFetch(routes: StubbedRoute[] = []) {
  const all: StubbedRoute[] = [...routes, { url: '/api/config', body: { analyticsEnabled: true } }];

  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString();
    const match = all.find((route) => url.includes(route.url));
    const status = match?.status ?? 200;
    const body = JSON.stringify(match?.body ?? {});
    return new Response(status === 204 ? null : body, {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

/** Convenience builder for a paged exhibitions response. */
export function pagedResponse<T>(items: T[], total = items.length, page = 1, pageSize = 20) {
  return { items, total, page, pageSize };
}
