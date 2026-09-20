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
reading_minutes: 4
related_practice: [harness-bundle-budget, harness-link-checker]
---

A forty-line pull request gets read carefully and reviewed in minutes. A
two-thousand-line one gets a "LGTM" and a rubber stamp, because no human can hold
that much change in their head at once and actually reason about it. Small diffs are
not a matter of etiquette — they are how bugs get caught, how review stays honest, and
counterintuitively how you ship *faster*. The size of your diffs is one of the
highest-leverage habits you control.

## Big diffs defeat review

Review has a capacity. Past a few hundred lines, a reviewer's ability to actually
find problems drops sharply — the change is too large to trace, the interactions too
many to reason about, so they skim and approve. That means a big PR is effectively
*unreviewed*, which is worse than it sounds because everyone believes it was
reviewed. Bugs sail through under the cover of a green approval that meant "I trust
you" rather than "I checked this." Splitting the same change into small PRs restores
the reviewer's ability to genuinely check each piece, so review does its job again.

## Small diffs de-risk everything downstream

A small change is easier to test, easier to roll back, and easier to bisect when
something breaks later. If a bug appears and the suspect commit is forty lines, you
find the cause fast; if it is two thousand, the bisect lands you in a haystack. A
small change that breaks production is a small, targeted revert; a large one is a
painful choice between reverting a lot of unrelated good work or surgically fixing
under pressure. Small diffs keep every downstream operation — test, review, deploy,
rollback, debug — cheap, and those operations happen far more often than the writing
did.

## Ship faster by shipping smaller

The counterintuitive part is that small diffs make you *faster*, not slower. Big
PRs sit in review for days because reviewing them is daunting, they accumulate merge
conflicts while they wait, and they block on a single large approval. Small PRs get
reviewed quickly (they are easy to say yes to), merge before they conflict, and keep
your work flowing to production continuously instead of in scary batches. The feeling
that a big PR is "more done" is an illusion — it is more *written*, but less
*shipped*, because it is stuck in the pipeline that small diffs flow through.

## How to keep them small

The skill is decomposing work into independently-shippable pieces. Separate a
refactor from a feature (do the refactor in its own PR, then the feature on top of
clean code). Land a change behind a feature flag so incomplete work can merge without
releasing. Split by layer or by sub-feature so each PR does one coherent thing you can
describe in a sentence. And lean on automated guardrails so the small PRs are safe to
merge fast — a bundle budget, a link check, a test suite catching what a rushed review
might miss. The bundle-budget and link-checker exercises build exactly the kind of
automated check that lets a team merge small diffs quickly and confidently, which is
the whole point.
