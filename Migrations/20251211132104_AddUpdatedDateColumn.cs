using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PersonalTrackerDeneme2.Migrations
{
    /// <inheritdoc />
    public partial class AddUpdatedDateColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "Tasks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "TaskLogs",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "TaskLogs");
        }
    }
}
