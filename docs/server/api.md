---
title: API
layout: doc
slug: api
---

# API Services

## Key Insight

API services are the bridge between your frontend and backend—your application's nervous system coordinating all data flow with consistency, error handling, and authentication built-in. By centralizing API logic into a structured client layer, you eliminate scattered fetch calls, ensure predictable error handling, and create a single source of truth for all server communication that scales from simple CRUD operations to complex multi-service architectures.

## Detailed Description

API services transform chaotic, duplicated data fetching into an organized, maintainable architecture. Instead of scattering `fetch()` calls throughout your codebase with inconsistent error handling and duplicated authentication logic, a well-designed API layer centralizes all server communication into reusable service modules with consistent patterns for requests, responses, errors, caching, and retry logic.

The fundamental problem: in applications without structured API services, every component making network requests reinvents the wheel—manually adding authorization headers, handling loading states, parsing errors differently, implementing retry logic inconsistently. This leads to maintenance nightmares where changing an API endpoint or authentication method requires hunting through dozens of files. When the API returns a 401 error, some components redirect to login, others show an alert, others silently fail—creating confusing user experiences.

A proper API architecture solves this through three layers: (1) **Base HTTP Client** configured with common settings (base URL, timeout, headers, authentication, interceptors), (2) **Service Layer** providing typed, domain-specific methods (UserService.getUser(), ProductService.searchProducts()) abstracting HTTP details, (3) **Integration Layer** connecting services to state management (Redux thunks, React Query, Vuex actions) handling loading/error states and caching.

Modern implementations use axios or fetch wrappers with **request interceptors** (automatically inject auth tokens, add request IDs, log requests, transform payloads) and **response interceptors** (handle 401 with token refresh, transform API formats to app formats, normalize error structures, implement exponential backoff retry). This middleware pattern ensures every request gets authenticated, logged, and error-handled consistently without manual code in each API call.

TypeScript integration elevates API services from simple wrappers to typed contracts. By defining interfaces for request/response data (interface User, interface CreateUserRequest), you get compile-time validation, autocomplete in IDEs, self-documenting code, and confidence that components consume correct data shapes. Generated types from OpenAPI/Swagger specs keep frontend and backend in sync automatically.

Performance optimization with API services includes: (1) **Request deduplication** preventing parallel identical requests (React Query, SWR), (2) **Response caching** storing frequently accessed data (cache-control headers, client-side LRU cache), (3) **Optimistic updates** showing UI changes before server confirms (instant perceived responsiveness), (4) **Batch operations** combining multiple requests into one (GraphQL, custom batch endpoints), (5) **Retry strategies** with exponential backoff for failed requests, (6) **Request cancellation** aborting outdated requests (AbortController) when user navigates away.

Testing API services becomes straightforward with centralized logic. Mock the base HTTP client once, and all service methods inherit mocked behavior. Use tools like MSW (Mock Service Worker) intercepting network requests at the network level for realistic integration tests, or simple jest.mock() for unit tests. Services return predictable promises making async testing with async/await or waitFor simple and reliable.

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

<details>
<summary><strong>Question 1:</strong> What is the purpose of request/response interceptors?</summary>

**Answer:** Interceptors provide centralized middleware:
- **Request:** Add auth tokens, log requests, modify headers
- **Response:** Handle 401/500, refresh tokens, normalize errors

Eliminates duplication and ensures consistency.
</details>

<details>
<summary><strong>Question 2:</strong> REST HTTP methods and their purposes?</summary>

**Answer:**
- **GET:** Retrieve data (idempotent, cacheable)
- **POST:** Create resources
- **PUT/PATCH:** Update resources (PUT = full, PATCH = partial)
- **DELETE:** Remove resources

Understanding semantics affects caching and browser behavior.
</details>

<details>
<summary><strong>Question 3:</strong> Should API services contain business logic?</summary>

