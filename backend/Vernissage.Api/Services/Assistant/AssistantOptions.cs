using System.Security.Claims;
using System.Threading.RateLimiting;
using Anthropic;
using Microsoft.AspNetCore.RateLimiting;

namespace Vernissage.Api.Services.Assistant;

/// <summary>
/// Wiring for the AI assistant. It's on when an Anthropic API key is configured
/// (<c>Anthropic:ApiKey</c> / App Service setting <c>Anthropic__ApiKey</c>, or the
/// <c>ANTHROPIC_API_KEY</c> env var) and <c>Features:AssistantEnabled</c> isn't false.
/// Without a key nothing is registered and the endpoints return 404.
/// </summary>
public static class AssistantOptions
{
    public const string RateLimitPolicy = "assistant";

    /// <summary>Assistant calls each user may make per hour (cost guard).</summary>
    public const int RequestsPerHour = 30;

    public static string? ApiKey(IConfiguration configuration) =>
        configuration["Anthropic:ApiKey"] is { Length: > 0 } key ? key
        : configuration["ANTHROPIC_API_KEY"] is { Length: > 0 } envKey ? envKey
        : null;

    public static bool IsEnabled(IConfiguration configuration) =>
        configuration.GetValue("Features:AssistantEnabled", true) && ApiKey(configuration) is not null;

    public static IServiceCollection AddExhibitionAssistant(this IServiceCollection services, IConfiguration configuration)
    {
        if (IsEnabled(configuration))
        {
            services.AddSingleton(new AnthropicClient { ApiKey = ApiKey(configuration) });
            services.AddScoped<IExhibitionAssistant, ClaudeExhibitionAssistant>();
        }

        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.AddPolicy(RateLimitPolicy, context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    context.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "anonymous",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = RequestsPerHour,
                        Window = TimeSpan.FromHours(1),
                    }));
        });

        return services;
    }
}
