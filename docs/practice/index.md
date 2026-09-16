---
title: Practice
layout: default
slug: practice
description: The Frontend AI Harness question bank — quiz, coding, UI coding, system design and agent-harness practice across the UI, Server and State layers.
---

<h1>Question bank</h1>

<p class="practice-lede">
Every question is one file, one Agent Skill and one measurable outcome. Coding
questions run in the browser against the same tests the build runs under Node,
so "it passes" means the same thing here, in CI, and to an agent working on
your repository.
</p>

{% include progress-tracker.html all=true title="Question bank" reset=true %}

<form class="practice-filters" role="search" aria-label="Filter questions" onsubmit="return false;">
  <label class="practice-filters__field">
    <span>Search</span>
    <input type="search" data-search placeholder="binary search, hydration, selector…">
  </label>
  <label class="practice-filters__field">
    <span>Format</span>
    <select data-filter="format">
      <option value="">All formats</option>
      <option value="quiz">Quiz</option>
      <option value="coding">Coding</option>
      <option value="ui-coding">UI coding</option>
      <option value="system-design">System design</option>
      <option value="harness">Agent harness</option>
    </select>
  </label>
  <label class="practice-filters__field">
    <span>Difficulty</span>
    <select data-filter="difficulty">
      <option value="">Any difficulty</option>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>
  </label>
  <label class="practice-filters__field">
    <span>Layer</span>
    <select data-filter="layer">
      <option value="">All layers</option>
      <option value="ui">UI</option>
      <option value="server">Server</option>
      <option value="state">State</option>
    </select>
  </label>
  <label class="practice-filters__field">
    <span>Topic</span>
    <select data-filter="topic">
      <option value="">All topics</option>
      {%- assign all_topics = site.data.questions | map: "topics" | join: "," | split: "," | uniq | sort -%}
      {%- for t in all_topics -%}
      {%- if t != "" %}<option value="{{ t }}">{{ t }}</option>{% endif -%}
      {%- endfor -%}
    </select>
  </label>
  <button type="button" class="practice-filters__clear" data-filter-clear>Clear</button>
  <output class="practice-filters__count" data-question-count>{{ site.data.questions | size }} questions</output>
</form>

<ul class="question-list" data-question-list>
  {%- for q in site.data.questions -%}
  <li class="question-row"
      data-question
      data-slug="{{ q.slug }}"
      data-format="{{ q.format }}"
      data-difficulty="{{ q.difficulty }}"
      data-layer="{{ q.layer }}"
      data-topic="{{ q.topics | join: ' ' }}"
      data-searchtext="{{ q.title | downcase }} {{ q.summary | downcase }} {{ q.topics | join: ' ' | downcase }} {{ q.skill }}">
    <label class="question-row__check">
      <input type="checkbox" data-progress-toggle="{{ q.slug }}">
      <span class="sr-only">Mark {{ q.title }} done</span>
    </label>
    <a class="question-row__link" href="{{ '/practice/' | append: q.slug | append: '.html' | relative_url }}">{{ q.title }}</a>
    <span class="question-row__meta">
      <span class="tag tag--{{ q.format }}">{{ q.format }}</span>
      <span class="tag tag--{{ q.difficulty }}">{{ q.difficulty }}</span>
      <span class="tag">{{ q.layer }}</span>
      <span class="tag">{{ q.minutes }} min</span>
    </span>
  </li>
  {%- endfor -%}
</ul>

<p class="question-empty" data-question-empty hidden>No question matches those filters yet.</p>

<script type="text/javascript" src="{{ '/assets/js/progress.js' | relative_url }}"></script>
<script type="text/javascript" src="{{ '/assets/js/practice-index.js' | relative_url }}"></script>
