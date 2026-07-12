// Mirrors Vernissage.Api.Dtos.AppVersionDto.
export interface BackendVersion {
  version: string;
  branch: string;
  buildTimeUtc: string | null;
}

// Build-time info about the frontend bundle itself (injected via Vite).
export interface FrontendVersion {
  branch: string;
  buildTimeUtc: string;
}
