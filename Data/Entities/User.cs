using PersonalTrackerDeneme2.Data.Entities.Common;

namespace PersonalTrackerDeneme2.Data.Entities;

public class User : BaseEntity
{
    
    public string Password { get; set; }
    public string Username { get; set; }
    public string Gender { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public ICollection<UserTask> Tasks { get; set; }
}