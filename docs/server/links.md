---
title: Links
layout: doc
slug: links
---
# Link Navigation

The **Universal Link Component** (ULC) is a flexible and reusable module designed to handle URL routing, dynamic links, and deep linking in web applications. This component is framework-agnostic and can be integrated into various frontend frameworks like **React**, **Angular**, and **Vue**. It provides a unified approach to manage navigation, handle parameterized routes, and ensure proper handling of external and app-based links.

---

## Features

- **Routing Management**: Handles internal URL routing, including query parameters, hash fragments, and route parameters.
- **Dynamic Linking**: Supports links with dynamic parameters and data-driven navigation.
- **Deep Linking Support**: Allows for direct navigation to specific sections of the application, including handling deep links from mobile apps or external services.
- **Linking Across Frameworks**: Works seamlessly across React, Angular, and Vue, providing a consistent API.
- **SEO-friendly**: Ensures that deep links are crawlable by search engines.
- **Error Handling**: Manages 404s or invalid links gracefully.

---

## Use Cases

- **Internal Routing**: Navigating between different pages or sections of the web app using internal links.
- **Dynamic Routes**: Linking to pages with dynamic parameters (e.g., user profiles or product pages).
- **App Deep Linking**: Handling links that point to specific content or features within a mobile app or website (e.g., linking directly to a user’s dashboard or a specific article).
- **External Linking**: Creating links to external resources (e.g., social media, external websites).

---

## Components & API

The Universal Link Component provides a set of APIs and functions for integrating links across different parts of the application. The core functionality typically includes:

- **`Link` Component**: A reusable component for creating links.
- **`useNavigate()` Hook (or equivalent)**: A hook to programmatically navigate between pages.
- **`useRouteParams()`**: A hook to access route parameters.
- **`LinkHandler`**: Handles complex link scenarios, such as deep linking.

---

### 1. **Link Component**

The **`Link`** component is responsible for rendering anchor tags (`<a>`) and enabling internal routing, with the ability to support dynamic links.

#### Usage

- **React**: The `Link` component can wrap navigation logic and handle internal links.
- **Vue**: Use `v-bind:href` to dynamically bind URLs.
- **Angular**: Use the `routerLink` directive to generate internal links.

#### Example (React):

```jsx
import { Link } from 'react-router-dom'; // or a custom routing library

function MyComponent() {
  return (
    <div>
      <Link to="/profile/123">Go to Profile</Link>
    </div>
  );
}
```

#### Example (Vue):

```html
<template>
  <div>
    <router-link :to="'/profile/' + userId">Go to Profile</router-link>
  </div>
</template>
```

#### Example (Angular):

```html
<a [routerLink]="['/profile', userId]">Go to Profile</a>
```

### 2. **useNavigate() / navigate()**

This hook (or equivalent function in Angular/Vue) is used for programmatically navigating between routes. It allows you to perform navigation without relying on traditional `<Link>` components.

#### React Example (with `useNavigate`):

```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const goToProfile = () => {
    navigate('/profile/123');
  };

  return (
    <button onClick={goToProfile}>Go to Profile</button>
  );
}
```

#### Vue Example (with `this.$router.push`):

```javascript
methods: {
  goToProfile() {
    this.$router.push('/profile/123');
  }
}
```

#### Angular Example (with `Router`):

```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

goToProfile() {
  this.router.navigate(['/profile', 123]);
}
```

### 3. **useRouteParams()**

This hook (or its equivalent in other frameworks) is used to access dynamic route parameters from the URL.

#### React Example (with `useParams`):

```jsx
import { useParams } from 'react-router-dom';

function Profile() {
  const { userId } = useParams(); // Assuming route is '/profile/:userId'
  
  return <div>Profile of user {userId}</div>;
}
```

#### Vue Example (with `this.$route.params`):

```javascript
computed: {
  userId() {
    return this.$route.params.userId;
  }
}
```

#### Angular Example (with ActivatedRoute):

```typescript
import { ActivatedRoute } from '@angular/router';

constructor(private route: ActivatedRoute) {}

ngOnInit() {
  this.route.params.subscribe(params => {
    const userId = params['userId']; // Assuming route is '/profile/:userId'
  });
}
```

---

## Key Functionalities

### 1. **Dynamic Routes**

Dynamic routes allow for URLs with variable parameters. For instance, a user profile page might be accessed at `/profile/:userId`, where `userId` is dynamic.

- **React Example**: 
  - Route Definition:
    ```jsx
    <Route path="/profile/:userId" element={<Profile />} />
    ```
  - Link:
    ```jsx
    <Link to={`/profile/${userId}`}>Go to Profile</Link>
    ```

- **Vue Example**:
  - Route Definition:
    ```javascript
    const routes = [
      { path: '/profile/:userId', component: Profile }
    ]
    ```
  - Link:
    ```html
    <router-link :to="'/profile/' + userId">Go to Profile</router-link>
    ```

- **Angular Example**:
  - Route Definition:
    ```typescript
    const routes: Routes = [
      { path: 'profile/:userId', component: ProfileComponent }
    ];
    ```
  - Link:
    ```html
    <a [routerLink]="['/profile', userId]">Go to Profile</a>
    ```

### 2. **Deep Linking**

Deep linking refers to links that direct users to specific content or views within an application, even from an external link or mobile app.

For example, a deep link like `myapp://profile/123` can be handled by the app to open a specific user profile page.

- **React Example**: 
    You can use deep links alongside custom schemes like `myapp://profile/123` with URL handling.
    ```jsx
    window.location.href = 'myapp://profile/123';  // This will trigger app deep linking logic.
    ```

- **Vue Example**: 
    ```javascript
    window.location.href = 'myapp://profile/123';
    ```

- **Angular Example**:
    ```typescript
    window.location.href = 'myapp://profile/123';
    ```

### 3. **SEO-friendly URLs**

The Universal Link Component should ensure that links are accessible and crawlable by search engines, including static routes and dynamically generated URLs. Use tools like **React Helmet**, **Vue Meta**, or **Angular Meta** to manage metadata for better SEO.

---

## Error Handling

Handling broken or invalid links gracefully is essential for a good user experience.

- **React**: Handle with a `<Route>` fallback or a `404` page.
- **Vue**: Use Vue Router's `*` wildcard for unmatched routes.
- **Angular**: Define a wildcard route that handles unknown paths.

### Example (React - 404 Route):
```jsx
<Route path="*" element={<NotFound />} />
```

### Example (Vue - 404 Route):
```javascript
const routes = [
  { path: '*', component: NotFound }
]
```

### Example (Angular - 404 Route):
```typescript
const routes: Routes = [
  { path: '**', component: NotFoundComponent }
];
```

---

## Configuration and Customization

The Universal Link Component is highly configurable to adapt to different routing strategies and needs:

- **Custom Link Handler**: Allows customizing how links are handled across frameworks (e.g., for mobile deep linking).
- **Route Guards**: Protect routes based on user authentication or roles.
- **Error Pages**: Customize error pages for broken or unauthorized links.

### Example (Custom Route Handler):
```jsx
<Link to={`/profile/${userId}`} onClick={customLinkHandler}>Go to Profile</Link>
```

## References
- https://mattburgess.medium.com/framework-routers-and-linking-98398af89022
