---
title: "Optimistic updates: show it now, reconcile later"
layout: post
slug: optimistic-updates-and-rollback
date: 2026-08-26
author: The Elegant team
category: terminology
tags: [state, ux, async, patterns]
description: An optimistic update applies the change to the UI before the server confirms it, then rolls back if the server disagrees. It makes an app feel instant — and it is only safe if you plan the rollback.
cover: /assets/img/state-system-diagram.png
reading_minutes: 3
related_practice: [offline-first-list, retry-with-backoff]
---

Tap "like" and the heart should fill instantly, not half a second later when the
server responds. That is an optimistic update: you apply the change to local
state immediately, assuming it will succeed, and only reconcile if the server
disagrees. Done well it makes an app feel instant. Done without a rollback plan
it makes the UI lie.

## The optimistic flow

The pattern has three beats. First, apply the change locally and record enough to
undo it — the previous value, or a patch. Second, fire the request. Third, on
success, confirm (often just keep the optimistic value, maybe reconcile with the
server's canonical version); on failure, roll back to the recorded previous value
and tell the user. The recorded previous state is the whole game: without it you
cannot undo, and an optimistic update with no rollback is just a bug that usually
gets away with it because requests usually succeed.

## When to be optimistic and when not

Be optimistic for changes that almost always succeed and are cheap to reverse:
toggling a like, checking a todo, reordering a list, editing a note. Be
pessimistic — wait for the server — for changes that are risky or irreversible:
submitting a payment, deleting an account, anything where showing success before
it is real would be dangerous or confusing. The test is: if this fails and I have
to roll it back, will the user be merely mildly surprised, or will they have
acted on a false confirmation? The former is fine to fake; the latter is not.

## Rollback is a UX problem, not just a state one

The rollback is where teams get it wrong, because it is not only about restoring
state — it is about telling the user without yanking the rug. If they liked a
post, it failed, and the heart silently empties, they are confused. Better: roll
back and show a brief "couldn't save, try again." Handle the concurrent case too
— two optimistic edits in flight, one fails — by keying each pending change so a
rollback restores the right baseline rather than clobbering a newer edit. This is
where a request id per change earns its place.

Optimism buys perceived speed at the cost of a reconciliation step you must
actually write. Apply now, record the undo, reconcile on the response, and be
honest in the UI when you have to walk it back. Skip the rollback and you have not
built an optimistic UI — you have built one that is occasionally, silently wrong.
The offline-first-list exercise is optimistic updates taken to their limit, where
every change is provisional until sync.
