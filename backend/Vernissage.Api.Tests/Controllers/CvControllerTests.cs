using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Vernissage.Api.Controllers;
using Vernissage.Api.Data;
using Vernissage.Api.Dtos;
using Vernissage.Api.Models;
using Vernissage.Api.Tests.TestHelpers;
using Xunit;

namespace Vernissage.Api.Tests.Controllers;

public class CvControllerTests
{
    private static readonly Guid OwnerId = Guid.NewGuid();
    private static readonly Guid OtherUserId = Guid.NewGuid();

    private static Exhibition SeedExhibition(AppDbContext db, Guid? ownerId, string name)
    {
        var exhibition = new Exhibition
        {
            Id = Guid.NewGuid(),
            Name = name,
            OwnerId = ownerId,
            CreatedAtUtc = DateTimeOffset.UtcNow,
            UpdatedAtUtc = DateTimeOffset.UtcNow,
        };
        db.Exhibitions.Add(exhibition);
        db.SaveChanges();
        return exhibition;
    }

    private static FormFile MakeFile(string fileName, byte[] content, string contentType = "application/octet-stream") =>
        new FormFile(new MemoryStream(content), 0, content.Length, "file", fileName)
        {
            Headers = new HeaderDictionary(),
            ContentType = contentType,
        };

    private static CvDto OkDto(ActionResult<CvDto> result) =>
        Assert.IsType<CvDto>(Assert.IsType<OkObjectResult>(result.Result).Value);

    [Fact]
    public async Task Get_ReturnsDefaultDocument_WhenNoCvSavedYet()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var controller = new CvController(db).WithUser(OwnerId);

        var dto = OkDto(await controller.Get());

