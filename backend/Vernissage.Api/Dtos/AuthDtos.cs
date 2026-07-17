using System.ComponentModel.DataAnnotations;

namespace Vernissage.Api.Dtos;

/// <summary>Payload for creating a new account.</summary>
public class RegisterDto
{
    [Required]
    [EmailAddress]
    [MaxLength(300)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [MaxLength(200)]
    public string Password { get; set; } = string.Empty;

    /// <summary>Creator roles: any combination of "Gallery", "Curator", "Artist".</summary>
    [Required]
    [MinLength(1)]
    public string[] Roles { get; set; } = [];
}

/// <summary>Payload for logging in.</summary>
public class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

/// <summary>Successful register/login response.</summary>
public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = new();
}

/// <summary>Public view of the authenticated user.</summary>
public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string[] Roles { get; set; } = [];
    public string DisplayName { get; set; } = string.Empty;
}
