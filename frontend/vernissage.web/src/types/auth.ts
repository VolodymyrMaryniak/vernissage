// Mirrors Vernissage.Api.Dtos auth DTOs.

export type CreatorRole = 'Gallery' | 'Curator' | 'Artist';

export const CREATOR_ROLES: CreatorRole[] = ['Gallery', 'Curator', 'Artist'];

export interface User {
  id: string;
  email: string;
  roles: CreatorRole[];
  displayName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  roles: CreatorRole[];
}

export interface LoginPayload {
  email: string;
  password: string;
}
