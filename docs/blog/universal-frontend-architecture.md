---
title: Universal Frontend Architecture
layout: default
---
# Universal Frontend Architecture
<style>
  @media (min-width: 1600px) {
    .arch-img {
      position: relative;
      left: -400px;
      width: 1600px;
      display: block;
      max-width: initial !important;
      margin-bottom: 50px;
      z-index: -1;
    }
  }
</style>
<img src="/assets/img/diagrams/fe-segregation-all.png" class="arch-img" alt="Univeral Frontend Architecture with SSR"/>
The image illustrates a **Universal Frontend Architecture** that organizes the frontend development process into three main sections: **UI System**, **Server**, and **State**, with a separate **Build** module for deployment. Below is a breakdown of each section:

---

## UI System
The UI System focuses on building the user interface components in a modular and hierarchical manner:

- **Atoms**: These are the smallest building blocks of the UI, such as buttons, inputs, or icons.
- **Molecules**: Groups of atoms combined to form more complex components, like input fields with labels or buttons with icons.
- **Organisms**: Larger components formed by combining molecules, such as navigation bars or forms. These organisms are responsive and accessible.
- **Skeleton**: Placeholder UI components used during loading states.
- **Template**: Defines the structure and layout of pages by arranging organisms.
- **Theme Provider**: Manages styling and themes across the application.

---

## Server
The server section handles rendering logic and backend interaction:

- **Providers**:
  - *Form/Links/Image Localization Module*: Handles dynamic content like forms, links, and localized images.
  - *Route Provider*: Manages routing within the application.
  - *Auth Provider*: Handles authentication-related functionalities.
  - *Common Provider*: Serves shared functionalities across modules.
  
- **Containers**: Wraps components to manage data flow (e.g., props) between UI elements and state.

- **Rendering Modules**:
  - *SSR Module*: Server-Side Rendering for pre-rendering pages on the server before sending them to the client.
  - *SSG Module*: Static Site Generation for building static HTML files during build time.

- **App Shell**: Provides a lightweight framework to load essential parts of the app quickly.

- **Frontend Side Headers**:
  - *PWA*: Progressive Web App capabilities for offline use and enhanced performance.
  - *SEO*: Search Engine Optimization elements for better visibility.
  - *Protocol/Security*: Ensures secure communication protocols.

---

## State
The state section manages application data flow and logic:

- **Store**: Centralized state management system (e.g., Redux).
- **Reducer/Controller**: Handles state updates based on dispatched actions.
- **Actions & Action Types**: Define events that trigger state changes.
- **Selectors**: Extract specific pieces of state for use in components.
- **Middleware**:
  - *Async Operations*: Handles asynchronous tasks like API calls.
  - *Personalization*: Customizes user experience based on preferences or data.
  - *Analytics*: Tracks user interactions and app performance metrics.
  - *Localization*: Supports multiple languages and regional settings.

---

## Build
The build section compiles the application into deployable assets:

- Outputs include:
  - `style.css` (CSS files for styling)
  - `main.js` (JavaScript files for functionality)
  - `sw.js` (Service Worker scripts)
  - `index.html/static-page.html` (HTML files for rendering).

These files are bundled together for deployment to production environments.

---

This architecture ensures modularity, scalability, and maintainability in frontend development while supporting both dynamic and static rendering approaches.