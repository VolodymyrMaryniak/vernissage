using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Vernissage.Api.Models;

namespace Vernissage.Api.Data;

// IdentityUserContext (not IdentityDbContext) on purpose: creator roles are a
// flags column on the user, not ASP.NET Identity roles, so the AspNetRoles
// tables are never needed.
public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityUserContext<ApplicationUser, Guid>(options)
{
    public DbSet<Exhibition> Exhibitions => Set<Exhibition>();

    public DbSet<ExhibitionMedia> ExhibitionMedia => Set<ExhibitionMedia>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ApplicationUser>(entity =>
        {
            entity.Property(u => u.GalleryName).HasMaxLength(300);
            entity.Property(u => u.BusinessLocation).HasMaxLength(500);
            entity.Property(u => u.Focus).HasMaxLength(200);
            entity.Property(u => u.FirstName).HasMaxLength(200);
            entity.Property(u => u.LastName).HasMaxLength(200);
            entity.Property(u => u.SocialMedia).HasMaxLength(500);
            entity.Property(u => u.PlaceOfWork).HasMaxLength(300);
            entity.Property(u => u.AreasOfInterest).HasMaxLength(500);
            entity.Property(u => u.Location).HasMaxLength(500);
            entity.Property(u => u.Medium).HasMaxLength(300);
            entity.Property(u => u.ProfilePhoto).HasColumnType("varbinary(max)");
            entity.Property(u => u.ProfilePhotoContentType).HasMaxLength(200);
            entity.Ignore(u => u.DisplayName);
        });

        modelBuilder.Entity<Exhibition>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(300);

            entity.Property(e => e.Location).HasMaxLength(500);
            entity.Property(e => e.Curator).HasMaxLength(500);
            entity.Property(e => e.GalleryLocation).HasMaxLength(500);

            // Long-form text fields are left as nvarchar(max).
            entity.Property(e => e.Explication);
            entity.Property(e => e.InvestigationMaterial);
            entity.Property(e => e.Team);
            entity.Property(e => e.ArtworksList);
            entity.Property(e => e.PreOpeningDetails);
            entity.Property(e => e.OpeningDetails);
            entity.Property(e => e.EventsDetails);
            entity.Property(e => e.Notes);
            entity.Property(e => e.ReferencedLiterature);
            entity.Property(e => e.Aim);

            entity.HasMany(e => e.Media)
                .WithOne(m => m.Exhibition)
                .HasForeignKey(m => m.ExhibitionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ExhibitionMedia>(entity =>
        {
            entity.HasKey(m => m.Id);

            entity.Property(m => m.FileName)
                .IsRequired()
                .HasMaxLength(400);

            entity.Property(m => m.ContentType)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(m => m.Caption).HasMaxLength(1000);

            entity.Property(m => m.Content)
                .HasColumnType("varbinary(max)");

            entity.HasIndex(m => new { m.ExhibitionId, m.Category });
        });
    }
}
