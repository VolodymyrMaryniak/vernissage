using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Vernissage.Api.Controllers;
using Vernissage.Api.Data;
using Vernissage.Api.Dtos;
using Vernissage.Api.Models;
using Vernissage.Api.Tests.TestHelpers;
using Xunit;

namespace Vernissage.Api.Tests.Controllers;

public class AnalyticsControllerTests
{
    private static readonly Guid OwnerId = Guid.NewGuid();
    private static readonly Guid OtherUserId = Guid.NewGuid();

    private static IConfiguration Config(bool analyticsEnabled = true) =>
        new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Features:AnalyticsEnabled"] = analyticsEnabled.ToString(),
            })
            .Build();

    private static async Task SeedExhibitionWithMetrics(
        AppDbContext db,
        Guid ownerId,
        string name,
        string? focus = null,
        DateOnly? startDate = null,
        int? visitors = null,
        int? satisfaction = null,
        int? sold = null,
        decimal? revenue = null,
        params (string Label, decimal Amount)[] costs)
    {
        var exhibition = new Exhibition
        {
            Id = Guid.NewGuid(),
            Name = name,
            Focus = focus,
            StartDate = startDate,
            OwnerId = ownerId,
            CreatedAtUtc = DateTimeOffset.UtcNow,
            UpdatedAtUtc = DateTimeOffset.UtcNow,
        };
        db.Exhibitions.Add(exhibition);

        if (visitors is not null || satisfaction is not null || sold is not null
            || revenue is not null || costs.Length > 0)
        {
            var metrics = new ExhibitionMetrics
            {
                ExhibitionId = exhibition.Id,
                VisitorsCount = visitors,
                Satisfaction = satisfaction,
                ArtworksSold = sold,
                TotalRevenue = revenue,
                UpdatedAtUtc = DateTimeOffset.UtcNow,
            };
            db.ExhibitionMetrics.Add(metrics);
            foreach (var (label, amount) in costs)
            {
                db.CostItems.Add(new CostItem
                {
                    Id = Guid.NewGuid(),
                    ExhibitionMetricsId = exhibition.Id,
                    Label = label,
                    Amount = amount,
                });
            }
        }

        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task GetSummary_AggregatesOwnMetrics()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        await SeedExhibitionWithMetrics(db, OwnerId, "Show A",
            visitors: 100, satisfaction: 8, sold: 5, revenue: 1000m, costs: ("Rent", 400m));
        await SeedExhibitionWithMetrics(db, OwnerId, "Show B",
            visitors: 50, satisfaction: 6, sold: 2, revenue: 500m, costs: [("Framing", 100m), ("Brunch", 50m)]);
        await SeedExhibitionWithMetrics(db, OwnerId, "Show C (no metrics)");
        var controller = new AnalyticsController(db, Config()).WithUser(OwnerId);

        var result = await controller.GetSummary(new ExhibitionQueryParams());

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<AnalyticsSummaryDto>(ok.Value);
        Assert.Equal(3, dto.ExhibitionCount);
        Assert.Equal(2, dto.ExhibitionsWithMetrics);
        Assert.Equal(150, dto.TotalVisitors);
        Assert.Equal(7, dto.TotalArtworksSold);
        Assert.Equal(1500m, dto.TotalRevenue);
        Assert.Equal(550m, dto.TotalCost);
        Assert.Equal(7m, dto.AverageSatisfaction);
    }

    [Fact]
    public async Task GetSummary_ExcludesOtherUsersData()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        await SeedExhibitionWithMetrics(db, OwnerId, "Mine", visitors: 100);
        await SeedExhibitionWithMetrics(db, OtherUserId, "Theirs", visitors: 999);
        var controller = new AnalyticsController(db, Config()).WithUser(OwnerId);

        var result = await controller.GetSummary(new ExhibitionQueryParams());

        var dto = (AnalyticsSummaryDto)((OkObjectResult)result.Result!).Value!;
        Assert.Equal(1, dto.ExhibitionCount);
        Assert.Equal(100, dto.TotalVisitors);
    }

    [Fact]
    public async Task GetSummary_RespectsFocusAndDateFilters()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        await SeedExhibitionWithMetrics(db, OwnerId, "Light Show", focus: "Light art",
            startDate: new DateOnly(2026, 5, 1), visitors: 100);
        await SeedExhibitionWithMetrics(db, OwnerId, "Clay Show", focus: "Sculpture",
            startDate: new DateOnly(2026, 1, 1), visitors: 40);
        var controller = new AnalyticsController(db, Config()).WithUser(OwnerId);

        var byFocus = await controller.GetSummary(new ExhibitionQueryParams { Focus = "Light" });
        var byDate = await controller.GetSummary(new ExhibitionQueryParams
        {
            From = new DateOnly(2026, 4, 1),
        });

        var focusDto = (AnalyticsSummaryDto)((OkObjectResult)byFocus.Result!).Value!;
        Assert.Equal(1, focusDto.ExhibitionCount);
        Assert.Equal(100, focusDto.TotalVisitors);
        var dateDto = (AnalyticsSummaryDto)((OkObjectResult)byDate.Result!).Value!;
        Assert.Equal(1, dateDto.ExhibitionCount);
        Assert.Equal(100, dateDto.TotalVisitors);
    }

    [Fact]
    public async Task GetSummary_ReturnsNullSatisfaction_WhenNoData()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        await SeedExhibitionWithMetrics(db, OwnerId, "Show", visitors: 10);
        var controller = new AnalyticsController(db, Config()).WithUser(OwnerId);

        var result = await controller.GetSummary(new ExhibitionQueryParams());

        var dto = (AnalyticsSummaryDto)((OkObjectResult)result.Result!).Value!;
        Assert.Null(dto.AverageSatisfaction);
    }

    [Fact]
    public async Task GetSummary_ReturnsNotFound_WhenFeatureDisabled()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var controller = new AnalyticsController(db, Config(analyticsEnabled: false)).WithUser(OwnerId);

        var result = await controller.GetSummary(new ExhibitionQueryParams());

        Assert.IsType<NotFoundResult>(result.Result);
    }
}
