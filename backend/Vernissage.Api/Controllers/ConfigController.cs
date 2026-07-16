using Microsoft.AspNetCore.Mvc;

namespace Vernissage.Api.Controllers;

/// <summary>Public runtime configuration for the frontend (feature flags).</summary>
[ApiController]
[Route("api/[controller]")]
public class ConfigController(IConfiguration configuration) : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new
    {
        analyticsEnabled = configuration.GetValue("Features:AnalyticsEnabled", true),
    });
}
