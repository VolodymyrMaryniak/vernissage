namespace Vernissage.Api.Models;

/// <summary>
/// An exhibition record created by an (independent) curator.
/// Holds descriptive text fields plus a collection of media assets
/// (images, documents, audio, VR).
/// </summary>
public class Exhibition
{
    public Guid Id { get; set; }

    /// <summary>Exhibition name / title.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Optional start date of the exhibition.</summary>
    public DateOnly? StartDate { get; set; }

    /// <summary>Optional end date of the exhibition.</summary>
    public DateOnly? EndDate { get; set; }

    /// <summary>General location.</summary>
    public string? Location { get; set; }

    /// <summary>Curator name(s).</summary>
    public string? Curator { get; set; }

    /// <summary>Gallery / location details.</summary>
    public string? GalleryLocation { get; set; }

    /// <summary>Explication text.</summary>
    public string? Explication { get; set; }

    /// <summary>Investigation / research material.</summary>
    public string? InvestigationMaterial { get; set; }

    /// <summary>Team involved.</summary>
    public string? Team { get; set; }

    /// <summary>List of artworks (free text).</summary>
    public string? ArtworksList { get; set; }

    /// <summary>Pre-opening details.</summary>
    public string? PreOpeningDetails { get; set; }

    /// <summary>Opening details.</summary>
    public string? OpeningDetails { get; set; }

    /// <summary>Details of events held within the exhibition.</summary>
    public string? EventsDetails { get; set; }

    /// <summary>Free-form notes.</summary>
    public string? Notes { get; set; }

    /// <summary>Referenced literature and research articles.</summary>
    public string? ReferencedLiterature { get; set; }

    /// <summary>Aim / purpose of the exhibition.</summary>
    public string? Aim { get; set; }

    /// <summary>
    /// Optional owning curator identifier. Reserved for future authorization;
    /// not populated or enforced yet.
    /// </summary>
    public Guid? OwnerId { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; }

    public DateTimeOffset UpdatedAtUtc { get; set; }

    /// <summary>Media assets attached to this exhibition.</summary>
    public ICollection<ExhibitionMedia> Media { get; set; } = new List<ExhibitionMedia>();
}
