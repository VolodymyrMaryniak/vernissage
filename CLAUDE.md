# Vernissage — project guide for Claude

Full-stack app for managing exhibition records: a .NET 10 Web API backend and a
React + TypeScript (Vite) frontend. This file orients new Claude sessions; see
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the full deployment reference.

## Layout

```
backend/
  Vernissage.Api/        ASP.NET Core Web API (.NET 10, EF Core / SQL Server)
  Vernissage.Api.Tests/  xUnit tests
  Vernissage.slnx        solution
frontend/
  vernissage.web/        React 19 + TypeScript + Vite (react-router)
infra/                   Bicep IaC for all Azure resources + deploy.ps1 (see infra/README.md)
.github/workflows/       CI + two Azure deploy pipelines
```

## Common commands

Backend (run from `backend/`):

```bash
dotnet restore Vernissage.slnx
dotnet build   Vernissage.slnx --configuration Release
dotnet test    Vernissage.slnx --configuration Release
cd Vernissage.Api && dotnet run     # API on http://localhost:5000
```

Frontend (run from `frontend/vernissage.web/`):

```bash
npm ci
npm run dev      # http://localhost:5173
npm run lint
npm run test
npm run build
```

In dev the frontend talks to the API via the Vite proxy (`vite.config.ts` proxies
`/api` to the Azure dev API; `.env.development` leaves `VITE_API_BASE_URL` empty).
`.env.production` points at the deployed API.

New backend endpoints won't exist on the deployed dev API until this branch is
merged, so to develop against a local API run it (`dotnet run` → `localhost:5000`)
and point the proxy at it:

```bash
VITE_DEV_PROXY_TARGET=http://localhost:5000 npm run dev
```

## CI

`.github/workflows/ci.yml` runs on pushes to `develop` and PRs targeting `develop`:
a **backend** job (restore/build/test) and a **frontend** job (npm ci/lint/test/build).
It does **not** deploy. Keep it green before merging.

## Deployment (summary)

Two independent Azure targets, each with its own workflow, both triggered on
**push to `develop` or `release/*`**:

| Target | Workflow | Auth |
| --- | --- | --- |
| Backend API → Azure Web App `vernissage-api-dev` | `develop_vernissage-api-dev.yml` | OIDC (managed identity), deploy job scoped to GitHub environment `dev` |
| Frontend → Azure Static Web App `vernissage-web-dev` (`blue-water-0fe1e130f.7.azurestaticapps.net`) | `azure-static-web-apps-kind-island-0c4e5b50f.yml` | Static API token (works from any branch; `kind-island` in the filename/secret name is historical) |

**To deploy:** merge/push to `develop` (deploys both), or push a `release/*`
branch. Feature branches do **not** deploy. Full details, including how to add a
new deploy branch and how the Azure OIDC trust works, are in
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

All Azure resources (RG `vernissage-dev-rg`, vernissage subscription) are Bicep
in [`infra/`](infra/); `infra/deploy.ps1` re-creates everything and syncs the
GitHub Actions secrets — see [`infra/README.md`](infra/README.md).

## Logging & telemetry

The API exports OpenTelemetry (requests, SQL dependencies, `ILogger` logs, live
metrics) to Application Insights `vernissage-appinsights-dev` via
`Azure.Monitor.OpenTelemetry.AspNetCore`. Registration in `Program.cs` is
conditional on the `APPLICATIONINSIGHTS_CONNECTION_STRING` setting (set by the
Bicep on the App Service) — absent locally and in tests, so telemetry is off
there. Never enable the portal's codeless App Insights agent on the Web App; it
conflicts with the in-process distro.

## Authentication & authorization

ASP.NET Identity + JWT bearer, self-contained in the app's own SQL DB (no
external IdP). `ApplicationUser : IdentityUser<Guid>` holds all profile fields as
nullable columns; `AppDbContext` derives from `IdentityUserContext` (no
AspNetRoles tables — creator roles are **not** authorization roles).

- **Creator roles** are a `[Flags] CreatorRoles` column (`Gallery`/`Curator`/
  `Artist`); one account can hold any combination. DTOs expose them as a string
  array via `CreatorRolesMapper`.
