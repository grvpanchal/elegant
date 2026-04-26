---
title: API
layout: doc
slug: api
---

# API Services

> - Bridge between frontend and backend for data flow
> - Centralizes server communication with consistent patterns
> - Handles authentication, error handling, and caching

## Detailed Description

API services transform chaotic, duplicated data fetching into an organized, maintainable architecture. Instead of scattering `fetch()` calls throughout your codebase with inconsistent error handling and duplicated authentication logic, a well-designed API layer centralizes all server communication into reusable service modules with consistent patterns for requests, responses, errors, caching, and retry logic.

The fundamental problem: in applications without structured API services, every component making network requests reinvents the wheel—manually adding authorization headers, handling loading states, parsing errors differently, implementing retry logic inconsistently. This leads to maintenance nightmares where changing an API endpoint or authentication method requires hunting through dozens of files. When the API returns a 401 error, some components redirect to login, others show an alert, others silently fail—creating confusing user experiences.

A proper API architecture solves this through three layers: (1) **Base HTTP Client** configured with common settings (base URL, timeout, headers, authentication, interceptors), (2) **Service Layer** providing typed, domain-specific methods (UserService.getUser(), ProductService.searchProducts()) abstracting HTTP details, (3) **Integration Layer** connecting services to state management (Redux thunks, React Query, Vuex actions) handling loading/error states and caching.

Modern implementations use axios or fetch wrappers with **request interceptors** (automatically inject auth tokens, add request IDs, log requests, transform payloads) and **response interceptors** (handle 401 with token refresh, transform API formats to app formats, normalize error structures, implement exponential backoff retry). This middleware pattern ensures every request gets authenticated, logged, and error-handled consistently without manual code in each API call.

TypeScript integration elevates API services from simple wrappers to typed contracts. By defining interfaces for request/response data (interface User, interface CreateUserRequest), you get compile-time validation, autocomplete in IDEs, self-documenting code, and confidence that components consume correct data shapes. Generated types from OpenAPI/Swagger specs keep frontend and backend in sync automatically.

Performance optimization with API services includes: (1) **Request deduplication** preventing parallel identical requests (React Query, SWR), (2) **Response caching** storing frequently accessed data (cache-control headers, client-side LRU cache), (3) **Optimistic updates** showing UI changes before server confirms (instant perceived responsiveness), (4) **Batch operations** combining multiple requests into one (GraphQL, custom batch endpoints), (5) **Retry strategies** with exponential backoff for failed requests, (6) **Request cancellation** aborting outdated requests (AbortController) when user navigates away.

Testing API services becomes straightforward with centralized logic. Mock the base HTTP client once, and all service methods inherit mocked behavior. Use tools like MSW (Mock Service Worker) intercepting network requests at the network level for realistic integration tests, or simple jest.mock() for unit tests. Services return predictable promises making async testing with async/await or waitFor simple and reliable.

## Key Insight

API services are the bridge between your frontend and backend—your application's nervous system coordinating all data flow with consistency, error handling, and authentication built-in. Centralizing API logic into a structured client layer eliminates scattered fetch calls and creates a single source of truth for server communication. The result scales cleanly from simple CRUD operations to complex multi-service architectures.

## Code Examples

### Basic Example: Axios Client with Interceptors

Full working API client demonstrating request/response interceptors and service layer:

```javascript
// ===== apiClient.js =====
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;


// ===== UserService.js =====
import apiClient from './apiClient';

const UserService = {
  getUser(userId) {
    return apiClient.get(`/users/${userId}`);
  },
  
  getUsers(page = 1, limit = 10) {
    return apiClient.get('/users', { params: { page, limit } });
  },
  
  createUser(userData) {
    return apiClient.post('/users', userData);
  },
  
  updateUser(userId, userData) {
    return apiClient.put(`/users/${userId}`, userData);
  },
  
  deleteUser(userId) {
    return apiClient.delete(`/users/${userId}`);
  }
};

export default UserService;


// ===== Usage in Component =====
import { useState, useEffect } from 'react';
import UserService from './services/UserService';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    UserService.getUser(userId)
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Practical Example: TypeScript API Client with Token Refresh

Production-ready client with type safety and automatic token refresh:

```typescript
// ===== types.ts =====
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  total: number;
}


