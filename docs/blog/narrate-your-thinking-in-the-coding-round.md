---
title: "In the coding round, your narration is most of the score"
layout: post
slug: narrate-your-thinking-in-the-coding-round
date: 2026-07-18
author: The Elegant team
category: interview
tags: [interview, communication, coding, career]
description: 'The interviewer cannot read your mind, and they are scoring your thinking, not just your code. Silence while you type — even to a correct answer — leaves most of the available signal unspoken. Talk.'
cover: /assets/img/ui-server-state.png
reading_minutes: 4
related_practice: [debounce-utility, event-emitter, deep-clone]
---

The most common way strong engineers underperform in a live coding round is
silence. They read the problem, think hard, type a good solution, and say almost
nothing — and they score lower than someone with a worse solution who talked
through it. The reason is simple and worth internalizing: the interviewer is scoring
your *thinking*, and thinking they cannot hear does not count. Your narration is not
color commentary; it is the bulk of the signal.

## State your understanding before you code

Begin by restating the problem and your assumptions: "So I need a debounce that
delays until calls stop, fires the trailing call with the latest arguments, and can
be cancelled — I'll assume trailing-only unless you want leading too." This does
three things: it confirms you understood the task, it surfaces the edge cases up
front (which is the signal), and it gives the interviewer a chance to correct you
before you spend twenty minutes solving the wrong problem. Diving straight into code
skips all of that and risks building the wrong thing in confident silence.

## Say the edge cases out loud as you meet them

As you code, narrate the decisions and especially the edges: "I'll clear the
previous timer here so rapid calls reset the delay," "I need to capture the latest
arguments, not the first ones," "let me guard against calling this after it's been
cancelled." Naming the edge cases is precisely what distinguishes a senior answer
from a junior one — the code might look similar, but the candidate who *said* "this
version leaks listeners, let me fix that" demonstrably saw the problem, where a
silent identical fix might have been luck. Talk through the edges even when you
handle them correctly, because the seeing is the score.

## Narrate your recovery when you get stuck

Getting stuck is not the failure; going silent when stuck is. When you hit a wall,
say what you are considering: "this approach is getting complicated, let me think
about whether there's a cleaner one," or "I'm not sure of the exact API here, but
the shape is a function returning a function." Interviewers weight problem-solving
process heavily, and a visible, structured recovery from a stumble is a strong
positive signal — it is literally what the job is. A candidate who narrates their
way out of a dead end often outscores one who never hit it.

## Read the room and leave hooks

Narration is also a two-way channel: pausing to say "does that approach sound
reasonable to you?" invites a hint you would otherwise not get, because interviewers
often will not interrupt a silent candidate even when they are heading the wrong
way. Leave hooks for them to guide you. The balance is to talk continuously but not
frantically — enough that your reasoning is always audible, not so much that you
cannot code. Practice this on real problems out loud, because it is a separate skill
from solving them. The debounce, event-emitter, and deep-clone exercises are ideal
to rehearse narrating, since each has edges worth saying aloud as you handle them.
