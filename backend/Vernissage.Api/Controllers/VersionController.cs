using System.Globalization;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Vernissage.Api.Dtos;

namespace Vernissage.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VersionController : ControllerBase
{
    // Read the assembly metadata once; it never changes for the lifetime of the process.
    private static readonly AppVersionDto Info = ReadVersionInfo();

    [HttpGet]
    public ActionResult<AppVersionDto> Get() => Ok(Info);

    private static AppVersionDto ReadVersionInfo()
    {
        var assembly = typeof(VersionController).Assembly;

        // Last value wins; avoids throwing if the same key appears twice.
        var metadata = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);
        foreach (var attribute in assembly.GetCustomAttributes<AssemblyMetadataAttribute>())
        {
            metadata[attribute.Key] = attribute.Value;
        }

        var informationalVersion = assembly
            .GetCustomAttribute<AssemblyInformationalVersionAttribute>()
            ?.InformationalVersion;

        // Strip the "+<commit-hash>" source-revision suffix the SDK appends by default.
        var plusIndex = informationalVersion?.IndexOf('+', StringComparison.Ordinal) ?? -1;
        var version = plusIndex >= 0
            ? informationalVersion![..plusIndex]
            : informationalVersion ?? assembly.GetName().Version?.ToString() ?? "unknown";

        DateTimeOffset? buildTime = null;
        if (metadata.TryGetValue("BuildTimestampUtc", out var rawBuildTime)
            && DateTimeOffset.TryParse(
                rawBuildTime,
                CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                out var parsed))
        {
            buildTime = parsed;
        }

        var branch = metadata.TryGetValue("SourceBranch", out var rawBranch) && !string.IsNullOrWhiteSpace(rawBranch)
            ? rawBranch
            : "unknown";

        return new AppVersionDto
        {
            Version = version,
            Branch = branch,
            BuildTimeUtc = buildTime,
        };
    }
}
