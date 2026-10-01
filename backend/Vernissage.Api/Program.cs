using System.Text;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Vernissage.Api.Data;
using Vernissage.Api.Models;
using Vernissage.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// OpenTelemetry (requests, SQL dependencies, ILogger logs) exported to Application
// Insights. Only active where the connection string is configured (the App Service);
// local dev and tests run without telemetry.
if (!string.IsNullOrWhiteSpace(builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]))
{
    builder.Services.AddOpenTelemetry().UseAzureMonitor();
}

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "ConnectionStrings:DefaultConnection is not configured. Set it via the " +
        "ConnectionStrings__DefaultConnection environment variable / App Service " +
        "connection string (production) or dotnet user-secrets (local dev).");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
        // The dev Azure SQL DB is serverless with auto-pause; a paused/cold DB
        // surfaces transient connection errors while it resumes (~tens of
        // seconds). Retry so startup migrations and requests wait for the
        // resume instead of the app failing to start (HTTP 500.30).
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 8,
            maxRetryDelay: TimeSpan.FromSeconds(15),
            errorNumbersToAdd: null)));

builder.Services.AddIdentityCore<ApplicationUser>(options =>
    {
        // Length over composition: 8+ characters, no forced digits/symbols/case.
        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<AppDbContext>();

builder.Services.AddScoped<TokenService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(TokenService.GetSigningKey(builder.Configuration))),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://blue-water-0fe1e130f.7.azurestaticapps.net")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Apply pending EF migrations on boot (single shared dev environment).
// Relational-only so the InMemory provider used in tests is unaffected.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var startupLogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    if (db.Database.IsRelational())
    {
        // The dev Azure SQL DB is serverless with auto-pause: at boot it may be
        // paused or mid-resume and reject the first connections, which would
        // otherwise crash startup (HTTP 500.30). Retry the initial migration so
        // the app waits for the DB to wake instead of failing to start.
        const int maxAttempts = 6;
        var retryDelay = TimeSpan.FromSeconds(10);
        for (var attempt = 1; ; attempt++)
        {
            try
            {
                db.Database.Migrate();
                break;
            }
            catch (Exception ex) when (attempt < maxAttempts)
            {
                startupLogger.LogWarning(
                    ex,
                    "Database not ready on startup (attempt {Attempt}/{MaxAttempts}); retrying in {Delay}s.",
                    attempt,
                    maxAttempts,
                    retryDelay.TotalSeconds);
                Thread.Sleep(retryDelay);
            }
        }
    }

    // Opt-in dev/demo seed of realistic artists + exhibition records. Off by
    // default; enable locally with `--Seed:DevData=true` (or env var
    // `Seed__DevData=true`). Idempotent, so re-running is safe.
    if (builder.Configuration.GetValue<bool>("Seed:DevData"))
    {
        try
        {
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            await DevDataSeeder.SeedAsync(db, userManager);
        }
        catch (Exception ex)
        {
            // Dev/demo seeding must never take down the API. Log and continue.
            startupLogger.LogError(ex, "Dev data seeding failed; continuing startup without seed data.");
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("LocalFrontend");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
