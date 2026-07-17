namespace Vernissage.Api.Models;

/// <summary>A single cost line in an exhibition's private cost breakdown.</summary>
public class CostItem
{
    public Guid Id { get; set; }

    public Guid ExhibitionMetricsId { get; set; }

    public ExhibitionMetrics? Metrics { get; set; }

    /// <summary>What the cost was for, e.g. "Framing", "Welcome brunch".</summary>
    public string Label { get; set; } = string.Empty;

    public decimal Amount { get; set; }
}
