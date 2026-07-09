# Engineering Decisions

This document briefly outlines the core technology selections and architectural trade-offs made in the Shortify project.

---

## Technical Stack Rationale

### 1. Spring Boot (Java)
* **Decision**: Selected as the primary framework for the backend REST service.
* **Rationale**: Spring Boot provides a mature, type-safe ecosystem with built-in integrations for transaction management, database ORM mapping (Hibernate/JPA), and security authentication. It allows writing robust, multi-threaded server applications capable of handling production-grade API workloads.

### 2. React & Vite (TypeScript)
* **Decision**: Selected for building the single-page client interface.
* **Rationale**: React's component-based model provides an efficient way to structure complex, interactive dashboard views. Vite is used as the build tool to achieve sub-second Hot Module Replacement (HMR), ensuring a fast, lightweight developer loop compared to traditional bundling systems.

### 3. Redis Caching
* **Decision**: Integrated as an in-memory key-value cache layer in front of the MySQL database.
* **Rationale**: Serving browser redirects directly from Redis (sub-millisecond read access) prevents blocking relational database connections on high-traffic lookups, increasing system throughput and reducing query latency.

### 4. JSON Web Tokens (JWT)
* **Decision**: Chosen as the method for user session authentication.
* **Rationale**: JWTs contain cryptographically signed user claims, enabling completely stateless authentication. This eliminates the need to store session states in database tables or server memory, simplifying horizontal scaling across multiple application instances.

### 5. Docker & Docker Compose
* **Decision**: Used for containerization and infrastructure orchestration.
* **Rationale**: Docker guarantees that all dependencies (MySQL, Redis, JDK) run in identical environments on any local developer machine, during CI validation (GitHub Actions), and in final production deployments.
