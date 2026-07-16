namespace Vernissage.Api.Models;

/// <summary>
/// Private outcome metrics for an exhibition (1:1). Visible and editable only
/// by the exhibition's owner — never included in public DTOs.
/// </summary>
public class ExhibitionMetrics
{
    /// <summary>PK and FK to the exhibition.</summary>
    public Guid ExhibitionId { get; set; }

    public Exhibition? Exhibition { get; set; }

    public int? VisitorsCount { get; set; }

    /// <summary>Satisfaction rating, 1–10.</summary>
    public int? Satisfaction { get; set; }

    public int? ArtworksSold { get; set; }

    public decimal? TotalRevenue { get; set; }

    public DateTimeOffset UpdatedAtUtc { get; set; }

    /// <summary>Cost breakdown line items (framing, printing, brunch, rent, …).</summary>
    public ICollection<CostItem> CostItems { get; set; } = new List<CostItem>();
}