- **Endpoints:** `POST /api/auth/register`, `POST /api/auth/login` (both return
  `{ token, user }`), `GET /api/auth/me`. Password policy is length-only (≥ 8).
- **JWT signing key** comes from config `Jwt:SigningKey` and is **never
  committed**: the dev key lives in `appsettings.Development.json`; production
  reads the App Service setting `Jwt__SigningKey` (≥ 32 bytes). `TokenService`
  throws on startup if it's missing.
- **Ownership:** `Exhibition.OwnerId` is set from the JWT on create. Writes
  (`PUT`/`DELETE`, media upload/delete, metrics) require the owner — non-owners
  and ownerless legacy records get **403**, missing records **404** (see
  `Infrastructure/OwnershipExtensions.cs`). All `GET`s stay anonymous, so the
  public can browse/search read-only. Legacy `OwnerId == null` rows are
  read-only until claimed via manual SQL.
- **Frontend:** `AuthContext` stores the token in `localStorage`
  (`vernissage.token`); `api/http.ts` injects the bearer header on every request;
  `RequireAuth` guards create/edit/profile/analytics routes.

## Private metrics & analytics

- **`GET`/`PUT /api/exhibitions/{id}/metrics`** (owner-only): private outcome
  metrics — visitors, satisfaction (1–10), artworks sold, revenue, and a
  `CostItem` breakdown (framing, rent, brunch, …). Never included in public
  exhibition DTOs. `GET` returns empty defaults before first save; `PUT` upserts
  and fully replaces the cost items. `TotalCost` is computed, never stored.
- **`GET /api/analytics/summary`** (owner-only) aggregates the caller's own
  exhibitions' metrics with the same `q`/`location`/`focus`/`from`/`to` filters
  as the public list. Gated by the `Features:AnalyticsEnabled` flag (default
  true) — returns **404** when off. This is the "Pro, free during beta" feature.
- **`GET /api/config`** (anonymous) exposes `{ analyticsEnabled }` so the
  frontend can show/hide the analytics nav without a rebuild.

## Configuration & secrets

Neither the **SQL connection string** nor the **JWT signing key** is committed.

- `ConnectionStrings:DefaultConnection` — local dev: `dotnet user-secrets` (from
  `Vernissage.Api`) or the `ConnectionStrings__DefaultConnection` env var;
  production: the App Service connection string / app setting
  `ConnectionStrings__DefaultConnection`. `Program.cs` throws on startup if it's
  missing. Tests are unaffected (they use the InMemory provider, not `Program.cs`).
- `Jwt:SigningKey` — see the authentication section above.

## Database migrations

EF Core migrations are applied automatically at startup by
`db.Database.Migrate()` in `Program.cs` (guarded by `IsRelational()`, so the
InMemory provider used in tests is unaffected). There is no separate migration
step in CI/CD — pushing to a deploy branch applies pending migrations on the
next boot. Add migrations with `dotnet ef migrations add <Name>` from
`Vernissage.Api`. Migrations to date are additive (new tables + nullable
columns), safe over existing data.

## App version endpoint

`GET /api/version` returns `{ version, branch, buildTimeUtc }`. The branch and
build time are baked into the assembly at build time by the `AddBuildMetadata`
target in `Vernissage.Api.csproj` (branch resolves from `-p:SourceBranch` /
`GITHUB_REF_NAME`, with a local `git` fallback) and read back via
`[AssemblyMetadata]` in `Controllers/VersionController.cs`.

The UI footer (`src/features/version/AppVersion.tsx`) shows the frontend's own
build branch/time — injected by Vite `define` as `__APP_BRANCH__` /
`__APP_BUILD_TIME__` (see `vite.config.ts`) — next to the backend info from the
endpoint.

## Gotchas / conventions

- **Mixed line endings in the deploy workflow YAML.** `develop_vernissage-api-dev.yml`
  (and the SWA workflow) mix CRLF with some LF lines. Edit them **byte-precisely**
  (e.g. `perl -0777 -i -pe`) so unrelated lines keep their endings — a normal
  editor may rewrite every line to CRLF and produce a noisy whole-file diff.
- Deploys go to a single shared **dev** environment, so a `release/*` push
  overwrites what `develop` last deployed there.
- `.claude/settings.local.json` is gitignored; `.claude/launch.json` is committed.
