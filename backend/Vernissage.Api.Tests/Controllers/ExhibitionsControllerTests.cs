using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vernissage.Api.Controllers;
using Vernissage.Api.Data;
using Vernissage.Api.Dtos;
using Vernissage.Api.Models;
using Xunit;

namespace Vernissage.Api.Tests.Controllers;

public class ExhibitionsControllerTests
{
    private static AppDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private static ExhibitionWriteDto SampleDto() => new()
    {
        Name = "Northern Lights",
        StartDate = new DateOnly(2026, 5, 1),
        EndDate = new DateOnly(2026, 6, 1),
        Location = "Kyiv",
        Curator = "Ada Curator",
        Aim = "Explore light in contemporary art.",
    };

    [Fact]
    public async Task Create_PersistsExhibition_AndReturnsCreated()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = new ExhibitionsController(db);

        var result = await controller.Create(SampleDto());

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var dto = Assert.IsType<ExhibitionDetailDto>(created.Value);
        Assert.Equal("Northern Lights", dto.Name);
        Assert.Equal(new DateOnly(2026, 5, 1), dto.StartDate);
        Assert.Single(await db.Exhibitions.ToListAsync());
    }

    [Fact]
    public async Task GetById_ReturnsExhibition_WhenExists()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = new ExhibitionsController(db);
        var created = (ExhibitionDetailDto)((CreatedAtActionResult)(await controller.Create(SampleDto())).Result!).Value!;

        var result = await controller.GetById(created.Id);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<ExhibitionDetailDto>(ok.Value);
        Assert.Equal(created.Id, dto.Id);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenMissing()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = new ExhibitionsController(db);

        var result = await controller.GetById(Guid.NewGuid());

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task GetAll_ReturnsSummaries()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = new ExhibitionsController(db);
        await controller.Create(SampleDto());

        var result = await controller.GetAll();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var items = Assert.IsAssignableFrom<IEnumerable<ExhibitionSummaryDto>>(ok.Value);
        Assert.Single(items);
    }

    [Fact]
    public async Task Update_ChangesFields()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = new ExhibitionsController(db);
        var created = (ExhibitionDetailDto)((CreatedAtActionResult)(await controller.Create(SampleDto())).Result!).Value!;

        var updated = SampleDto();
        updated.Name = "Renamed Show";
        var result = await controller.Update(created.Id, updated);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<ExhibitionDetailDto>(ok.Value);
        Assert.Equal("Renamed Show", dto.Name);
    }

    [Fact]
    public async Task Delete_RemovesExhibition()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = new ExhibitionsController(db);
        var created = (ExhibitionDetailDto)((CreatedAtActionResult)(await controller.Create(SampleDto())).Result!).Value!;

        var result = await controller.Delete(created.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.Empty(await db.Exhibitions.ToListAsync());
    }

    [Fact]
    public async Task UploadMedia_ThenDownload_RoundTripsContent()
    {
        await using var db = CreateInMemoryDbContext();
        var controller = new ExhibitionsController(db);
        var created = (ExhibitionDetailDto)((CreatedAtActionResult)(await controller.Create(SampleDto())).Result!).Value!;

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
}
