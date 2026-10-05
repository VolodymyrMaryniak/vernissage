using System.ComponentModel.DataAnnotations;

namespace Vernissage.Api.Dtos;

/// <summary>
/// The assistant's suggested values for an exhibition record, drafted from the
/// user's notes. Every field is a suggestion: null means "the source didn't say",
/// and the user accepts or skips each one, so nothing is written automatically.
/// </summary>
public class ExhibitionDraftDto
{
    public string? Name { get; set; }
    /// <summary>yyyy-MM-dd, or null.</summary>
    public string? StartDate { get; set; }
    /// <summary>yyyy-MM-dd, or null.</summary>
    public string? EndDate { get; set; }
    public string? Location { get; set; }
    public string? Focus { get; set; }
    public string? Curator { get; set; }
    public string? GalleryLocation { get; set; }
    public string? Aim { get; set; }
    public string? Explication { get; set; }
    public string? InvestigationMaterial { get; set; }
    public string? ReferencedLiterature { get; set; }
    public string? Team { get; set; }
    public string? ArtworksList { get; set; }
    public string? PreOpeningDetails { get; set; }
    public string? OpeningDetails { get; set; }
    public string? EventsDetails { get; set; }
    public string? Notes { get; set; }

    /// <summary>One or two sentences on what was found and what is still missing.</summary>
    public string Summary { get; set; } = string.Empty;
}

/// <summary>Request to rewrite one long-text field.</summary>
public class AssistantImproveRequestDto
{
    public static readonly string[] Modes = ["polish", "shorten"];

    /// <summary>Which field this text belongs to (e.g. "explication"), for tone.</summary>
    [Required]
    [MaxLength(60)]
    public string Field { get; set; } = string.Empty;

    [Required]
    [MaxLength(20000)]
    public string Text { get; set; } = string.Empty;

    /// <summary>"polish" (clearer, same length) or "shorten".</summary>
    [Required]
    public string Mode { get; set; } = "polish";

    /// <summary>The exhibition's name, if known, as context.</summary>
    [MaxLength(300)]
    public string? ExhibitionName { get; set; }
}

public class AssistantImproveResultDto
{
    public string Text { get; set; } = string.Empty;
}
