using PersonalTrackerDeneme2.Data.Entities;
using PersonalTrackerDeneme2.DTOs;

namespace PersonalTrackerDeneme2.Services;

public interface IAuthService
{
    Task<User?> LoginAsync(UserLoginDto loginDto);
    Task<User> RegisterAsync(UserRegisterDto registerDto);
    Task<bool> IsUserExistAsync(string username);
}