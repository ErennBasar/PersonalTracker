using Microsoft.EntityFrameworkCore;
using PersonalTrackerDeneme2.Data;
using PersonalTrackerDeneme2.Data.Entities;
using PersonalTrackerDeneme2.DTOs;

namespace PersonalTrackerDeneme2.Services;

public class AuthService : IAuthService
{
    private readonly PersonalTrackerDeneme2DbContext _dbContext;

    public AuthService(PersonalTrackerDeneme2DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> LoginAsync(UserLoginDto loginDto)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Username == loginDto.Username && u.Password == loginDto.Password);
        
        return user;
    }

    public async Task<User> RegisterAsync(UserRegisterDto registerDto)
    {
        var newUser = new User
        {
            Id = Guid.NewGuid(),
            Username = registerDto.Username,
            Password = registerDto.Password,
            Gender = registerDto.Gender,
            CreatedDate = DateTime.UtcNow,
            Tasks = new List<UserTask>()
        };
        
        _dbContext.Users.Add(newUser);
        await _dbContext.SaveChangesAsync();

        return newUser;
    }

    public async Task<bool> IsUserExistAsync(string username)
    {
        return await _dbContext.Users.AnyAsync(u => u.Username == username);
    }
}