namespace PersonalTrackerDeneme2;

public class Configuration 
{
    public static string? ConnectionString
    {
        get
        {   
            // ConfigurationManager configurationManager = new();
            // configurationManager.SetBasePath(Directory.GetCurrentDirectory());
            // configurationManager.AddJsonFile("appsettings.json");
            // return configurationManager.GetConnectionString("DefaultConnection");
            
            ConfigurationManager configurationManager = new();
            configurationManager.SetBasePath(Directory.GetCurrentDirectory());
            
            // 1. appsettings.json'ı oku (Lokal için)
            // optional: true yaptık ki Docker içinde dosya bulunamazsa hata vermesin
            configurationManager.AddJsonFile("appsettings.json", optional: true);
            
            // 2. appsettings.Development.json'ı oku (Varsa ezer)
            configurationManager.AddJsonFile("appsettings.Development.json", optional: true);

            // 3. Environment Variables (Ortam Değişkenleri) oku (AZURE İÇİN KRİTİK OLAN BU)
            // Azure'daki ConnectionStrings__DefaultConnection ayarını bu satır sayesinde okur.
            configurationManager.AddEnvironmentVariables();

            return configurationManager.GetConnectionString("DefaultConnection");
        }
    }
}