---
title: "Actions are messages, not setters"
layout: post
slug: actions-are-messages-not-setters
date: 2026-09-02
author: The Elegant team
category: terminology
tags: [state, redux, actions, architecture]
description: The most common Redux mistake is treating actions like setters — SET_USER, SET_LOADING, SET_ERROR. An action should describe something that happened, not command the store how to change.
cover: /assets/img/state-system-diagram.png
reading_minutes: 3
related_practice: [action-creators, counter-reducer, combine-reducers]
---

The single design decision that separates a maintainable Redux store from a mess
is how you name actions. Most beginners reach for setters — `SET_USER`,
`SET_LOADING`, `SET_ERROR` — mirroring the state fields one-for-one. It works,
briefly, and then it rots, because setters push all the logic of *what a change
means* out of the store and into whatever component happened to dispatch them.

## An action describes an event

An action should name something that happened in the world, not an instruction
for mutating a field. `USER_LOGGED_IN` is an event; `SET_USER` is a command.
`CHECKOUT_SUBMITTED` is an event; `SET_LOADING_TRUE` plus `SET_ERROR_NULL` is two
commands doing one event's job. The difference is not cosmetic. When the action
is an event, the reducer decides what that event means for the state — maybe it
sets the user *and* clears an error *and* flips a flag. With setters, the
component has to know to fire all three, in the right order, every time, and any
component that forgets one creates an inconsistent state.

## Why events keep the logic in one place

With event-named actions, the knowledge of "when a user logs in, these five
fields change" lives in one reducer, testable in isolation. Add a sixth field
that should change on login and you edit one place. With setters, that knowledge
is smeared across every call site, so adding the sixth field means hunting down
every dispatcher. Events also make the action log readable: a stream of
`USER_LOGGED_IN`, `CART_ITEM_ADDED`, `CHECKOUT_SUBMITTED` tells a story, where a
stream of `SET_*` tells you nothing about what the user did.

## One event, many reducers

The event framing unlocks a second thing setters cannot do: several reducers can
respond to the same action. `USER_LOGGED_OUT` might reset the cart slice, clear
the profile slice, and close the settings panel — three reducers, one action,
each minding its own state. With setters you would dispatch three separate
commands and hope none is missed. Because reducers are pure and independent, the
store simply hands the one action to all of them and each does its part.

The rule is worth saying plainly: name actions after what happened, in the past
tense, from the domain's point of view — not after the state field you intend to
poke. If your action types read like a list of setters, your business logic has
leaked out of the store and into your components, and the store has become a bag
of variables with extra steps. The action-creators exercise is where you feel the
difference between a command and an event.
