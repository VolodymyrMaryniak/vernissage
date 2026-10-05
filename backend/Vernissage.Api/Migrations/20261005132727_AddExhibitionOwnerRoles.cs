using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vernissage.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddExhibitionOwnerRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OwnerRoles",
                table: "Exhibitions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OwnerRoles",
                table: "Exhibitions");
        }
    }
}
