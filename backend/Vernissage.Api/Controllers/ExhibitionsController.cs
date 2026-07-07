using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vernissage.Api.Data;
using Vernissage.Api.Dtos;
using Vernissage.Api.Models;

namespace Vernissage.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExhibitionsController(AppDbContext dbContext) : ControllerBase
{
    // Guard against oversized in-DB media; blob storage will replace this later.
    private const long MaxMediaBytes = 50 * 1024 * 1024; // 50 MB

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExhibitionSummaryDto>>> GetAll()
    {
        var exhibitions = await dbContext.Exhibitions
            .AsNoTracking()
            .OrderByDescending(e => e.CreatedAtUtc)
            .Select(e => new ExhibitionSummaryDto
            {
                Id = e.Id,
                Name = e.Name,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                Location = e.Location,
                Curator = e.Curator,
                MediaCount = e.Media.Count,
                CreatedAtUtc = e.CreatedAtUtc,
                UpdatedAtUtc = e.UpdatedAtUtc,
            })
            .ToListAsync();

        return Ok(exhibitions);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExhibitionDetailDto>> GetById(Guid id)
    {
        var exhibition = await dbContext.Exhibitions
            .AsNoTracking()
            .Include(e => e.Media)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exhibition is null)
        {
            return NotFound();
        }

        return Ok(ToDetailDto(exhibition));
    }

    [HttpPost]
    public async Task<ActionResult<ExhibitionDetailDto>> Create(ExhibitionWriteDto dto)
    {
        var now = DateTimeOffset.UtcNow;
        var exhibition = new Exhibition
        {
            Id = Guid.NewGuid(),
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
        };

        ApplyWrite(exhibition, dto);

        dbContext.Exhibitions.Add(exhibition);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = exhibition.Id }, ToDetailDto(exhibition));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ExhibitionDetailDto>> Update(Guid id, ExhibitionWriteDto dto)
    {
        var exhibition = await dbContext.Exhibitions
            .Include(e => e.Media)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exhibition is null)
        {
            return NotFound();
        }

        ApplyWrite(exhibition, dto);
        exhibition.UpdatedAtUtc = DateTimeOffset.UtcNow;

        await dbContext.SaveChangesAsync();

        return Ok(ToDetailDto(exhibition));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var exhibition = await dbContext.Exhibitions.FirstOrDefaultAsync(e => e.Id == id);
        if (exhibition is null)
        {
            return NotFound();
        }

        dbContext.Exhibitions.Remove(exhibition);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id:guid}/media")]
    [RequestSizeLimit(MaxMediaBytes + (1 * 1024 * 1024))]
    public async Task<ActionResult<ExhibitionMediaDto>> UploadMedia(
        Guid id,
        [FromForm] MediaCategory category,
        IFormFile file,
        [FromForm] string? caption)
    {
        var exhibitionExists = await dbContext.Exhibitions.AnyAsync(e => e.Id == id);
        if (!exhibitionExists)
        {
            return NotFound();
        }

        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "A non-empty file is required." });
        }

        if (file.Length > MaxMediaBytes)
        {
            return BadRequest(new { message = $"File exceeds the maximum size of {MaxMediaBytes} bytes." });
        }

        if (!Enum.IsDefined(category))
        {
            return BadRequest(new { message = "Unknown media category." });
        }

        using var memory = new MemoryStream();
        await file.CopyToAsync(memory);

        var media = new ExhibitionMedia
        {
            Id = Guid.NewGuid(),
            ExhibitionId = id,
            Category = category,
            FileName = Path.GetFileName(file.FileName),
            ContentType = string.IsNullOrWhiteSpace(file.ContentType)
                ? "application/octet-stream"
                : file.ContentType,
            FileSize = file.Length,
            Caption = caption,
            Content = memory.ToArray(),
            CreatedAtUtc = DateTimeOffset.UtcNow,
        };

        dbContext.ExhibitionMedia.Add(media);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(
            nameof(DownloadMedia),
            new { id, mediaId = media.Id },
            ToMediaDto(media));
    }

    [HttpGet("{id:guid}/media/{mediaId:guid}")]
    public async Task<IActionResult> DownloadMedia(Guid id, Guid mediaId)
    {
        var media = await dbContext.ExhibitionMedia
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == mediaId && m.ExhibitionId == id);

        if (media is null)
        {
            return NotFound();
        }

        return File(media.Content, media.ContentType, media.FileName);
    }

    [HttpDelete("{id:guid}/media/{mediaId:guid}")]
    public async Task<IActionResult> DeleteMedia(Guid id, Guid mediaId)
    {
        var media = await dbContext.ExhibitionMedia
            .FirstOrDefaultAsync(m => m.Id == mediaId && m.ExhibitionId == id);

        if (media is null)
        {
            return NotFound();
        }

        dbContext.ExhibitionMedia.Remove(media);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    private static void ApplyWrite(Exhibition exhibition, ExhibitionWriteDto dto)
    {
        exhibition.Name = dto.Name;
        exhibition.StartDate = dto.StartDate;
        exhibition.EndDate = dto.EndDate;
        exhibition.Location = dto.Location;
        exhibition.Curator = dto.Curator;
        exhibition.GalleryLocation = dto.GalleryLocation;
        exhibition.Explication = dto.Explication;
        exhibition.InvestigationMaterial = dto.InvestigationMaterial;
        exhibition.Team = dto.Team;
        exhibition.ArtworksList = dto.ArtworksList;
        exhibition.PreOpeningDetails = dto.PreOpeningDetails;
        exhibition.OpeningDetails = dto.OpeningDetails;
        exhibition.EventsDetails = dto.EventsDetails;
        exhibition.Notes = dto.Notes;
        exhibition.ReferencedLiterature = dto.ReferencedLiterature;
        exhibition.Aim = dto.Aim;
    }

    private static ExhibitionDetailDto ToDetailDto(Exhibition e) => new()
    {
        Id = e.Id,
        Name = e.Name,
        StartDate = e.StartDate,
        EndDate = e.EndDate,
        Location = e.Location,
        Curator = e.Curator,
        GalleryLocation = e.GalleryLocation,
        Explication = e.Explication,
        InvestigationMaterial = e.InvestigationMaterial,
        Team = e.Team,
        ArtworksList = e.ArtworksList,
        PreOpeningDetails = e.PreOpeningDetails,
        OpeningDetails = e.OpeningDetails,
        EventsDetails = e.EventsDetails,
        Notes = e.Notes,
        ReferencedLiterature = e.ReferencedLiterature,
        Aim = e.Aim,
        CreatedAtUtc = e.CreatedAtUtc,
        UpdatedAtUtc = e.UpdatedAtUtc,
        Media = e.Media
            .OrderBy(m => m.Category)
            .ThenBy(m => m.CreatedAtUtc)
            .Select(ToMediaDto)
            .ToList(),
    };

    private static ExhibitionMediaDto ToMediaDto(ExhibitionMedia m) => new()
    {
        Id = m.Id,
        Category = m.Category,
        FileName = m.FileName,
        ContentType = m.ContentType,
        FileSize = m.FileSize,
        Caption = m.Caption,
        CreatedAtUtc = m.CreatedAtUtc,
    };
}
