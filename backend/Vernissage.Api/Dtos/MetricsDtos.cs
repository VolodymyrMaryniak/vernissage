using System.ComponentModel.DataAnnotations;

namespace Vernissage.Api.Dtos;

/// <summary>Owner-only view of an exhibition's private metrics.</summary>
public class ExhibitionMetricsDto
{
    public int? VisitorsCount { get; set; }
    public int? Satisfaction { get; set; }
    public int? ArtworksSold { get; set; }
    public decimal? TotalRevenue { get; set; }

    /// <summary>Sum of cost items; computed, never stored.</summary>
    public decimal TotalCost { get; set; }

    public IReadOnlyList<CostItemDto> CostItems { get; set; } = [];

    /// <summary>Null when metrics have never been saved for this exhibition.</summary>
    public DateTimeOffset? UpdatedAtUtc { get; set; }
}

/// <summary>Payload for saving an exhibition's metrics (full replace).</summary>
public class MetricsWriteDto
{
    [Range(0, int.MaxValue)]
    public int? VisitorsCount { get; set; }

    [Range(1, 10)]
    public int? Satisfaction { get; set; }

    [Range(0, int.MaxValue)]
    public int? ArtworksSold { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? TotalRevenue { get; set; }

    public List<CostItemWriteDto> CostItems { get; set; } = [];
}

public class CostItemDto
{
    public Guid Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}

public class CostItemWriteDto
{
    [Required]
    [MaxLength(200)]
    public string Label { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Amount { get; set; }
}
