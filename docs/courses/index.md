---
title: Free courses
layout: default
slug: courses
description: Free, no-signup courses on the terminology of the UI, State and Server layers, and on driving coding agents with Agent Skills.
---

<h1>Free courses</h1>

<p class="courses-lede">
Pick a course and work through its lessons in order. Each lesson teaches one
term of the frontend architecture, the key insight behind it, the Agent Skill
that encodes it for a coding agent, and a question from the bank to prove it.
Every course is free and needs no signup — sign in only if you want your
progress to follow you to another browser.
</p>

{%- assign groups = site.data.courses | sort: "order" | group_by: "category" %}
{%- for group in groups %}
<section class="course-group" aria-labelledby="group-{{ forloop.index }}">
  <h2 class="course-group__title" id="group-{{ forloop.index }}">{{ group.name }}</h2>
  <ul class="course-list">
    {%- for course in group.items %}
    {%- include course-data.html course=course %}
    <li class="course-card">
      <h3 class="course-card__title">
        <a href="{{ '/courses/' | append: course.slug | append: '/' | relative_url }}">{{ course.title }}</a>
      </h3>
      <p class="course-card__summary">{{ course.summary }}</p>
      <p class="course-card__meta">{{ course.modules | size }} modules · {{ cd_count }} lessons · about {{ cd_minutes }} min</p>
      {% include progress-tracker.html slugs=cd_keys title="Your progress" %}
      <a class="course-button" href="{{ cd_first_url }}" data-course-continue data-lessons="{{ cd_json | escape }}">Start course</a>
    </li>
    {%- endfor %}
  </ul>
</section>
{%- endfor %}

<p class="courses-after">
Want a schedule instead? The <a href="{{ '/plans/' | relative_url }}">study plans</a>
put the same terms on a clock. Your <a href="{{ '/dashboard/' | relative_url }}">dashboard</a>
shows every course, plan and question in one place.
</p>

<script type="text/javascript" src="{{ '/assets/js/courses.js' | relative_url }}" defer></script>
