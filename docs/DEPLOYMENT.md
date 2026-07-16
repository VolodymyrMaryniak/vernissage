# Deployment

How Vernissage builds and deploys, and how to change what deploys from where.

## Overview

There are **three** workflows in `.github/workflows/`:

| File | Purpose | Deploys? |
| --- | --- | --- |
| `ci.yml` | Build + test backend, lint/test/build frontend | No — quality gate only |
| `develop_vernissage-api-dev.yml` | Build + deploy the **backend API** to Azure Web App | Yes |
| `azure-static-web-apps-kind-island-0c4e5b50f.yml` | Build + deploy the **frontend** to Azure Static Web Apps | Yes |

The two deploy pipelines are independent (different Azure services, different
auth) and both trigger on **push to `develop` or `release/*`**.

## How to deploy

- **Deploy everything:** land changes on `develop` (normally by merging a PR).
- **Deploy a release:** push a `release/*` branch (e.g. `release/1.2.0`).
- **Feature branches do not deploy.** They only run `ci.yml` via their PR.

Both deploy targets point at the shared **dev** environment, so a `release/*`
push overwrites whatever `develop` last shipped there.

## Backend API — `develop_vernissage-api-dev.yml`

Runs on Windows. Two jobs:

1. **build** — `dotnet build` + `dotnet publish` of `backend/Vernissage.Api`, then
   uploads the published output as the `.net-app` artifact. Both commands pass
   `-p:SourceBranch=${{ github.ref_name }}` so the branch is baked into the
   assembly for `GET /api/version`.
2. **deploy** — downloads the artifact, logs into Azure, and deploys to the
   `vernissage-api-dev` Web App (Production slot).

### Runtime configuration / secrets

The API needs a JWT signing key at runtime, supplied as the App Service
application setting **`Jwt__SigningKey`** (≥ 32 bytes) on `vernissage-api-dev`
(Azure Portal → the Web App → *Settings → Environment variables*). It is
deliberately **not** committed — only a dev key in `appsettings.Development.json`
lives in the repo. If the setting is missing the API fails fast on startup with
an `InvalidOperationException` from `TokenService`. `Jwt:Issuer`/`Jwt:Audience`
are non-secret and committed in `appsettings.json`.

Migrations are applied automatically on startup (`Database.Migrate()`), so a
deploy that carries new EF migrations updates the shared dev database on the
next boot — there is no separate migration step.

### Azure authentication (OIDC — important)

The deploy job authenticates with **`azure/login` using OIDC** (no stored
password). GitHub mints a short-lived token; Azure accepts it only if a matching
**federated identity credential (FIC)** exists on the identity behind the
`AZUREAPPSERVICE_CLIENTID_*` / `TENANTID_*` / `SUBSCRIPTIONID_*` secrets.

That identity is a **user-assigned managed identity**: `vernissage-api-d-id-9452`
(Azure Portal → *Managed Identities* → the identity → *Settings → Federated
credentials*).

The deploy job is scoped to the GitHub **environment `dev`**:

```yaml
deploy:
  needs: build
  environment: dev          # <- makes the OIDC token carry an environment claim
```

so the token's subject is:

```
repo:VolodymyrMaryniak/vernissage:environment:dev
```

A single FIC on the managed identity matching that subject lets **any branch
allowed by the `dev` environment** deploy the API — no per-branch Azure change.
Which branches may use the environment is controlled in
**GitHub → repo Settings → Environments → `dev` → Deployment branches and tags**
(currently `develop` and `release/*`).

> Why environment-scoped and not branch-scoped? A managed-identity FIC only
> supports an **exact** subject (no wildcard), so `refs/heads/release/*` cannot be
> expressed as one branch credential. Scoping to an environment gives one stable
> subject for all allowed branches. (Wildcard "flexible" FICs exist only for
> **app registrations**, not managed identities.)

### Adding a new deploy branch

1. Add the branch/pattern to `on.push.branches` in **both** deploy workflows.
2. Add it to the `dev` environment's **Deployment branches** rules in GitHub.
   The existing environment-scoped FIC already covers it for the API — no Azure
   change needed.

### Troubleshooting

- **`AADSTS700213: No matching federated identity record found for ... subject
  'repo:.../<something>'`** — the token's subject has no matching FIC. Check the
  FIC subject on `vernissage-api-d-id-9452`. With `environment: dev` on the job
  the subject must be `repo:VolodymyrMaryniak/vernissage:environment:dev`; if the
  job has no `environment:`, the subject is `...:ref:refs/heads/<branch>` instead.
- **Deploy job pauses waiting for approval** — the `dev` environment has required
  reviewers or a wait timer configured (a GitHub environment feature, not an error).

## Frontend — `azure-static-web-apps-kind-island-0c4e5b50f.yml`

Runs on Ubuntu. Uses `Azure/static-web-apps-deploy`, which builds the frontend
with Oryx (`app_location: ./frontend/vernissage.web`, `output_location: dist`)
and uploads it to the Static Web App.

- **Auth:** a static token secret (`AZURE_STATIC_WEB_APPS_API_TOKEN_*`), **not
  OIDC** — so it deploys from any branch without federated-credential setup.
- **PR previews:** on pull requests it creates a temporary preview environment;
  `close_pull_request_job` tears it down when the PR closes.
- Passes `env: VITE_APP_BRANCH: ${{ github.ref_name }}` so the version footer can
  show which branch the bundle was built from.

## Editing the deploy workflow YAML — line endings

`develop_vernissage-api-dev.yml` and the SWA workflow have **mixed line endings**
(mostly CRLF, with a few LF-only lines). Edit them **byte-precisely** so unrelated
lines keep their terminators, e.g.:

```bash
perl -0777 -i -pe 's{(    needs: build\r\n)(    permissions:)}{$1    environment: dev\r\n$2}' \
  .github/workflows/develop_vernissage-api-dev.yml
```

A normal editor that "fixes" line endings will rewrite every line to CRLF and
produce a large, noisy diff that touches lines you didn't mean to change.
