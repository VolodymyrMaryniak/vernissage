namespace Vernissage.Api.Models;

/// <summary>
/// Creator roles a single account can hold (any combination).
/// These describe what kind of creator the user is; they are not
/// authorization roles — all creators have the same permissions
/// over their own records.
/// </summary>
[Flags]
public enum CreatorRoles
{
    None = 0,
    Gallery = 1,
    Curator = 2,
    Artist = 4,
}

/// <summary>Maps between the <see cref="CreatorRoles"/> flags and the string array used in DTOs.</summary>
public static class CreatorRolesMapper
{
    private static readonly (CreatorRoles Flag, string Name)[] All =
    [
        (CreatorRoles.Gallery, "Gallery"),
        (CreatorRoles.Curator, "Curator"),
        (CreatorRoles.Artist, "Artist"),
    ];

    public static string[] ToNames(CreatorRoles roles) =>
        All.Where(r => roles.HasFlag(r.Flag)).Select(r => r.Name).ToArray();

    /// <summary>Parses role names; returns false when any name is unknown.</summary>
    public static bool TryParse(IEnumerable<string> names, out CreatorRoles roles)
    {
        roles = CreatorRoles.None;
        foreach (var name in names)
        {
            var match = All.FirstOrDefault(r =>
                string.Equals(r.Name, name, StringComparison.OrdinalIgnoreCase));
            if (match.Flag == CreatorRoles.None)
            {
                return false;
            }
            roles |= match.Flag;
        }
        return true;
    }
}
