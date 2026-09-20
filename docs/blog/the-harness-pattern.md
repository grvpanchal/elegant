---
title: "The harness pattern: make 'is it done' a number, not an opinion"
layout: post
slug: the-harness-pattern
date: 2026-08-01
author: The Elegant team
category: ai-and-frontend
tags: [ai, guardrails, harness, quality]
description: 'A harness is the set of checks that decide whether work is good enough, run automatically. Build one and "is this done" stops being a meeting and becomes an exit code — which is the only way autonomous or AI-heavy work stays honest.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 4
related_practice: [harness-link-checker, harness-bundle-budget, harness-skill-eval]
---

A harness is the collection of checks that decide, automatically, whether a piece
of work meets the bar — and it is the single idea that makes AI-heavy or
autonomous development trustworthy. With a harness, "is this done?" is not a
judgement call in a review meeting; it is an exit code. Without one, you are back
to trusting that whoever looked (human or model) caught everything, at exactly the
moment volume makes that impossible.

## Form and function, both measured

A good harness checks two kinds of thing. **Form**: does the work have the right
shape — front matter present, schema valid, links resolve, no forbidden patterns,
bundle under budget. These are cheap static checks. **Function**: does the work
actually *behave* — the button runs the code, the filter filters, the starter
fails its own tests while the solution passes, the page does not throw. These
usually need a real browser. Form checks are necessary but not sufficient; a page
can be perfectly well-formed and completely broken. A harness that only checks form
gives false confidence, which is why the functional half — driving a real browser
and asserting behaviour — is what actually removes the human from the loop.

## The harness is the standard, so never edit it to pass

The discipline that makes a harness worth anything: the checks are the standard,
not the thing being tested. When a check fails, you fix the work, never loosen the
check to make it green. The moment you edit a scenario so a broken thing passes,
the harness stops measuring anything and becomes theater. This is the rule that is
hardest to hold under deadline pressure, and it is the one that determines whether
your "green build" means something. A harness you are willing to weaken is not a
standard; it is a suggestion.

## Growth targets belong in the harness too

A harness is not only for regressions. Declare what you do not have yet as a
measured, failing check — "we need 100 posts, we have 40" — so the gap stays
visible and honest rather than living in someone's head as a vague intention. Mark
it non-blocking so it does not stop unrelated work, and it reads as "40/100" until
it fills. This turns a roadmap into something measurable, and it is how a harness
drives growth, not just prevents backsliding. The composite sitting below
threshold while a growth target is open is the honest reading — you do not lower
the threshold to feel finished.

## Why it is the foundation for AI work

Tie it together and the reason a harness matters for AI is plain: a model can
generate work far faster than a human can review it, so the only way to keep
quality is to make the standard executable and let it run on every output. The
harness is what lets you say "yes, let the AI (or the agent, or the junior)
produce this" without fear, because a check — not attention — decides whether the
result is kept. The link-checker, bundle-budget, and skill-eval exercises each
build one check of a harness; assembled, they are how "done" becomes a number this
whole site is measured by.
