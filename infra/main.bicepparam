using 'main.bicep'

// Non-secret parameters all have sensible defaults in main.bicep.
// Secrets and machine-specific values come from environment variables, which
// infra/deploy.ps1 sets before invoking the deployment — never commit values here.
param sqlAdminLogin = readEnvironmentVariable('VERNISSAGE_SQL_ADMIN_LOGIN', 'vernissage_admin')
param sqlAdminPassword = readEnvironmentVariable('VERNISSAGE_SQL_ADMIN_PASSWORD')
param jwtSigningKey = readEnvironmentVariable('VERNISSAGE_JWT_SIGNING_KEY')
param clientIpAddress = readEnvironmentVariable('VERNISSAGE_CLIENT_IP', '')