// ===== apiClient.ts =====
import axios, { AxiosInstance, AxiosError } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;
  
  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 15000
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && originalRequest) {
          if (!this.refreshPromise) {
            this.refreshPromise = this.refreshToken();
          }
          
          try {
            const newToken = await this.refreshPromise;
            this.refreshPromise = null;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch {
            this.logout();
          }
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  private async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await axios.post('/auth/refresh', { refreshToken });
    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
  }
  
  private logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
  
  get<T>(url: string, config = {}) {
    return this.client.get<T>(url, config);
  }
  
  post<T>(url: string, data?: any, config = {}) {
    return this.client.post<T>(url, data, config);
  }
}

export const apiClient = new ApiClient();


// ===== userService.ts =====
import { apiClient } from './apiClient';
import { User, CreateUserRequest, PaginatedResponse } from './types';

export const UserService = {
  async getUser(userId: number): Promise<User> {
    const { data } = await apiClient.get<User>(`/users/${userId}`);
    return data;
  },
  
  async getUsers(page = 1): Promise<PaginatedResponse<User>> {
    const { data } = await apiClient.get<PaginatedResponse<User>>('/users', {
      params: { page }
    });
    return data;
  },
  
  async createUser(userData: CreateUserRequest): Promise<User> {
    const { data } = await apiClient.post<User>('/users', userData);
    return data;
  }
};
```

### Advanced Example: React Query with Optimistic Updates

Modern approach using React Query for caching, background refetching, and optimistic UI:

```typescript
// ===== hooks/useUsers.ts =====
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../services/userService';
import { User, CreateUserRequest } from '../types';

export function useUsers(page = 1) {
  return useQuery({
    queryKey: ['users', page],
    queryFn: () => UserService.getUsers(page),
    staleTime: 5 * 60 * 1000,  // Fresh for 5 min
    keepPreviousData: true  // Show old data while fetching
  });
}

export function useUser(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => UserService.getUser(userId),
    enabled: !!userId
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: UserService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: Partial<User> }) =>
      UserService.updateUser(userId, data),
    
    // Optimistic update
    onMutate: async ({ userId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['user', userId] });
      
      const previous = queryClient.getQueryData<User>(['user', userId]);
      
      if (previous) {
        queryClient.setQueryData<User>(['user', userId], {
          ...previous,
          ...data
        });
      }
      
      return { previous };
    },
    
    // Rollback on error
    onError: (err, { userId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['user', userId], context.previous);
      }
    }
  });
}


// ===== Component Usage =====
function UsersList() {
  const { data, isLoading } = useUsers(1);
  const createUser = useCreateUser();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <button
        onClick={() => createUser.mutate({
          name: 'New User',
          email: 'user@example.com',
          password: '123456'
        })}
      >
        Create User
      </button>
      
      {data?.data.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}


// ===== Request Cancellation =====
function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const controller = new AbortController();
    
    const search = async () => {
      try {
        const { data } = await axios.get('/users/search', {
          params: { q: query },
          signal: controller.signal
        });
        setResults(data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error(err);
        }
      }
    };
    
    if (query) search();
    
    return () => controller.abort();  // Cancel on unmount or query change
  }, [query]);
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

## Common Mistakes

### 1. Making API Calls Directly in Components
**Mistake:** Scattering fetch calls without abstraction.

