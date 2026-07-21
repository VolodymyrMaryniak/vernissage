namespace Vernissage.Api.Dtos;

/// <summary>Public runtime configuration the frontend reads on startup.</summary>
public class AppConfigDto
{
    /// <summary>Whether the analytics feature is available ("Pro", free during beta).</summary>
    public bool AnalyticsEnabled { get; set; }
}
