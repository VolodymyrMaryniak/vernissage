using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Vernissage.Api.Controllers;
using Vernissage.Api.Dtos;
using Vernissage.Api.Services.Assistant;
using Vernissage.Api.Tests.TestHelpers;
using Xunit;

namespace Vernissage.Api.Tests.Controllers;

public class AssistantControllerTests
{
    private sealed class FakeAssistant : IExhibitionAssistant
    {
        public string? Notes;
        public byte[]? Pdf;
        public AssistantImproveRequestDto? Improved;
        public Exception? Throw;

        public Task<ExhibitionDraftDto> DraftAsync(string? notes, byte[]? pdf, CancellationToken cancellationToken)
        {
            if (Throw is not null) throw Throw;
            Notes = notes;
            Pdf = pdf;
            return Task.FromResult(new ExhibitionDraftDto { Name = "Soft Wall", Summary = "Found the title." });
        }

        public Task<string> ImproveAsync(AssistantImproveRequestDto request, CancellationToken cancellationToken)
        {
            if (Throw is not null) throw Throw;
            Improved = request;
            return Task.FromResult("Shorter.");
        }
    }

    private static AssistantController Controller(IExhibitionAssistant? assistant) =>
        new AssistantController(NullLogger<AssistantController>.Instance, assistant).WithUser(Guid.NewGuid());

    private static IFormFile File(string name, string content = "%PDF-1.4") =>
        new FormFile(new MemoryStream(Encoding.ASCII.GetBytes(content)), 0, content.Length, "file", name);

    [Fact]
    public async Task Endpoints_Return404_WhenNoAssistantIsConfigured()
    {
        var controller = Controller(null);

        Assert.IsType<NotFoundResult>((await controller.Draft("notes", null, default)).Result);
        Assert.IsType<NotFoundResult>((await controller.Improve(
            new AssistantImproveRequestDto { Field = "aim", Text = "x" }, default)).Result);
    }

    [Fact]
    public async Task Draft_RequiresNotesOrAPdf()
    {
        var result = await Controller(new FakeAssistant()).Draft("  ", null, default);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task Draft_RejectsNonPdfAttachments()
    {
        var result = await Controller(new FakeAssistant()).Draft(null, File("release.docx"), default);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task Draft_PassesNotesAndPdfToTheAssistant()
    {
        var assistant = new FakeAssistant();

        var result = await Controller(assistant).Draft("Opening on 12 Sep", File("Release.PDF"), default);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal("Soft Wall", Assert.IsType<ExhibitionDraftDto>(ok.Value).Name);
        Assert.Equal("Opening on 12 Sep", assistant.Notes);
        Assert.Equal("%PDF-1.4", Encoding.ASCII.GetString(assistant.Pdf!));
    }

    [Fact]
    public async Task Improve_ValidatesTheMode()
    {
        var result = await Controller(new FakeAssistant()).Improve(
            new AssistantImproveRequestDto { Field = "aim", Text = "Some text", Mode = "translate" }, default);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task Improve_ReturnsTheRewrittenText()
    {
        var assistant = new FakeAssistant();

        var result = await Controller(assistant).Improve(
            new AssistantImproveRequestDto { Field = "explication", Text = "A long text.", Mode = "shorten" }, default);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal("Shorter.", Assert.IsType<AssistantImproveResultDto>(ok.Value).Text);
        Assert.Equal("shorten", assistant.Improved!.Mode);
    }

    [Fact]
    public async Task AssistantFailures_Return422WithTheMessage()
    {
        var assistant = new FakeAssistant { Throw = new AssistantException("Too long.") };

        var result = await Controller(assistant).Draft("notes", null, default);

        var error = Assert.IsType<UnprocessableEntityObjectResult>(result.Result);
        Assert.Contains("Too long.", error.Value!.ToString());
    }

    [Theory]
    [InlineData(null, null, false)]
    [InlineData("sk-test", null, true)]
    [InlineData("sk-test", "false", false)]
    public void IsEnabled_NeedsAKeyAndTheFlag(string? key, string? flag, bool expected)
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Anthropic:ApiKey"] = key,
                ["Features:AssistantEnabled"] = flag,
            })
            .Build();

        Assert.Equal(expected, AssistantOptions.IsEnabled(config));
    }
}
