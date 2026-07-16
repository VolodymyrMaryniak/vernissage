using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Vernissage.Api.Dtos;
using Vernissage.Api.Infrastructure;
using Vernissage.Api.Models;
using Vernissage.Api.Services;

namespace Vernissage.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(UserManager<ApplicationUser> userManager, TokenService tokenService)
    : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        if (!CreatorRolesMapper.TryParse(dto.Roles, out var roles) || roles == CreatorRoles.None)
        {
            return BadRequest(new { message = "Roles must be one or more of: Gallery, Curator, Artist." });
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = dto.Email,
            Email = dto.Email,
            Roles = roles,
            CreatedAtUtc = DateTimeOffset.UtcNow,
        };

        var result = await userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new { message = string.Join(" ", result.Errors.Select(e => e.Description)) });
        }

        return Ok(ToAuthResponse(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user is null || !await userManager.CheckPasswordAsync(user, dto.Password))
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return Ok(ToAuthResponse(user));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> Me()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var user = await userManager.FindByIdAsync(userId.Value.ToString());
        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(ToUserDto(user));
    }

    private AuthResponseDto ToAuthResponse(ApplicationUser user) => new()
    {
        Token = tokenService.CreateToken(user),
        User = ToUserDto(user),
    };

    private static UserDto ToUserDto(ApplicationUser user) => new()
    {
        Id = user.Id,
        Email = user.Email ?? string.Empty,
        Roles = CreatorRolesMapper.ToNames(user.Roles),
        DisplayName = user.DisplayName,
    };
}
