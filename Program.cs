using Microsoft.EntityFrameworkCore;
using PersonalTrackerDeneme2;
using PersonalTrackerDeneme2.Data;
using PersonalTrackerDeneme2.Services;

var builder = WebApplication.CreateBuilder(args);

// var connString = Configuration.ConnectionString 
//                  ?? throw new InvalidOperationException("Connection string 'DefaultConnection' bulunamadı. Azure Environment Variables veya appsettings kontrol ediniz.");

var connString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(connString))
{
    throw new InvalidOperationException("HATA: Connection String bulunamadı! Azure'da 'Connection strings' altında 'DefaultConnection' isminde bir kayıt olduğundan emin olun.");
}

builder.Services.AddDbContext<PersonalTrackerDeneme2DbContext>(options =>
    options.UseNpgsql(connString));

// builder.Services.AddDbContext<PersonalTrackerDeneme2DbContext>(options =>
//     options.UseNpgsql(Configuration.ConnectionString));

// builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
//     policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
//         .AllowAnyHeader()
//         .AllowAnyMethod()
// ));
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
        policy
            .SetIsOriginAllowed(origin => true)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials() 
));

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();


