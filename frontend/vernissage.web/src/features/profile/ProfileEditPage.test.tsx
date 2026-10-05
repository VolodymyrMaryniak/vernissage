import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders, stubFetch } from '../../testUtils';
import ProfileEditPage from './ProfileEditPage';

const PROFILE = {
  id: '1',
  email: 'ada@example.com',
  roles: ['Artist'],
  displayName: 'Ada Lovelace',
  galleryName: null,
  businessLocation: null,
  focus: null,
  foundingYear: null,
  firstName: 'Ada',
  lastName: 'Lovelace',
  socialMedia: null,
  placeOfWork: null,
  areasOfInterest: null,
  location: null,
  medium: 'Painting',
  hasPhoto: false,
};

describe('ProfileEditPage', () => {
  beforeEach(() => {
    localStorage.setItem('vernissage.token', 'jwt');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('renders artist-specific fields for an artist profile', async () => {
    stubFetch([{ url: '/api/profile', body: PROFILE }]);
    renderWithProviders(<ProfileEditPage />);

    await waitFor(() => expect(screen.getByText('Edit profile')).toBeInTheDocument());
    expect(screen.getByText('About you')).toBeInTheDocument();
    expect(screen.getByLabelText('Medium')).toHaveValue('Painting');
    // Gallery-only section should not render for a non-gallery account.
    expect(screen.queryByText('Year of founding')).not.toBeInTheDocument();
  });

  it('returns to the business card after saving', async () => {
    const fetchMock = stubFetch([{ url: '/api/profile', body: PROFILE }]);
    renderWithProviders(
      <Routes>
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/profile" element={<p>Card view</p>} />
      </Routes>,
      { route: '/profile/edit' },
    );

    await userEvent.click(await screen.findByRole('button', { name: 'Save profile' }));

    expect(await screen.findByText('Card view')).toBeInTheDocument();
    // stubFetch's mock is typed with the URL only; the init is passed at runtime.
    const calls = fetchMock.mock.calls as unknown as [RequestInfo | URL, RequestInit?][];
    expect(
      calls.some(([url, init]) => String(url).endsWith('/api/profile') && init?.method === 'PUT'),
    ).toBe(true);
  });
});
