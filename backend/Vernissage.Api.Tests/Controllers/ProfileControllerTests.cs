using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Vernissage.Api.Controllers;
using Vernissage.Api.Dtos;
using Vernissage.Api.Models;
using Vernissage.Api.Tests.TestHelpers;
using Xunit;

namespace Vernissage.Api.Tests.Controllers;

public class ProfileControllerTests
{
    private static async Task<ApplicationUser> SeedUser(UserManager<ApplicationUser> userManager)
    {
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = "ada@example.com",
            Email = "ada@example.com",
            Roles = CreatorRoles.Curator,
            CreatedAtUtc = DateTimeOffset.UtcNow,
        };
        var result = await userManager.CreateAsync(user, "correct horse battery");
        Assert.True(result.Succeeded);
        return user;
    }

    [Fact]
    public async Task Get_ReturnsOwnProfile()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);
        var user = await SeedUser(userManager);
        var controller = new ProfileController(userManager).WithUser(user.Id);

        var result = await controller.Get();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<ProfileDto>(ok.Value);
        Assert.Equal("ada@example.com", dto.Email);
        Assert.Equal(["Curator"], dto.Roles);
        Assert.False(dto.HasPhoto);
    }

    [Fact]
    public async Task Put_UpdatesProfileFields_AndRoles()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);
        var user = await SeedUser(userManager);
        var controller = new ProfileController(userManager).WithUser(user.Id);

        var result = await controller.Put(new ProfileWriteDto
        {
            Roles = ["Curator", "Artist"],
            FirstName = "Ada",
            LastName = "Lovelace",
            Medium = "Oil on canvas",
            AreasOfInterest = "Generative art",
        });

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<ProfileDto>(ok.Value);
        Assert.Equal(["Curator", "Artist"], dto.Roles);
        Assert.Equal("Ada Lovelace", dto.DisplayName);
        Assert.Equal("Oil on canvas", dto.Medium);
    }

    [Fact]
    public async Task Put_RejectsUnknownRole()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);
        var user = await SeedUser(userManager);
        var controller = new ProfileController(userManager).WithUser(user.Id);

        var result = await controller.Put(new ProfileWriteDto { Roles = ["Admin"] });

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task UploadPhoto_ThenGet_RoundTrips_AndDeleteRemoves()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);
        var user = await SeedUser(userManager);
        var controller = new ProfileController(userManager).WithUser(user.Id);

        var bytes = new byte[] { 9, 8, 7 };
        using var stream = new MemoryStream(bytes);
        var file = new FormFile(stream, 0, bytes.Length, "file", "me.png")
        {
            Headers = new HeaderDictionary(),
            ContentType = "image/png",
        };

        var upload = await controller.UploadPhoto(file);
        var uploaded = Assert.IsType<ProfileDto>(((OkObjectResult)upload.Result!).Value);
        Assert.True(uploaded.HasPhoto);

        var photo = await controller.GetPhoto();
        var fileResult = Assert.IsType<FileContentResult>(photo);
        Assert.Equal(bytes, fileResult.FileContents);
        Assert.Equal("image/png", fileResult.ContentType);

        Assert.IsType<NoContentResult>(await controller.DeletePhoto());
        Assert.IsType<NotFoundResult>(await controller.GetPhoto());
    }

    [Fact]
    public async Task UploadPhoto_RejectsNonImage()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);
        var user = await SeedUser(userManager);
        var controller = new ProfileController(userManager).WithUser(user.Id);

        var bytes = new byte[] { 1 };
        using var stream = new MemoryStream(bytes);
        var file = new FormFile(stream, 0, bytes.Length, "file", "x.pdf")
        {
            Headers = new HeaderDictionary(),
            ContentType = "application/pdf",
        };

        var result = await controller.UploadPhoto(file);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }
}
