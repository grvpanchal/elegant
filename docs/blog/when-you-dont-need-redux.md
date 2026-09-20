---
title: "When you don't need Redux"
layout: post
slug: when-you-dont-need-redux
date: 2026-08-24
author: The Elegant team
category: terminology
tags: [state, redux, architecture, react]
description: Redux is a tool for a specific problem — a lot of client state, changed from many places, that many parts of the app must read. If that is not your problem, Redux is overhead you will resent.
cover: /assets/img/state-system-diagram.png
reading_minutes: 3
related_practice: [simple-store, counter-component]
---

Redux earned its reputation on large apps with sprawling client state, and then a
generation of developers reached for it on every project, including todo lists.
The result was a lot of boilerplate protecting state that three components
shared. Redux is a good answer to a specific question; if you are not asking that
question, it is overhead. Knowing when *not* to use it is as valuable as knowing
how.

## The problem Redux actually solves

Redux shines when you have a lot of **client** state (not server data — that
wants a cache), changed from **many** places, that **many** parts of the app must
read, and where you value a strict, inspectable, replayable model of every
change. Think a complex editor, a trading dashboard, a design tool — where an
action fired in one corner updates state read in five others, and being able to
time-travel through changes is worth real boilerplate. There, the ceremony pays
for itself in predictability.

## The cases that don't need it

Most apps are not that. If your shared client state is a user, a theme, and a
cart, plain context (or a tiny store) carries it with a fraction of the code. If
your "state" is mostly data fetched from a server, a data-fetching library owns it
far better than Redux ever did — freshness, refetch, and invalidation for free. If
a piece of state is used by one component, it is local state, full stop. Reaching
for Redux in these cases buys you actions, reducers, selectors, and a store to
protect three variables that a `useState` would have held.

## The honest middle

This is not "Redux bad." It is "match the tool to the shape of the state." Many
mature apps end up with a blend: a data-fetching library for server state, local
state for component concerns, context or a light store for a few app-wide client
values, and Redux (or a modern toolkit that cuts its boilerplate) only if there
is genuinely complex client state that benefits from the strict model. The
failure is monoculture in either direction — Redux for everything, or refusing a
store when you truly have complex shared client state and end up prop-drilling a
mess.

Ask three questions before adding Redux: is this client state or server state? Is
it shared widely or colocated? Do I benefit from a strict, replayable change
model? If the answers are "server," "local," and "no," you have your answer, and
it is not Redux. The simple-store exercise builds the core idea from scratch so
you understand what you are (or aren't) opting into, and counter-component shows
how far plain local state goes.
