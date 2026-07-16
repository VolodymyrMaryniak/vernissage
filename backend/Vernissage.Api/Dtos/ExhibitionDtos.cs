using System.ComponentModel.DataAnnotations;
using Vernissage.Api.Models;

namespace Vernissage.Api.Dtos;

/// <summary>Payload for creating or updating an exhibition's text fields.</summary>
public class ExhibitionWriteDto
{
    [Required]
    [MaxLength(300)]
    public string Name { get; set; } = string.Empty;

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    [MaxLength(500)]
    public string? Location { get; set; }

    [MaxLength(200)]
    public string? Focus { get; set; }

    [MaxLength(500)]
    public string? Curator { get; set; }

    [MaxLength(500)]
    public string? GalleryLocation { get; set; }

    public string? Explication { get; set; }

    public string? InvestigationMaterial { get; set; }

    public string? Team { get; set; }

    public string? ArtworksList { get; set; }

    public string? PreOpeningDetails { get; set; }

    public string? OpeningDetails { get; set; }

    public string? EventsDetails { get; set; }

    public string? Notes { get; set; }

    public string? ReferencedLiterature { get; set; }

    public string? Aim { get; set; }
}

/// <summary>Query parameters for filtering the public exhibitions list.</summary>
public class ExhibitionQueryParams
{
    /// <summary>Free text matched against name and curator.</summary>
    public string? Q { get; set; }

    public string? Location { get; set; }

    public string? Focus { get; set; }

    /// <summary>Only exhibitions ending on/after this date.</summary>
    public DateOnly? From { get; set; }

    /// <summary>Only exhibitions starting on/before this date.</summary>
    public DateOnly? To { get; set; }
}

/// <summary>Summary view of an exhibition (used in list responses).</summary>
public class ExhibitionSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Location { get; set; }
    public string? Focus { get; set; }
    public string? Curator { get; set; }
    public Guid? OwnerId { get; set; }
    public int MediaCount { get; set; }
    public DateTimeOffset CreatedAtUtc { get; set; }
    public DateTimeOffset UpdatedAtUtc { get; set; }
}

/// <summary>Full view of an exhibition, including media metadata.</summary>
public class ExhibitionDetailDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Location { get; set; }
    public string? Focus { get; set; }
    public string? Curator { get; set; }
    public Guid? OwnerId { get; set; }
    public string? GalleryLocation { get; set; }
    public string? Explication { get; set; }
    public string? InvestigationMaterial { get; set; }
    public string? Team { get; set; }
    public string? ArtworksList { get; set; }
    public string? PreOpeningDetails { get; set; }
    public string? OpeningDetails { get; set; }
    public string? EventsDetails { get; set; }
    public string? Notes { get; set; }
    public string? ReferencedLiterature { get; set; }
    public string? Aim { get; set; }
    public DateTimeOffset CreatedAtUtc { get; set; }
    public DateTimeOffset UpdatedAtUtc { get; set; }
    public IReadOnlyList<ExhibitionMediaDto> Media { get; set; } = [];
}

/// <summary>Metadata for a single media asset (no binary content).</summary>
public class ExhibitionMediaDto
{
    public Guid Id { get; set; }
    public MediaCategory Category { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string? Caption { get; set; }
    public DateTimeOffset CreatedAtUtc { get; set; }
}
