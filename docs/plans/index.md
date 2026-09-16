---
title: Study plans
layout: default
slug: plans
description: Curated study plans over the Frontend AI Harness question bank — one week, one month, three months, and a curated shortlist.
---

<h1>Study plans</h1>

<p class="plans-lede">
A plan is an ordered list of questions and readings with a declared time
budget. The budget is checked: <code>harness/check_harness.py</code> fails the
build when a plan's steps no longer add up to the hours it promises, so a plan
cannot quietly rot as questions change.
</p>

<ul class="plan-list">
  {%- for plan in site.data.plans -%}
  <li class="plan-card">
    <h2 class="plan-card__title">
      <a href="{{ '/plans/' | append: plan.slug | append: '.html' | relative_url }}">{{ plan.title }}</a>
    </h2>
    <p class="plan-card__summary">{{ plan.summary }}</p>
    <p class="plan-card__meta">{{ plan.budget_minutes }} minutes · {{ plan.items | size }} steps</p>
    {%- assign plan_slugs = plan.items | map: "ref" | join: " " -%}
    {% include progress-tracker.html slugs=plan_slugs title=plan.title %}
  </li>
  {%- endfor -%}
</ul>

<p>Finished one? <a href="{{ '/plans/certificate.html' | relative_url }}">Print your certificate</a>.</p>

<script type="text/javascript" src="{{ '/assets/js/progress.js' | relative_url }}"></script>
