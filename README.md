# Personal Tracker Projesi Kurulum Rehberi 🚀

Bu projeyi çalıştırmak için aşağıdaki adımları izleyin.

## Gereksinimler
* .NET 9 SDK
* Node.js (Angular için)
* Docker Desktop (Veritabanı için önerilir)

## 1. Veritabanını Ayağa Kaldır (Docker ile)
compose.yaml dosyasındaki 'image: postgres:latest' yerine 'image: postgres:16-alpine' yazın

Terminalde ana dizine gelin ve şu komutu çalıştırın:
docker-compose up -d

*Bu işlem PostgreSQL veritabanını 5432 portunda çalıştıracaktır.*

## 2. Backend Ayarları (ÖNEMLİ!) ⚠️
Güvenlik gereği veritabanı bağlantı ayarları repoda yoktur.
Ana dizinde içine `appsettings.json` adında bir dosya oluşturun ve içine şunları yapıştırın:

  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=TrackerDbTest;Username=test;Password=ŞİFRE"
  }

**Not:** ŞİFRE kısmına .env dosyasında tanımlı olan şifreyi yazın.

## 3. Veritabanını Güncelle
Veritabanı tablolarını oluşturmak için Package Manager Console(mac için terminal) içinde şu komutu çalıştırın:
* Migrations klasörünü silin
* Drop-Database
* Add-Migration mig_1 (mac için; dotnet ef migrations add mig_1)
* Update-Database (mac için: dotnet ef database update)

## 4. Projeyi Çalıştır
* **Backend:**  Ana dizinde `dotnet run`
* **Frontend:** `PersonalTracker.Client` dizininde `npm install --legacy-peer-deps` ve ardından `ng serve -o` veya `npm start`
* `npm start` için `PersonalTracker.Client`/`package.json` içindeki `"start": ng serve -o` olduğundan emin olun