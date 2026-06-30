using Microsoft.AspNetCore.Mvc;
using Vernissage.Api.Data;

namespace Vernissage.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Hello from Vernissage API" });
    }

    [HttpGet("db-check")]
    public async Task<IActionResult> DbCheck()
    {
        var canConnect = await dbContext.Database.CanConnectAsync();
        return canConnect
            ? Ok(new { connected = true })
            : StatusCode(StatusCodes.Status503ServiceUnavailable, new { connected = false });
    }
}
