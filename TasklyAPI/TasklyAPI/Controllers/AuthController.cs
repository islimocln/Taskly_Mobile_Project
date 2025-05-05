using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.ComponentModel.DataAnnotations;
using TasklyAPI.Context;
using TasklyAPI.DTOS;
using TasklyAPI.Entities;
using TasklyAPI;

namespace TasklyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PasswordService _passwordService;
        private readonly TasklyDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(TasklyDbContext context, PasswordService passwordService, IConfiguration configuration)
        {
            _context = context;
            _passwordService = passwordService;
            _configuration = configuration;
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:SecretKey"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim("userId", user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role ?? "user")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDto signUpDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // E-posta kontrolü
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == signUpDto.Email.ToLower());
                
                if (existingUser != null)
                    return BadRequest("Bu e-posta adresi zaten kullanımda.");

                // Kullanıcı adı oluşturma
                var baseUsername = $"{signUpDto.Name.ToLower()}.{signUpDto.Surname.ToLower()}";
                var username = baseUsername;
                int counter = 1;

                while (await _context.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower()))
                {
                    username = $"{baseUsername}{counter}";
                    counter++;
                }

                var user = new User
                {
                    Name = signUpDto.Name,
                    Surname = signUpDto.Surname,
                    Email = signUpDto.Email,
                    Username = username,
                    Role = "user",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                user.PasswordHash = _passwordService.HashPassword(user, signUpDto.Password);

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Kullanıcı başarıyla oluşturuldu",
                    username = user.Username
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Bir hata oluştu: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => 
                        (u.Email.ToLower() == loginDto.EmailOrUsername.ToLower() || 
                         u.Username.ToLower() == loginDto.EmailOrUsername.ToLower()) &&
                        u.IsActive);

                if (user == null)
                    return Unauthorized("Kullanıcı bulunamadı veya hesap aktif değil.");

                var isPasswordValid = _passwordService.VerifyPassword(user, user.PasswordHash, loginDto.Password);

                if (!isPasswordValid)
                    return Unauthorized("Geçersiz şifre.");

                var token = GenerateJwtToken(user);

                return Ok(new
                {
                    token = token,
                    user = new
                    {
                        id = user.Id,
                        username = user.Username,
                        email = user.Email,
                        name = user.Name,
                        surname = user.Surname,
                        role = user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Bir hata oluştu: {ex.Message}");
            }
        }
    }
}