namespace Vernissage.Api.Dtos;

/// <summary>Build and version information for the running backend.</summary>
public class AppVersionDto
{
    /// <summary>Informational version of the API assembly (e.g. "1.0.0").</summary>
    public string Version { get; set; } = string.Empty;

    /// <summary>Branch the backend was built from (e.g. "develop"), or "unknown".</summary>
    public string Branch { get; set; } = string.Empty;

    /// <summary>UTC timestamp of when the backend was built, if available.</summary>
    public DateTimeOffset? BuildTimeUtc { get; set; }
}
