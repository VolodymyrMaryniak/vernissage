# Vernissage — functionality status

A review of what exists in the code today (backend + frontend) and what is still
missing. Reviewed 2026-07-21 against `develop`; gap list updated after the
wiring/polish pass on the same date.

Companion docs: [`DEPLOYMENT.md`](DEPLOYMENT.md), [`../CLAUDE.md`](../CLAUDE.md),
[`../infra/README.md`](../infra/README.md).

---

## 1. Implemented

### 1.1 Backend API surface

| Endpoint | Auth | Notes |
| --- | --- | --- |
| `POST /api/auth/register` | anon | email + password (≥ 8 chars, length-only policy) + creator roles; returns `{ token, user }` |
| `POST /api/auth/login` | anon | returns `{ token, user }` |
| `GET /api/auth/me` | JWT | current user |
| `GET /api/exhibitions` | anon | paged `{ items, total, page, pageSize }`; filters `q` / `location` / `focus` / `from` / `to`, plus `mine=true` (401 when anonymous); ordered by `createdAtUtc` desc |
| `GET /api/exhibitions/{id}` | anon | full record incl. media metadata |
| `POST /api/exhibitions` | JWT | sets `OwnerId` from the token |
| `PUT /api/exhibitions/{id}` | owner | 403 non-owner / ownerless, 404 missing |
| `DELETE /api/exhibitions/{id}` | owner | cascades media |
| `POST /api/exhibitions/{id}/media` | owner | multipart; category + optional caption; 50 MB cap |
| `GET /api/exhibitions/{id}/media/{mediaId}` | **anon** | raw file download |
| `DELETE /api/exhibitions/{id}/media/{mediaId}` | owner | |
| `GET /api/exhibitions/{id}/metrics` | owner | empty defaults before first save |
| `PUT /api/exhibitions/{id}/metrics` | owner | upsert; cost items fully replaced |
| `GET /api/analytics/summary` | owner | same filters as the public list; 404 when the feature flag is off |
| `GET /api/profile` / `PUT /api/profile` | JWT | own profile only |
| `PUT|GET|DELETE /api/profile/photo` | JWT | 5 MB, image content types only |
| `GET /api/config` | anon | `{ analyticsEnabled }` |
| `GET /api/version` | anon | `{ version, branch, buildTimeUtc }` from assembly metadata |

Supporting pieces that are done:

- **Auth**: ASP.NET Identity (`IdentityUserContext`, no role tables) + JWT bearer,
  7-day token lifetime ([TokenService.cs:12](../backend/Vernissage.Api/Services/TokenService.cs:12)),
  signing key required from config at startup.
- **Creator roles** as a `[Flags]` enum (Gallery / Curator / Artist), mapped to a
  string array in DTOs ([CreatorRoles.cs](../backend/Vernissage.Api/Models/CreatorRoles.cs)).
- **Ownership enforcement** centralised in `OwnershipExtensions.CheckOwnership`.
- **Exhibition schema**: 17 descriptive fields (aim, explication, investigation
  material, team, artworks list, pre-opening / opening / events, notes,
  referenced literature, …) + dates, location, focus, curator, gallery.
- **Media**: 9 categories (artwork image, expo-design full/detail, event photo,
  exposition design plan, location plan, audio, lighting plan, VR excursion),
  binary stored in SQL as `varbinary(max)`.
- **Private metrics**: visitors, satisfaction 1–10, artworks sold, revenue,
  arbitrary cost line items; `TotalCost` computed, never stored.
- **Shared filter semantics** between the public list and analytics
  ([ExhibitionFilters.cs](../backend/Vernissage.Api/Infrastructure/ExhibitionFilters.cs)).
- **EF migrations applied at boot**; 4 migrations, all additive.
- **Telemetry**: OpenTelemetry → Application Insights, conditional on the
  connection string being present.
- **Tests**: xUnit controller tests for auth, exhibitions, metrics, analytics,
  profile and version (InMemory provider).

### 1.2 Frontend

Routes ([App.tsx](../frontend/vernissage.web/src/App.tsx)):

