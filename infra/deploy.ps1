# Vernissage dev infrastructure deploy.
# Creates/converges every Azure resource from main.bicep and syncs the GitHub Actions
# secrets that the deploy workflows consume. Idempotent: re-runs reuse the secrets already
# on the live web app instead of generating new ones.
#
# The vernissage subscription is NOT the machine's default az subscription — every az call
# below passes --subscription explicitly. Do not "fix" that by az account set.
#
# Usage:
#   pwsh infra/deploy.ps1                # full deploy + GitHub secret sync
#   pwsh infra/deploy.ps1 -WhatIf        # template preview only, changes nothing
#   pwsh infra/deploy.ps1 -SkipGitHubSync
#   pwsh infra/deploy.ps1 -ClientIp 203.0.113.7   # also open SQL firewall for that IP

param(
    [string]$SubscriptionId = '5f176042-017e-4258-9f38-80b531d1e91f',
    [string]$Location = 'francecentral',
    [string]$ResourceGroup = 'vernissage-dev-rg',
    [string]$WebAppName = 'vernissage-api-dev',
    [string]$StaticWebAppName = 'vernissage-web-dev',
    [string]$GitHubRepo = 'VolodymyrMaryniak/vernissage',
    [string]$ClientIp = '',
    [switch]$WhatIf,
    [switch]$SkipGitHubSync
)

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

function Invoke-Az {
    # az writes warnings to stderr; only fail on exit code.
    param([Parameter(ValueFromRemainingArguments)][string[]]$AzArgs)
    $output = az @AzArgs 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "az $($AzArgs -join ' ') failed (exit $LASTEXITCODE)"
    }
    return $output
}

function New-RandomToken {
    param([int]$Length, [string]$Alphabet)
    $bytes = [byte[]]::new($Length)
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    return -join ($bytes | ForEach-Object { $Alphabet[$_ % $Alphabet.Length] })
}

# --- 1. Subscription / tooling pre-flight ------------------------------------

Write-Host "==> Verifying access to subscription $SubscriptionId (vernissage)"
$account = az account show --subscription $SubscriptionId -o json 2>$null | ConvertFrom-Json
if (-not $account) {
    throw "Cannot access subscription $SubscriptionId. Run: az login (account volodymyr.maryniak@gmail.com), then re-run this script."
}
$tenantId = $account.tenantId
Write-Host "    OK: '$($account.name)' in tenant $tenantId"

az bicep version *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host '==> Installing Bicep via az'
    Invoke-Az bicep install | Out-Null
}

# --- 2. Resolve secrets (reuse from live app if present, else generate) ------

Write-Host '==> Resolving secrets'
$sqlAdminLogin = 'vernissage_admin'
$sqlPassword = $null
$jwtKey = $null

$liveSettingsJson = az webapp config appsettings list --name $WebAppName --resource-group $ResourceGroup --subscription $SubscriptionId -o json 2>$null
if ($LASTEXITCODE -eq 0 -and $liveSettingsJson) {
    $liveSettings = $liveSettingsJson | ConvertFrom-Json
    $connSetting = ($liveSettings | Where-Object name -eq 'ConnectionStrings__DefaultConnection').value
    if ($connSetting -match 'User ID=([^;]+)') { $sqlAdminLogin = $Matches[1] }
    if ($connSetting -match 'Password=([^;]+)') { $sqlPassword = $Matches[1] }
    $jwtKey = ($liveSettings | Where-Object name -eq 'Jwt__SigningKey').value
    if ($sqlPassword -and $jwtKey) { Write-Host '    Reusing secrets from the live web app.' }
}

if (-not $sqlPassword) {
    # Alphanumeric only → connection-string-safe; loop until SQL complexity (3 categories) holds.
    do {
        $sqlPassword = New-RandomToken -Length 24 -Alphabet 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
    } until ($sqlPassword -cmatch '[A-Z]' -and $sqlPassword -cmatch '[a-z]' -and $sqlPassword -match '[0-9]')
    Write-Host '    Generated new SQL admin password.'
}
if (-not $jwtKey) {
    $jwtBytes = [byte[]]::new(32)
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($jwtBytes)
    $jwtKey = -join ($jwtBytes | ForEach-Object { $_.ToString('x2') }) # 64 hex chars = 32+ bytes
    Write-Host '    Generated new JWT signing key.'
}

