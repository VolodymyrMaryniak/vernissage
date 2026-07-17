using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vernissage.Api.Controllers;
using Vernissage.Api.Data;
using Vernissage.Api.Dtos;
using Vernissage.Api.Models;
using Vernissage.Api.Tests.TestHelpers;
using Xunit;

namespace Vernissage.Api.Tests.Controllers;

public class ExhibitionsControllerTests
{
    private static readonly Guid OwnerId = Guid.NewGuid();
    private static readonly Guid OtherUserId = Guid.NewGuid();

    private static AppDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private static ExhibitionsController OwnerController(AppDbContext db) =>
        new ExhibitionsController(db).WithUser(OwnerId);

    private static ExhibitionWriteDto SampleDto() => new()
    {
        Name = "Northern Lights",
        StartDate = new DateOnly(2026, 5, 1),
        EndDate = new DateOnly(2026, 6, 1),
        Location = "Kyiv",
        Focus = "Light art",
        Curator = "Ada Curator",
        Aim = "Explore light in contemporary art.",
    };

    private static async Task<ExhibitionDetailDto> CreateSample(
        ExhibitionsController controller,
        Action<ExhibitionWriteDto>? mutate = null)
    {
        var dto = SampleDto();
        mutate?.Invoke(dto);
        return (ExhibitionDetailDto)((CreatedAtActionResult)(await controller.Create(dto)).Result!).Value!;
    }

    [Fact]
    public async Task Create_PersistsExhibition_AndSetsOwner()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = OwnerController(db);

