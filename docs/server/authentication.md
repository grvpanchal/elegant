---
title: Authentication
layout: default
---

# **Authentication**

The Authentication can be a reusable module designed to handle user authentication, ensuring secure login, registration, password management, and role-based access control (RBAC) across multiple services or applications. It provides standard methods and interfaces for validating user credentials, managing authentication tokens, and maintaining session integrity.

## Features

- **User Registration**: Allows users to sign up for an account.
- **Login**: Enables users to authenticate by providing credentials.
- **Password Recovery**: Offers mechanisms for users to reset their passwords securely.
- **Token-based Authentication**: Supports JWT (JSON Web Token) for stateless authentication.
- **Role-based Access Control (RBAC)**: Manages access to resources based on user roles.
- **Session Management**: Handles session creation, expiration, and revocation.
- **Multi-factor Authentication (MFA)**: Optionally integrates with third-party MFA services.

---

## Components

The **Authentication Common Component** typically consists of the following modules:

1. **Authentication API**
2. **User Management Service**
3. **Token Service**
4. **Password Management**
5. **Session Service**
6. **Roles and Permissions**

---

## Authentication Flow

### 1. **Login**
   - **Request**: The user submits their credentials (e.g., username and password).
   - **Process**: The system validates the credentials. If valid:
     - A session or JWT token is generated.
     - The token is returned to the client.
   - **Response**: A response with the access token and possibly a refresh token.

   **Example Request** (POST):
   ```json
   {
     "username": "user@example.com",
     "password": "securePassword123"
   }
   ```

   **Example Response** (200 OK):
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJpYXQiOjE2MTYyOTkxMTIsImV4cCI6MTYxNjMwMjExMn0.9Q7nhtzE...",
     "refresh_token": "rNjhvn8aP4l0Bc0hrFqFtrh0",
     "expires_in": 3600
   }
   ```

### 2. **Registration**
   - **Request**: The user submits a registration form with required information (e.g., email, password).
   - **Process**: The system checks if the email is unique, hashes the password, and stores the user information in the database.
   - **Response**: A success message or an error if the email is already taken.

   **Example Request** (POST):
   ```json
   {
     "username": "newuser@example.com",
     "password": "newSecurePassword123",
     "first_name": "John",
     "last_name": "Doe"
   }
   ```

   **Example Response** (201 Created):
   ```json
   {
     "message": "User successfully registered."
   }
   ```

### 3. **Password Recovery**
   - **Request**: The user submits an email or username.
   - **Process**: The system generates a unique, time-limited password reset token and sends it to the user's email address.
   - **Response**: A response indicating whether the email was sent successfully or not.

   **Example Request** (POST):
   ```json
   {
     "email": "user@example.com"
   }
   ```

   **Example Response** (200 OK):
   ```json
   {
     "message": "Password reset email sent."
   }
   ```

### 4. **Password Reset**
   - **Request**: The user submits the reset token along with a new password.
   - **Process**: The system validates the reset token, hashes the new password, and updates the user's password in the database.
   - **Response**: A success message indicating the password has been reset.

   **Example Request** (POST):
   ```json
   {
     "reset_token": "abc123xyz",
     "new_password": "newPassword123"
   }
   ```

   **Example Response** (200 OK):
   ```json
   {
     "message": "Password successfully reset."
   }
   ```

---

## Token Service

### JWT Authentication

The ACC uses JWT (JSON Web Tokens) for stateless authentication, meaning the server does not need to store session data. The token contains information about the user and is signed to prevent tampering.

**JWT Structure**: 
- Header: Contains metadata about the token (algorithm and type).
- Payload: Contains claims (e.g., user ID, roles).
- Signature: Verifies the integrity of the token.

### Token Expiration
- **Access Token**: Typically has a short lifespan (e.g., 1 hour).
- **Refresh Token**: Longer lifespan (e.g., 30 days) and is used to obtain a new access token once it expires.

### Example of Token Generation:
```json
{
  "user_id": 123456,
  "email": "user@example.com",
  "roles": ["user", "admin"],
  "iat": 1627905189,
  "exp": 1627908789
}
```

---

## Roles and Permissions

The ACC supports Role-Based Access Control (RBAC). Roles are assigned to users, and these roles determine what actions they can perform within the application. 

### Role Definitions:
- **Admin**: Full access to all resources and configuration settings.
- **User**: Limited access to resources and personal data.
- **Guest**: Can view publicly available content only.

### Permission Checks:
Each API request that requires authorization must include a valid JWT or session token. Based on the user's role, the system will grant or deny access to specific resources.

Example:
- **Admin** can view and modify user data, while **User** can only access their own data.

---

## Session Management

- **Create Session**: Upon successful login, a session is created.
- **Session Expiration**: The session may expire after a set time or if the user logs out.
- **Session Termination**: Sessions can be manually terminated via an API endpoint.

---

## Multi-factor Authentication (MFA) (Optional)

If enabled, users will be prompted for an additional form of authentication, such as a one-time passcode (OTP) sent via email or SMS, after entering their primary credentials.

---

## API Endpoints

| Endpoint                          | Method | Description                                            |
|-----------------------------------|--------|--------------------------------------------------------|
| `/auth/login`                     | POST   | Login and obtain access token                         |
| `/auth/register`                  | POST   | Register a new user                                   |
| `/auth/forgot-password`           | POST   | Request password reset                                |
| `/auth/reset-password`            | POST   | Reset password using a token                          |
| `/auth/refresh-token`             | POST   | Obtain a new access token using refresh token         |
| `/auth/logout`                    | POST   | Log out (terminate session)                           |

---

## Error Handling

- **400 Bad Request**: Input validation failed.
- **401 Unauthorized**: Authentication required or failed.
- **403 Forbidden**: Insufficient permissions.
- **404 Not Found**: Resource not found (e.g., user).
- **500 Internal Server Error**: An unexpected error occurred.

---

## Security Considerations

- **Password Storage**: Ensure passwords are hashed using a secure algorithm (e.g., bcrypt or Argon2).
- **Token Storage**: Tokens should be securely stored, ideally in HTTP-only cookies.
- **Rate Limiting**: Implement rate limiting to prevent brute-force attacks.

---


# Further Reading
- https://zivukushingai.medium.com/everything-you-need-to-know-about-frontend-and-backend-authentication-ultimate-guide-7142a752249c
- https://webauthn.guide/