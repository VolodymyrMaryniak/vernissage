using Microsoft.EntityFrameworkCore;
using Vernissage.Api.Models;

namespace Vernissage.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : D