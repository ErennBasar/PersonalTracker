using Microsoft.EntityFrameworkCore;
using PersonalTrackerDeneme2.Data.Entities;

namespace PersonalTrackerDeneme2.Data;

public class PersonalTrackerDeneme2DbContext : DbContext
{
    public PersonalTrackerDeneme2DbContext(DbContextOptions<PersonalTrackerDeneme2DbContext> options) : base(options)
    {
    }
    
    public DbSet<UserTask> Tasks { get; set; }
    public DbSet<TaskLog> TaskLogs { get; set; }
}