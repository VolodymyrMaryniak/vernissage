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
| Frontend → Azure Static Web Apps (`kind-island-0c4e5b50f`) | `azure-static-web-apps-kind-island-0c4e5b50f.yml` | Static API token (works from any branch) |

**To deploy:** merge/push to `develop` (deploys both), or push a `release/*`
branch. Feature branches do **not** deploy. Full details, including how to add a
new deploy branch and how the Azure OIDC trust works, are in
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

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