**Answer:** **No.** Services handle HTTP only:
- Making requests
- Transforming data
- Network errors

Business logic belongs in stores/containers.

This separation makes services reusable.
</details>

<details>
<summary><strong>Question 4:</strong> How to handle authentication tokens?</summary>

**Answer:** Use request interceptors:

```javascript
apiClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

Handle refresh in response interceptor for 401 errors.
</details>

<details>
<summary><strong>Question 5:</strong> REST vs GraphQL vs WebSocket?</summary>

**Answer:**
- **REST:** Multiple endpoints, fixed responses, request-response
- **GraphQL:** Single endpoint, client specifies data, solves over-fetching
- **WebSocket:** Persistent connection, real-time bidirectional

Choose based on use case (CRUD → REST, complex data → GraphQL, real-time → WebSocket).
</details>

## References

### 1. **API Client Base**
- A central module that handles all API requests.
- Utilizes HTTP client libraries like `axios` or the Fetch API.
- Manages common configurations such as base URLs, headers, and authentication tokens.

### 2. **Service Layer**
- Abstraction layer that defines methods for various API endpoints.
- Each service corresponds to a specific backend resource (e.g., UserService, ProductService).

### 3. **Request Interceptors**
- Functions that modify requests before they are sent to the server.
- Can add authorization headers, log requests, or modify request payloads.

### 4. **Response Interceptors**
- Functions that handle responses after they are received but before they are processed by the application.
- Can handle common response status codes, refresh tokens, or log responses.

### 5. **Error Handling**
- Centralized error handling mechanism.
- Can display user-friendly error messages, retry failed requests, or log errors.

## Benefits

- **Consistency**: Centralizing API interactions ensures consistent handling of requests and responses.
- **Reusability**: Common logic for API calls can be reused across different parts of the application.
- **Maintainability**: Easier to update and maintain API-related code in a single place.
- **Scalability**: Simplifies the process of adding new API endpoints and services.

## Example Implementation

### API Client (using axios)

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (e.g., 401 Unauthorized)
    if (error.response.status === 401) {
      // Redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Service layer
```javascript
import apiClient from './apiClient';

const UserService = {
  getUser(userId) {
    return apiClient.get(`/users/${userId}`);
  },
  createUser(userData) {
    return apiClient.post('/users', userData);
  },
  updateUser(userId, userData) {
    return apiClient.put(`/users/${userId}`, userData);
  },
  deleteUser(userId) {
    return apiClient.delete(`/users/${userId}`);
  },
};

