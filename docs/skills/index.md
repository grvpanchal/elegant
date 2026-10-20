---
title: Agent Skills
layout: default
permalink: /skills/
description: Browse and download every Agent Skill, the SKILL.md files that encode the UI, Server and State terms for your coding agent.
---

{%- assign skills = site.data.skill_index -%}
{%- assign layers = "ui:UI,server:Server,state:State" | split: "," -%}

<h1>Agent Skills</h1>

<p class="blog-lede">
Each of these {{ skills | size }} Agent Skills encodes one term of the architecture as a
<code>SKILL.md</code>: the rules, code patterns and quality gates a coding agent follows when it
writes that part of your app. Install one into your agent with the command on its card, or
download the file for any runtime that reads Agent Skills.
</p>

<p class="skill-index__jump">
{%- for l in layers -%}
  {%- assign key = l | split: ":" | first -%}{%- assign name = l | split: ":" | last -%}
  {%- assign n = skills | where: "layer", key | size -%}
  <a href="#{{ key }}">{{ name }} ({{ n }})</a>{% unless forloop.last %} · {% endunless %}
{%- endfor -%}
</p>

{% for l in layers %}
{%- assign key = l | split: ":" | first -%}{%- assign name = l | split: ":" | last -%}
<h2 id="{{ key }}">{{ name }}</h2>
<ul class="playbook-list">
  {%- for skill in skills -%}
  {%- if skill.layer == key -%}
  <li class="playbook-card">
    <h3 class="playbook-card__title">{% if skill.doc != "" %}<a href="{{ skill.doc | relative_url }}">{{ skill.title }}</a>{% else %}{{ skill.title }}{% endif %}</h3>
    <p class="playbook-card__summary">{{ skill.summary }}</p>
    <p class="playbook-card__meta skill-index__install">
      <a href="{{ '/skills/' | append: skill.slug | append: '/SKILL.md' | relative_url }}" download="{{ skill.slug }}-SKILL.md">Download SKILL.md</a>
      <code><span>npx skills add</span> <span>{{ site.skills_repo }}</span> <span>--skill {{ skill.slug }}</span></code>
    </p>
  </li>
  {%- endif -%}
  {%- endfor -%}
</ul>
{% endfor %}
