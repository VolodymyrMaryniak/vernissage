using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vernissage.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddOwnershipAndFocus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Focus",
                table: "Exhibitions",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Exhibitions_OwnerId",
                table: "Exhibitions",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Exhibitions_AspNetUsers_OwnerId",
                table: "Exhibitions",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exhibitions_AspNetUsers_OwnerId",
                table: "Exhibitions");

            migrationBuilder.DropIndex(
                name: "IX_Exhibitions_OwnerId",
                table: "Exhibitions");

            migrationBuilder.DropColumn(
                name: "Focus",
                table: "Exhibitions");
        }
    }
}
