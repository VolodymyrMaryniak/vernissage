# Vernissage infrastructure (Bicep)

Everything the app runs on in Azure is described here and can be re-created from scratch
with one script. Subscription: **vernissage_subscription**
(`5f176042-017e-4258-9f38-80b531d1e91f`, tenant `56de5462-d0d1-4067-8e3a-c1bf20bcb4d7`).

> ⚠️ This is **not** the machine's default `az` subscription. `deploy.ps1` passes
> `--subscription` on every call; do the same for any manual `az` command.

## Files

| File | Purpose |
| --- | --- |
| `main.bicep` | Subscription-scope entry point: creates the resource group + everything in it |
| `resources.bicep` | All resources (module) |
| `main.bicepparam` | Parameter file; secrets come from env vars set by `deploy.ps1` |
| `deploy.ps1` | Orchestrator: deploys, fetches outputs, syncs GitHub secrets |

## What gets created

Resource group `vernissage-dev-rg` (France Central; SWA in East US 2):

| Resource | Name | Notes |
| --- | --- | --- |
| App Service plan | `vernissage-plan-dev` | Windows **F1 Free** |
| Web App (API) | `vernissage-api-dev` | .NET 10, HTTPS-only; hostname is auto-generated (`TenantReuse` scope) — treat as a deployment output |
| Static Web App | `vernissage-web-dev` | Free tier, **not** GitHub-linked; deploys use the deployment token |
| SQL server | `vernissage-sql-server-dev` | SQL auth; firewall: Azure services + optional `-ClientIp` |
| SQL database | `vernissage_db_dev` | GP_S_Gen5 serverless, **free-limit offer** (`useFreeLimit`) — set at creation only |
| Log Analytics | `vernissage-logs-dev` | PerGB2018, 30-day retention, **0.1 GB/day cap** (~zero cost) |
| Application Insights | `vernissage-appinsights-dev` | Workspace-based; wired to the API via `APPLICATIONINSIGHTS_CONNECTION_STRING` |
| Managed identity | `vernissage-github-deploy-dev` | GitHub OIDC deploy identity: Website Contributor on the web app only; federated credentials for `environment:dev` and `ref:refs/heads/develop` |

The web app's app settings are **fully owned by Bicep** (`ConnectionStrings__DefaultConnection`,
`Jwt__SigningKey`, `APPLICATIONINSIGHTS_CONNECTION_STRING`, `WEBSITE_HTTPLOGGING_RETENTION_DAYS`).
The deploy workflow re-applies the first two from GitHub secrets on every deploy with the same
values (deploy.ps1 keeps both sides in sync), so neither overwrites the other. Never enable the
portal's codeless Application Insights agent (`ApplicationInsightsAgent_EXTENSION_VERSION`) —
the API ships the OpenTelemetry distro in-process.

## Deploying

Prerequisites: `az` CLI (logged in to the vernissage tenant), `gh` CLI authenticated
(`winget install GitHub.cli`, then `gh auth login`) for the GitHub secret sync.

```powershell
pwsh infra/deploy.ps1 -WhatIf   # preview
pwsh infra/deploy.ps1           # deploy + GitHub sync
```

The script is idempotent:

- **Secrets** (SQL admin password, JWT signing key) are read back from the live web app's
  settings when it exists; generated only on a clean-slate run. Nothing secret is committed
  or logged (a manual fallback printout appears only when `gh` is unavailable).
- Re-running against an unchanged environment is a no-op.

After deploy it syncs the six GitHub Actions secrets (fixed names referenced by the
workflows — only values ever change): `AZUREAPPSERVICE_CLIENTID_*`,
`AZUREAPPSERVICE_TENANTID_*`, `AZUREAPPSERVICE_SUBSCRIPTIONID_*`, `SQL_CONNECTION_STRING`,
`JWT_SIGNING_KEY`, `AZURE_STATIC_WEB_APPS_API_TOKEN_KIND_ISLAND_0C4E5B50F` (name is
historical — it predates the current SWA). It also ensures the GitHub environment `dev`
exists with deployment branches `develop` + `release/*`, and updates environment-level
copies of those secrets if any exist (they shadow repo-level ones).

Finally it prints a drift report: whether `frontend/vernissage.web/.env.production`,
`vite.config.ts` (dev-proxy fallback), and the CORS origin in
`backend/Vernissage.Api/Program.cs` still match the deployed hostnames. The script never
edits repo files — patch, commit, and merge to `develop` to redeploy the apps.

## Re-creating from scratch (teardown runbook)

1. **Pre-flight**: Owner (or Contributor + User Access Administrator) on the subscription is
   required (role assignment). Capture the current app settings somewhere safe if you want to
   reuse the secrets; a fresh run generates new ones (all dev users must re-register — the DB
   is wiped).
2. **Teardown**: `az group delete --name <old rg> --subscription 5f176042-… --yes`
3. **Deploy**: `pwsh infra/deploy.ps1`. Globally-named resources (`vernissage-api-dev`,
   `vernissage-sql-server-dev`) can take a few minutes to free up after deletion — if the
   deployment reports a name conflict, wait and re-run.
4. **Patch repo** per the drift report (hostnames change when resources are re-created),
   update docs, merge to `develop` → both deploy workflows run → apps are live. EF migrations
   recreate the DB schema on the API's first boot.
5. **Verify**: workflows green; `GET https://<api>/api/version` → 200; register/login on the
   SWA works without CORS errors; `az sql db show … --query "{f:useFreeLimit, b:freeLimitExhaustionBehavior}"`
   → `true`/`AutoPause`; App Insights shows `requests`/`dependencies`/`traces` rows.

## Costs

Everything is on free tiers/offers (F1 plan, SWA Free, SQL free serverless limit). The only
metered resource is Log Analytics ingestion, capped at 0.1 GB/day (≈ €0–7/month worst case;
in practice ~€0 at dev traffic with the cap as a circuit breaker).
