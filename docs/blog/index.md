---
title: Blog
layout: default
slug: blog
description: Field notes on frontend architecture, the terminology that makes a component system legible, and what the craft looks like now that an AI writes half the code.
---

<h1>Blog</h1>

<p class="blog-lede">
Short, opinionated reads on the Universal Frontend Architecture — the atoms and
organisms vocabulary, where state actually lives, how the server layer fits, and
how to stay valuable as a frontend engineer while an AI writes half the diff.
Every post ends by sending you to the questions that drill it.
</p>

<form class="practice-filters" role="search" aria-label="Filter the blog">
  <label class="practice-filters__field">
    Category
    <select data-filter="category">
      <option value="">All</option>
      {%- assign all_categories = site.data.blog | map: "category" | uniq | sort -%}
      {%- for c in all_categories -%}
      <option value="{{ c }}">{{ c }}</option>
      {%- endfor -%}
    </select>
  </label>
  <label class="practice-filters__field">
    Tag
    <select data-filter="tag">
      <option value="">All</option>
      {%- assign all_tags = site.data.blog | map: "tags" | join: "," | split: "," | uniq | sort -%}
      {%- for t in all_tags -%}
      {%- if t != "" -%}<option value="{{ t }}">{{ t }}</option>{%- endif -%}
      {%- endfor -%}
    </select>
  </label>
  <label class="practice-filters__field">
    Search
    <input type="search" data-search placeholder="atoms, SSR, AI…">
  </label>
  <button type="button" class="practice-filters__clear" data-filter-clear>Clear</button>
  <output class="practice-filters__count" data-post-count>{{ site.data.blog | size }} posts</output>
</form>

<ul class="playbook-list" data-post-list>
  {%- assign posts = site.data.blog | sort: "date" | reverse -%}
  {%- for post in posts -%}
  <li class="playbook-card" data-post
      data-slug="{{ post.slug }}"
      data-category="{{ post.category }}"
      data-tag="{{ post.tags | join: ' ' }}"
      data-searchtext="{{ post.title | downcase | escape }} {{ post.description | downcase | escape }} {{ post.tags | join: ' ' | downcase | escape }} {{ post.category | escape }}">
    <h2 class="playbook-card__title"><a href="{{ '/blog/' | append: post.slug | append: '.html' | relative_url }}">{{ post.title }}</a></h2>
    <p class="playbook-card__meta">{{ post.author }} · {{ post.date | date: "%b %-d, %Y" }} · {{ post.reading_minutes }} min · {{ post.category }}</p>
    <p class="playbook-card__summary">{{ post.description }}</p>
  </li>
  {%- endfor -%}
</ul>

<p class="question-empty" data-post-empty hidden>No posts match those filters. <button type="button" class="practice-filters__clear" data-filter-clear>Clear the filters</button></p>

<script src="{{ '/assets/js/blog-index.js' | relative_url }}"></script>
