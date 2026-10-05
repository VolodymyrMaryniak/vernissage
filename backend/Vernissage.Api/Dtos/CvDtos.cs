using System.ComponentModel.DataAnnotations;

namespace Vernissage.Api.Dtos;

/// <summary>
/// Everything the CV builder needs to render a CV: the chosen design, which of
/// the user's exhibitions to list (and how to label each), and the free-text
/// sections. Personal details (name, photo, contact) come from the profile.
/// </summary>
public class CvDocumentDto
{
    public static readonly string[] Templates = ["classic", "modern", "minimal"];
    public static readonly string[] Fonts = ["garamond", "times", "helvetica", "courier"];
    public static readonly string[] PageSizes = ["A4", "Letter"];

    /// <summary>Layout: one of <see cref="Templates"/>.</summary>
    [Required]
    public string Template { get; set; } = "classic";

    /// <summary>Typeface: one of <see cref="Fonts"/>.</summary>
    [Required]
    public string Font { get; set; } = "garamond";

    /// <summary>Paper size: one of <see cref="PageSizes"/>.</summary>
    [Required]
    public string PageSize { get; set; } = "A4";

    /// <summary>Line under the name, e.g. "Visual artist, based in Kyiv".</summary>
    [MaxLength(300)]
    public string? Headline { get; set; }

    public bool IncludePhoto { get; set; } = true;

    public bool IncludeContact { get; set; } = true;

    public bool IncludeExhibitions { get; set; } = true;

    /// <summary>The user's documented exhibitions to list, in order.</summary>
    [MaxLength(500)]
    public List<CvExhibitionDto> Exhibitions { get; set; } = [];

    /// <summary>Free-text sections (statement, education, awards, …), in order.</summary>
    [MaxLength(20)]
    public List<CvSectionDto> Sections { get; set; } = [];

    /// <summary>The starting document for a user who has never saved a CV.</summary>
    public static CvDocumentDto CreateDefault() => new()
    {
        Sections =
        [
            new() { Key = "statement", Title = "Statement" },
            new() { Key = "education", Title = "Education" },
            new() { Key = "otherExhibitions", Title = "Other exhibitions" },
            new() { Key = "awards", Title = "Awards, grants & residencies" },
            new() { Key = "collections", Title = "Collections" },
            new() { Key = "publications", Title = "Publications & press" },
        ],
    };
}

/// <summary>One documented exhibition listed on the CV.</summary>
public class CvExhibitionDto
{
    public static readonly string[] Kinds = ["solo", "group", "curated"];

    public Guid ExhibitionId { get; set; }

    /// <summary>Which CV heading it goes under: one of <see cref="Kinds"/>.</summary>
    [Required]
    public string Kind { get; set; } = "group";
}

/// <summary>A free-text CV section; each line of <see cref="Text"/> is one entry.</summary>
public class CvSectionDto
{
    [Required]
    [MaxLength(60)]
    public string Key { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    public bool Include { get; set; } = true;

    [MaxLength(20000)]
    public string? Text { get; set; }
}

/// <summary>Metadata of the CV file the user uploaded (the bytes have their own endpoint).</summary>
public class CvFileDto
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public DateTimeOffset UploadedAtUtc { get; set; }
}

/// <summary>Owner-only view of the caller's CV.</summary>
public class CvDto
{
    public CvDocumentDto Document { get; set; } = CvDocumentDto.CreateDefault();

    /// <summary>Last time "Update the CV" was pressed; null if never.</summary>
    public DateTimeOffset? GeneratedAtUtc { get; set; }

    public DateTimeOffset? UpdatedAtUtc { get; set; }

    public CvFileDto? UploadedFile { get; set; }
}

/// <summary>Payload for saving the CV document.</summary>
public class CvWriteDto
{
    [Required]
    public CvDocumentDto Document { get; set; } = CvDocumentDto.CreateDefault();

    /// <summary>
    /// True when this save is an "Update the CV": stamps <see cref="CvDto.GeneratedAtUtc"/>
    /// so exhibitions documented afterwards are flagged as new next time.
    /// </summary>
    public bool MarkGenerated { get; set; }
}