export default UserService;
```

### Usage in component

```jsx
import React, { useEffect, useState } from 'react';
import UserService from './services/UserService';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    UserService.getUser(userId)
      .then((response) => setUser(response.data))
      .catch((error) => console.error(error));
  }, [userId]);

  return user ? (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default UserProfile;
```


### 2. REST Processes

## Overview
REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on stateless, client-server communication, often using HTTP. In frontend architecture, RESTful APIs provide a standard way to interact with backend services, enabling the frontend to perform CRUD (Create, Read, Update, Delete) operations.

## Key REST Processes

### 1. **GET**
- **Purpose**: Retrieve data from the server.
- **Usage**: Used to fetch resources such as user data, product lists, etc.

### 2. **POST**
- **Purpose**: Send data to the server to create a new resource.
- **Usage**: Used for actions like user registration, adding new items, etc.

### 2. **PUT**
- **Purpose**: Update an existing resource on the server.
- **Usage**: Used for actions like updating user information, modifying items, etc.


### 2. **DELETE**
- **Purpose**: Remove a resource from the server.
- **Usage**: Used for actions like deleting user accounts, removing items, etc.

## Types of web-based APIs

### 1. REST-based APIs
A data-driven architectural style of API development, REST (Representational State Transfer) is one of the most lucrative categories of web-based APIs. Based on Uniform Resource Identifiers (URIs) and HTTP protocol, REST-based APIs use JSON for data formatting which is considered to be browser-compatible.

REST-based APIs are extremely simple when it comes to building and scaling as compared to other types of APIs. When these types of APIs are put to action, they help facilitate client-server communications with ease and smoothness. Because REST-based APIs are simple, they can be the perfect APIs for beginners.

### 2. SOAP-based APIs
As compared to its peers, SOAP-based APIs (Simple Object Access Protocol) can be viewed as quite complex in terms of use. These APIs use a type of protocol known as Simple Object Access Protocol, which is a common communication protocol. This helps them in providing higher levels of security and makes them better at accuracy as compared with the REST-based APIs in the way messages are exchanged.

### 3. GraphQL-based APIs
GraphQL is one of the most advanced sets of web-based APIs where open-source data query and manipulation language is used. This makes it easier for forming a definitive pathway for the runtime that plays a vital role in fulfilling queries with the pre-existing data.

Although it is well known that GraphQL and REST APIs both use the same set of APIs, the major thing that differentiates them is the interface: a single interface-id is put to use by GraphQL when it comes to organizing data into the format of a graph.

### 4. XML-RPC
XML-RPC (Extensible Markup Language-Remote Procedure Call) can be described as another type of API protocol, which differentiates itself in terms of information security and the use of XML format that is specifically designed for transferring data. When compared to SOAP-based APIs, the XML-RPC protocols are easier and much simpler to use since they use minimum bandwidth.

### 5. WebSocket
A two-way interactive communication session between the user’s browser and a server can be made smoother and faster with the help of an organized set of APIs known as WebSockets. WebSocket APIs play a vital role in helping receive event-driven responses, and they also help in easier management of sending messages to a server. Plus, the entire process involving this doesn’t even require having to poll the server in order to receive a reply.
## Common Mistakes

### 1. Making API Calls Directly in Components
**Mistake:** Scattering `fetch()` or `axios` calls throughout components without abstraction.

```jsx
// ❌ BAD: Direct API calls in components
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://api.example.com/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
};
```

```jsx
// ✅ GOOD: Centralized API service
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    UserService.getUser(userId)
      .then(response => setUser(response.data))
      .catch(handleError);
  }, [userId]);
};
```

**Why it matters:** Direct calls duplicate configuration logic, make testing difficult, and create maintenance nightmares when API endpoints or authentication methods change.

### 2. Ignoring Error Handling Consistency
**Mistake:** Handling errors differently in every API call.

```javascript
// ❌ BAD: Inconsistent error handling
fetch('/api/users').then(...).catch(err => console.log(err));
fetch('/api/posts').then(...).catch(err => alert(err.message));
fetch('/api/comments').then(...).catch(err => showToast(err));
```

```javascript
// ✅ GOOD: Centralized error interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      redirectToLogin();
    } else if (error.response?.status >= 500) {
      showErrorToast('Server error. Please try again.');
    }
    return Promise.reject(error);
  }
);
```

**Why it matters:** Centralized error handling ensures consistent user experience and makes it easy to add global behaviors like retry logic or offline detection.

### 3. Not Using TypeScript Interfaces for API Responses
**Mistake:** Working with untyped API responses.

```typescript
// ❌ BAD: No type safety
const UserService = {
  getUser(id) {
    return apiClient.get(`/users/${id}`);
  }
};

// Usage - no autocomplete, no type checking
const user = await UserService.getUser(1);
console.log(user.namee); // Typo not caught
```

```typescript
// ✅ GOOD: Typed responses
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const UserService = {
  getUser(id: number): Promise<AxiosResponse<User>> {
    return apiClient.get<User>(`/users/${id}`);
  }
};

