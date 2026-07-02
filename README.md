# High-Throughput URL Shortener

[![Java CI with Maven](https://github.com/arnav/url-shortener/actions/workflows/ci.yml/badge.svg)](https://github.com/arnav/url-shortener/actions/workflows/ci.yml)

A production-grade, highly optimized URL Shortener backend designed for high-concurrency lookup redirection.

## Tech Stack
- **Java 21** & **Spring Boot 3.5**
- **Spring Data JPA** & **MySQL 8.0**
- **Spring Data Redis** (Lettuce driver for caching)
- **Spring Security** & **JWT Authentication** (Bearer tokens)
- **OpenAPI 3 / Swagger UI** (Interactive specs at `/swagger-ui.html`)
- **Docker & Docker Compose** (Containerized orchestration)

## Key Features
- **Cache-Aside Pattern**: Serves redirects directly from Redis (24-hour TTL) to minimize database read overhead.
- **Custom Alias URL Support**: Allows users to define alphanumeric custom links with format validations and duplicate key checks.
- **Security**: Stateless JWT verification with standard authentication filters.
- **CI/CD Integration**: Automatic Maven compilation, unit test suites, and Docker image packaging on every push/PR.

## How to Run Locally
1. Start the Docker containers:
   ```bash
   docker compose up -d --build
   ```
2. Open Swagger UI at:
   `http://localhost:8080/swagger-ui/index.html`
3. Access Spring Actuator health monitoring at:
   `http://localhost:8080/actuator/health`
