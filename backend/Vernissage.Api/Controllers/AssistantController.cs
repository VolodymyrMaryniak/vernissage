using Anthropic.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Vernissage.Api.Dtos;
using Vernissage.Api.Services.Assistant;

namespace Vernissage.Api.Controllers;

/// <summary>
/// AI help while documenting a show: draft the record from notes or a PDF, and
/// polish or shorten long texts. Signed-in users only, rate-limited per user, and
/// 404 when no assistant is configured (see <see cref="AssistantOptions"/>).
/// </summary>
[ApiController]
[Route("api/assistant")]
[Authorize]
[EnableRateLimiting(AssistantOptions.RateLimitPolicy)]
public class AssistantController(
    ILogger<AssistantController> logger,
    // Optional: not registered when no API key is configured.
    IExhibitionAssistant? assistant = null) : ControllerBase
{
    public const int MaxNotesLength = 50_000;
    public const long MaxPdfBytes = 10 * 1024 * 1024; // 10 MB

    [HttpPost("draft")]
    [RequestSizeLimit(MaxPdfBytes + (1 * 1024 * 1024))]
    public async Task<ActionResult<ExhibitionDraftDto>> Draft(
        [FromForm] string? notes,
        IFormFile? file,
        CancellationToken cancellationToken)
    {
        if (assistant is null)
        {
            return NotFound();
        }

        if (string.IsNullOrWhiteSpace(notes) && (file is null || file.Length == 0))
        {
            return BadRequest(new { message = "Paste some notes or attach a PDF to draft from." });
        }

        if (notes is { Length: > MaxNotesLength })
        {
            return BadRequest(new { message = $"Notes are limited to {MaxNotesLength:N0} characters." });
        }

        byte[]? pdf = null;
        if (file is { Length: > 0 })
        {
            if (file.Length > MaxPdfBytes)
            {
                return BadRequest(new { message = "The PDF must be 10 MB or smaller." });
            }

            if (!string.Equals(Path.GetExtension(file.FileName), ".pdf", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = "Attach the document as a PDF." });
            }

            using var memory = new MemoryStream();
            await file.CopyToAsync(memory, cancellationToken);
            pdf = memory.ToArray();
        }

        return await Run(() => assistant.DraftAsync(notes, pdf, cancellationToken));
    }

    [HttpPost("improve")]
    public async Task<ActionResult<AssistantImproveResultDto>> Improve(
        AssistantImproveRequestDto request,
        CancellationToken cancellationToken)
    {
        if (assistant is null)
        {
            return NotFound();
        }

        if (!AssistantImproveRequestDto.Modes.Contains(request.Mode))
        {
            return BadRequest(new { message = $"Mode must be one of: {string.Join(", ", AssistantImproveRequestDto.Modes)}." });
        }

        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest(new { message = "There is no text to improve yet." });
        }

        return await Run(async () => new AssistantImproveResultDto
        {
            Text = await assistant.ImproveAsync(request, cancellationToken),
        });
    }

    /// <summary>Maps assistant and API failures to responses the UI can show.</summary>
    private async Task<ActionResult<T>> Run<T>(Func<Task<T>> call)
    {
        try
        {
            return Ok(await call());
        }
        catch (AssistantException ex)
        {
            return UnprocessableEntity(new { message = ex.Message });
        }
        catch (AnthropicRateLimitException ex)
        {
            logger.LogWarning(ex, "Assistant provider rate limit hit");
            return StatusCode(StatusCodes.Status503ServiceUnavailable,
                new { message = "The assistant is busy right now. Please try again in a minute." });
        }
        catch (AnthropicApiException ex)
        {
            logger.LogError(ex, "Assistant provider error");
            return StatusCode(StatusCodes.Status502BadGateway,
                new { message = "The assistant is unavailable right now. Please try again later." });
        }
    }
}