// Usage - full type safety
const response = await UserService.getUser(1);
const user = response.data; // Type: User
console.log(user.name); // Autocomplete works!
```

**Why it matters:** Type safety catches errors at compile time, provides autocomplete, and serves as documentation for API contracts.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What is the primary purpose of request and response interceptors in an API client?</summary>

**Answer:** Interceptors provide centralized middleware for all API requests/responses to:
- **Request interceptors:** Add authentication tokens, modify headers, log requests, transform payloads
- **Response interceptors:** Handle common status codes (401, 500), refresh tokens, transform data, log responses

**Example:** Instead of adding `Authorization` header in every API call, a request interceptor adds it once for all requests automatically.

**Why it matters:** Interceptors eliminate code duplication, enforce consistent patterns (auth, logging, error handling), and provide a single place to modify all API behavior.
</details>

<details>
<summary><strong>Question 2:</strong> What are the four main HTTP methods used in RESTful APIs and their purposes?</summary>

**Answer:**
1. **GET** - Retrieve/read resources (fetching user data, product lists)
2. **POST** - Create new resources (user registration, creating posts)
3. **PUT/PATCH** - Update existing resources (editing profile, updating settings)
4. **DELETE** - Remove resources (deleting account, removing items)

**REST principle:** These methods are idempotent (except POST), meaning multiple identical requests produce the same result.

**Why it matters:** Understanding REST semantics ensures you use the right method for each operation, which affects caching, browser behavior, and API design.
</details>

<details>
<summary><strong>Question 3:</strong> True or False: API services should contain business logic and state management.</summary>

**Answer:** **False.** API services should focus solely on server communication:
- Making HTTP requests
- Transforming request/response data
- Handling network-level errors

Business logic belongs in:
- **Store/State management** - Redux reducers, Vuex mutations
- **Containers** - Components that orchestrate data flow
- **Domain logic layers** - Separate business rules modules

**Example:**
```javascript
// ❌ BAD: Business logic in API service
UserService.createUser = async (userData) => {
  if (userData.age < 18) throw new Error('Too young');
  const response = await apiClient.post('/users', userData);
  store.dispatch(addUser(response.data)); // State management
  return response;
};

// ✅ GOOD: Pure API communication
UserService.createUser = (userData) => {
  return apiClient.post('/users', userData);
};
```

**Why it matters:** Separation of concerns makes API services reusable across different state management patterns and easier to test in isolation.
</details>

<details>
<summary><strong>Question 4:</strong> How should you handle authentication tokens in an API client?</summary>

**Answer:** Use request interceptors to inject tokens automatically:

```javascript
// ✅ Best practice
apiClient.interceptors.request.use(config => {
  const token = getAuthToken(); // From localStorage, cookie, or state
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const newToken = await refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(error.config); // Retry original request
    }
    return Promise.reject(error);
  }
);
```

**Avoid:** Adding tokens manually to each request or storing them in component state.

**Why it matters:** Centralized token management ensures all requests are authenticated, handles token refresh transparently, and prevents security issues from forgetting to add tokens.
</details>

<details>
<summary><strong>Question 5:</strong> What's the difference between REST, GraphQL, and WebSocket APIs?</summary>

**Answer:**

**REST:**
- Multiple endpoints (e.g., `/users`, `/posts`)
- Fixed response structures
- Request-response pattern
- **Use when:** Standard CRUD operations, caching important, simple data fetching

**GraphQL:**
- Single endpoint
- Client specifies exact data needed
- Solves over-fetching/under-fetching
- **Use when:** Complex data requirements, mobile apps needing bandwidth optimization

**WebSocket:**
- Persistent bidirectional connection
- Real-time data push from server
- Event-driven
- **Use when:** Chat applications, live updates, collaborative editing

**Example decision matrix:**
- Todo app → REST
- Social media feed → GraphQL (complex, nested data)
- Live chat → WebSocket

**Why it matters:** Choosing the right API pattern affects performance, complexity, and development speed. The Universal Frontend Architecture supports all three through abstracted service layers.
</details>
## References

- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Query Documentation](https://tanstack.com/query/latest)
- [REST API Best Practices](https://restfulapi.net/)

