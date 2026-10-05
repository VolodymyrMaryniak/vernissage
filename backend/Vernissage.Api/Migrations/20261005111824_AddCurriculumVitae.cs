using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vernissage.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCurriculumVitae : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CurriculumVitae",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DocumentJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GeneratedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UploadedFile = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    UploadedFileName = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: true),
                    UploadedContentType = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    UploadedFileSize = table.Column<long>(type: "bigint", nullable: true),
                    UploadedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CurriculumVitae", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CurriculumVitae_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CurriculumVitae_OwnerId",
                table: "CurriculumVitae",
                column: "OwnerId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CurriculumVitae");
        }
    }
}
