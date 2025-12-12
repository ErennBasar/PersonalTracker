namespace PersonalTrackerDeneme2.DTOs;

public class TaskDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? Header  { get; set; }
    public string? Body { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? StartDate { get; set; } 
    public DateTime CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public decimal HoursTaken { get; set; } 
    public bool IsCompleted { get; set; } 
    public bool IsCommon { get; set; }
    public List<TaskLogDto> Logs { get; set; }
    
}