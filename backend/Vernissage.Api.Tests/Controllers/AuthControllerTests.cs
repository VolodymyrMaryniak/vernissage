using Microsoft.AspNetCore.Mvc;
using Vernissage.Api.Controllers;
using Vernissage.Api.Dtos;
using Vernissage.Api.Models;
using Vernissage.Api.Tests.TestHelpers;
using Xunit;

namespace Vernissage.Api.Tests.Controllers;

public class AuthControllerTests
{
    private static RegisterDto SampleRegister(string email = "ada@example.com") => new()
    {
        Email = email,
        Password = "correct horse battery",
        Roles = ["Curator", "Artist"],
    };

    [Fact]
    public async Task Register_CreatesUser_AndReturnsTokenWithRoles()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);
        var controller = new AuthController(userManager, IdentityTestFactory.CreateTokenService());

        var result = await controller.Register(SampleRegister());

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponseDto>(ok.Value);
        Assert.NotEmpty(response.Token);
        Assert.Equal("ada@example.com", response.User.Email);
        Assert.Equal(["Curator", "Artist"], response.User.Roles);
        var user = Assert.Single(db.Users);
        Assert.Equal(CreatorRoles.Curator | CreatorRoles.Artist, user.Roles);
    }

    [Fact]
    public async Task Register_RejectsUnknownRole()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);
        var controller = new AuthController(userManager, IdentityTestFactory.CreateTokenService());

        var result = await controller.Register(SampleRegister());
        var bad = await controller.Register(new RegisterDto
        {
            Email = "bad@example.com",
            Password = "correct horse battery",
            Roles = ["Researcher"],
        });

        Assert.IsType<OkObjectResult>(result.Result);
        Assert.IsType<BadRequestObjectResult>(bad.Result);
    }

    [Fact]
    public async Task Register_RejectsDuplicateEmail()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);
        var controller = new AuthController(userManager, IdentityTestFactory.CreateTokenService());
        await controller.Register(SampleRegister());

        var result = await controller.Register(SampleRegister());

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task Login_ReturnsToken_ForValidCredentials()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);
        var controller = new AuthController(userManager, IdentityTestFactory.CreateTokenService());
        await controller.Register(SampleRegister());

        var result = await controller.Login(new LoginDto
        {
            Email = "ada@example.com",
            Password = "correct horse battery",
        });

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponseDto>(ok.Value);
        Assert.NotEmpty(response.Token);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_ForWrongPassword()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);
        var controller = new AuthController(userManager, IdentityTestFactory.CreateTokenService());
        await controller.Register(SampleRegister());

        var result = await controller.Login(new LoginDto
        {
            Email = "ada@example.com",
            Password = "wrong password!",
        });

        Assert.IsType<UnauthorizedObjectResult>(result.Result);
    }

    [Fact]
    public async Task Me_ReturnsCurrentUser()
    {
        await using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);
        var controller = new AuthController(userManager, IdentityTestFactory.CreateTokenService());
        var registered = (AuthResponseDto)((OkObjectResult)(await controller.Register(SampleRegister())).Result!).Value!;

        controller.WithUser(registered.User.Id);
        var result = await controller.Me();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var user = Assert.IsType<UserDto>(ok.Value);
        Assert.Equal(registered.User.Id, user.Id);
        Assert.Equal(["Curator", "Artist"], user.Roles);
    }
}
