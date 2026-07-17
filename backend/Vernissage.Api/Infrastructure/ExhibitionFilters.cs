using Vernissage.Api.Dtos;
using Vernissage.Api.Models;

namespace Vernissage.Api.Infrastructure;

public static class ExhibitionFilters
{
    /// <summary>
    /// Shared filter semantics for the public list and owner analytics:
    /// free text over name/curator, contains-match on location/focus, and
    /// date-range overlap (undated rows drop out only when a date filter is set).
    /// </summary>
    public static IQueryable<Exhibition> ApplyFilters(
        this IQueryable<Exhibition> source,
        ExhibitionQueryParams query)
    {
        if (!string.IsNullOrWhiteSpace(query.Q))
        {
            var q = query.Q.Trim();
            source = source.Where(e => e.Name.Contains(q) || (e.Curator != null && e.Curator.Contains(q)));
        }

        if (!string.IsNullOrWhiteSpace(query.Location))
        {
            var location = query.Location.Trim();
            source = source.Where(e => e.Location != null && e.Location.Contains(location));
        }

        if (!string.IsNullOrWhiteSpace(query.Focus))
        {
            var focus = query.Focus.Trim();
            source = source.Where(e => e.Focus != null && e.Focus.Contains(focus));
        }

        if (query.From is { } from)
        {
            source = source.Where(e => (e.EndDate ?? e.StartDate) >= from);
        }

        if (query.To is { } to)
        {
            source = source.Where(e => (e.StartDate ?? e.EndDate) <= to);
        }

        return source;
    }
}
