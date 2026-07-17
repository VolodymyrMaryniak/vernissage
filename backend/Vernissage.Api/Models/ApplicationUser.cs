using Microsoft.AspNetCore.Identity;

namespace Vernissage.Api.Models;

/// <summary>
/// Application account. One user can hold any combination of creator roles
/// (Gallery / Curator / Artist); profile fields for every role live on this
/// single table as nullable columns — the UI shows only the groups relevant
/// to the user's roles.
/// </summary>
public class ApplicationUser : IdentityUser<Guid>
{
    public CreatorRoles Roles { get; set; }

    // Gallery profile
    public string? GalleryName { get; set; }
    public string? BusinessLocation { get; set; }
    public string? Focus { get; set; }
    public int? FoundingYear { get; set; }

    // Person (curator / artist) profile
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? SocialMedia { get; set; }
    public string? PlaceOfWork { get; set; }
    public string? AreasOfInterest { get; set; }
    public string? Location { get; set; }

    // Artist-specific
    public string? Medium { get; set; }

    // Profile photo stored in-DB, mirroring the exhibition media convention.
    public byte[]? ProfilePhoto { get; set; }
    public string? ProfilePhotoContentType { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; }

    /// <summary>Display name derived from profile fields, falling back to email.</summary>
    public string DisplayName =>
        !string.IsNullOrWhiteSpace(GalleryName) ? GalleryName
        : !string.IsNullOrWhiteSpace(FirstName) || !string.IsNullOrWhiteSpace(LastName)
            ? $"{FirstName} {LastName}".Trim()
            : Email ?? string.Empty;
}
