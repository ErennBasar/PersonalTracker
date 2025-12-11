# Personal Tracker (Kişisel Gelişim Takip Sistemi)

Bu proje, kişisel görevlerinizi, harcadığınız saatleri ve ilerlemenizi takip etmek için oluşturulmuştur.

## 🚀 Çalışma Mimarisi

Bu uygulama, arka planda tek bir merkezi Azure PostgreSQL veritabanına bağlanır.

| Katman | Proje | Teknoloji | Adres |
| :--- | :--- | :--- | :--- |
| **Veritabanı** | Azure Postgres | PostgreSQL | Cloud (Ortak Havuz) |
| **Backend** | PersonalTracker.API | .NET 9 | Localhost:5256 (Varsayılan) |
| **Frontend** | PersonalTracker.Client | Angular | Localhost:4200 (Varsayılan) |

---

## 🛠️ Kurulum ve Çalıştırma

### Ön Koşullar

Bu projeyi çalıştırabilmeniz için bilgisayarınızda şunların kurulu olması gerekir:

1.  **[.NET 9 SDK (veya 8)](https://dotnet.microsoft.com/download):** Backend projesi için.
2.  **[Node.js (v18+)](https://nodejs.org/en):** Angular projesi için.

## KRİTİK AYAR ⚠️ - Azure Bağlantısı
Bu proje yerel veritabanı kullanmaz. Ortak Azure veritabanına bağlanmak için projedeki `appsettings.json` dosyasında bağlantı cümlesini (Connection String) ayarlamanız gerekir. 

* "ConnectionStrings": {
"DefaultConnection": "Host=ptracker-db-eren.postgres.database.azure.com;Port=5432;Database=PersonalTrackerDB;Username=erenadmin;Password=ŞİFRENİZİ_BURAYA_YAZIN"
}

## 4. Projeyi Çalıştır
* **Backend:**  Ana dizinde `dotnet run`
* **Frontend:** `PersonalTracker.Client` dizininde `npm install --legacy-peer-deps` ve ardından `ng serve -o` veya `npm start`
* `npm start` için `PersonalTracker.Client`/`package.json` içindeki `"start": ng serve -o` olduğundan emin olun