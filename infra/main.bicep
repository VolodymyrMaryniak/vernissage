// Vernissage dev environment — subscription-scope entry point.
// Creates the resource group and everything inside it. Deploy with:
//   az deployment sub create --subscription <vernissage sub id> --location francecentral \
//     --template-file main.bicep --parameters main.bicepparam
// (use infra/deploy.ps1 rather than calling this directly — it handles secrets and
//  GitHub secret sync).
targetScope = 'subscription'

@description('Region for all resources except the Static Web App.')
param location string = 'francecentral'

@description('Region for the Static Web App (SWA is not offered in France Central).')
param swaLocation string = 'eastus2'

param resourceGroupName string = 'vernissage-dev-rg'
param appServicePlanName string = 'vernissage-plan-dev'
param webAppName string = 'vernissage-api-dev'
param staticWebAppName string = 'vernissage-web-dev'
param deployIdentityName string = 'vernissage-github-deploy-dev'
param logAnalyticsName string = 'vernissage-logs-dev'
param appInsightsName string = 'vernissage-appinsights-dev'
param sqlServerName string = 'vernissage-sql-server-dev'
param sqlDatabaseName string = 'vernissage_db_dev'

@description('SQL administrator login name.')
param sqlAdminLogin string = 'vernissage_admin'

@secure()
param sqlAdminPassword string

@description('JWT signing key for the API (Jwt__SigningKey app setting, >= 32 bytes).')
@secure()
param jwtSigningKey string

@description('Optional developer client IP allowed through the SQL firewall. Empty = no rule.')
param clientIpAddress string = ''

param httpLoggingRetentionDays int = 1

@description('GitHub repository (owner/name) trusted by the deploy identity via OIDC.')
param gitHubRepository string = 'VolodymyrMaryniak/vernissage'

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
}

module resources 'resources.bicep' = {
  scope: rg
  name: 'vernissage-dev-resources'
  params: {
    location: location
    swaLocation: swaLocation
    appServicePlanName: appServicePlanName
    webAppName: webAppName
    staticWebAppName: staticWebAppName
    deployIdentityName: deployIdentityName
    logAnalyticsName: logAnalyticsName
    appInsightsName: appInsightsName
    sqlServerName: sqlServerName
    sqlDatabaseName: sqlDatabaseName
    sqlAdminLogin: sqlAdminLogin
    sqlAdminPassword: sqlAdminPassword
    jwtSigningKey: jwtSigningKey
    clientIpAddress: clientIpAddress
    httpLoggingRetentionDays: httpLoggingRetentionDays
    gitHubRepository: gitHubRepository
  }
}

output apiDefaultHostname string = resources.outputs.apiDefaultHostname
output swaDefaultHostname string = resources.outputs.swaDefaultHostname
output deployIdentityClientId string = resources.outputs.deployIdentityClientId
output sqlServerFqdn string = resources.outputs.sqlServerFqdn
output appInsightsConnectionString string = resources.outputs.appInsightsConnectionString
