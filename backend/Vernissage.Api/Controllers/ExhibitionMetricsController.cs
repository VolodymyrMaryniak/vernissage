using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vernissage.Api.Data;
using Vernissage.Api.Dtos;
using Vernissage.Api.Infrastructure;
using Vernissage.Api.Models;

namespace Vernissage.Api.Controllers;

/// <summary>Owner-only private metrics for an exhibition.</summary>
[ApiController]
[Route("api/exhibitions/{id:guid}/metrics")]
[Authorize]
public class ExhibitionMetricsController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ExhibitionMetricsDto>> Get(Guid id)
    {
        var exhibition = await dbContext.Exhibitions
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);
        if (this.CheckOwnership(exhibition) is { } problem)
        {
            return problem;
        }

        var metrics = await dbContext.ExhibitionMetrics
            .AsNoTracking()
            .Include(m => m.CostItems)
            .FirstOrDefaultAsync(m => m.ExhibitionId == id);

        // Metrics never saved yet → empty defaults so the UI can render the form.
        return Ok(metrics is null ? new ExhibitionMetricsDto() : ToDto(metrics));
    }

    [HttpPut]
    public async Task<ActionResult<ExhibitionMetricsDto>> Put(Guid id, MetricsWriteDto dto)
    {
        var exhibition = await dbContext.Exhibitions
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);
        if (this.CheckOwnership(exhibition) is { } problem)
        {
            return problem;
        }

        var metrics = await dbContext.ExhibitionMetrics
            .Include(m => m.CostItems)
            .FirstOrDefaultAsync(m => m.ExhibitionId == id);

        if (metrics is null)
        {
            metrics = new ExhibitionMetrics { ExhibitionId = id };
            dbContext.ExhibitionMetrics.Add(metrics);
        }

        metrics.VisitorsCount = dto.VisitorsCount;
        metrics.Satisfaction = dto.Satisfaction;
        metrics.ArtworksSold = dto.ArtworksSold;
        metrics.TotalRevenue = dto.TotalRevenue;
        metrics.UpdatedAtUtc = DateTimeOffset.UtcNow;

        // Full replace of the cost breakdown.
        dbContext.CostItems.RemoveRange(metrics.CostItems);
        metrics.CostItems.Clear();
        foreach (var item in dto.CostItems)
        {
            var costItem = new CostItem
            {
                Id = Guid.NewGuid(),
                ExhibitionMetricsId = id,
                Label = item.Label,
                Amount = item.Amount,
            };
            // Add via the set (change-tracker fixup also puts it in the
            // navigation): entities discovered only through the navigation
            // with a pre-set key would be tracked as Modified, not Added.
            dbContext.CostItems.Add(costItem);
        }

        await dbContext.SaveChangesAsync();

        return Ok(ToDto(metrics));
    }

    private static ExhibitionMetricsDto ToDto(ExhibitionMetrics m) => new()
    {
        VisitorsCount = m.VisitorsCount,
        Satisfaction = m.Satisfaction,
        ArtworksSold = m.ArtworksSold,
        TotalRevenue = m.TotalRevenue,
        TotalCost = m.CostItems.Sum(c => c.Amount),
        CostItems = m.CostItems
            .Select(c => new CostItemDto { Id = c.Id, Label = c.Label, Amount = c.Amount })
            .ToList(),
        UpdatedAtUtc = m.UpdatedAtUtc,
    };
}
