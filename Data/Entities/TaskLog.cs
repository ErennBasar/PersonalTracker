using System.ComponentModel.DataAnnotations.Schema;
using PersonalTrackerDeneme2.Data.Entities.Common;

namespace PersonalTrackerDeneme2.Data.Entities;

[Table("TaskLogs")]
public class TaskLog : BaseEntity
{
    public Guid UserTaskId  { get; set; }
    // O günün tarihi
    public DateTime LogTime { get; set; }
    [Column(TypeName = "numeric(4,2)")]
    public decimal HoursSpent { get; set; }
    public string? Description { get; set; }
    public UserTask Tasks { get; set; }
}