using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vernissage.Api.Migrations;

/// <inheritdoc />
public partial class InitialExhibitions : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Exhibitions",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                Location = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                Curator = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                GalleryLocation = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                Explication = table.Column<string>(type: "nvarchar(max)", nullable: true),
                InvestigationMaterial = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Team = table.Column<string>(type: "nvarchar(max)", nullable: true),
                ArtworksList = table.Column<string>(type: "nvarchar(max)", nullable: true),
                PreOpeningDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                OpeningDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                EventsDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                ReferencedLiterature = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Aim = table.Column<string>(type: "nvarchar(max)", nullable: true),
                OwnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Exhibitions", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "ExhibitionMedia",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ExhibitionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Category = table.Column<int>(type: "int", nullable: false),
                FileName = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                ContentType = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                FileSize = table.Column<long>(type: "bigint", nullable: false),
                Caption = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                Content = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ExhibitionMedia", x => x.Id);
                table.ForeignKey(
                    name: "FK_ExhibitionMedia_Exhibitions_ExhibitionId",
                    column: x => x.ExhibitionId,
                    principalTable: "Exhibitions",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_ExhibitionMedia_ExhibitionId_Category",
            table: "ExhibitionMedia",
            columns: ["ExhibitionId", "Category"]);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "ExhibitionMedia");

        migrationBuilder.DropTable(
            name: "Exhibitions");
    }
}