| Route | Auth | State |
| --- | --- | --- |
| `/` home | anon | hero/marketing copy + featured and latest entries from the live archive |
| `/about`, `/curators`, `/galleries` | anon | marketing pages; unbuilt features labelled "Planned" |
| `/archive` | anon | live paged list + search bar + "only my exhibitions" toggle + owner-only delete |
| `/version` | anon, **unlisted** | frontend + backend build info; nothing links to it and it sets `noindex` |
| `/exhibitions/:id` | anon | editorial detail view, media gallery + lightbox; owner also sees the metrics section |
| `/exhibitions/new`, `/exhibitions/:id/edit` | guarded | sectioned form driven by `fields.ts`; edit page also mounts the media manager |
| `/login`, `/register` | anon | |
| `/profile` | guarded | role-aware profile form + photo upload/delete |
| `/analytics` | guarded | filterable stat tiles |
| `*` | | redirect to `/` |

Also done: `AuthContext` with token persistence in `localStorage` and startup
validation via `/api/auth/me`; `apiFetch` bearer injection plus central 401
handling (clears the token, raises `vernissage:unauthorized`, guards bounce to
`/login`); `ConfigProvider` reading `/api/config` once so the analytics nav is
gated by the server flag; `RequireAuth` guard; per-page document
title/description (`useDocumentMeta`, with `noIndex` for the build page);
client-side size/type checks before media and photo uploads. Vitest covers
login, profile, metrics, analytics, build info, `App`, the archive list
(pagination + mine), the exhibition form, the media manager, the home page and
the HTTP layer.

---

## 2. Gaps and unfinished work

### 2.1 Advertised but not built

These are now labelled "Planned" in the UI rather than described as shipping
features, but the functionality still does not exist:

- **Google Drive sync** ("every show gets a Drive folder") — no integration,
  no OAuth, nothing.
- **VR / Matterport walkthroughs** — only a `VrExcursion` media category; the
  file is stored and downloadable, never rendered or embedded.
- **Versioned, per-revision citation** — URLs are GUID-based, there are no
  slugs, no revision history, no citation metadata, no sitemap, and the SPA
  is client-rendered (no SSR/prerender for crawlers).
- **Team accounts for galleries** — creator roles describe a single account;
  there is no way to invite colleagues or share a workspace.

### 2.2 Backend gaps

- **Media privacy.** `GET /api/exhibitions/{id}/media/{mediaId}` is anonymous, so
  every uploaded file — including drafts and plans — is public to anyone with the
  GUID. Deliberate for the public archive, but there is no private/draft state.
- **No publish/draft lifecycle.** Every created exhibition is immediately public.
- **Media in SQL.** `varbinary(max)`, 50 MB per file; the code comments already
  flag blob storage as the intended replacement. Costly and slow at volume.
- **No sort options** on `GET /api/exhibitions` — newest-first only (it is paged
  now, with a page-size cap of 100).
- **Search is `LIKE %…%`** over name/curator only; case-sensitivity depends on DB
  collation, no full-text index, no relevance ranking.
- **Account management is missing**: no password reset, email confirmation, email
  change, password change, account deletion or 2FA. Identity token providers are
  not registered, so those flows cannot be added without extra setup.
- **No refresh tokens / revocation.** A 7-day JWT cannot be invalidated on logout.
- **No public profile.** `/api/profile/photo` requires auth, so an exhibition
  page cannot show the owner's avatar or a creator page.
- **No rate limiting, no lockout on repeated failed logins.**
- **CORS origins are hard-coded** in `Program.cs`, including the SWA hostname.
- **Legacy ownerless rows** can only be claimed by manual SQL — no admin path.
- **Analytics is a single summary object.** No per-exhibition breakdown, no
  time series, no cost-category grouping, no export.
- **No integration tests** against a real SQL provider — controller tests only,
  on the InMemory provider.

### 2.3 Frontend gaps

- No image thumbnails or resizing; full-size originals are downloaded into the
  gallery grid.
- No drag-and-drop or multi-file upload; one file per submit in `MediaManager`.
- No upload progress indicator (size/type are now checked before the POST).
- No optimistic updates or caching layer; every navigation refetches.
- No i18n, no dark-mode toggle, no accessibility audit.
- The media gallery and lightbox still have no test coverage.

---

## 3. Suggested order of work

1. Move media to Azure Blob Storage with SAS URLs and thumbnails; that also
   unlocks a private/draft state.
2. Account management: password reset and change (needs Identity token providers
   + an email sender).
3. Refresh tokens, so sessions survive longer than 7 days and can be revoked.
4. Sort options and a real search index for the archive.
5. Decide the fate of the Drive-sync, VR and team-account promises — build them,
   or drop the "Planned" sections from the marketing pages.
