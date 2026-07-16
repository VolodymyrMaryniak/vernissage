import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../auth/AuthContext';
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
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/api/profile')) {
          return new Response(JSON.stringify(PROFILE), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('renders artist-specific fields for an artist profile', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('My profile')).toBeInTheDocument());
    expect(screen.getByText('About you')).toBeInTheDocument();
    expect(screen.getByLabelText('Medium')).toHaveValue('Painting');
    // Gallery-only section should not render for a non-gallery account.
    expect(screen.queryByText('Year of founding')).not.toBeInTheDocument();
  });
});
