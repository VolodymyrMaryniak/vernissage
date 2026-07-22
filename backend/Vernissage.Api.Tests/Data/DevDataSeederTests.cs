using Microsoft.EntityFrameworkCore;
using Vernissage.Api.Data;
using Vernissage.Api.Models;
using Vernissage.Api.Tests.TestHelpers;

namespace Vernissage.Api.Tests.Data;

public class DevDataSeederTests
{
    [Fact]
    public async Task SeedAsync_CreatesArtistsWithOwnedExhibitions()
    {
        using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);

        await DevDataSeeder.SeedAsync(db, userManager);

        var artists = await db.Users.ToListAsync();
        Assert.Equal(3, artists.Count);
        Assert.All(artists, u => Assert.Equal(CreatorRoles.Artist, u.Roles));
        Assert.All(artists, u => Assert.False(string.IsNullOrWhiteSpace(u.Medium)));

        var exhibitions = await db.Exhibitions.ToListAsync();
        Assert.NotEmpty(exhibitions);

        // Every exhibition is owned by one of the seeded artists.
        var artistIds = artists.Select(a => a.Id).ToHashSet();
        Assert.All(exhibitions, e =>
        {
            Assert.NotNull(e.OwnerId);
            Assert.Contains(e.OwnerId!.Value, artistIds);
            Assert.False(string.IsNullOrWhiteSpace(e.Name));
        });
    }

    [Fact]
    public async Task SeedAsync_PopulatesMetricsWithCostItems()
    {
        using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);

        await DevDataSeeder.SeedAsync(db, userManager);

        var metrics = await db.ExhibitionMetrics.Include(m => m.CostItems).ToListAsync();
        Assert.NotEmpty(metrics);
        Assert.All(metrics, m => Assert.NotNull(m.VisitorsCount));

        // At least one exhibition has a private cost breakdown.
        Assert.Contains(metrics, m => m.CostItems.Count > 0);

        // Every cost item is well-formed.
        foreach (var item in metrics.SelectMany(m => m.CostItems))
        {
            Assert.False(string.IsNullOrWhiteSpace(item.Label));
            Assert.True(item.Amount > 0);
        }
    }

    [Fact]
    public async Task SeedAsync_IsIdempotent()
    {
        using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);

        await DevDataSeeder.SeedAsync(db, userManager);
        var usersAfterFirst = await db.Users.CountAsync();
        var exhibitionsAfterFirst = await db.Exhibitions.CountAsync();

        await DevDataSeeder.SeedAsync(db, userManager);

        Assert.Equal(usersAfterFirst, await db.Users.CountAsync());
        Assert.Equal(exhibitionsAfterFirst, await db.Exhibitions.CountAsync());
    }

    [Fact]
    public async Task SeededAccounts_CanAuthenticateWithSeedPassword()
    {
        using var db = IdentityTestFactory.CreateInMemoryDbContext();
        using var userManager = IdentityTestFactory.CreateUserManager(db);

        await DevDataSeeder.SeedAsync(db, userManager);

        var user = await userManager.FindByEmailAsync("sofiya.melnyk@example.com");
        Assert.NotNull(user);
        Assert.True(await userManager.CheckPasswordAsync(user!, DevDataSeeder.SeedPassword));
    }
}
