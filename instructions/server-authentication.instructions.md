---
description: Guidance for Authentication - secure user identity verification
name: Authentication - Server
applyTo: |
  **/auth/**/*.{js,ts}
  **/*auth*.{js,ts}
  **/login/**/*.{jsx,tsx}
---

# Authentication Instructions

## What is Authentication?

Authentication verifies user identity using token-based systems (JWT). Login returns access token (15min) + refresh token (7 days). Access token proves identity for API requests; refresh token gets new access tokens.

## Key Principles

1. **Token-Based (JWT)**: Stateless authentication—server validates token signature without database lookup. Token contains user info + expiration.

2. **Access + Refresh Pattern**: Short-lived access tokens limit damage if stolen. Refresh tokens (httpOnly cookie) get new access tokens silently.

3. **Secure Storage**: httpOnly cookies prevent XSS (JavaScript can't read). Memory storage is most secure but lost on refresh.

## Best Practices

✅ **DO**:
- Store refresh token in httpOnly cookie
- Store access token in memory (React state)
- Implement token refresh in axios interceptor
- Use HTTPS only (never HTTP for auth)
- Implement proper logout (clear tokens + optionally blacklist)
- Protect routes with auth guards

❌ **DON'T**:
- Store tokens in localStorage (XSS vulnerable)
- Use long-lived access tokens
- Forget CSRF protection with cookies
- Send tokens over HTTP
- Ignore token expiration handling

## Code Patterns

### Auth Context Provider

```jsx
// AuthContext.js
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  
  const login = async (credentials) => {
    const { accessToken, user } = await authService.login(credentials);
    setAccessToken(accessToken);  // Memory storage
    setUser(user);
    // Refresh token set as httpOnly cookie by server
  };
  
  const logout = async () => {
    await authService.logout();
    setAccessToken(null);
    setUser(null);
  };
  
  const value = { user, accessToken, login, logout, isAuthenticated: !!user };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Axios Interceptor for Token Refresh

```javascript
// apiClient.js
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Refresh token sent automatically via cookie
        const { accessToken } = await authService.refresh();
        setAccessToken(accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### Protected Route

```jsx
// ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## Token Storage Comparison

| Storage | XSS Safe | CSRF Safe | Persists | Recommendation |
|---------|----------|-----------|----------|----------------|
| Memory | ✅ | ✅ | ❌ | Access token |
| httpOnly Cookie | ✅ | ❌ | ✅ | Refresh token |
| localStorage | ❌ | ✅ | ✅ | Avoid |

## Related Terminologies

- **API** (Server) - Auth tokens in API requests
- **Router** (Server) - Protected routes
- **Store** (State) - Auth state management
- **Middleware** (State) - Auth actions/async

## Quality Gates

- [ ] Access token in memory
- [ ] Refresh token in httpOnly cookie
- [ ] Token refresh in interceptor
- [ ] Protected routes implemented
- [ ] HTTPS only
- [ ] Proper logout flow

**Source**: `/docs/server/authentication.md`
