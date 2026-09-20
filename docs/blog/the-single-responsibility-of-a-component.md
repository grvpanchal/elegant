---
title: "A component should do one job, and you should be able to name it"
slug: the-single-responsibility-of-a-component
layout: post
date: 2026-06-21
author: The Elegant team
category: architecture
tags: [ui, components, architecture, maintainability]
description: 'If you cannot describe a component in one sentence without saying "and", it is doing too much. The single-responsibility test is the cheapest way to know when to split — and where.'
cover: /assets/img/atomic-design.png
reading_minutes: 4
related_practice: [atom-boundaries, presentational-vs-container]
---

There is a one-sentence test for whether a component is well-scoped: try to describe
what it does in a single sentence without using the word "and." "It renders a
product card." Good. "It renders a product card *and* fetches the product *and*
manages the modal *and* tracks analytics." That is four responsibilities wearing one
name, and the "and"s are telling you exactly where the split lines are. Single
responsibility is the cheapest design heuristic in the frontend, and it applies at
every layer of the tree.

## The "and" test finds the seams

When a component's description needs "and," each clause is a candidate to extract.
The card that renders *and* fetches should be split into a container (fetches) and a
presentational card (renders) — the container line again. The component that renders
*and* manages a modal should delegate the modal to a modal component. The one that
renders *and* tracks analytics should have the tracking lifted to a hook or a
wrapper. Each extraction leaves a component you *can* describe without "and," which
is the signal you have found the right boundary. The heuristic does not just tell you
*that* a component is overloaded; the conjunctions tell you *where* to cut.

## Why one job makes everything easier

A single-responsibility component is easier to name (its name is its one job),
easier to test (you assert one behaviour), easier to reuse (it does one thing, so it
fits more places), and easier to change (a requirement change touches the one
component that owns that concern). A multi-responsibility component is the opposite
on every axis: hard to name, hard to test in isolation, hard to reuse because it
drags its other jobs along, and risky to change because touching one concern can
break the others tangled with it. The single job is what makes a component a
building block rather than a knot.

## It applies at every atomic layer

The heuristic scales across the atomic-design layers. An atom does one small thing (a
button, an input). A molecule composes a few atoms into one useful unit (a labelled
field) — still one job, at a higher level. An organism composes molecules into a
section (a form, a header) — one job, higher still. The responsibility gets larger up
the tree, but at each level it should still be *one* nameable job. When an organism
starts doing two sections' worth of work, that is the same "and" smell at the organism
scale, and the fix is the same: split.

## Do not over-split either

The counter-caution: single responsibility is not "one line per component." Splitting
a coherent single job into five anemic components that only make sense together is its
own mess — now the one job is smeared across five files and you cannot see it. The
target is *one job per component*, where "job" is a meaningful unit, not the smallest
possible fragment. If describing the split-out pieces individually is harder than
describing the whole, you split too far. The atom-boundaries exercise is precisely
the "where does this component's job stop" judgement, and presentational-vs-container
is the most common single-responsibility split there is.
