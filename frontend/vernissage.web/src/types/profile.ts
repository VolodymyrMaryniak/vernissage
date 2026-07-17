import type { CreatorRole } from './auth';

// Mirrors Vernissage.Api.Dtos profile DTOs (owner-only).

export interface Profile {
  id: string;
  email: string;
  roles: CreatorRole[];
  displayName: string;
  galleryName: string | null;
  businessLocation: string | null;
  focus: string | null;
  foundingYear: number | null;
  firstName: string | null;
  lastName: string | null;
  socialMedia: string | null;
  placeOfWork: string | null;
  areasOfInterest: string | null;
  location: string | null;
  medium: string | null;
  hasPhoto: boolean;
}

export interface ProfileWrite {
  roles: CreatorRole[];
  galleryName: string | null;
  businessLocation: string | null;
  focus: string | null;
  foundingYear: number | null;
  firstName: string | null;
  lastName: string | null;
  socialMedia: string | null;
  placeOfWork: string | null;
  areasOfInterest: string | null;
  location: string | null;
  medium: string | null;
}