# --- 3. Deploy ----------------------------------------------------------------

$env:VERNISSAGE_SQL_ADMIN_LOGIN = $sqlAdminLogin
$env:VERNISSAGE_SQL_ADMIN_PASSWORD = $sqlPassword
$env:VERNISSAGE_JWT_SIGNING_KEY = $jwtKey
$env:VERNISSAGE_CLIENT_IP = $ClientIp
try {
    $templateArgs = @(
        '--subscription', $SubscriptionId
        '--location', $Location
        '--template-file', (Join-Path $PSScriptRoot 'main.bicep')
        '--parameters', (Join-Path $PSScriptRoot 'main.bicepparam')
        '--parameters', "resourceGroupName=$ResourceGroup", "webAppName=$WebAppName", "staticWebAppName=$StaticWebAppName", "gitHubRepository=$GitHubRepo"
    )
    if ($WhatIf) {
        Write-Host '==> what-if preview (no changes will be made)'
        az deployment sub what-if @templateArgs
        if ($LASTEXITCODE -ne 0) { throw 'what-if failed' }
        return
    }

    $deploymentName = "vernissage-dev-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "==> Deploying ($deploymentName) — first run takes several minutes"
    az deployment sub create --name $deploymentName @templateArgs --output none
    if ($LASTEXITCODE -ne 0) { throw 'deployment failed' }
}
finally {
    Remove-Item Env:\VERNISSAGE_SQL_ADMIN_LOGIN, Env:\VERNISSAGE_SQL_ADMIN_PASSWORD, Env:\VERNISSAGE_JWT_SIGNING_KEY, Env:\VERNISSAGE_CLIENT_IP -ErrorAction SilentlyContinue
}

$outputs = (Invoke-Az deployment sub show --name $deploymentName --subscription $SubscriptionId --query properties.outputs --output json) | ConvertFrom-Json
$apiHostname = $outputs.apiDefaultHostname.value
$swaHostname = $outputs.swaDefaultHostname.value
$deployClientId = $outputs.deployIdentityClientId.value
$sqlFqdn = $outputs.sqlServerFqdn.value

Write-Host ''
Write-Host '==> Deployment outputs'
Write-Host "    API hostname:      https://$apiHostname"
Write-Host "    SWA hostname:      https://$swaHostname"
Write-Host "    Deploy client id:  $deployClientId"
Write-Host "    SQL server:        $sqlFqdn"

$sqlConnectionString = "Server=tcp:$sqlFqdn,1433;Initial Catalog=vernissage_db_dev;Persist Security Info=False;User ID=$sqlAdminLogin;Password=$sqlPassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
$swaToken = (Invoke-Az staticwebapp secrets list --name $StaticWebAppName --resource-group $ResourceGroup --subscription $SubscriptionId --query properties.apiKey --output tsv | Out-String).Trim()

# --- 4. GitHub secret + environment sync -------------------------------------

# Secret NAMES are fixed — the workflow YAMLs reference them and must not be edited.
$gitHubSecrets = [ordered]@{
    'AZUREAPPSERVICE_CLIENTID_19ABDA93FC1142439814C1EECAA63BF8'       = $deployClientId
    'AZUREAPPSERVICE_TENANTID_C285DC947FC94D1EB4061C1F1D9B2ACE'       = $tenantId
    'AZUREAPPSERVICE_SUBSCRIPTIONID_98CCD31C9584421FB43CB7BFA60B43F7' = $SubscriptionId
    'SQL_CONNECTION_STRING'                                           = $sqlConnectionString
    'JWT_SIGNING_KEY'                                                 = $jwtKey
    'AZURE_STATIC_WEB_APPS_API_TOKEN_KIND_ISLAND_0C4E5B50F'           = $swaToken
}

