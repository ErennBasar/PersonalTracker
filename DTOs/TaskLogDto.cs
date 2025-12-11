namespace PersonalTrackerDeneme2.DTOs;

public class TaskLogDto
{
    public Guid Id { get; set; }
    public DateTime LogTime { get; set; }
    public decimal HoursSpent { get; set; }
    public string? Description { get; set; }
    public DateTime? UpdatedDate { get; set; }
}