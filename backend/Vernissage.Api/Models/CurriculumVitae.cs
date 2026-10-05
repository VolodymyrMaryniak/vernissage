namespace Vernissage.Api.Models;

/// <summary>
/// A user's CV: the builder settings and content used to generate it (stored as
/// JSON, see <see cref="Dtos.CvDocumentDto"/>), plus an optional CV file the
/// user uploaded themselves. One per user. The generated PDF/Word files are
/// rendered on demand in the browser from this document, so they are never
/// stale and never stored.
/// </summary>
public class CurriculumVitae
{
    public Guid Id { get; set; }

    public Guid OwnerId { get; set; }

    /// <summary>Serialized <see cref="Dtos.CvDocumentDto"/>.</summary>
    public string DocumentJson { get; set; } = "{}";

    /// <summary>When the user last pressed "Update the CV" (pulled in new exhibitions).</summary>
    public DateTimeOffset? GeneratedAtUtc { get; set; }

    public DateTimeOffset UpdatedAtUtc { get; set; }

    // An uploaded CV file, stored in-DB like profile photos and exhibition media.
    public byte[]? UploadedFile { get; set; }

    public string? UploadedFileName { get; set; }

    public string? UploadedContentType { get; set; }

    public long? UploadedFileSize { get; set; }

    public DateTimeOffset? UploadedAtUtc { get; set; }
}
