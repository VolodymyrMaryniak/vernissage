import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pagedResponse, renderWithProviders } from '../../testUtils';
import CvPage from './CvPage';

const PROFILE = {
  id: 'u1',
  email: 'olena@example.com',
  roles: ['Artist'],
  displayName: 'Olena Kovalenko',
  galleryName: null,
  businessLocation: null,
  focus: null,
  foundingYear: null,
  firstName: 'Olena',
  lastName: 'Kovalenko',
  socialMedia: null,
  placeOfWork: null,
  areasOfInterest: null,
  location: 'Kyiv',
  medium: 'Painting',
  hasPhoto: false,
};

function show(id: string, name: string, createdAtUtc = '2026-01-01T00:00:00Z') {
  return {
    id,
    name,
    startDate: '2025-03-01',
    endDate: '2025-04-01',
    location: 'Kyiv',
    focus: null,
    curator: null,
    galleryLocation: 'Voloshyn Gallery',
    ownerId: 'u1',
    mediaCount: 0,
    createdAtUtc,
    updatedAtUtc: createdAtUtc,
  };
}

const SECTIONS = [
  { key: 'statement', title: 'Statement', include: true, text: null },
  { key: 'education', title: 'Education', include: true, text: null },
];

function savedCv(exhibitions: { exhibitionId: string; kind: string }[], generatedAtUtc: string | null) {
  return {
    document: {
      template: 'classic',
      font: 'garamond',
      pageSize: 'A4',
      headline: 'Painter',
      includePhoto: true,
      includeContact: true,
      includeExhibitions: true,
      exhibitions,
      sections: SECTIONS,
    },
    generatedAtUtc,
    updatedAtUtc: generatedAtUtc ?? '2026-02-01T00:00:00Z',
    uploadedFile: null,
  };
}

interface Call {
  url: string;
  method: string;
  body: unknown;
}

/** A tiny fake API: answers profile/CV/exhibitions and records every call. */
function fakeApi(state: { cv: unknown; exhibitions: unknown[] }) {
  const calls: Call[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? 'GET';
      const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null;
      calls.push({ url, method, body });
      const json = (value: unknown) =>
        new Response(JSON.stringify(value), { status: 200, headers: { 'Content-Type': 'application/json' } });
      if (url.includes('/api/config')) return json({ analyticsEnabled: true });
      if (url.includes('/api/auth/me')) return json({ id: 'u1', email: PROFILE.email, roles: PROFILE.roles, displayName: PROFILE.displayName });
      if (url.includes('/api/profile')) return json(PROFILE);
      if (url.includes('/api/exhibitions')) return json(pagedResponse(state.exhibitions, state.exhibitions.length, 1, 100));
      if (url.includes('/api/cv') && method === 'PUT') {
        const { document, markGenerated } = body as { document: unknown; markGenerated: boolean };
        state.cv = { ...(state.cv as object), document, updatedAtUtc: '2026-03-01T00:00:00Z', generatedAtUtc: markGenerated ? '2026-03-01T00:00:00Z' : null };
        return json(state.cv);
      }
      if (url.includes('/api/cv')) return json(state.cv);
      return json({});
    }),
  );
  return calls;
}

describe('CvPage', () => {
  beforeEach(() => {
    localStorage.setItem('vernissage.token', 'jwt');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('starts a first CV with every documented exhibition and a suggested headline', async () => {
    fakeApi({
      cv: { ...savedCv([], null), updatedAtUtc: null, document: { ...savedCv([], null).document, headline: null } },
      exhibitions: [show('a', 'Northern Lights'), show('b', 'Afterglow')],
    });

    renderWithProviders(<CvPage />);

    const preview = await screen.findByRole('document', { name: 'CV preview' });
    expect(within(preview).getByText('Olena Kovalenko')).toBeInTheDocument();
    expect(within(preview).getByText('Northern Lights')).toBeInTheDocument();
    expect(within(preview).getByText('Afterglow')).toBeInTheDocument();
    expect(screen.getByLabelText('Headline')).toHaveValue('Artist · Painting · Kyiv');
    expect(screen.getByText('2 of 2 on the CV')).toBeInTheDocument();
  });

  it('updates the preview as exhibitions and sections are edited', async () => {
    fakeApi({ cv: savedCv([{ exhibitionId: 'a', kind: 'group' }], null), exhibitions: [show('a', 'Northern Lights'), show('b', 'Afterglow')] });

    renderWithProviders(<CvPage />);
    const preview = await screen.findByRole('document', { name: 'CV preview' });
    expect(within(preview).queryByText('Afterglow')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('checkbox', { name: /Afterglow/ }));
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Heading for Afterglow' }), 'solo');
    await userEvent.type(screen.getByPlaceholderText(/MA Fine Art/), '2018 — MA Fine Art');

    expect(within(preview).getByText('Solo exhibitions')).toBeInTheDocument();
    expect(within(preview).getByText('Afterglow')).toBeInTheDocument();
    expect(within(preview).getByText('MA Fine Art')).toBeInTheDocument();
    expect(within(preview).getByText('2018')).toBeInTheDocument();
  });

  it('"Update the CV" adds exhibitions documented since the last update and saves', async () => {
    const state = {
      cv: savedCv([{ exhibitionId: 'a', kind: 'solo' }], '2026-02-01T00:00:00Z'),
      exhibitions: [show('a', 'Northern Lights', '2026-01-01T00:00:00Z')] as unknown[],
    };
    const calls = fakeApi(state);

    renderWithProviders(<CvPage />);
    await screen.findByRole('document', { name: 'CV preview' });

    // A show documented after the last update, and an older one left off on purpose.
    state.exhibitions = [
      show('new', 'Electric Field', '2026-02-20T00:00:00Z'),
      show('a', 'Northern Lights', '2026-01-01T00:00:00Z'),
      show('old', 'Left off on purpose', '2025-12-01T00:00:00Z'),
    ];
    await userEvent.click(screen.getByRole('button', { name: 'Update the CV' }));

    expect(await screen.findByText('CV updated: added 1 new exhibition.')).toBeInTheDocument();
    const save = calls.find((c) => c.method === 'PUT' && c.url.endsWith('/api/cv'));
    expect(save?.body).toMatchObject({
      markGenerated: true,
      document: { exhibitions: [{ exhibitionId: 'a', kind: 'solo' }, { exhibitionId: 'new', kind: 'group' }] },
    });
    const preview = screen.getByRole('document', { name: 'CV preview' });
    expect(within(preview).getByText('Electric Field')).toBeInTheDocument();
    expect(within(preview).queryByText('Left off on purpose')).not.toBeInTheDocument();
  });

  it('saves edits only when asked', async () => {
    const calls = fakeApi({ cv: savedCv([], null), exhibitions: [] });

    renderWithProviders(<CvPage />);
    await screen.findByRole('document', { name: 'CV preview' });
    expect(screen.getByRole('button', { name: 'Saved' })).toBeDisabled();

    await userEvent.click(screen.getByText('Modern'));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => expect(screen.getByText('CV saved.')).toBeInTheDocument());
    const save = calls.find((c) => c.method === 'PUT');
    expect(save?.body).toMatchObject({ markGenerated: false, document: { template: 'modern' } });
  });
});
