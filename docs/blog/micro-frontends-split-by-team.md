---
title: "Micro-frontends solve an org problem, not a tech one"
layout: post
slug: micro-frontends-split-by-team
date: 2026-07-13
author: The Elegant team
category: architecture
tags: [server, micro-frontends, architecture, scaling]
description: 'Splitting a frontend into independently deployable pieces is worth it when teams are stepping on each other, and a costly mistake when they are not. The boundary should follow the org chart, not the tech.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [design-micro-frontends]
---

Micro-frontends — splitting a single web app into independently built and deployed
pieces owned by different teams — are often adopted for the wrong reason ("our
frontend is big") and regretted. The right reason is organizational: when multiple
teams are stepping on each other in one codebase and one deploy pipeline, splitting
lets each ship independently. The decision is about team autonomy and deploy
cadence, not about lines of code, and getting that backwards is the classic mistake.

## The problem they actually solve

In a large organization, a single-frontend monolith becomes a coordination
bottleneck: every team's changes go through one build, one deploy, one release
train, so a bug in one team's code blocks everyone, and a shared release cadence
forces teams to move at the speed of the slowest. Micro-frontends cut that coupling
— each team owns a slice, builds it, tests it, and deploys it on its own schedule.
That independence is the entire payoff, and it is an organizational payoff. If you
have one team, you do not have this problem, and micro-frontends will only add cost.

## The costs are real and up front

The independence is not free. You take on integration complexity (how do the pieces
compose into one page?), shared-dependency management (each piece bundles React —
do you ship it three times?), consistency challenges (how do independently
deployed pieces stay visually and behaviorally coherent?), and cross-team
communication contracts. Module federation and similar tooling address the
mechanics, but the coordination cost does not disappear — it moves from "one
codebase" to "contracts between codebases." For a small team, this is a large tax
paid to solve a problem you do not have.

## Split at real boundaries

When you do split, the boundary should follow genuine seams — a whole product area
a team owns end to end (checkout, search, the seller dashboard), not an arbitrary
technical slice. A good boundary is one where the pieces are loosely coupled and
communicate through a small, stable contract; a bad one cuts through a tightly
coupled flow and forces constant cross-team coordination, giving you all the cost of
the split and none of the independence. The org chart is usually the best guide to
where the seams are, because that is where ownership already lives.

## Keep the contracts small and the shell thin

The integration layer — the shell that composes the pieces and the contracts they
communicate through — should be as thin and stable as possible, because it is the
one shared thing and every change to it is a cross-team event. Define how pieces are
loaded, how they share (or don't) global state, and how they stay consistent (shared
design tokens, a shared component library) up front. Micro-frontends done well feel
like one app assembled from independently-shipped parts; done poorly they feel like
several apps awkwardly stapled together. The micro-frontends design exercise is
exactly this judgement — when the split is worth it and where the boundary should
fall.
