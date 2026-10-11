---
title: The Elegant Frontend, the book
layout: default
slug: book
description: Download every UI, server and state term on the site, with its best practices, as one free PDF.
---

<h1>The book</h1>

<p class="playbooks-lede">
The whole glossary, bound. Each of the {{ site.data.book.chapters }} chapters takes one term and
gives it the same shape: the term at a glance, the key insight, the full explanation, a worked
example from the <code>chota-*</code> boilerplates, the common mistakes, and the best practices
with the quality gates to check before you call the work done. The best practices are the same
Agent Skills a coding agent is given, so the book and the agent follow one standard.
</p>

{% include book-download.html %}

<section class="book-contents" aria-labelledby="book-contents-title">
  <h2 id="book-contents-title">Contents</h2>
  {%- assign n = 0 -%}
  {%- for part in site.data.book.parts %}
  <h3 class="book-contents__part">Part {% cycle 'I', 'II', 'III' %}: {{ part.title }} <small>(page {{ part.page }})</small></h3>
  <ol class="book-contents__list" start="{{ n | plus: 1 }}">
    {%- for term in site.data.topics[part.layer] %}
    {%- assign n = n | plus: 1 %}
    <li class="book-contents__item">
      <a href="{{ '/' | append: part.layer | append: '/' | append: term.slug | relative_url }}">
        <span class="book-contents__icon"><img src="{{ '/assets/img/logos/' | append: term.slug | append: '.png' | relative_url }}" alt="{{ term.title }} icon" width="28" height="28"></span>
        <span>{{ term.title }}</span>
        <span class="book-contents__no">Ch. {{ n }}</span>
      </a>
    </li>
    {%- endfor %}
  </ol>
  {%- endfor %}
</section>