        Assert.Equal("classic", dto.Document.Template);
        Assert.Equal("garamond", dto.Document.Font);
        Assert.Equal("A4", dto.Document.PageSize);
        Assert.Contains(dto.Document.Sections, s => s.Key == "education");
        Assert.Empty(dto.Document.Exhibitions);
        Assert.Null(dto.GeneratedAtUtc);
        Assert.Null(dto.UploadedFile);
    }

    [Fact]
    public async Task Put_SavesTheDocument_AndGetReturnsIt()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var show = SeedExhibition(db, OwnerId, "Northern Lights");
        var controller = new CvController(db).WithUser(OwnerId);

        var document = CvDocumentDto.CreateDefault();
        document.Template = "modern";
        document.Font = "helvetica";
        document.PageSize = "Letter";
        document.Headline = "Visual artist, Kyiv";
        document.IncludePhoto = false;
        document.Exhibitions = [new() { ExhibitionId = show.Id, Kind = "solo" }];
        document.Sections[0].Text = "I paint light.";
        OkDto(await controller.Put(new CvWriteDto { Document = document }));

        var saved = OkDto(await controller.Get());

        Assert.Equal("modern", saved.Document.Template);
        Assert.Equal("helvetica", saved.Document.Font);
        Assert.Equal("Letter", saved.Document.PageSize);
        Assert.Equal("Visual artist, Kyiv", saved.Document.Headline);
        Assert.False(saved.Document.IncludePhoto);
        var entry = Assert.Single(saved.Document.Exhibitions);
        Assert.Equal(show.Id, entry.ExhibitionId);
        Assert.Equal("solo", entry.Kind);
        Assert.Equal("I paint light.", saved.Document.Sections[0].Text);
        Assert.NotNull(saved.UpdatedAtUtc);
    }

    [Fact]
    public async Task Put_KeepsOnlyTheCallersOwnExhibitions_OnceEach()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var mine = SeedExhibition(db, OwnerId, "Mine");
        var theirs = SeedExhibition(db, OtherUserId, "Theirs");
        var controller = new CvController(db).WithUser(OwnerId);

        var document = CvDocumentDto.CreateDefault();
        document.Exhibitions =
        [
            new() { ExhibitionId = mine.Id, Kind = "solo" },
            new() { ExhibitionId = theirs.Id, Kind = "group" },
            new() { ExhibitionId = Guid.NewGuid(), Kind = "group" },
            new() { ExhibitionId = mine.Id, Kind = "group" },
        ];

        var dto = OkDto(await controller.Put(new CvWriteDto { Document = document }));

        var entry = Assert.Single(dto.Document.Exhibitions);
        Assert.Equal(mine.Id, entry.ExhibitionId);
        Assert.Equal("solo", entry.Kind);
    }

    [Fact]
    public async Task Put_StampsGeneratedAt_OnlyForAnUpdateTheCv()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var controller = new CvController(db).WithUser(OwnerId);

        var plainSave = OkDto(await controller.Put(new CvWriteDto { Document = CvDocumentDto.CreateDefault() }));
        Assert.Null(plainSave.GeneratedAtUtc);

        var update = OkDto(await controller.Put(new CvWriteDto
        {
            Document = CvDocumentDto.CreateDefault(),
            MarkGenerated = true,
        }));
        Assert.NotNull(update.GeneratedAtUtc);
    }

    [Theory]
    [InlineData("baroque", "garamond", "A4", "group")]
    [InlineData("classic", "comic-sans", "A4", "group")]
    [InlineData("classic", "garamond", "A3", "group")]
    [InlineData("classic", "garamond", "A4", "retrospective")]
    public async Task Put_RejectsUnknownChoices(string template, string font, string pageSize, string kind)
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var show = SeedExhibition(db, OwnerId, "Show");
        var controller = new CvController(db).WithUser(OwnerId);

        var document = CvDocumentDto.CreateDefault();
        document.Template = template;
        document.Font = font;
        document.PageSize = pageSize;
        document.Exhibitions = [new() { ExhibitionId = show.Id, Kind = kind }];

        var result = await controller.Put(new CvWriteDto { Document = document });

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task Put_RejectsDuplicateSectionKeys()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var controller = new CvController(db).WithUser(OwnerId);

        var document = CvDocumentDto.CreateDefault();
        document.Sections.Add(new CvSectionDto { Key = "education", Title = "Education again" });

        var result = await controller.Put(new CvWriteDto { Document = document });

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task UploadFile_StoresTheFile_AndItCanBeDownloaded()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var controller = new CvController(db).WithUser(OwnerId);
        byte[] bytes = [1, 2, 3, 4];

        // Browsers often send Word files as octet-stream; the extension decides.
        var dto = OkDto(await controller.UploadFile(MakeFile("My CV.docx", bytes)));

        Assert.NotNull(dto.UploadedFile);
        Assert.Equal("My CV.docx", dto.UploadedFile.FileName);
        Assert.Equal(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            dto.UploadedFile.ContentType);
        Assert.Equal(4, dto.UploadedFile.FileSize);

        var download = Assert.IsType<FileContentResult>(await controller.DownloadFile());
        Assert.Equal(bytes, download.FileContents);
        Assert.Equal("My CV.docx", download.FileDownloadName);
    }

    [Fact]
    public async Task UploadFile_KeepsTheBuilderDocument()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var controller = new CvController(db).WithUser(OwnerId);
        var document = CvDocumentDto.CreateDefault();
        document.Headline = "Curator";
        OkDto(await controller.Put(new CvWriteDto { Document = document }));

        var dto = OkDto(await controller.UploadFile(MakeFile("cv.pdf", [9], "application/pdf")));

        Assert.Equal("Curator", dto.Document.Headline);
    }

    [Theory]
    [InlineData("cv.exe")]
    [InlineData("cv.png")]
    [InlineData("cv")]
    public async Task UploadFile_RejectsUnsupportedFileTypes(string fileName)
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var controller = new CvController(db).WithUser(OwnerId);

        var result = await controller.UploadFile(MakeFile(fileName, [1]));

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task UploadFile_RejectsFilesOverTheLimit()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var controller = new CvController(db).WithUser(OwnerId);
        // Only the reported length matters for the size check.
        var huge = new FormFile(new MemoryStream([1]), 0, 11L * 1024 * 1024, "file", "cv.pdf");

        var result = await controller.UploadFile(huge);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task DeleteFile_RemovesTheUploadedFile()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var controller = new CvController(db).WithUser(OwnerId);
        OkDto(await controller.UploadFile(MakeFile("cv.pdf", [1], "application/pdf")));

        Assert.IsType<NoContentResult>(await controller.DeleteFile());

        Assert.IsType<NotFoundResult>(await controller.DownloadFile());
        Assert.Null(OkDto(await controller.Get()).UploadedFile);
    }

    [Fact]
    public async Task EachUserOnlySeesTheirOwnCv()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        OkDto(await new CvController(db).WithUser(OwnerId)
            .UploadFile(MakeFile("cv.pdf", [1], "application/pdf")));

        var other = new CvController(db).WithUser(OtherUserId);

        Assert.Null(OkDto(await other.Get()).UploadedFile);
        Assert.IsType<NotFoundResult>(await other.DownloadFile());
    }

    [Fact]
    public async Task AnonymousCallers_AreUnauthorized()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        var controller = new CvController(db).WithAnonymousUser();

        Assert.IsType<UnauthorizedResult>((await controller.Get()).Result);
        Assert.IsType<UnauthorizedResult>(
            (await controller.Put(new CvWriteDto { Document = CvDocumentDto.CreateDefault() })).Result);
        Assert.IsType<UnauthorizedResult>(await controller.DownloadFile());
    }
}