$ghReady = $false
if (-not $SkipGitHubSync) {
    if (Get-Command gh -ErrorAction SilentlyContinue) {
        gh auth status *> $null
        if ($LASTEXITCODE -eq 0) { $ghReady = $true }
        else { Write-Warning 'gh is installed but not authenticated. Run: gh auth login' }
    }
    else {
        Write-Warning 'GitHub CLI not found. Install with: winget install --id GitHub.cli ; then: gh auth login'
    }
}

if ($ghReady) {
    Write-Host '==> Syncing GitHub repository secrets'
    foreach ($name in $gitHubSecrets.Keys) {
        $gitHubSecrets[$name] | gh secret set $name --repo $GitHubRepo
        if ($LASTEXITCODE -ne 0) { throw "Failed to set repo secret $name" }
    }

    # Environment-level secrets shadow repo-level ones for the deploy job — update any that exist.
    $envSecretNames = @()
    $envSecretsJson = gh api "repos/$GitHubRepo/environments/dev/secrets" 2>$null
    if ($LASTEXITCODE -eq 0 -and $envSecretsJson) {
        $envSecretNames = ($envSecretsJson | ConvertFrom-Json).secrets.name
    }
    foreach ($name in $gitHubSecrets.Keys) {
        if ($envSecretNames -contains $name) {
            Write-Host "    Updating shadowing environment-level secret: $name"
            $gitHubSecrets[$name] | gh secret set $name --repo $GitHubRepo --env dev
            if ($LASTEXITCODE -ne 0) { throw "Failed to set environment secret $name" }
        }
    }

    Write-Host '==> Ensuring GitHub environment "dev" allows develop + release/* deployments'
    '{"deployment_branch_policy":{"protected_branches":false,"custom_branch_policies":true}}' |
        gh api -X PUT "repos/$GitHubRepo/environments/dev" --input - | Out-Null
    $policies = (gh api "repos/$GitHubRepo/environments/dev/deployment-branch-policies" | ConvertFrom-Json).branch_policies.name
    foreach ($branch in @('develop', 'release/*')) {
        if ($policies -notcontains $branch) {
            gh api -X POST "repos/$GitHubRepo/environments/dev/deployment-branch-policies" -f name=$branch -f type=branch | Out-Null
        }
    }
    Write-Host '    GitHub sync complete.'
}
elseif (-not $SkipGitHubSync) {
    Write-Warning 'Manual GitHub sync required. The values below are SECRETS — clear your terminal afterwards.'
    Write-Host "Set these at https://github.com/$GitHubRepo/settings/secrets/actions"
    Write-Host "(if a secret with the same name also exists under Settings > Environments > dev, update it there too):"
    foreach ($name in $gitHubSecrets.Keys) {
        Write-Host "  $name = $($gitHubSecrets[$name])"
    }
    Write-Host "Also ensure environment 'dev' (Settings > Environments) allows deployment branches: develop, release/*"
}

# --- 5. Repo drift report (script never edits repo files) --------------------

Write-Host ''
Write-Host '==> Repo files vs. deployed hostnames'
$checks = @(
    @{ File = 'frontend\vernissage.web\.env.production'; Expect = $apiHostname }
    @{ File = 'frontend\vernissage.web\vite.config.ts'; Expect = $apiHostname }
    @{ File = 'backend\Vernissage.Api\Program.cs'; Expect = $swaHostname }
)
foreach ($check in $checks) {
    $path = Join-Path $repoRoot $check.File
    if ((Get-Content $path -Raw) -match [regex]::Escape($check.Expect)) {
        Write-Host "    OK      $($check.File)"
    }
    else {
        Write-Host "    PATCH   $($check.File)  (expects $($check.Expect))"
    }
}
Write-Host ''
Write-Host 'Done. If any file needs patching, update it and merge to develop to redeploy the apps.'
