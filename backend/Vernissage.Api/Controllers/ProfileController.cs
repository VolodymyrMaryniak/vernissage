using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Vernissage.Api.Dtos;
using Vernissage.Api.Infrastructure;
using Vernissage.Api.Models;

namespace Vernissage.Api.Controllers;

/// <summary>The authenticated user's own profile (no public profiles in MVP).</summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController(UserManager<ApplicationUser> userManager) : ControllerBase
{
    // Same in-DB storage approach as exhibition media, but profile photos are small.
    private const long MaxPhotoBytes = 5 * 1024 * 1024; // 5 MB

    [HttpGet]
    public async Task<ActionResult<ProfileDto>> Get()
    {
        var user = await GetCurrentUser();
        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(ToDto(user));
    }

    [HttpPut]
    public async Task<ActionResult<ProfileDto>> Put(ProfileWriteDto dto)
    {
        var user = await GetCurrentUser();
        if (user is null)
        {
            return Unauthorized();
        }

        if (!CreatorRolesMapper.TryParse(dto.Roles, out var roles) || roles == CreatorRoles.None)
        {
            return BadRequest(new { message = "Roles must be one or more of: Gallery, Curator, Artist." });
        }

        user.Roles = roles;
        user.GalleryName = dto.GalleryName;
        user.BusinessLocation = dto.BusinessLocation;
        user.Focus = dto.Focus;
        user.FoundingYear = dto.FoundingYear;
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.SocialMedia = dto.SocialMedia;
        user.PlaceOfWork = dto.PlaceOfWork;
        user.AreasOfInterest = dto.AreasOfInterest;
        user.Location = dto.Location;
        user.Medium = dto.Medium;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(new { message = string.Join(" ", result.Errors.Select(e => e.Description)) });
        }

        return Ok(ToDto(user));
    }

    [HttpPut("photo")]
    [RequestSizeLimit(MaxPhotoBytes + (1 * 1024 * 1024))]
    public async Task<ActionResult<ProfileDto>> UploadPhoto(IFormFile file)
    {
        var user = await GetCurrentUser();
        if (user is null)
        {
            return Unauthorized();
        }

        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "A non-empty file is required." });
        }

        if (file.Length > MaxPhotoBytes)
        {
            return BadRequest(new { message = $"Photo exceeds the maximum size of {MaxPhotoBytes} bytes." });
        }

        if (file.ContentType is null || !file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Profile photo must be an image." });
        }

        using var memory = new MemoryStream();
        await file.CopyToAsync(memory);
        user.ProfilePhoto = memory.ToArray();
        user.ProfilePhotoContentType = file.ContentType;

        await userManager.UpdateAsync(user);

        return Ok(ToDto(user));
    }

    [HttpGet("photo")]
    public async Task<IActionResult> GetPhoto()
    {
        var user = await GetCurrentUser();
        if (user is null)
        {
            return Unauthorized();
        }

        if (user.ProfilePhoto is null || user.ProfilePhotoContentType is null)
        {
            return NotFound();
        }

        return File(user.ProfilePhoto, user.ProfilePhotoContentType);
    }

    [HttpDelete("photo")]
    public async Task<IActionResult> DeletePhoto()
    {
        var user = await GetCurrentUser();
        if (user is null)
        {
            return Unauthorized();
        }

        user.ProfilePhoto = null;
        user.ProfilePhotoContentType = null;
        await userManager.UpdateAsync(user);

        return NoContent();
    }

    private async Task<ApplicationUser?> GetCurrentUser()
    {
        var userId = User.GetUserId();
        return userId is null ? null : await userManager.FindByIdAsync(userId.Value.ToString());
    }

    private static ProfileDto ToDto(ApplicationUser user) => new()
    {
        Id = user.Id,
        Email = user.Email ?? string.Empty,
        Roles = CreatorRolesMapper.ToNames(user.Roles),
        DisplayName = user.DisplayName,
        GalleryName = user.GalleryName,
        BusinessLocation = user.BusinessLocation,
        Focus = user.Focus,
        FoundingYear = user.FoundingYear,
        FirstName = user.FirstName,
        LastName = user.LastName,
        SocialMedia = user.SocialMedia,
        PlaceOfWork = user.PlaceOfWork,
        AreasOfInterest = user.AreasOfInterest,
        Location = user.Location,
        Medium = user.Medium,
        HasPhoto = user.ProfilePhoto is not null,
    };
}
