using Microsoft.EntityFrameworkCore;
using PersonalTrackerDeneme2.Data;
using PersonalTrackerDeneme2.Data.Entities;
using PersonalTrackerDeneme2.DTOs;

namespace PersonalTrackerDeneme2.Services;

public class TodoService : ITodoService
{
    readonly PersonalTrackerDeneme2DbContext _dbContext;

    public TodoService(PersonalTrackerDeneme2DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<TaskDto>> GetAllAsync()
    {
        var todoTasks = await _dbContext.Tasks
            .Include(x => x.TaskLogs)
            .OrderBy(t => t.CreatedDate)
            .ToListAsync();

        var taskDtos = todoTasks.Select(t => new TaskDto
        {
            Id = t.Id,
            Header = t.Header,
            Body = t.Body,
            CreatedDate = t.CreatedDate,
            StartDate = t.StartDate,
            EndDate = t.EndDate,
            HoursTaken = t.HoursTaken,
            IsCompleted = t.IsCompleted,
            
            Logs = t.TaskLogs.Select(l => new TaskLogDto 
            {
                Id = l.Id,
                LogTime = l.LogTime, 
                HoursSpent = l.HoursSpent,
                Description = l.Description
            }).ToList()
        });
        return taskDtos;
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto)
    {
        var startDate = createTaskDto.StartDate;
        var endDate = createTaskDto.EndDate;
        
        var createdDto = new UserTask
        {
            StartDate = startDate,
            EndDate = endDate,
            TaskLogs = new List<TaskLog>()
        };

        for (var date = startDate; date <= endDate; date = date.AddDays(1))
        {
            createdDto.TaskLogs.Add(new TaskLog
            {
                LogTime = date,
                HoursSpent = 0,
                Description = ""
            });
        }
        
        _dbContext.Tasks.Add(createdDto);
        await _dbContext.SaveChangesAsync();

        var clientResponse = new TaskDto
        {
            Id = createdDto.Id,
            Header = createdDto.Header,
            Body = createdDto.Body,
            CreatedDate = createdDto.CreatedDate,
            StartDate = createdDto.StartDate,
            EndDate = createdDto.EndDate,
            HoursTaken = createdDto.HoursTaken,
            IsCompleted = createdDto.IsCompleted,
        };
        return clientResponse;
    }

    public async Task<TaskDto> UpdateTaskAsync(Guid id, UpdateTaskDto updateTaskDto)
    {
        var existTask = await _dbContext.Tasks.
            Include(t => t.TaskLogs).
            FirstOrDefaultAsync(t => t.Id == id);

        if (existTask == null)
            return null!;
        
        if(updateTaskDto.Header != null)
            existTask.Header = updateTaskDto.Header;
        
        if(updateTaskDto.Body != null)
            existTask.Body = updateTaskDto.Body;
        
        if(updateTaskDto.IsCompleted.HasValue)
            existTask.IsCompleted = updateTaskDto.IsCompleted.Value;

        DateTime newStartDate = updateTaskDto.StartDate.HasValue 
            ? DateTime.SpecifyKind(updateTaskDto.StartDate.Value, DateTimeKind.Utc).Date
            : existTask.StartDate!.Value.Date;

        DateTime newEndDate = updateTaskDto.EndDate.HasValue 
            ? DateTime.SpecifyKind(updateTaskDto.EndDate.Value, DateTimeKind.Utc).Date 
            : existTask.EndDate!.Value.Date;
        
        existTask.UpdatedDate = DateTime.UtcNow;
        
        if (newStartDate != existTask.StartDate!.Value.Date || newEndDate != existTask.EndDate!.Value.Date)
        {
            // yeni tarihe göre aralık dışında kalanları silme işlemi
            var logsToRemove = existTask.TaskLogs
                .Where(t => t.LogTime.Date < newStartDate || t.LogTime.Date > newEndDate)
                .ToList();
            
            foreach (var log in logsToRemove)
            {
                _dbContext.TaskLogs.Remove(log); 
            }

            for (var date = newStartDate; date <= newEndDate; date = date.AddDays(1))
            {
                var exist = existTask.TaskLogs.Any(t => t.LogTime.Date == date);

                if (!exist)
                {
                    existTask.TaskLogs.Add(new TaskLog
                    {
                        LogTime = date,
                        HoursSpent = 0,
                        Description = "",
                    });
                }
            }
            
            existTask.StartDate = newStartDate;
            existTask.EndDate = newEndDate;
        }
        
        await _dbContext.SaveChangesAsync();
        
        // var totalHours = await _dbContext.TaskLogs
        //     .Where(t => t.UserTaskId == id)
        //     .SumAsync(t => t.HoursSpent);
        //
        // existTask.HoursTaken = totalHours;
        // await _dbContext.SaveChangesAsync();
        
        return new TaskDto
        {
            Id = existTask.Id,
            Header = existTask.Header,
            Body = existTask.Body,
            CreatedDate = existTask.CreatedDate,
            StartDate = existTask.StartDate,
            EndDate = existTask.EndDate,
            HoursTaken = existTask.HoursTaken,
            IsCompleted = existTask.IsCompleted,
            UpdatedDate = existTask.UpdatedDate
        };
    }

    public async Task<bool> DeleteTaskAsync(Guid id)
    {
        var taskDelete = await _dbContext.Tasks.FindAsync(id);
        
        if(taskDelete == null)
            return false;

        var deleted = _dbContext.Tasks.Remove(taskDelete);
        
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<TaskDto> GetTaskByIdAsync(Guid id)
    {
        var taskEntity = await _dbContext.Tasks
            .Include(t => t.TaskLogs)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (taskEntity == null)
            return null!;

        return new TaskDto
        {
            Id = taskEntity.Id,
            Header = taskEntity.Header,
            Body = taskEntity.Body,
            CreatedDate = taskEntity.CreatedDate,
            StartDate = taskEntity.StartDate,
            EndDate = taskEntity.EndDate,
            HoursTaken = taskEntity.HoursTaken,
            IsCompleted = taskEntity.IsCompleted,

            Logs = taskEntity.TaskLogs.Select(log => new TaskLogDto
            {
                Id = log.Id,
                LogTime = log.LogTime,
                HoursSpent = log.HoursSpent,
                Description = log.Description,
                
            }).OrderBy(o => o.LogTime).ToList()
        };
    }

    public async Task<TaskLogDto> UpdateLogAsync(Guid logId, UpdateTaskLogDto updateTaskLogDto)
    {
        var existingLog = await _dbContext.TaskLogs
            .Include(l => l.Tasks)
            .FirstOrDefaultAsync(l => l.Id == logId);

        if (existingLog == null)
            return null!;

        if (updateTaskLogDto.HoursSpent.HasValue)
            existingLog.HoursSpent = updateTaskLogDto.HoursSpent.Value;

        if (updateTaskLogDto.Description != null)
            existingLog.Description = updateTaskLogDto.Description;
        
        existingLog.UpdatedDate = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        
        var totalHours = await _dbContext.TaskLogs
            .Where(l => l.UserTaskId == existingLog.UserTaskId)
            .SumAsync(l => l.HoursSpent);
        
        existingLog.Tasks.HoursTaken = totalHours;

        await _dbContext.SaveChangesAsync();

        return new TaskLogDto
        {
            Id = existingLog.Id,
            LogTime = existingLog.LogTime,
            HoursSpent = existingLog.HoursSpent,
            Description = existingLog.Description,
            UpdatedDate = existingLog.UpdatedDate
        };
    }

    // public async Task<List<ListTaskLogsDto>> GetListTaskLogsAsync(Guid taskId)
    // {
    //     var logs = await _dbContext.TaskLogs
    //         .Where(x => x.UserTaskId == taskId)
    //         .OrderByDescending(x => x.LogTime)
    //         .Select(x => new ListTaskLogsDto
    //         {
    //             LogTime = x.LogTime,
    //             Description = x.Description,
    //             HoursSpent = x.HoursSpent,
    //             
    //         }).ToListAsync();
    //     
    //     return logs;
    // }
}