        var result = await controller.Create(SampleDto());

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var dto = Assert.IsType<ExhibitionDetailDto>(created.Value);
        Assert.Equal("Northern Lights", dto.Name);
        Assert.Equal("Light art", dto.Focus);
        Assert.Equal(OwnerId, dto.OwnerId);
        var entity = Assert.Single(await db.Exhibitions.ToListAsync());
        Assert.Equal(OwnerId, entity.OwnerId);
    }

    [Fact]
    public async Task GetById_ReturnsExhibition_WhenExists()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = OwnerController(db);
        var created = await CreateSample(controller);

        var result = await controller.GetById(created.Id);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<ExhibitionDetailDto>(ok.Value);
        Assert.Equal(created.Id, dto.Id);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenMissing()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = new ExhibitionsController(db).WithAnonymousUser();

        var result = await controller.GetById(Guid.NewGuid());

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task GetAll_ReturnsSummaries_ForAnonymousUsers()
    {
        await using var db = CreateInMemoryDbContext();
        await CreateSample(OwnerController(db));
        var anonymous = new ExhibitionsController(db).WithAnonymousUser();

        var result = await anonymous.GetAll(new ExhibitionQueryParams());

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var items = Assert.IsAssignableFrom<IEnumerable<ExhibitionSummaryDto>>(ok.Value);
        Assert.Single(items);
    }

    [Theory]
    [InlineData("Northern", null, null, true)]
    [InlineData("Ada", null, null, true)]     // matches curator
    [InlineData("nomatch", null, null, false)]
    [InlineData(null, "Kyiv", null, true)]
    [InlineData(null, "Lviv", null, false)]
    [InlineData(null, null, "Light", true)]
    [InlineData(null, null, "Sculpture", false)]
    public async Task GetAll_FiltersByTextParams(string? q, string? location, string? focus, bool expected)
    {
        await using var db = CreateInMemoryDbContext();
        var controller = OwnerController(db);
        await CreateSample(controller);

        var result = await controller.GetAll(new ExhibitionQueryParams
        {
            Q = q,
            Location = location,
            Focus = focus,
        });

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var items = Assert.IsAssignableFrom<IEnumerable<ExhibitionSummaryDto>>(ok.Value);
        Assert.Equal(expected ? 1 : 0, items.Count());
    }

    [Fact]
    public async Task GetAll_FiltersByDateOverlap()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = OwnerController(db);
        await CreateSample(controller); // runs 2026-05-01 .. 2026-06-01

        var overlapping = await controller.GetAll(new ExhibitionQueryParams
        {
            From = new DateOnly(2026, 5, 15),
            To = new DateOnly(2026, 7, 1),
        });
        var before = await controller.GetAll(new ExhibitionQueryParams
        {
            To = new DateOnly(2026, 4, 1),
        });
        var after = await controller.GetAll(new ExhibitionQueryParams
        {
            From = new DateOnly(2026, 7, 1),
        });

        Assert.Single(((IEnumerable<ExhibitionSummaryDto>)((OkObjectResult)overlapping.Result!).Value!));
        Assert.Empty(((IEnumerable<ExhibitionSummaryDto>)((OkObjectResult)before.Result!).Value!));
        Assert.Empty(((IEnumerable<ExhibitionSummaryDto>)((OkObjectResult)after.Result!).Value!));
    }

    [Fact]
    public async Task Update_ChangesFields_WhenOwner()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = OwnerController(db);
        var created = await CreateSample(controller);

        var updated = SampleDto();
        updated.Name = "Renamed Show";
        var result = await controller.Update(created.Id, updated);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<ExhibitionDetailDto>(ok.Value);
        Assert.Equal("Renamed Show", dto.Name);
    }

    [Fact]
    public async Task Update_ReturnsForbidden_WhenNotOwner()
    {
        await using var db = CreateInMemoryDbContext();
        var created = await CreateSample(OwnerController(db));
        var otherUser = new ExhibitionsController(db).WithUser(OtherUserId);

        var result = await otherUser.Update(created.Id, SampleDto());

        Assert.IsType<ForbidResult>(result.Result);
    }

    [Fact]
    public async Task Update_ReturnsForbidden_ForOwnerlessLegacyRecord()
    {
        await using var db = CreateInMemoryDbContext();
        db.Exhibitions.Add(new Exhibition
        {
            Id = Guid.NewGuid(),
            Name = "Legacy Show",
            OwnerId = null,
            CreatedAtUtc = DateTimeOffset.UtcNow,
            UpdatedAtUtc = DateTimeOffset.UtcNow,
        });
        await db.SaveChangesAsync();
        var legacyId = (await db.Exhibitions.SingleAsync()).Id;
        var controller = OwnerController(db);

        var result = await controller.Update(legacyId, SampleDto());

        Assert.IsType<ForbidResult>(result.Result);
    }

    [Fact]
    public async Task Delete_RemovesExhibition_WhenOwner()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = OwnerController(db);
        var created = await CreateSample(controller);

        var result = await controller.Delete(created.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.Empty(await db.Exhibitions.ToListAsync());
    }

    [Fact]
    public async Task Delete_ReturnsForbidden_WhenNotOwner()
    {
        await using var db = CreateInMemoryDbContext();
        var created = await CreateSample(OwnerController(db));
        var otherUser = new ExhibitionsController(db).WithUser(OtherUserId);

        var result = await otherUser.Delete(created.Id);

        Assert.IsType<ForbidResult>(result);
        Assert.Single(await db.Exhibitions.ToListAsync());
    }

    [Fact]
    public async Task UploadMedia_ThenDownload_RoundTripsContent()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = OwnerController(db);
        var created = await CreateSample(controller);

        var bytes = new byte[] { 1, 2, 3, 4, 5 };
        using var stream = new MemoryStream(bytes);
        var file = new FormFile(stream, 0, bytes.Length, "file", "plan.pdf")
        {
            Headers = new HeaderDictionary(),
            ContentType = "application/pdf",
        };

        var uploadResult = await controller.UploadMedia(
            created.Id,
            MediaCategory.ExpositionDesignPlan,
            file,
            "Main plan");

        var uploadCreated = Assert.IsType<CreatedAtActionResult>(uploadResult.Result);
        var mediaDto = Assert.IsType<ExhibitionMediaDto>(uploadCreated.Value);
        Assert.Equal("plan.pdf", mediaDto.FileName);
        Assert.Equal(MediaCategory.ExpositionDesignPlan, mediaDto.Category);

        var download = await controller.DownloadMedia(created.Id, mediaDto.Id);
        var fileResult = Assert.IsType<FileContentResult>(download);
        Assert.Equal(bytes, fileResult.FileContents);
        Assert.Equal("application/pdf", fileResult.ContentType);
    }

    [Fact]
    public async Task UploadMedia_ReturnsForbidden_WhenNotOwner()
    {
        await using var db = CreateInMemoryDbContext();
        var created = await CreateSample(OwnerController(db));
        var otherUser = new ExhibitionsController(db).WithUser(OtherUserId);

        var bytes = new byte[] { 1 };
        using var stream = new MemoryStream(bytes);
        var file = new FormFile(stream, 0, bytes.Length, "file", "x.pdf")
        {
            Headers = new HeaderDictionary(),
            ContentType = "application/pdf",
        };

        var result = await otherUser.UploadMedia(created.Id, MediaCategory.ExpositionDesignPlan, file, null);

        Assert.IsType<ForbidResult>(result.Result);
    }
}
