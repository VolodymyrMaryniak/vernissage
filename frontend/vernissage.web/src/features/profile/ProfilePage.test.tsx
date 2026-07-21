import { screen, waitFor } from '@testing-library/react';
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

  it('renders artist-specific fields for an artist profile', async () => {
    renderWithProviders(<ProfilePage />);

    await waitFor(() => expect(screen.getByText('My profile')).toBeInTheDocument());
    expect(screen.getByText('About you')).toBeInTheDocument();
    expect(screen.getByLabelText('Medium')).toHaveValue('Painting');
    // Gallery-only section should not render for a non-gallery account.
    expect(screen.queryByText('Year of founding')).not.toBeInTheDocument();
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
