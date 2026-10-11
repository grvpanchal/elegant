---
layout: home
title: Frontend Architecture Principles
---

<section id="harness" class="landing-section">
  <p class="landing-section__kicker">The harness</p>
  <h2 class="landing-section__title">One architecture, six boilerplates</h2>
  <p class="landing-section__lede">
    Every template <code>npx elegant</code> copies is the same three-layer shell over a different
    framework and store. Swap React for Angular, or Redux for Pinia, and the folder layout, the naming
    and the tests stay the same. The architecture is the thing you learn, not the framework.
  </p>
  <div class="landing-layers">
    <a class="landing-layer" href="{{ '/ui/' | relative_url }}">
      <span class="landing-layer__icon"><img src="{{ '/assets/img/logos/component.png' | relative_url }}" alt="Puzzle-piece icon for the UI layer" width="56" height="56"></span>
      <h3>UI</h3>
      <p>Atoms, molecules, organisms, skeletons and templates, each with a story, a style, a type and a test. Theming and responsive layout live here.</p>
      <span class="landing-layer__more">Explore the UI layer &rarr;</span>
    </a>
    <a class="landing-layer" href="{{ '/server/' | relative_url }}">
      <span class="landing-layer__icon"><img src="{{ '/assets/img/logos/ssr.png' | relative_url }}" alt="Browser-with-server icon for the server layer" width="56" height="56"></span>
      <h3>Server</h3>
      <p>Pages, containers and the app shell: routing, SSR and SSG, proxies and headers. Everything between the browser and the UI.</p>
      <span class="landing-layer__more">Explore the server layer &rarr;</span>
    </a>
    <a class="landing-layer" href="{{ '/state/' | relative_url }}">
      <span class="landing-layer__icon"><img src="{{ '/assets/img/logos/store.png' | relative_url }}" alt="Database icon for the state layer" width="56" height="56"></span>
      <h3>State</h3>
      <p>Actions, reducers, selectors and operations in one folder per feature, with Redux, Redux Toolkit, Saga, NgRx or Pinia behind the same shape.</p>
      <span class="landing-layer__more">Explore the state layer &rarr;</span>
    </a>
  </div>
</section>

<section class="landing-section">
  <p class="landing-section__kicker">Why three layers</p>
  <h2 class="landing-section__title">UI and UX mean different things to different people</h2>
  <p class="landing-section__lede">
    A designer, a developer and an enterprise each split the same work a different way. The harness
    splits the code the way all three already think about it.
  </p>
  <div class="landing-cards">
    <figure class="landing-card">
      <img alt="A designer splitting work between UX research and wireframes on one side and visual design on the other" src="{{ '/assets/img/ui-ux-designer.png' | relative_url }}" loading="lazy">
      <figcaption>
        <h3>Designer's perspective</h3>
        <p>UX handles analytical work like research and wireframes, while UI focuses on visual design and aesthetics.</p>
      </figcaption>
    </figure>
    <figure class="landing-card">
      <img alt="A developer's split of the same work: HTML and JavaScript for behaviour, CSS for presentation" src="{{ '/assets/img/ui-ux-developer.png' | relative_url }}" loading="lazy">
      <figcaption>
        <h3>Developer's perspective</h3>
        <p>UX uses HTML and JavaScript for behaviour, while UI relies on CSS for visual presentation.</p>
      </figcaption>
    </figure>
    <figure class="landing-card">
      <img alt="An enterprise view combining the UI layer, web server operations and state management into one architecture" src="{{ '/assets/img/ui-ux-enterprise.png' | relative_url }}" loading="lazy">
      <figcaption>
        <h3>Enterprise perspective</h3>
        <p>Frontend architecture combines the UI layer, web server operations and state management into one application.</p>
      </figcaption>
    </figure>
  </div>
</section>

<section class="landing-section">
  <p class="landing-section__kicker">How it is built</p>
  <h2 class="landing-section__title">From prompt to reviewed code</h2>
  <p class="landing-section__lede">
    The harness is built for an AI-assisted lifecycle: describe the component, generate it into the
    atomic layer it belongs to, run the tests and Storybook that came with it, then review. The
    <a href="{{ '/cli' | relative_url }}">CLI reference</a> lists every generator.
  </p>
  <figure class="landing-figure">
    <img alt="The AI-assisted software development lifecycle used by Elegant, from prompt through generated code to review" src="{{ '/assets/img/ai-sdlc-flow.png' | relative_url }}" loading="lazy">
  </figure>
</section>

<section id="practice" class="landing-band">
  <div class="landing-section">
    <p class="landing-section__kicker">The practice</p>
    <h2 class="landing-section__title">Now practise the terminology</h2>
    <p class="landing-section__lede">
      Every term the harness is built from is a page in the docs and a question in the bank. Pick a
      term, read it, then answer for it.
    </p>
    {% include landing-terms.html %}
    {% include landing-proof.html %}
  </div>
</section>

<section class="landing-section">
  <p class="landing-section__kicker">Try it</p>
  <h2 class="landing-section__title">Answer a question right now</h2>
  <p class="landing-section__lede">
    No account, no setup. Edit the starter and press Run. The same tests grade you here and in every question.
  </p>
  {% include code-playground.html slug="action-creators" %}
  <p class="landing-section__cta">
    <a class="landing-button" href="{{ '/practice/' | relative_url }}">See all questions &rarr;</a>
  </p>
</section>

<section class="landing-section">
  <p class="landing-section__kicker">Keep going</p>
  <h2 class="landing-section__title">Where to go from here</h2>
  <p class="landing-section__lede">
    Pick the surface that matches how you like to study, or read the
    <a href="{{ '/terminology' | relative_url }}">full glossary</a> first.
  </p>
  {% include landing-surfaces.html %}
</section>
