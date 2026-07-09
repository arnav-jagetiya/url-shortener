# API Specification

This document details the REST API endpoints and redirection flows of the Shortify platform.

---

## API Design Principles

The Shortify API is designed around the following principles:
* **Contract-First Design**: Strict separation between the API contract and internal implementation layers.
* **Consistent Resource Naming**: Clear resource hierarchies mapping URL collections (`/api/urls`) and authentication endpoints (`/api/auth`).
* **Stateless Authentication**: No session state is retained on the server; clients authorize requests on every call.
* **Predictable Error Responses**: Uniform error payloads are returned on failures.
* **Stable Contracts**: Exposing fixed JSON structures to protect consumers from unexpected schema changes.

---

## Base URL

* **Development (Backend API)**: `http://localhost:8080` (API prefixes are configured under `/api/`)
* **Development (Client Redirection)**: Root path `/` on the backend server maps redirect codes.
* **Production**: Deployment environments may configure different root hostnames while preserving the exact same API contract paths.

---

## Authentication Requirements

All endpoints under the `/api/urls/**` prefix are protected and require a valid JSON Web Token (JWT) sent via the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

Public endpoints (such as user authentication and browser link redirections) do not require credentials.

---

## Error Response Structure

When an API request fails, Shortify returns a uniform JSON error payload containing the following fields:

```json
{
  "timestamp": "2026-07-09T15:00:00.000",
  "message": "Error description message text",
  "details": "Additional contextual details"
}
```

* **timestamp**: The ISO-8601 date and time when the error was caught on the server.
* **message**: User-friendly description of what failed.
* **details**: Specific resource context or error category (e.g. "URL has expired" or "Resource not found").

---

## Common HTTP Status Codes

Shortify uses standard HTTP response codes to indicate request outcomes:
* `200 OK`: Request succeeded (e.g. loading URL lists).
* `201 Created`: Resource successfully created (e.g. registering user, shortening URL).
* `302 Found`: Successful redirection to original destination.
* `400 Bad Request`: Input validation failed (e.g. malformed URL format).
* `401 Unauthorized`: Token is missing, expired, or invalid.
* `404 Not Found`: Short URL code does not exist.
* `410 Gone`: Short URL link has expired.
* `500 Internal Server Error`: An unexpected backend error occurred.

---

## Endpoint Specifications

### 1. User Authentication

#### Register User
* **Endpoint**: `POST /api/auth/register`
* **Access**: Public
* **Purpose**: Register a new user account.
* **Request Payload**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Response Payload (201 Created)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "email": "john@example.com",
    "name": "John Doe"
  }
  ```
* **Error Responses**:
  * `400 Bad Request`: Validation checks failed (e.g. password too short, malformed email).

#### Log In
* **Endpoint**: `POST /api/auth/login`
* **Access**: Public
* **Purpose**: Log in an existing user and retrieve a JWT bearer session token.
* **Request Payload**:
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Response Payload (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "email": "john@example.com",
    "name": "John Doe"
  }
  ```
* **Error Responses**:
  * `400 Bad Request`: Invalid inputs.
  * `401 Unauthorized`: Incorrect email or password.

---

### 2. URL Shortener Management

#### Shorten URL
* **Endpoint**: `POST /api/urls`
* **Access**: Protected (JWT Bearer Token Required)
* **Purpose**: Create a new shortened URL with optional custom alias and expiration minutes.
* **Request Payload**:
  ```json
  {
    "originalUrl": "https://google.com",
    "customAlias": "custom-alias",
    "expirationMinutes": 10
  }
  ```
* **Response Payload (201 Created)**:
  ```json
  {
    "id": 42,
    "shortCode": "custom-alias",
    "originalUrl": "https://google.com",
    "shortUrl": "http://localhost:8080/custom-alias",
    "clickCount": 0,
    "createdAt": "2026-07-09T15:00:00",
    "expiresAt": "2026-07-09T15:10:00"
  }
  ```
* **Error Responses**:
  * `400 Bad Request`: Invalid destination URL format, or custom alias already in use.

#### Get User URLs
* **Endpoint**: `GET /api/urls`
* **Access**: Protected (JWT Bearer Token Required)
* **Purpose**: Retrieve all shortened URLs created by the authenticated user.
* **Response Payload (200 OK)**:
  ```json
  [
    {
      "id": 42,
      "shortCode": "custom-alias",
      "originalUrl": "https://google.com",
      "shortUrl": "http://localhost:8080/custom-alias",
      "clickCount": 12,
      "createdAt": "2026-07-09T15:00:00",
      "expiresAt": "2026-07-09T15:10:00"
    }
  ]
  ```
* **Idempotency Note**: `GET` operations are strictly read-only and side-effect free. Repeating a `GET` request does not alter backend resources.

#### Delete URL
* **Endpoint**: `DELETE /api/urls/{id}`
* **Access**: Protected (JWT Bearer Token Required)
* **Purpose**: Permanently delete a short URL, evicting its record from the database and the Redis cache.
* **Response Payload (200 OK)**:
  * (Empty body, success indicator)
* **Error Responses**:
  * `404 Not Found`: Short URL record with specified ID does not exist or belongs to another user.
* **Idempotency Note**: `DELETE` operations should be treated as idempotent from the consumer's perspective. Repeated calls to delete the same resource ID will return a success state or a clean resource missing indicator without adverse side effects.

---

### 3. Redirection Flow (Browser Requests)

#### Short URL Redirect
* **Endpoint**: `GET /{shortCode}`
* **Access**: Public
* **Purpose**: Redirects user browsers from the shortened code to the original destination URL.
* **Success Response (302 Found)**:
  * **Headers**: `Location: <original_destination_url>`
* **Expiration Response (302 Found)**:
  * **Headers**: `Location: <frontend_url>/link-expired?code={shortCode}`
* **Missing Response (302 Found)**:
  * **Headers**: `Location: <frontend_url>/link-not-found?code={shortCode}`
* **Idempotency Note**: `GET` redirection lookups are read-only from the data schema mapping perspective. Click count increments are executed as decoupled side effects.

---

## Security Notes

* **Bearer Authentication**: JWT tokens must be sent on every request to protected routes.
* **HTTPS**: Production environments must enforce TLS/HTTPS to protect bearer tokens in transit.
* **Token Storage**: Clients should store bearer tokens securely. In web browsers, security practices dictate careful protection of `localStorage` tokens against XSS.
* **Role Isolation**: Protected routes strictly block unauthenticated guest requests.

---

## Versioning Policy

Shortify exposes version `1.0.0` of the API contract. Future breaking changes to the REST contract structure will be managed through the project's versioning strategy to ensure stable compatibility for consumers.

---

## Documentation Scope

> [!NOTE]
> This document describes the published API contract. Internal implementation details, service architecture, and business logic are documented separately.
