using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Vernissage.Api.Infrastructure;

public static class ClaimsPrincipalExtensions
{
    /// <summary>
    /// Returns the authenticated user's id from the JWT `sub` claim
    /// (surfaced as NameIdentifier by default claim mapping), or null.
    /// </summary>
    public static Guid? GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(value, out var id) ? id : null;
    }
}
