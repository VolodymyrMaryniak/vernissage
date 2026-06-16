using Microsoft.AspNetCore.Mvc;

namespace Vernissage.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Hello from Vernissage API" });
    }
}
