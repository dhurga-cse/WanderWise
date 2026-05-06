# 🚀 WanderWise Spring Boot Backend - Run Guide

## Prerequisites

### 1. Install Java 17
Download from: https://www.oracle.com/java/technologies/downloads/#java17
- Choose Windows x64 Installer
- Install and set JAVA_HOME environment variable

Verify:
```bash
java -version
# Should show: java version "17.x.x"
```

### 2. Install Maven
Download from: https://maven.apache.org/download.cgi
- Download Binary zip archive
- Extract to C:\maven
- Add C:\maven\bin to PATH

Verify:
```bash
mvn -version
# Should show: Apache Maven 3.x.x
```

### 3. PostgreSQL must be running
Make sure wanderwise database exists:
```bash
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE wanderwise;"
```

---

## Run Spring Boot Backend

```bash
cd springboot-backend
mvn spring-boot:run
```

You should see:
```
✅ PostgreSQL Connected Successfully
🚀 WanderWise Spring Boot Server running on port 5000
```

---

## Run Frontend (unchanged)

```bash
cd frontend
npm start
```

---

## ✅ All API Endpoints (Same as before)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/trips | Get all trips |
| GET | /api/trips/:id | Get single trip |
| POST | /api/trips | Create trip |
| PUT | /api/trips/:id | Update trip |
| DELETE | /api/trips/:id | Delete trip |
| GET | /api/expenses/trip/:id | Get expenses |
| POST | /api/expenses | Add expense |
| DELETE | /api/expenses/:id | Delete expense |
| GET | /api/recommendations/hotels/:dest | Get hotels |
| GET | /api/recommendations/food/:dest | Get restaurants |
| POST | /api/routes/optimize | Get route |
| GET | /api/health | Health check |

---

## Project Structure

```
springboot-backend/
├── pom.xml
└── src/main/
    ├── java/com/wanderwise/
    │   ├── WanderWiseApplication.java
    │   ├── config/SecurityConfig.java
    │   ├── controller/
    │   │   ├── AuthController.java
    │   │   ├── TripController.java
    │   │   ├── ExpenseController.java
    │   │   ├── RecommendationController.java
    │   │   ├── RouteController.java
    │   │   └── HealthController.java
    │   ├── dto/
    │   │   ├── AuthDto.java
    │   │   ├── TripDto.java
    │   │   ├── ExpenseDto.java
    │   │   └── RouteDto.java
    │   ├── model/
    │   │   ├── User.java
    │   │   ├── Trip.java
    │   │   └── Expense.java
    │   ├── repository/
    │   │   ├── UserRepository.java
    │   │   ├── TripRepository.java
    │   │   └── ExpenseRepository.java
    │   ├── security/
    │   │   ├── JwtUtil.java
    │   │   └── JwtAuthFilter.java
    │   └── service/
    │       ├── AuthService.java
    │       ├── TripService.java
    │       ├── ExpenseService.java
    │       ├── RecommendationService.java
    │       └── RouteService.java
    └── resources/
        └── application.properties
```
