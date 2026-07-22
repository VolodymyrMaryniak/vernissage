using Microsoft.AspNetCore.Identity;
using Vernissage.Api.Models;

namespace Vernissage.Api.Data;

/// <summary>
/// Populates the database with a handful of realistic artists and exhibition
/// records for local development and demos. Opt-in (gated by the
/// <c>Seed:DevData</c> configuration flag in <c>Program.cs</c>) and idempotent:
/// it keys off the seed accounts' emails, so running it again after the data
/// already exists is a no-op. Never wired up in production config.
/// </summary>
public static class DevDataSeeder
{
    /// <summary>Password assigned to every seeded account (dev-only).</summary>
    public const string SeedPassword = "vernissage-demo-2026";

    public static async Task SeedAsync(
        AppDbContext db,
        UserManager<ApplicationUser> userManager,
        CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;

        foreach (var spec in Artists)
        {
            // Idempotency: skip an artist whose account (and, therefore, whose
            // exhibitions) has already been seeded.
            if (await userManager.FindByEmailAsync(spec.Email) is not null)
            {
                continue;
            }

            var user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = spec.Email,
                Email = spec.Email,
                Roles = CreatorRoles.Artist,
                FirstName = spec.FirstName,
                LastName = spec.LastName,
                Medium = spec.Medium,
                AreasOfInterest = spec.AreasOfInterest,
                Location = spec.Location,
                PlaceOfWork = spec.PlaceOfWork,
                SocialMedia = spec.SocialMedia,
                CreatedAtUtc = now,
            };

            var result = await userManager.CreateAsync(user, SeedPassword);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException(
                    $"Failed to seed artist '{spec.Email}': {errors}");
            }

