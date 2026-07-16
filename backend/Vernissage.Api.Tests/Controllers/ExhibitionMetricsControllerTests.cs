using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vernissage.Api.Controllers;
using Vernissage.Api.Data;
using Vernissage.Api.Dtos;
using Vernissage.Api.Models;
using Vernissage.Api.Tests.TestHelpers;
using Xunit;

namespace Vernissage.Api.Tests.Controllers;

public class ExhibitionMetricsControllerTests
{
    private static readonly Guid OwnerId = Guid.NewGuid();
    private static readonly Guid OtherUserId = Guid.NewGuid();

    private static async Task<(AppDbContext Db, Guid ExhibitionId)> SeedExhibition()
    {
        var db = IdentityTestFactory.CreateInMemoryDbContext();
        var exhibition = new Exhibition
        {
            Id = Guid.NewGuid(),
            Name = "Metrics Show",
            OwnerId = OwnerId,
            CreatedAtUtc = DateTimeOffset.UtcNow,
            UpdatedAtUtc = DateTimeOffset.UtcNow,
        };
        db.Exhibitions.Add(exhibition);
        await db.SaveChangesAsync();
        return (db, exhibition.Id);
    }

    private static MetricsWriteDto SampleWrite() => new()
    {
        VisitorsCount = 250,
        Satisfaction = 8,
        ArtworksSold = 12,
        TotalRevenue = 15000m,
        CostItems =
        [
            new CostItemWriteDto { Label = "Framing", Amount = 1200m },
            new CostItemWriteDto { Label = "Welcome brunch", Amount = 300m },
        ],
    };

    [Fact]
    public async Task Get_ReturnsEmptyDefaults_WhenNeverSaved()
    {
        var (db, exhibitionId) = await SeedExhibition();
        await using var _ = db;
        var controller = new ExhibitionMetricsController(db).WithUser(OwnerId);

        var result = await controller.Get(exhibitionId);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<ExhibitionMetricsDto>(ok.Value);
        Assert.Null(dto.VisitorsCount);
        Assert.Null(dto.UpdatedAtUtc);
        Assert.Empty(dto.CostItems);
    }

    [Fact]
    public async Task Put_CreatesMetrics_AndComputesTotalCost()
    {
        var (db, exhibitionId) = await SeedExhibition();
        await using var _ = db;
        var controller = new ExhibitionMetricsController(db).WithUser(OwnerId);

        var result = await controller.Put(exhibitionId, SampleWrite());

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<ExhibitionMetricsDto>(ok.Value);
        Assert.Equal(250, dto.VisitorsCount);
        Assert.Equal(1500m, dto.TotalCost);
        Assert.Equal(2, dto.CostItems.Count);
        Assert.NotNull(dto.UpdatedAtUtc);
        Assert.Single(await db.ExhibitionMetrics.ToListAsync());
    }

    [Fact]
    public async Task Put_ReplacesCostItems()
    {
        var (db, exhibitionId) = await SeedExhibition();
        await using var _ = db;
        var controller = new ExhibitionMetricsController(db).WithUser(OwnerId);
        await controller.Put(exhibitionId, SampleWrite());

        var replacement = SampleWrite();
        replacement.CostItems = [new CostItemWriteDto { Label = "Rent", Amount = 5000m }];
        var result = await controller.Put(exhibitionId, replacement);

        var dto = (ExhibitionMetricsDto)((OkObjectResult)result.Result!).Value!;
        var item = Assert.Single(dto.CostItems);
        Assert.Equal("Rent", item.Label);
        Assert.Equal(5000m, dto.TotalCost);
        Assert.Single(await db.CostItems.ToListAsync());
    }

    [Fact]
    public async Task Get_ReturnsForbidden_WhenNotOwner()
    {
        var (db, exhibitionId) = await SeedExhibition();
        await using var _ = db;
        var controller = new ExhibitionMetricsController(db).WithUser(OtherUserId);

        var result = await controller.Get(exhibitionId);

        Assert.IsType<ForbidResult>(result.Result);
    }

    [Fact]
    public async Task Put_ReturnsForbidden_WhenNotOwner()
    {
        var (db, exhibitionId) = await SeedExhibition();
        await using var _ = db;
        var controller = new ExhibitionMetricsController(db).WithUser(OtherUserId);

        var result = await controller.Put(exhibitionId, SampleWrite());

        Assert.IsType<ForbidResult>(result.Result);
        Assert.Empty(await db.ExhibitionMetrics.ToListAsync());
    }

    [Fact]
    public async Task Get_ReturnsNotFound_WhenExhibitionMissing()
    {
        var (db, _) = await SeedExhibition();
        await using var __ = db;
        var controller = new ExhibitionMetricsController(db).WithUser(OwnerId);

        var result = await controller.Get(Guid.NewGuid());

        Assert.IsType<NotFoundResult>(result.Result);
    }
}
