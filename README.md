# Personal Tracker Projesi Kurulum Rehberi 🚀

Bu projeyi çalıştırmak için aşağıdaki adımları izleyin.

## Gereksinimler
* .NET 9 SDK
* Node.js (Angular için)
* Docker Desktop (Veritabanı için önerilir)

## 1. Veritabanını Ayağa Kaldır (Docker ile)
Terminalde ana dizine gelin ve şu komutu çalıştırın:
docker-compose up -d

*Bu işlem PostgreSQL veritabanını 5432 portunda çalıştıracaktır.*

## 2. Backend Ayarları (ÖNEMLİ!) ⚠️
Güvenlik gereği veritabanı bağlantı ayarları repoda yoktur.
Ana dizinde içine `appsettings.json` adında bir dosya oluşturun ve içine şunları yapıştırın:

{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=TrackerDbTest;Username=test;Password=ŞİFRE"
  }
}

**Not:** ŞİFRE kısmına .env dosyasında tanımlı olan şifreyi yazın.

## 3. Veritabanını Güncelle
Veritabanı tablolarını oluşturmak için ana dizinde şu komutu çalıştırın:
dotnet ef database update

## 4. Projeyi Çalıştır
* **Backend:**  Ana dizinde `dotnet run`
* **Frontend:** `PersonalTracker.Client` dizininde `npm install` ve ardından `ng serve -o`
