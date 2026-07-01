using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vernissage.Api.Controllers;
using Vernissage.Api.Data;
using Xunit;

namespace Vernissage.Api.Tests.Controllers;

public class TestControllerTests
{
    private static AppDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public void Get_ReturnsOkWithMessage()
    {
        var controller = new TestController(CreateInMemoryDbContext());

        var result = Assert.IsType<OkObjectResult>(controller.Get());

        Assert.NotNull(result.Value);
    }

    [Fact]
    public void Another_ReturnsOkWithMessage()
    {
        var controller = new TestController(CreateInMemoryDbContext());

        var result = Assert.IsType<OkObjectResult>(controller.Another());

        Assert.NotNull(result.Value);
    }

    [Fact]
    public async Task DbCheck_ReturnsOk_WhenDatabaseIsReachable()
    {
        var controller = new TestController(CreateInMemoryDbContext());

        var result = Assert.IsType<OkObjectResult>(await controller.DbCheck());

        Assert.NotNull(result.Value);
    }
}
