using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vernissage.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddExhibitionMetrics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ExhibitionMetrics",
                columns: table => new
                {
                    ExhibitionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    VisitorsCount = table.Column<int>(type: "int", nullable: true),
                    Satisfaction = table.Column<int>(type: "int", nullable: true),
                    ArtworksSold = table.Column<int>(type: "int", nullable: true),
                    TotalRevenue = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExhibitionMetrics", x => x.ExhibitionId);
                    table.ForeignKey(
                        name: "FK_ExhibitionMetrics_Exhibitions_ExhibitionId",
                        column: x => x.ExhibitionId,
                        principalTable: "Exhibitions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CostItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExhibitionMetricsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CostItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CostItems_ExhibitionMetrics_ExhibitionMetricsId",
                        column: x => x.ExhibitionMetricsId,
                        principalTable: "ExhibitionMetrics",
                        principalColumn: "ExhibitionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CostItems_ExhibitionMetricsId",
                table: "CostItems",
                column: "ExhibitionMetricsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CostItems");

            migrationBuilder.DropTable(
                name: "ExhibitionMetrics");
        }
    }
}
