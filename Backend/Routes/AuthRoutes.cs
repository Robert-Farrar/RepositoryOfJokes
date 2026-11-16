using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
namespace Backend.Routes;
using System;

public static class AuthRoutes
{
    public static void MakeAuthRoutes(this WebApplication app)
    {
        var authGroup = app.MapGroup("/auth");

        authGroup.MapPost("/login", async (LoginRequest request, ILdapAuthService authService, IConfiguration configuration) =>
        {
            var result = authService.Authenticate(request.Username, request.Password);

                if (!result.Success)
            {
                return Results.Json(new { success = false, message = result.Message }, statusCode: 401);
            }

            var claims = new[]
            {
              new Claim(ClaimTypes.Name, request.Username),
              new Claim(ClaimTypes.Role, result.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = configuration["Jwt:Issuer"],
                Audience = configuration["Jwt:Audience"],
                SigningCredentials = creds
            };

            
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtString = tokenHandler.WriteToken(token);

            return Results.Ok(new { 
                success = true, 
                username = request.Username,
                role = result.Role,
                token = jwtString
            });
        });

    }
}