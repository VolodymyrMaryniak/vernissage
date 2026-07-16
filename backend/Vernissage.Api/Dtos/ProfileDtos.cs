using System.ComponentModel.DataAnnotations;

namespace Vernissage.Api.Dtos;

/// <summary>Owner-only view of the authenticated user's profile.</summary>
public class ProfileDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string[] Roles { get; set; } = [];
    public string DisplayName { get; set; } = string.Empty;

    // Gallery
    public string? GalleryName { get; set; }
    public string? BusinessLocation { get; set; }
    public string? Focus { get; set; }
    public int? FoundingYear { get; set; }

    // Person (curator / artist)
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? SocialMedia { get; set; }
    public string? PlaceOfWork { get; set; }
    public string? AreasOfInterest { get; set; }
    public string? Location { get; set; }

    // Artist
    public string? Medium { get; set; }

    public bool HasPhoto { get; set; }
}

/// <summary>Payload for updating the profile (photo has its own endpoints).</summary>
public class ProfileWriteDto
{
    /// <summary>Creator roles: any combination of "Gallery", "Curator", "Artist".</summary>
    [Required]
    [MinLength(1)]
    public string[] Roles { get; set; } = [];

    [MaxLength(300)]
    public string? GalleryName { get; set; }

    [MaxLength(500)]
    public string? BusinessLocation { get; set; }

    [MaxLength(200)]
    public string? Focus { get; set; }

    [Range(1000, 9999)]
    public int? FoundingYear { get; set; }

    [MaxLength(200)]
    public string? FirstName { get; set; }

    [MaxLength(200)]
    public string? LastName { get; set; }

    [MaxLength(500)]
    public string? SocialMedia { get; set; }

    [MaxLength(300)]
    public string? PlaceOfWork { get; set; }

    [MaxLength(500)]
    public string? AreasOfInterest { get; set; }

    [MaxLength(500)]
    public string? Location { get; set; }

    [MaxLength(300)]
    public string? Medium { get; set; }
}
