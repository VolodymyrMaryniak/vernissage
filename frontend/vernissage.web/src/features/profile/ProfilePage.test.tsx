import { screen, waitFor, within } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders, stubFetch } from '../../testUtils';
import ProfilePage from './ProfilePage';

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

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.setItem('vernissage.token', 'jwt');
    stubFetch([{ url: '/api/profile', body: PROFILE }]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('shows the profile as a business card with only the filled-in details', async () => {
    renderWithProviders(<ProfilePage />);

    const card = await screen.findByRole('article', { name: 'Business card' });
    expect(within(card).getByRole('heading', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(within(card).getByText('Artist')).toBeInTheDocument();
    expect(within(card).getByText('Painting')).toBeInTheDocument();
    expect(within(card).getByRole('link', { name: 'ada@example.com' })).toHaveAttribute(
      'href',
      'mailto:ada@example.com',
    );
    // Empty and gallery-only fields are left off the card, and it's not a form.
    expect(within(card).queryByText('Founded')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Edit profile' })).toHaveAttribute(
      'href',
      '/profile/edit',
    );
  });

  it('confirms a save made on the edit page', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>,
      { route: { pathname: '/profile', state: { saved: true } } },
    );

    expect(await screen.findByText('Profile saved.')).toBeInTheDocument();
  });

  it('links to analytics when the feature is enabled', async () => {
    renderWithProviders(<ProfilePage />);

    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Analytics' })).toHaveAttribute(
        'href',
        '/analytics',
      ),
    );
  });

  it('hides the analytics link when the feature is off', async () => {
    stubFetch([
      { url: '/api/profile', body: PROFILE },
      { url: '/api/config', body: { analyticsEnabled: false } },
    ]);

    renderWithProviders(<ProfilePage />);

    await waitFor(() => expect(screen.getByText('My profile')).toBeInTheDocument());
    expect(screen.queryByRole('link', { name: 'Analytics' })).not.toBeInTheDocument();
  });
});
