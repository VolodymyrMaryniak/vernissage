namespace Vernissage.Api.Dtos;

/// <summary>Aggregated metrics over the caller's own exhibitions.</summary>
public class AnalyticsSummaryDto
{
    /// <summary>Exhibitions matching the filters (with or without metrics).</summary>
    public int ExhibitionCount { get; set; }

    /// <summary>How many of those have saved metrics.</summary>
    public int ExhibitionsWithMetrics { get; set; }

    public int TotalVisitors { get; set; }
    public int TotalArtworksSold { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal TotalCost { get; set; }

    /// <summary>Average of non-null satisfaction ratings; null when no data.</summary>
    public decimal? AverageSatisfaction { get; set; }
}
