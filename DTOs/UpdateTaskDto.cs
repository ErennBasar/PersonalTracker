namespace PersonalTrackerDeneme2.DTOs;

public class UpdateTaskDto
{
    // ? operatörü ile hepsini nullable yaptık.
    // Bu sayede veri güncellenmediyse null olacak
    // Eğer nullable yapmasaydık default olarak tanımlanan değerleri alacaklardı, bu gereksiz olurdu çünkü oluşturma aşamasında zaten default değerler verildi
    public string? Header { get; set; }
    public string? Body { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? StartDate { get; set; }
    public bool? IsCompleted { get; set; } 
    public decimal? HoursTaken { get; set; }
}