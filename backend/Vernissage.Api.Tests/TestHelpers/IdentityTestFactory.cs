using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Vernissage.Api.Data;
using Vernissage.Api.Models;
using Vernissage.Api.Services;

namespace Vernissage.Api.Tests.TestHelpers;

/// <summary>Builds real Identity/JWT collaborators over an in-memory database for controller tests.</summary>
public static class IdentityTestFactory
{
    public static AppDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    public static UserManager<ApplicationUser> CreateUserManager(AppDbContext db)
    {
        var identityOptions = new IdentityOptions
        {
            Password =
            {
                RequiredLength = 8,
                RequireDigit = false,
                RequireUppercase = false,
                RequireLowercase = false,
                RequireNonAlphanumeric = false,
            },
            User = { RequireUniqueEmail = true },
        };

        var store = new UserOnlyStore<ApplicationUser, AppDbContext, Guid>(db);
        return new UserManager<ApplicationUser>(
            store,
            Options.Create(identityOptions),
            new PasswordHasher<ApplicationUser>(),
            [new UserValidator<ApplicationUser>()],
            [new PasswordValidator<ApplicationUser>()],
            new UpperInvariantLookupNormalizer(),
            new IdentityErrorDescriber(),
            services: null,
            NullLogger<UserManager<ApplicationUser>>.Instance);
    }

    public static TokenService CreateTokenService()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Issuer"] = "vernissage-tests",
                ["Jwt:Audience"] = "vernissage-tests",
                ["Jwt:SigningKey"] = "unit-test-signing-key-with-at-least-32-bytes!",
            })
            .Build();
        return new TokenService(configuration);
    }
}
