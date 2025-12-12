using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PersonalTrackerDeneme2.Data;
using PersonalTrackerDeneme2.Data.Entities;
using PersonalTrackerDeneme2.DTOs;
using PersonalTrackerDeneme2.Services;

namespace PersonalTrackerDeneme2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto request)
        {
            if(string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                return BadRequest("Kullanıcı adı ve şifre boş olamaz.");

            if (await _authService.IsUserExistAsync(request.Username))
                return BadRequest("Bu kullanıcı adı zaten alınmış.");
                
            
            var registeredUser = await _authService.RegisterAsync(request);
            
            registeredUser.Password = string.Empty;
            
            return Ok(registeredUser);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                return BadRequest("Kullanıcı adı ve şifre boş olamaz.");
            
            var user = await _authService.LoginAsync(request);
            
            if (user == null)
                return Unauthorized("Kullanıcı adı veya şifre hatalı.");
        
            // Güvenlik için şifreyi gönderme
            user.Password = string.Empty;
            
            return Ok(user);
        }
    }
}
