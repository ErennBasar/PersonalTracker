using PersonalTrackerDeneme2.DTOs;

namespace PersonalTrackerDeneme2.Services;

public interface ITodoService
{
    Task<IEnumerable<TaskDto>> GetAllAsync();
    Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto);
    
    Task<TaskDto> UpdateTaskAsync(Guid id, UpdateTaskDto updateTaskDto);
    Task<bool> DeleteTaskAsync(Guid id);
    Task<TaskDto> GetTaskByIdAsync(Guid id);
    Task<TaskLogDto> UpdateLogAsync(Guid logId, UpdateTaskLogDto updateTaskLogDto);
    
    //Task<List<ListTaskLogsDto>> GetListTaskLogsAsync(Guid taskId);
    
}