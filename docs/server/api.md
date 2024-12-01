---
title: API
layout: default
---

## API

### 1. API Client Base Approach

## Overview
The API Client Base Approach is a strategy to streamline and standardize the way frontend applications communicate with backend services. It involves creating a central API client that handles all HTTP requests, responses, and error handling. This approach enhances maintainability, reusability, and consistency across the application.

## Key Components

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
``` Javascript
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

``` Javascript
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

## References:

https://blog.postman.com/understanding-api-basics-beginners/
