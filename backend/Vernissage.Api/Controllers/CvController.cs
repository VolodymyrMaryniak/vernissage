using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vernissage.Api.Data;
using Vernissage.Api.Dtos;
using Vernissage.Api.Infrastructure;
using Vernissage.Api.Models;

namespace Vernissage.Api.Controllers;

/// <summary>
/// The caller's CV: the builder document (design, chosen exhibitions, free-text
/// sections) and an optional uploaded CV file. Owner-only; there is no public CV.
/// </summary>
[ApiController]
[Route("api/cv")]
[Authorize]
public class CvController(AppDbContext dbContext) : ControllerBase
{
    private const long MaxFileBytes = 10 * 1024 * 1024; // 10 MB

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    // Browsers often send a generic content type for Word/ODT files, so the
    // extension decides what counts as a CV document; this maps it to a type.
    private static readonly Dictionary<string, string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        [".pdf"] = "application/pdf",
        [".doc"] = "application/msword",
        [".docx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        [".odt"] = "application/vnd.oasis.opendocument.text",
        [".rtf"] = "application/rtf",
        [".txt"] = "text/plain",
    };

    [HttpGet]
    public async Task<ActionResult<CvDto>> Get()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var cv = await dbContext.CurriculumVitae.AsNoTracking().FirstOrDefaultAsync(c => c.OwnerId == userId);
        return Ok(ToDto(cv));
    }

    [HttpPut]
    public async Task<ActionResult<CvDto>> Put(CvWriteDto dto)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var document = dto.Document;
        var problem = Validate(document);
        if (problem is not null)
        {
            return BadRequest(new { message = problem });
        }

        // Keep only the caller's own exhibitions (and each one once), so the CV
        // can never reference someone else's show.
        var requestedIds = document.Exhibitions.Select(e => e.ExhibitionId).ToList();
        var ownIds = (await dbContext.Exhibitions
                .Where(e => e.OwnerId == userId && requestedIds.Contains(e.Id))
                .Select(e => e.Id)
                .ToListAsync())
            .ToHashSet();
        document.Exhibitions = document.Exhibitions
            .Where(e => ownIds.Remove(e.ExhibitionId))
            .ToList();

        var cv = await dbContext.CurriculumVitae.FirstOrDefaultAsync(c => c.OwnerId == userId);
        var now = DateTimeOffset.UtcNow;
        if (cv is null)
        {
            cv = new CurriculumVitae { Id = Guid.NewGuid(), OwnerId = userId.Value };
            dbContext.CurriculumVitae.Add(cv);
        }

        cv.DocumentJson = JsonSerializer.Serialize(document, JsonOptions);
        cv.UpdatedAtUtc = now;
        if (dto.MarkGenerated)
        {
            cv.GeneratedAtUtc = now;
        }

        await dbContext.SaveChangesAsync();
        return Ok(ToDto(cv));
    }

    [HttpPut("file")]
    [RequestSizeLimit(MaxFileBytes + (1 * 1024 * 1024))]
    public async Task<ActionResult<CvDto>> UploadFile(IFormFile file)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "A non-empty file is required." });
        }

        if (file.Length > MaxFileBytes)
        {
            return BadRequest(new { message = "The CV file must be 10 MB or smaller." });
        }

        var fileName = Path.GetFileName(file.FileName);
        if (!AllowedExtensions.TryGetValue(Path.GetExtension(fileName), out var contentType))
        {
            return BadRequest(new { message = "Upload the CV as a PDF, Word (.doc/.docx), ODT, RTF or text file." });
        }

        using var memory = new MemoryStream();
        await file.CopyToAsync(memory);

        var cv = await dbContext.CurriculumVitae.FirstOrDefaultAsync(c => c.OwnerId == userId);
        var now = DateTimeOffset.UtcNow;
        if (cv is null)
        {
            cv = new CurriculumVitae
            {
                Id = Guid.NewGuid(),
                OwnerId = userId.Value,
                DocumentJson = JsonSerializer.Serialize(CvDocumentDto.CreateDefault(), JsonOptions),
                UpdatedAtUtc = now,
            };
            dbContext.CurriculumVitae.Add(cv);
        }

        cv.UploadedFile = memory.ToArray();
        cv.UploadedFileName = fileName;
        cv.UploadedContentType = contentType;
        cv.UploadedFileSize = cv.UploadedFile.LongLength;
        cv.UploadedAtUtc = now;

        await dbContext.SaveChangesAsync();
        return Ok(ToDto(cv));
    }

    [HttpGet("file")]
    public async Task<IActionResult> DownloadFile()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var cv = await dbContext.CurriculumVitae.AsNoTracking().FirstOrDefaultAsync(c => c.OwnerId == userId);
        if (cv?.UploadedFile is null)
        {
            return NotFound();
        }

        return File(cv.UploadedFile, cv.UploadedContentType ?? "application/octet-stream", cv.UploadedFileName);
    }

    [HttpDelete("file")]
    public async Task<IActionResult> DeleteFile()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var cv = await dbContext.CurriculumVitae.FirstOrDefaultAsync(c => c.OwnerId == userId);
        if (cv is not null)
        {
            cv.UploadedFile = null;
            cv.UploadedFileName = null;
            cv.UploadedContentType = null;
            cv.UploadedFileSize = null;
            cv.UploadedAtUtc = null;
            await dbContext.SaveChangesAsync();
        }

        return NoContent();
    }

    /// <summary>Checks the enumerated choices; returns a message, or null when valid.</summary>
    private static string? Validate(CvDocumentDto document)
    {
        if (!CvDocumentDto.Templates.Contains(document.Template))
        {
            return $"Template must be one of: {string.Join(", ", CvDocumentDto.Templates)}.";
        }

        if (!CvDocumentDto.Fonts.Contains(document.Font))
        {
            return $"Font must be one of: {string.Join(", ", CvDocumentDto.Fonts)}.";
        }

        if (!CvDocumentDto.PageSizes.Contains(document.PageSize))
        {
            return $"Page size must be one of: {string.Join(", ", CvDocumentDto.PageSizes)}.";
        }

        if (document.Exhibitions.Any(e => !CvExhibitionDto.Kinds.Contains(e.Kind)))
        {
            return $"Exhibition kind must be one of: {string.Join(", ", CvExhibitionDto.Kinds)}.";
        }

        if (document.Sections.Select(s => s.Key).Distinct().Count() != document.Sections.Count)
        {
            return "Each CV section must have a unique key.";
        }

        return null;
    }

    private static CvDto ToDto(CurriculumVitae? cv)
    {
        if (cv is null)
        {
            return new CvDto();
        }

        return new CvDto
        {
            Document = JsonSerializer.Deserialize<CvDocumentDto>(cv.DocumentJson, JsonOptions)
                ?? CvDocumentDto.CreateDefault(),
            GeneratedAtUtc = cv.GeneratedAtUtc,
            UpdatedAtUtc = cv.UpdatedAtUtc,
            UploadedFile = cv.UploadedFile is null
                ? null
                : new CvFileDto
                {
                    FileName = cv.UploadedFileName ?? "cv",
                    ContentType = cv.UploadedContentType ?? "application/octet-stream",
                    FileSize = cv.UploadedFileSize ?? cv.UploadedFile.LongLength,
                    UploadedAtUtc = cv.UploadedAtUtc ?? cv.UpdatedAtUtc,
                },
        };
    }
}
