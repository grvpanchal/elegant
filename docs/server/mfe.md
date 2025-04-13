---
title: Micro Frontend
layout: doc
slug: mfe
---

# Micro Frontend

Micro Frontends (MFE) is an architectural style that brings the principles of **microservices** to the world of frontend development. In this approach, a large frontend application is broken down into smaller, more manageable, independent units or **micro-apps**, each responsible for a specific feature or functionality.

Just like microservices, these frontend modules can be developed, deployed, and maintained independently, while being integrated into a cohesive application. The goal of MFE is to **decentralize** the frontend monolith and allow for a more scalable, flexible, and maintainable application.

## Key Concepts of Micro Frontends

- **Independent Deployment**: Each micro frontend can be deployed independently without affecting other parts of the application.
- **Decentralized Teams**: Different teams can work on different micro frontends, using the most suitable technology for their domain, without heavy inter-team coordination.
- **Technology Agnostic**: Micro Frontends can use different frameworks (e.g., React, Angular, Vue) or libraries based on the team's preference, and can be integrated into the same application.
- **Integration**: Micro Frontends can be integrated into a single application using various techniques, such as Web Components, JavaScript bundling, or iframe embedding.

## How Micro Frontends Work

Micro Frontends work by breaking down the user interface (UI) into isolated "micro-apps" that are responsible for different features or sections of the application. Each micro frontend is developed and deployed independently, but they are integrated into a container or shell application, which is responsible for assembling and rendering the complete UI.

### Key Steps:
1. **Domain Separation**: Each micro frontend is responsible for a specific domain, such as the user profile, shopping cart, or checkout.
2. **Integration**: Micro Frontends are integrated into a larger application shell that combines the individual micro-apps into a cohesive user interface.
3. **Routing and Communication**: Each micro frontend handles its own internal routing, and cross-component communication can be achieved via shared events, state, or APIs.

## Benefits of Micro Frontends

1. **Scalability**: Teams can work on different parts of the application independently, allowing the development of large applications by smaller, autonomous teams.
2. **Flexibility**: Teams can choose different technologies for different micro frontends, making it easier to experiment with new tools or migrate between technologies.
3. **Faster Development**: By decoupling the frontend, development cycles are faster, and features can be rolled out more quickly.
4. **Improved Maintainability**: Smaller, self-contained components are easier to maintain and update without affecting the entire application.

## Challenges of Micro Frontends

1. **Increased Complexity**: Micro Frontends introduce complexity in terms of integration, routing, and communication between modules, especially when teams use different technologies.
2. **Performance Overhead**: If not managed properly, integrating multiple micro frontends can lead to performance issues, particularly if multiple frameworks or libraries are used.
3. **UI Consistency**: Maintaining a consistent user interface and user experience across multiple micro frontends can be challenging, especially when teams work with different design systems or UI frameworks.
4. **Cross-Team Coordination**: Although teams can work independently, coordination is still required to ensure that micro frontends integrate seamlessly and maintain consistency.

## Approaches for Integrating Micro Frontends

Micro Frontends can be integrated into a single application using a variety of techniques. Here are some common approaches:

### 1. **Web Components**
   - Web Components are self-contained, reusable UI elements that can be used across different micro frontends. Each micro frontend is developed as a Web Component, which can then be integrated into the main application.

### 2. **Iframe Embedding**
   - Each micro frontend can be embedded into an iframe within the container application. This provides complete isolation, but may introduce performance concerns and challenges in communication between the iframe and the main app.

### 3. **JavaScript Bundling**
   - Micro frontends can be compiled into separate JavaScript files and dynamically loaded into the main application at runtime. This approach can help ensure that each micro frontend operates independently, but there may be challenges with managing dependencies.

### 4. **Single SPA**
   - [Single SPA](https://single-spa.js.org/) is a JavaScript framework that allows multiple micro frontends to coexist in a single-page application. It manages the routing and lifecycle of micro frontends, ensuring they work together seamlessly.

## Example of Micro Frontends in Action

Imagine an e-commerce platform with multiple sections, each developed by a different team:

- **Product Catalog**: Developed by Team A using React.
- **Shopping Cart**: Developed by Team B using Angular.
- **Checkout**: Developed by Team C using Vue.js.

These micro frontends are integrated into a larger container application that orchestrates their display and functionality, while allowing each team to independently deploy and update their section without affecting the others.

## When to Use Micro Frontends

Micro Frontends are particularly useful in the following scenarios:
- **Large Applications**: When working with large and complex applications that involve multiple teams.
- **Multiple Technologies**: When different teams prefer different frameworks or technologies.
- **Autonomous Teams**: When teams are autonomous and need the freedom to work independently without being blocked by others.
- **Scalable Development**: When an application needs to scale quickly, and having independent deployable units is beneficial.

## References

- [Micro Frontends: An Introduction](https://micro-frontends.org/)
- [Single SPA Documentation](https://single-spa.js.org/)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Basics](https://martinfowler.com/articles/micro-frontends.html)
- [Plugin](https://webpack.js.org/concepts/module-federation/)
- [MFE Next Gen](https://www.angulararchitects.io/en/blog/import-maps-the-next-evolution-step-for-micro-frontends-article/)