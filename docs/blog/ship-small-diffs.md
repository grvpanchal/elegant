---
title: "Ship small diffs: the pull request nobody can review is nobody's friend"
slug: ship-small-diffs
layout: post
date: 2026-06-15
author: The Elegant team
category: career
tags: [career, workflow, review, craft]
description: 'A 40-line pull request gets a real review in minutes. A 2000-line one gets a rubber stamp, because nobody can hold it in their head. Small diffs are not a nicety — they are how bugs get caught and how you ship faster.'
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [harness-bundle-budget, harness-link-checker]
---

A 40-line pull request gets a genuine review in a few minutes — a reviewer can hold it
all in their head, follow the logic, and catch the bug. A 2000-line pull request gets a
rubber stamp, because no human can keep two thousand lines in working memory, so they
skim, trust, and approve. The counterintuitive result is that the big PR — the one that
represents more work and feels more productive — gets *less* scrutiny and ships *more*
bugs. Small diffs are not politeness toward your reviewer; they are the mechanism by
which review actually works, and they make you ship faster, not slower, because small
things merge and unblock while big things sit.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="sd2-t sd2-d" class="blog-figure__svg">
  <title id="sd2-t">Review quality falls as diff size rises</title>
  <desc id="sd2-d">A curve: small diffs get thorough review and few escaped bugs; as diff size grows, review degrades to a rubber stamp and escaped bugs climb.</desc>
  <line x1="50" y1="150" x2="600" y2="150" stroke="#606c71" stroke-width="1.5"/><text x="320" y="172" text-anchor="middle" fill="#819198" font-size="9">diff size →</text>
  <line x1="50" y1="20" x2="50" y2="150" stroke="#606c71" stroke-width="1.5"/><text x="28" y="90" fill="#819198" font-size="9" transform="rotate(-90 28 90)">review depth</text>
  <path d="M60 40 Q 250 55, 590 140" fill="none" stroke="#157878" stroke-width="2.5"/>
  <circle cx="110" cy="46" r="6" fill="#157878"/><text x="120" y="40" fill="#157878" font-size="9">40 lines: real review</text>
  <circle cx="520" cy="128" r="6" fill="#c2571a"/><text x="510" y="122" text-anchor="end" fill="#c2571a" font-size="9">2000 lines: rubber stamp</text>
</svg>
<figcaption>Review depth collapses as diffs grow. The big PR feels productive and receives the least real scrutiny — which is where escaped bugs come from.</figcaption>
</figure>

## Big diffs defeat the point of review

Review works by a human understanding a change well enough to spot what is wrong. That
understanding has a size limit. Past it, the reviewer stops reasoning and starts
trusting, so the mechanism that was supposed to catch bugs quietly turns off — exactly
when there is the most code for bugs to hide in. A giant PR also blocks longer, invites
merge conflicts, and is agony to revert cleanly when something does slip. None of these
are the reviewer being lazy; they are the predictable result of exceeding what review
can do.

## Separate the refactor from the feature

The most common reason diffs balloon is mixing kinds of change. A PR that both moves
files around *and* adds a feature forces the reviewer to untangle which lines are
behaviour and which are noise. Split them — refactor in one PR, feature in the next —
and each becomes reviewable:

```text
PR 1  refactor: extract UserCard into ui/atoms (no behaviour change)   ← easy to verify
PR 2  feat: add "message" action to UserCard                           ← small, focused
# reviewing these separately is minutes each; reviewing them merged is an hour of confusion
```

"No behaviour change" is a promise a reviewer can *check* on a pure refactor PR, and
can't on a mixed one.

## Make small diffs easy to keep small

The habit is to slice work along seams that ship independently: land a data-layer
change, then the component that uses it, then the polish — each behind a flag if needed
so incomplete work is safe to merge. Keeping diffs small also plays well with automated
guardrails, which review the *mechanical* dimensions a human skims past on a big PR —
so the human review can focus on the logic in a small one:

```bash
# the checks that stay reliable no matter the diff size, freeing humans for the logic
$ node harness/check.js
  pass  bundle-budget   entry chunk 240kb < 250kb
  pass  links           all internal links resolve
```

The whole discipline is one idea: keep each change small enough that a human can
actually reason about it, and split unlike changes apart. You will feel like you are
shipping smaller units; you will actually be shipping *more*, with fewer escaped bugs,
because small things get real review and merge fast. The harness-bundle-budget and
harness-link-checker exercises build the automated half that makes this sustainable —
the checks that hold on every diff so human attention can go where only it works.
