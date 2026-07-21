using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Vernissage.Api.Controllers;
using Vernissage.Api.Dtos;
using Xunit;

namespace Vernissage.Api.Tests.Controllers;

public class ConfigControllerTests
{
    private static IConfiguration Config(params (string Key, string? Value)[] settings) =>
        new ConfigurationBuilder()
            .AddInMemoryCollection(settings.ToDictionary(s => s.Key, s => s.Value))
            .Build();

    private static AppConfigDto Get(IConfiguration configuration)
    {
        var result = new ConfigController(configuration).Get();
        var ok = Assert.IsType<OkObjectResult>(result.Result);
        return Assert.IsType<AppConfigDto>(ok.Value);
    }

    [Fact]
    public void Get_ReportsAnalyticsEnabled_ByDefault()
    {
        Assert.True(Get(Config()).AnalyticsEnabled);
    }

    [Fact]
    public void Get_ReportsAnalyticsDisabled_WhenFlagIsOff()
    {
        var config = Config(("Features:AnalyticsEnabled", "false"));

        Assert.False(Get(config).AnalyticsEnabled);
    }
}
