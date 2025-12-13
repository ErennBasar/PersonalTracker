# 1. Build Aşaması
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Dosyaları kopyalıyoruz
COPY ["PersonalTrackerDeneme2.csproj", "./"]
RUN dotnet restore "PersonalTrackerDeneme2.csproj"

# Geri kalan her şeyi kopyala (Frontend klasörü hariç, çünkü .dockerignore ile engelledik)
COPY . .

# Derleme
RUN dotnet publish "PersonalTrackerDeneme2.csproj" -c Release -o /app/publish

# 2. Run Aşaması
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "PersonalTrackerDeneme2.dll"]