# Setup Guide

This document describes how to clone, configure, and run the Shortify application locally.

---

## Prerequisites

Ensure you have the following software installed on your development machine:
* **Java Development Kit (JDK) 21** (Temurin recommended)
* **Maven 3.9+** (or use the included Maven wrapper)
* **Node.js 18+** & **npm**
* **Docker** & **Docker Compose**

---

## Option 1: Run with Docker Compose (Quick Start)

The simplest way to run the entire stack (Frontend, Backend, MySQL, Redis) is using Docker Compose:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arnav/url-shortener.git
   cd url-shortener
   ```

2. **Launch the containers**:
   ```bash
   docker compose up -d --build
   ```

3. **Verify the services**:
   * **Frontend Dashboard**: Open `http://localhost:5173` in your browser.
   * **Backend REST API**: Open `http://localhost:8080/swagger-ui/index.html` to view API documentation.
   * **Actuator Health check**: Access `http://localhost:8080/actuator/health` to verify system health.

4. **Stop the services**:
   ```bash
   docker compose down
   ```

---

## Option 2: Run Locally for Development

To make real-time changes to the frontend or backend, run the services locally while keeping database dependencies in Docker.

### 1. Spin up Databases (MySQL & Redis)
Run only the database containers using Docker Compose:
```bash
docker compose up -d mysql redis
```

### 2. Run Backend (Spring Boot)
1. Navigate to the root directory.
2. Compile and run the server using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *Note: On Windows, use `mvnw.cmd spring-boot:run`.*
3. The server runs at `http://localhost:8080`.

### 3. Run Frontend (React & Vite)
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Configure development environment variables. Ensure a file named `.env.development` exists in `frontend/` containing:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
3. Install npm packages:
   ```bash
   npm install
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
5. The frontend runs at `http://localhost:5173`.