            foreach (var ex in spec.Exhibitions)
            {
                var exhibition = new Exhibition
                {
                    Id = Guid.NewGuid(),
                    Name = ex.Name,
                    StartDate = ex.StartDate,
                    EndDate = ex.EndDate,
                    Location = ex.Location,
                    Focus = ex.Focus,
                    Curator = ex.Curator,
                    GalleryLocation = ex.GalleryLocation,
                    Explication = ex.Explication,
                    Team = ex.Team,
                    ArtworksList = ex.ArtworksList,
                    OpeningDetails = ex.OpeningDetails,
                    EventsDetails = ex.EventsDetails,
                    Aim = ex.Aim,
                    Notes = ex.Notes,
                    OwnerId = user.Id,
                    CreatedAtUtc = now,
                    UpdatedAtUtc = now,
                };
                db.Exhibitions.Add(exhibition);

                if (ex.Metrics is { } m)
                {
                    db.ExhibitionMetrics.Add(new ExhibitionMetrics
                    {
                        ExhibitionId = exhibition.Id,
                        VisitorsCount = m.VisitorsCount,
                        Satisfaction = m.Satisfaction,
                        ArtworksSold = m.ArtworksSold,
                        TotalRevenue = m.TotalRevenue,
                        UpdatedAtUtc = now,
                        CostItems = m.CostItems
                            .Select(c => new CostItem { Id = Guid.NewGuid(), Label = c.Label, Amount = c.Amount })
                            .ToList(),
                    });
                }
            }
        }

        await db.SaveChangesAsync(cancellationToken);
    }

    // --- Seed content -----------------------------------------------------

    private sealed record ArtistSpec(
        string Email,
        string FirstName,
        string LastName,
        string Medium,
        string AreasOfInterest,
        string Location,
        string PlaceOfWork,
        string SocialMedia,
        ExhibitionSpec[] Exhibitions);

    private sealed record ExhibitionSpec(
        string Name,
        DateOnly StartDate,
        DateOnly EndDate,
        string Location,
        string Focus,
        string Curator,
        string GalleryLocation,
        string Explication,
        string Team,
        string ArtworksList,
        string OpeningDetails,
        string EventsDetails,
        string Aim,
        string? Notes,
        MetricsSpec? Metrics);

    private sealed record MetricsSpec(
        int VisitorsCount,
        int Satisfaction,
        int ArtworksSold,
        decimal TotalRevenue,
        CostSpec[] CostItems);

    private sealed record CostSpec(string Label, decimal Amount);

    private static readonly ArtistSpec[] Artists =
    [
        new(
            Email: "sofiya.melnyk@example.com",
            FirstName: "Sofiya",
            LastName: "Melnyk",
            Medium: "Oil and mixed media on canvas",
            AreasOfInterest: "Memory, domestic interiors, post-war landscapes",
            Location: "Kyiv, Ukraine",
            PlaceOfWork: "Independent studio, Podil",
            SocialMedia: "instagram.com/sofiya.melnyk.art",
            Exhibitions:
            [
                new(
                    Name: "Rooms We Left Behind",
                    StartDate: new DateOnly(2025, 3, 14),
                    EndDate: new DateOnly(2025, 4, 27),
                    Location: "Kyiv",
                    Focus: "Painting",
                    Curator: "Ostap Hrytsenko",
                    GalleryLocation: "Naked Room, vul. Reitarska 21, Kyiv",
                    Explication: "A cycle of interior paintings tracing the emotional " +
                        "residue of abandoned homes — furniture under dust sheets, light " +
                        "falling across empty rooms, objects left mid-gesture.",
                    Team: "Sofiya Melnyk (artist), Ostap Hrytsenko (curator), Dana Illarionova (production)",
                    ArtworksList: "Sheet I–VIII (oil on linen, 90×120 cm each); Kitchen at Dusk; Threshold; Unmade Bed",
                    OpeningDetails: "Opening reception 14 March, 18:00, with a reading by poet Halyna Kruk.",
                    EventsDetails: "Curator-led walkthrough 22 March; artist talk 5 April.",
                    Aim: "To examine how domestic space holds memory after displacement.",
                    Notes: "Two works pre-sold to a private collector before opening.",
                    Metrics: new(
                        VisitorsCount: 1420,
                        Satisfaction: 9,
                        ArtworksSold: 6,
                        TotalRevenue: 18400m,
                        CostItems:
                        [
                            new("Framing", 2100m),
                            new("Gallery rent", 3600m),
                            new("Opening reception", 950m),
                            new("Print & promotion", 640m),
                        ])),
                new(
                    Name: "Soft Inventory",
                    StartDate: new DateOnly(2026, 2, 6),
                    EndDate: new DateOnly(2026, 3, 15),
                    Location: "Lviv",
                    Focus: "Painting",
                    Curator: "Marta Bazak",
                    GalleryLocation: "Jam Factory Art Center, vul. Bohdana Khmelnytskoho 124, Lviv",
                    Explication: "Small-format still lifes cataloguing the ordinary objects " +
                        "of a working studio, painted as if each were an artefact worth preserving.",
                    Team: "Sofiya Melnyk (artist), Marta Bazak (curator)",
                    ArtworksList: "Inventory No. 1–24 (oil on board, 30×24 cm)",
                    OpeningDetails: "Opening 6 February, 17:00.",
                    EventsDetails: "Painting workshop for students 28 February.",
                    Aim: "To slow attention onto the overlooked objects of daily practice.",
                    Notes: "Part of the gallery's emerging-artists winter programme.",
                    Metrics: new(
                        VisitorsCount: 880,
                        Satisfaction: 8,
                        ArtworksSold: 11,
                        TotalRevenue: 9350m,
                        CostItems:
                        [
                            new("Framing", 1450m),
                            new("Transport", 520m),
                            new("Catalogue", 780m),
                        ])),
            ]),
        new(
            Email: "andriy.kovalenko@example.com",
            FirstName: "Andriy",
            LastName: "Kovalenko",
            Medium: "Steel, concrete and found objects",
            AreasOfInterest: "Industrial heritage, public space, material memory",
            Location: "Dnipro, Ukraine",
            PlaceOfWork: "Shared metal workshop, Left Bank",
            SocialMedia: "instagram.com/kovalenko.builds",
            Exhibitions:
            [
                new(
                    Name: "Load-Bearing",
                    StartDate: new DateOnly(2024, 9, 12),
                    EndDate: new DateOnly(2024, 11, 3),
                    Location: "Dnipro",
                    Focus: "Sculpture / Installation",
                    Curator: "Yuliana Reva",
                    GalleryLocation: "Artsvit Gallery, vul. Voskresenska 5, Dnipro",
                    Explication: "Large-scale steel assemblages salvaged from decommissioned " +
                        "factory equipment, re-welded into forms that test how much weight a memory can hold.",
                    Team: "Andriy Kovalenko (artist), Yuliana Reva (curator), Metalist Coop (fabrication)",
                    ArtworksList: "Girder Study; Load-Bearing I–III; Counterweight; Rest",
                    OpeningDetails: "Opening 12 September, 19:00, with an industrial-noise set by DJ Rust.",
                    EventsDetails: "Welding demonstration 21 September; panel on industrial heritage 12 October.",
                    Aim: "To reframe discarded industrial material as monuments to labour.",
                    Notes: "Two pieces acquired by the municipal sculpture park.",
                    Metrics: new(
                        VisitorsCount: 2100,
                        Satisfaction: 9,
                        ArtworksSold: 2,
                        TotalRevenue: 26000m,
                        CostItems:
                        [
                            new("Fabrication & welding", 5400m),
                            new("Heavy transport & rigging", 3200m),
                            new("Gallery rent", 4000m),
                            new("Insurance", 900m),
                            new("Opening event", 1200m),
                        ])),
                new(
                    Name: "Field Notes in Concrete",
                    StartDate: new DateOnly(2025, 6, 20),
                    EndDate: new DateOnly(2025, 7, 20),
                    Location: "Kyiv",
                    Focus: "Sculpture / Installation",
                    Curator: "Yuliana Reva",
                    GalleryLocation: "Mystetskyi Arsenal, vul. Lavrska 10-12, Kyiv",
                    Explication: "Cast-concrete fragments of everyday city surfaces — kerbstones, " +
                        "manhole rims, tram grooves — presented as an archaeology of the present.",
                    Team: "Andriy Kovalenko (artist), Yuliana Reva (curator)",
                    ArtworksList: "Cast No. 1–15 (concrete, mixed dimensions)",
                    OpeningDetails: "Opening 20 June, 18:00.",
                    EventsDetails: "Guided night walk mapping the original casting sites, 4 July.",
                    Aim: "To make visible the anonymous infrastructure we walk over daily.",
                    Notes: "Shown as part of a group survey of Ukrainian sculptors under 40.",
                    Metrics: new(
                        VisitorsCount: 3400,
                        Satisfaction: 8,
                        ArtworksSold: 4,
                        TotalRevenue: 14200m,
                        CostItems:
                        [
                            new("Materials (concrete, moulds)", 1900m),
                            new("Transport", 1100m),
                            new("Documentation", 700m),
                        ])),
            ]),
        new(
            Email: "mariana.bondarenko@example.com",
            FirstName: "Mariana",
            LastName: "Bondarenko",
            Medium: "Photography and single-channel video",
            AreasOfInterest: "Coastline, borders, everyday ritual, the archive",
            Location: "Odesa, Ukraine",
            PlaceOfWork: "Independent",
            SocialMedia: "mariana-bondarenko.com",
            Exhibitions:
            [
                new(
                    Name: "Salt Line",
                    StartDate: new DateOnly(2025, 5, 9),
                    EndDate: new DateOnly(2025, 6, 22),
                    Location: "Odesa",
                    Focus: "Photography",
                    Curator: "Kateryna Yermolaeva",
                    GalleryLocation: "Museum of Odesa Modern Art, vul. Bilinskoho 5, Odesa",
                    Explication: "A photographic survey of the Black Sea coastline over one year, " +
                        "tracking the shifting line where salt water meets a city holding its breath.",
                    Team: "Mariana Bondarenko (artist), Kateryna Yermolaeva (curator), Ihor Prazhevskyi (printing)",
                    ArtworksList: "Salt Line I–XXX (archival pigment prints, 60×90 cm); Tideline (video, 11 min)",
                    OpeningDetails: "Opening 9 May, 18:00.",
                    EventsDetails: "Screening and Q&A 30 May; portfolio review day for local photographers 14 June.",
                    Aim: "To hold a portrait of a coastline in a year of uncertainty.",
                    Notes: "Edition prints sold to fund a coastal documentary follow-up.",
                    Metrics: new(
                        VisitorsCount: 2650,
                        Satisfaction: 10,
                        ArtworksSold: 18,
                        TotalRevenue: 21600m,
                        CostItems:
                        [
                            new("Archival printing", 3100m),
                            new("Framing", 2400m),
                            new("Video equipment rental", 850m),
                            new("Opening reception", 700m),
                        ])),
                new(
                    Name: "Household Gods",
                    StartDate: new DateOnly(2026, 4, 3),
                    EndDate: new DateOnly(2026, 5, 18),
                    Location: "Kharkiv",
                    Focus: "Photography / Video",
                    Curator: "Kateryna Yermolaeva",
                    GalleryLocation: "YermilovCentre, maidan Svobody 4, Kharkiv",
                    Explication: "Staged photographs of the small objects families carry when they move — " +
                        "keys, icons, a child's toy — treated with the reverence of a votive collection.",
                    Team: "Mariana Bondarenko (artist), Kateryna Yermolaeva (curator)",
                    ArtworksList: "Household Gods No. 1–20 (pigment prints); Carry (video, 7 min)",
                    OpeningDetails: "Opening 3 April, 17:00, with contributors from the local community.",
                    EventsDetails: "Community photography workshop 19 April; closing conversation 16 May.",
                    Aim: "To honour the ordinary objects that anchor identity through displacement.",
                    Notes: null,
                    Metrics: null),
            ]),
    ];
}
