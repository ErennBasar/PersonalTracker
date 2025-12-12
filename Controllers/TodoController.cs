using Microsoft.AspNetCore.Mvc;
using PersonalTrackerDeneme2.DTOs;
using PersonalTrackerDeneme2.Services;

namespace PersonalTrackerDeneme2.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodoController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodoController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetAllAsync([FromQuery] Guid userId)
    {
        if (userId == Guid.Empty) 
            return BadRequest("Kullanıcı ID'si zorunludur.");
        
        var userTasks = await _todoService.GetAllAsync(userId);
        return Ok(userTasks);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTaskById(Guid id)
    {
        var task = await _todoService.GetTaskByIdAsync(id);
        // if (task == null)
        //     return NotFound();
        return Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTaskAsync(CreateTaskDto createTaskDto)
    {
        var newTaskDto = await _todoService.CreateTaskAsync(createTaskDto);
        return StatusCode(201, newTaskDto);
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<TaskDto>> UpdateTaskAsync(Guid id, [FromBody] UpdateTaskDto updateTaskDto)
    {
        var updatedTaskDto = await _todoService.UpdateTaskAsync(id, updateTaskDto);
        return Ok(updatedTaskDto);
    }
    
    // /api/To do/log/{id}
    [HttpPatch("log/{id}")]
    public async Task<ActionResult<TaskLogDto>> UpdateLog(Guid id, [FromBody] UpdateTaskLogDto updateLogDto)
    {
        var result = await _todoService.UpdateLogAsync(id, updateLogDto);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTaskAsync(Guid id)
    {
        var IsSucces = await _todoService.DeleteTaskAsync(id);

        if (!IsSucces)
            return NotFound();
        
        return Ok();
    }

    // public async Task<ActionResult> GetListTaskLogs(Guid taskId)
    // {
    //     var result = await _todoService.GetListTaskLogsAsync(taskId);
    //     return Ok(result);
    // }
    
}