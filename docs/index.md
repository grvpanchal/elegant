---
layout: home
title: Frontend Architecture Principles
---

<style>
.card-container {
  display: flex; /* Enables Flexbox layout */
  justify-content: space-between; /* Adds equal space between cards */
  padding: 1rem 0 2rem 0;
}

.card {
  flex: 0 1 calc(33.33% - 2em); /* Each card takes up one-third of the row minus spacing */
  box-shadow: 0px 0px 35px 0px rgba(154, 161, 171, 0.15); /* Optional styling */
  border-radius: 4px;
}

.text-item {
  flex: 0 1 calc(50% - 2em); /* Each card takes up one-third of the row minus spacing */
}


@media (max-width: 600px) {
  .card-container {
    flex-wrap: wrap;
  }
  .card, .text-item {
    flex: 0 1 100%;
    margin-bottom: 2rem;
  }
}


.card img {
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
}
.card h3 {
  margin: 0;
  padding: 0.5rem 1rem;
}

.card p {
  margin: 0;
  padding: 0.5rem 1rem 2rem;
}
</style>
<div class="card-container">
  <div class="text-item">
    <h1>What is Elegant?</h1>
    <p>
    Elegant is a command-line tool for building frontend architecture with a focus on UI and UX. This framework-independent tool lets you build sites using your preferred technology—whether React, Angular, Vue, or Web Components. It generates components following atomic design principles and handles state management through Redux, NgRx, or Pinia. The generated files are comprehensive, including essential props, events, responsive design, CRUD operations, unit tests, and Storybook documentation.
    </p>
  </div>
  <div class="text-item">
    <img style="width: 100%;" src="{{ '/assets/img/ui-server-state.png' | relative_url }}" />
  </div>
</div>

# Working with UI and UX

<div class="card-container">
  <div class="card">
    <img style="width: 100%;" src="{{ '/assets/img/ui-ux-designer.png' | relative_url }}" />
    <h3>Designer's perspective</h3>
    <p>UX handles analytical functions like research and wireframes, while UI focuses on visual design and aesthetics.</p>
  </div>
  <div class="card">
    <img style="width: 100%;" src="{{ '/assets/img/ui-ux-developer.png' | relative_url }}">
    <h3>Developer's Perspective</h3>
    <p>UX uses HTML and JavaScript for functionality, while UI relies on CSS for visual presentation.</p>
  </div>
  <div class="card">
    <img style="width: 100%;" src="{{ '/assets/img/ui-ux-enterprise.png' | relative_url }}">
    <h3>Enterprise Perspective</h3>
    <p>Frontend  architecture combines UI layer, web server operations, and state management for comprehensive application development.</p>
  </div>
</div>

# Development Process with Atomic Design

<img style="display: block; margin: 0 auto;" src="{{ '/assets/img/elegant-devlopment-flow.jpeg' | relative_url }}">
