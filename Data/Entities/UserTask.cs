using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PersonalTrackerDeneme2.Data.Entities.Common;

namespace PersonalTrackerDeneme2.Data.Entities;

[Table("Tasks")]
public class UserTask : BaseEntity
{
    public string? Header { get; set; } = "New Note";
    public string? Body { get; set; } = "No additional text";
    public DateTime? EndDate { get; set; }
    public DateTime? StartDate { get; set; } 
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedDate { get; set; } 
    
    [Column(TypeName = "decimal(6,2)")]
    public decimal HoursTaken { get; set; } = 0;
    public bool IsCompleted { get; set; } = false;

    public ICollection<TaskLog> TaskLogs { get; set; } = new List<TaskLog>();
}