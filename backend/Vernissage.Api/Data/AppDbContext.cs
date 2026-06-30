using Microsoft.EntityFrameworkCore;

namespace Vernissage.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
}
