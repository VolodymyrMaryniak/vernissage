using Vernissage.Api.Dtos;

namespace Vernissage.Api.Services.Assistant;

/// <summary>AI help for documenting an exhibition. Implemented with Claude.</summary>
public interface IExhibitionAssistant
{
    /// <summary>Suggests exhibition fields from free-form notes and/or a PDF (e.g. a press release).</summary>
    Task<ExhibitionDraftDto> DraftAsync(string? notes, byte[]? pdf, CancellationToken cancellationToken);

    /// <summary>Rewrites one long-text field ("polish" or "shorten").</summary>
    Task<string> ImproveAsync(AssistantImproveRequestDto request, CancellationToken cancellationToken);
}

/// <summary>The model declined, or its answer couldn't be used; safe to show the message.</summary>
public class AssistantException(string message) : Exception(message);
