---
layout: home
title: Frontend Architecture Principles
---

{% include landing-proof.html %}

{% include landing-surfaces.html %}

<section style="max-width: 80rem; margin: 0 auto; padding: 1rem 1rem 2rem;">
  <h2 style="text-align: center;">Try a question right now</h2>
  <p style="text-align: center; color: #555; margin-top: 0;">
    No account, no setup. Edit the starter and press Run — the same tests grade you here and in every question.
  </p>
  {% include code-playground.html slug="action-creators" %}
  <p style="text-align: center; margin-top: 1rem;">
    <a class="btn" href="{{ '/practice/' | relative_url }}">See all questions</a>
  </p>
</section>

<hr style="max-width: 80rem; margin: 2rem auto;">

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

# Built with the Elegant CLI

<div class="card-container">
  <div class="text-item">
    <p>
    The questions here are built on <strong>Elegant</strong>, a command-line tool for frontend architecture with a focus on UI and UX. This framework-independent tool lets you scaffold sites using your preferred technology—whether React, Angular, Vue, or Web Components. It generates components following atomic design principles and handles state management through Redux, NgRx, or Pinia, with essential props, events, responsive design, CRUD operations, unit tests, and Storybook documentation.
    </p>
    <div class="flex">
      <div class="title">Elegant Architecture is</div>
      <div class="type-container">
        <div id="container">&nbsp;</div>
      </div>
    </div>
  </div>
  <div class="text-item">
    {% include begin-boilerplate.html %}
  </div>
</div>

# Working with UI and UX

<div class="card-container">
  <div class="card">
    <img style="width: 100%;" alt="A designer splitting work between UX research and wireframes on one side and visual design on the other" src="{{ '/assets/img/ui-ux-designer.png' | relative_url }}" />
    <h3>Designer's perspective</h3>
    <p>UX handles analytical functions like research and wireframes, while UI focuses on visual design and aesthetics.</p>
  </div>
  <div class="card">
    <img style="width: 100%;" alt="A developer's split of the same work: HTML and JavaScript for behaviour, CSS for presentation" src="{{ '/assets/img/ui-ux-developer.png' | relative_url }}">
    <h3>Developer's Perspective</h3>
    <p>UX uses HTML and JavaScript for functionality, while UI relies on CSS for visual presentation.</p>
  </div>
  <div class="card">
    <img style="width: 100%;" alt="An enterprise view combining the UI layer, web server operations and state management into one architecture" src="{{ '/assets/img/ui-ux-enterprise.png' | relative_url }}">
    <h3>Enterprise Perspective</h3>
    <p>Frontend  architecture combines UI layer, web server operations, and state management for comprehensive application development.</p>
  </div>
</div>

# Development Process with Atomic Design

<img style="display: block; margin: 0 auto;" alt="The AI-assisted software development lifecycle used by Elegant, from prompt through generated code to review" src="{{ '/assets/img/ai-sdlc-flow.png' | relative_url }}">
