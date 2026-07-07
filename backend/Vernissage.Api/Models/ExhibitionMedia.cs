namespace Vernissage.Api.Models;

/// <summary>
/// A single media asset (image, document, audio, VR file) belonging to an
/// <see cref="Exhibition"/>. The binary content is stored in the database as
/// varbinary(max) since no external blob storage is provisioned yet.
/// </summary>
public class ExhibitionMedia
{
    public Guid Id { get; set; }

    public Guid ExhibitionId { get; set; }

    public Exhibition? Exhibition { get; set; }

    /// <summary>What kind of asset this is.</summary>
    public MediaCategory Category { get; set; }

    /// <summary>Original file name.</summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>MIME content type of the file.</summary>
    public string ContentType { get; set; } = "application/octet-stream";

    /// <summary>Size of the content in bytes.</summary>
    public long FileSize { get; set; }

    /// <summary>Optional caption / description (e.g. the angle for a design photo).</summary>
    public string? Caption { get; set; }

    /// <summary>Raw file bytes. Stored as varbinary(max).</summary>
    public byte[] Content { get; set; } = Array.Empty<byte>();

    public DateTimeOffset CreatedAtUtc { get; set; }
}
