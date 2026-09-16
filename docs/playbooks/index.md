---
title: Playbooks
layout: default
slug: playbooks
description: Long-form guides on frontend interviews, system design, state management and running an AI harness against a real codebase.
---

<h1>Playbooks</h1>

<p class="playbooks-lede">
Playbooks are the long reads: how to prepare, how to reason out loud, and how
to point an agent at a codebase without losing control of it. Each one is
measured for depth by the capability guardrail, so none of them is a stub.
</p>

<ul class="playbook-list">
  {%- assign guides = site.pages | where_exp: "p", "p.url contains '/playbooks/'" | sort: "order" -%}
  {%- for g in guides -%}
  {%- unless g.slug == "playbooks" -%}
  <li class="playbook-card">
    <h2 class="playbook-card__title"><a href="{{ g.url | relative_url }}">{{ g.title }}</a></h2>
    <p class="playbook-card__summary">{{ g.description }}</p>
  </li>
  {%- endunless -%}
  {%- endfor -%}
</ul>
