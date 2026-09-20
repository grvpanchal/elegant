---
title: "Progressive enhancement still matters, even in a JavaScript world"
slug: progressive-enhancement-still-matters
layout: post
date: 2026-06-29
author: The Elegant team
category: architecture
tags: [ui, accessibility, resilience, html]
description: 'Build on a foundation that works without JavaScript, then layer richness on top. It sounds old-fashioned until a script fails to load, a network flakes, or a crawler visits — and the baseline is what saves you.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 4
related_practice: [form-field-molecule, responsive-image-set]
---

Progressive enhancement — build a baseline that works with plain HTML, then layer
JavaScript-powered richness on top — sounds like advice from a decade ago in a world
of heavy client apps. It is not. Scripts fail to load, networks flake, JavaScript
errors abort execution, and crawlers and assistive tech vary wildly in what they
support. The baseline is your resilience: when the enhancement fails, the user still
gets a working, if plainer, experience instead of a blank screen.

## Start with HTML that works

The foundation is semantic HTML that functions without any JavaScript: a real
`<form>` that submits to a URL, real `<a>` links that navigate, content that is in
the markup rather than injected by a script. On top of that you layer the
enhancements — intercept the form submit to validate and submit via fetch, intercept
link clicks for client-side routing, add interactivity. The key property is that if
the JavaScript layer never runs, the HTML layer still does something useful: the form
still submits, the links still work, the content is still there. You built up from a
floor, not down from a ceiling.

## Why the baseline pays off

The failure modes are more common than the "modern browsers all run JavaScript"
assumption admits. A bundle fails to download on a flaky connection; a single
JavaScript error aborts the rest of your script; a corporate proxy strips something;
a crawler or preview bot does not execute JS; an assistive technology interacts in a
way your handlers did not expect. In every one of these, a progressively-enhanced app
degrades to a working baseline, while a JavaScript-only app degrades to nothing. You
are buying insurance against the long tail of "the enhancement didn't run."

## It aligns with accessibility and SEO

Progressive enhancement is not a separate discipline from accessibility and SEO — it
is largely the same work. Semantic HTML that works without JavaScript is also what
screen readers navigate best and what crawlers index. A form that submits natively is
also a form that is keyboard- and screen-reader-operable by default. So the effort
you spend building a solid HTML baseline pays off three times: resilience, access,
and discoverability. The team that builds JavaScript-first and "adds accessibility
later" is doing more work for a worse result than the team that enhanced a solid
baseline.

## Pragmatism, not purism

This does not mean every app must be fully functional with JavaScript disabled — an
interactive design tool or a canvas game genuinely cannot be, and pretending
otherwise is purism. The pragmatic version is: make the *content and core actions*
resilient (readable content, working navigation, submittable critical forms), and
accept that rich interactions require JavaScript. Decide consciously what the
baseline guarantees rather than assuming the enhancement always runs. The form-field
exercise builds on a native form that works before enhancement, and the
responsive-image exercise uses native browser features that need no JavaScript at
all — both are enhancement layered on a working floor.