```jsx
// ❌ BAD
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`https://api.example.com/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
}
```

```jsx
// ✅ GOOD
function UserProfile({ userId }) {
  const { data: user, isLoading } = useUser(userId);
  if (isLoading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

**Why it matters:** Centralized services ensure consistent auth, error handling, and make testing trivial.

### 2. Ignoring Error Handling
**Mistake:** Not handling network/server errors.

```javascript
// ❌ BAD
const user = await UserService.getUser(1);
setUser(user);  // Crashes if API fails
```

```javascript
// ✅ GOOD
try {
  const user = await UserService.getUser(1);
  setUser(user);
} catch (error) {
  setError(error.message);
  console.error('Failed to fetch user:', error);
}
```

**Why it matters:** APIs fail. Handle errors gracefully to prevent crashes and inform users.

### 3. No Type Safety
**Mistake:** Using untyped responses.

```typescript
// ❌ BAD
const user = await apiClient.get('/users/1');
console.log(user.namee);  // Typo not caught
```

```typescript
// ✅ GOOD
const user = await apiClient.get<User>('/users/1');
console.log(user.name);  // Autocomplete works
```

**Why it matters:** Types catch errors at compile time and provide documentation.

## Quick Quiz

{% include quiz.html id="api-1"
   question="What is the primary purpose of request and response interceptors in an API client?"
   options="A|They replace the network transport layer, swapping HTTP for WebSocket or GraphQL on the fly depending on the endpoint;;B|They centralise cross-cutting concerns — attaching auth tokens, logging requests, normalising error shapes, transforming payloads, retrying on 401 with a refreshed token — so every call inherits that behaviour without each call site reimplementing it;;C|They are required by the HTTP spec for any request that uses cookies or custom headers, and skipping them causes browsers to block the request;;D|They are purely a performance optimisation that batches multiple requests into a single network call, with no effect on auth or error handling"
   correct="B"
   explanation="Interceptors are the one place that knows about auth headers, retry logic, and error normalisation — the rest of the codebase just calls api.get/api.post and inherits that behaviour for free." %}

{% include quiz.html id="api-2"
   question="Which HTTP method should be used for which REST operation?"
   options="A|GET for everything;;B|GET to read (safe, idempotent), POST to create (not idempotent), PUT to replace (idempotent), PATCH to partially update, DELETE to remove (idempotent);;C|POST for reads;;D|DELETE for updates"
   correct="B"
   explanation="Respecting method semantics makes APIs predictable, cacheable, and safe to retry. GET/PUT/DELETE are idempotent — safe to retry — POST is not." %}

{% include quiz.html id="api-3"
   question="Should API services contain business logic and application state?"
   options="A|No — API services should be thin, pure data-transport clients. Business logic and application state belong in the state layer (Redux/Saga/NgRx/Pinia). Keeping them separate makes the API layer reusable across stores and testable in isolation;;B|Yes — keep everything in one place;;C|Only for GraphQL;;D|Only Redux can wrap APIs"
   correct="A"
   explanation="When the API client is pure, swapping state management, testing with fakes, or reusing the client in a different app are all trivial." %}

{% include quiz.html id="api-4"
   question="What's the safest way to store and attach auth tokens client-side?"
   options="A|In a global variable on window;;B|Put tokens in the URL;;C|localStorage with a long expiry;;D|Prefer httpOnly, Secure, SameSite cookies for session tokens so JS can't read them (mitigating XSS). If you must use memory/storage, keep short-lived access tokens in memory and use a rotating refresh token via an httpOnly cookie. Always use HTTPS"
   correct="D"
   explanation="localStorage is XSS-readable; cookies with httpOnly+Secure+SameSite are the defence-in-depth default. Token rotation limits blast radius if one leaks." %}

{% include quiz.html id="api-5"
   question="How do REST, GraphQL, and WebSocket differ?"
   options="A|GraphQL has replaced REST;;B|REST is resource-oriented HTTP with multiple endpoints; GraphQL is a single endpoint where the client specifies exactly the fields it needs (reduces over-fetching/under-fetching); WebSocket is a persistent bidirectional connection for real-time pushes (chat, live updates). Pick per use case — they often coexist;;C|They are the same protocol;;D|WebSockets only work in Node"
   correct="B"
   explanation="REST wins for simple CRUD and cacheability, GraphQL for complex client-driven data needs, WebSockets (or SSE) for push — most large apps mix all three." %}

## References

- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Query Documentation](https://tanstack.com/query/latest)
- [REST API Best Practices](https://restfulapi.net/)

