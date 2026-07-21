using Microsoft.AspNetCore.Mvc;
using Vernissage.Api.Dtos;

namespace Vernissage.Api.Controllers;

/// <summary>Public runtime configuration for the frontend (feature flags).</summary>
[ApiController]
[Route("api/[controller]")]
public class ConfigController(IConfiguration configuration) : ControllerBase
{
    [HttpGet]
    public ActionResult<AppConfigDto> Get() => Ok(new AppConfigDto
    {
        AnalyticsEnabled = configuration.GetValue("Features:AnalyticsEnabled", true),
    });
}
