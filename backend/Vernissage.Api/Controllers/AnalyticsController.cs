using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vernissage.Api.Data;
using Vernissage.Api.Dtos;
using Vernissage.Api.Infrastructure;
using Vernissage.Api.Models;

namespace Vernissage.Api.Controllers;

/// <summary>
/// Owner-scoped analytics over private exhibition metrics.
/// Gated by the Features:AnalyticsEnabled flag ("Pro" feature, free during beta).
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalyticsController(AppDbContext dbContext, IConfiguration configuration) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<AnalyticsSummaryDto>> GetSummary(
        [FromQuery] ExhibitionQueryParams query)
    {
        if (!configuration.GetValue("Features:AnalyticsEnabled", true))
        {
            return NotFound();
        }

        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var exhibitions = dbContext.Exhibitions
            .AsNoTracking()
            .Where(e => e.OwnerId == userId)
            .ApplyFilters(query);

        var metrics = await exhibitions
            .Join(
                dbContext.ExhibitionMetrics.AsNoTracking().Include(m => m.CostItems),
                e => e.Id,
                m => m.ExhibitionId,
                (e, m) => m)
            .ToListAsync();

        var satisfactionValues = metrics
            .Where(m => m.Satisfaction.HasValue)
            .Select(m => m.Satisfaction!.Value)
            .ToList();

        return Ok(new AnalyticsSummaryDto
        {
            ExhibitionCount = await exhibitions.CountAsync(),
            ExhibitionsWithMetrics = metrics.Count,
            TotalVisitors = metrics.Sum(m => m.VisitorsCount ?? 0),
            TotalArtworksSold = metrics.Sum(m => m.ArtworksSold ?? 0),
            TotalRevenue = metrics.Sum(m => m.TotalRevenue ?? 0m),
            TotalCost = metrics.Sum(m => m.CostItems.Sum(c => c.Amount)),
            AverageSatisfaction = satisfactionValues.Count > 0
                ? Math.Round((decimal)satisfactionValues.Average(), 2)
                : null,
        });
    }

}
