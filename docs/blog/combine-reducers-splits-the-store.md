---
title: "combineReducers splits the store without splitting the truth"
layout: post
slug: combine-reducers-splits-the-store
date: 2026-08-23
author: The Elegant team
category: terminology
tags: [state, redux, reducers, architecture]
description: One state tree can still have many owners. combineReducers gives each slice its own reducer while keeping a single store — the trick is that each reducer sees only its slice, and that constraint is a feature.
cover: /assets/img/state-system-diagram.png
reading_minutes: 3
related_practice: [combine-reducers, normalize-entities, counter-reducer]
---

A single source of truth does not mean a single giant reducer. As an app grows,
one reducer handling every action for every part of the state becomes
unreadable. `combineReducers` is the standard answer: split the one state tree
into named slices, give each slice its own reducer, and keep a single store. The
constraint that makes it work — each reducer sees only its own slice — is exactly
what keeps the split clean.

## Each reducer owns one slice

`combineReducers({ cart: cartReducer, user: userReducer })` builds a root reducer
whose state is `{ cart, user }`. When an action is dispatched, the root hands it
to *every* slice reducer, but each one receives and returns only its own slice —
`cartReducer` gets `state.cart`, never the whole tree. So a slice reducer
physically cannot reach into another slice, which means slices cannot secretly
couple. The isolation is enforced by the shape of the function, not by
discipline, and that is why the pattern scales: a new slice is a new key and a
new reducer, with zero risk of it entangling the others.

## Many slices, one action

The isolation does not stop slices from *responding* to the same event, and this
is the pattern's quiet power. Dispatch `USER_LOGGED_OUT` and the cart reducer can
clear the cart while the user reducer clears the profile and the settings reducer
closes the panel — three slices, one action, each minding its own state. Because
every reducer sees every action (even if most ignore most actions), cross-cutting
events are handled without any slice knowing about the others. This is only
possible because reducers are pure and independent; the store just fans the action
out.

## Where the split should fall

Slice boundaries should follow domains, not data types — a `cart` slice, a
`user` slice, an `entities` slice for normalized server data — so that a feature's
state lives together and a feature's reducer is the one place its rules live.
Avoid slicing by incidental shape ("all the booleans here, all the arrays
there"); that scatters a feature across the tree. And when a slice's reducer
itself grows large, you can compose further — a slice reducer can call
`combineReducers` on sub-slices, nesting the same pattern.

The model to hold: one tree, many owners, each blind to the others but all
hearing every action. That combination — global readability, local ownership,
shared events — is what lets a Redux store grow without becoming a single
thousand-line switch statement. The combine-reducers exercise builds the
composition itself, and normalize-entities gives you the kind of `entities` slice
that most benefits from its own reducer.
