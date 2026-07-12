using Microsoft.AspNetCore.Mvc;
using Vernissage.Api.Controllers;
using Vernissage.Api.Dtos;
using Xunit;

namespace Vernissage.Api.Tests.Controllers;

public class VersionControllerTests
{
    [Fact]
    public void Get_ReturnsVersionInfo()
    {
        var controller = new VersionController();

        var result = controller.Get();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<AppVersionDto>(ok.Value);
        Assert.False(string.IsNullOrWhiteSpace(dto.Version));
        Assert.False(string.IsNullOrWhiteSpace(dto.Branch));
    }
}
