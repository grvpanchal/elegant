---
layout: home
title: Frontend Architecture Principles
---

<section id="harness" class="landing-section">
  <p class="landing-section__kicker">The harness</p>
  <h2 class="landing-section__title">One architecture, six boilerplates</h2>
  <p class="landing-section__lede">
    Every template <code>npx elegant</code> copies is the same three-layer shell — UI, server, state —
    over a different framework and store. Swap React for Angular, or Redux for Pinia, and the folder
    layout, the naming and the tests stay the same. That is the point: the architecture is the thing you learn, not the framework.
  </p>
  <div class="landing-layers">
    <a class="landing-layer" href="{{ '/ui' | relative_url }}">
      <h3>UI</h3>
      <p>Atoms, molecules, organisms, skeletons and templates, each with a story, a style, a type and a test. Theming and responsive layout live here.</p>
      <span class="landing-layer__more">UI terminology &rarr;</span>
    </a>
    <a class="landing-layer" href="{{ '/server' | relative_url }}">
      <h3>Server</h3>
      <p>Pages, containers and the app shell: routing, SSR and SSG, proxies and headers — everything between the browser and the UI.</p>
      <span class="landing-layer__more">Server terminology &rarr;</span>
    </a>
    <a class="landing-layer" href="{{ '/state' | relative_url }}">
      <h3>State</h3>
      <p>Actions, reducers, selectors and operations in one folder per feature — Redux, Redux Toolkit, Saga, NgRx or Pinia behind the same shape.</p>
      <span class="landing-layer__more">State terminology &rarr;</span>
    </a>
  </div>
</section>

<section class="landing-section">
  <h2 class="landing-section__title">Why UI, server and state</h2>
  <p class="landing-section__lede">
    UI and UX mean different things to a designer, a developer and an enterprise. The harness splits the
    code the way all three already think about it.
  </p>
  <div class="landing-cards">
    <div class="landing-card">
      <img alt="A designer splitting work between UX research and wireframes on one side and visual design on the other" src="{{ '/assets/img/ui-ux-designer.png' | relative_url }}" />
      <h3>Designer's perspective</h3>
      <p>UX handles analytical functions like research and wireframes, while UI focuses on visual design and aesthetics.</p>
    </div>
    <div class="landing-card">
      <img alt="A developer's split of the same work: HTML and JavaScript for behaviour, CSS for presentation" src="{{ '/assets/img/ui-ux-developer.png' | relative_url }}">
      <h3>Developer's perspective</h3>
      <p>UX uses HTML and JavaScript for functionality, while UI relies on CSS for visual presentation.</p>
    </div>
    <div class="landing-card">
      <img alt="An enterprise view combining the UI layer, web server operations and state management into one architecture" src="{{ '/assets/img/ui-ux-enterprise.png' | relative_url }}">
      <h3>Enterprise perspective</h3>
      <p>Frontend architecture combines the UI layer, web server operations and state management into one application.</p>
    </div>
  </div>
</section>

<section class="landing-section">
  <h2 class="landing-section__title">From prompt to reviewed code</h2>
  <p class="landing-section__lede">
    The harness is built for an AI-assisted lifecycle: describe the component, generate it into the atomic
    layer it belongs to, run the tests and Storybook that came with it, then review. The
    <a href="{{ '/cli' | relative_url }}">CLI reference</a> lists every generator.
  </p>
  <img class="landing-figure" alt="The AI-assisted software development lifecycle used by Elegant, from prompt through generated code to review" src="{{ '/assets/img/ai-sdlc-flow.png' | relative_url }}">
</section>

<hr class="landing-divider">

<section id="practice" class="landing-section landing-section--practice">
  <p class="landing-section__kicker">The practice</p>
  <h2 class="landing-section__title">Now practise the terminology</h2>
  <p class="landing-section__lede">
    Every term the harness is built from — atom, container, selector, hydration, skeleton — is a page in
    the docs and a question in the bank. Read the term, then answer for it: quizzes, coding challenges
    graded in the browser, UI coding, system design and agent-harness exercises.
  </p>
  {% include landing-proof.html %}
</section>

<section class="landing-section">
  <h2 class="landing-section__title">Try a question right now</h2>
  <p class="landing-section__lede">
    No account, no setup. Edit the starter and press Run — the same tests grade you here and in every question.
  </p>
  {% include code-playground.html slug="action-creators" %}
  <p class="landing-section__cta">
    <a class="btn" href="{{ '/practice/' | relative_url }}">See all questions</a>
  </p>
</section>

<section class="landing-section">
  <h2 class="landing-section__title">Where to go from here</h2>
  <p class="landing-section__lede">
    Start with the terms, then pick the surface that matches how you like to study.
  </p>
  <div class="landing-terms">
    <a href="{{ '/ui' | relative_url }}">UI terms</a>
    <a href="{{ '/server' | relative_url }}">Server terms</a>
    <a href="{{ '/state' | relative_url }}">State terms</a>
    <a href="{{ '/terminology' | relative_url }}">Full glossary</a>
  </div>
  {% include landing-surfaces.html %}
</section>
