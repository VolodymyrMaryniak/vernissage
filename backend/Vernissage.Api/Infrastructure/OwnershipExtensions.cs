using Microsoft.AspNetCore.Mvc;
using Vernissage.Api.Models;

namespace Vernissage.Api.Infrastructure;

public static class OwnershipExtensions
{
    /// <summary>
    /// Owner gate for exhibition writes: 404 when the exhibition is missing,
    /// 403 when the caller isn't its owner (including ownerless legacy records,
    /// which stay read-only until claimed), null when the write may proceed.
    /// </summary>
    public static ActionResult? CheckOwnership(this ControllerBase controller, Exhibition? exhibition)
    {
        if (exhibition is null)
        {
            return controller.NotFound();
        }

        var userId = controller.User.GetUserId();
        if (userId is null || exhibition.OwnerId != userId)
        {
            return controller.Forbid();
        }

        return null;
    }
}
