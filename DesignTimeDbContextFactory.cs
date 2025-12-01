using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using PersonalTrackerDeneme2.Data;

namespace PersonalTrackerDeneme2;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<PersonalTrackerDeneme2DbContext>
{
    public PersonalTrackerDeneme2DbContext CreateDbContext(string[] args)
    {
        DbContextOptionsBuilder<PersonalTrackerDeneme2DbContext> dbContext = new();
        dbContext.UseNpgsql(Configuration.ConnectionString);
        return new PersonalTrackerDeneme2DbContext(dbContext.Options);
    }
}