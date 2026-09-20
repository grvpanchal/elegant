---
title: "The take-home is a different game from the live round"
layout: post
slug: the-take-home-is-a-different-game
date: 2026-07-21
author: The Elegant team
category: interview
tags: [interview, take-home, quality, career]
description: 'A live coding round rewards thinking out loud under time pressure. A take-home rewards the opposite — polish, structure, tests, and the judgement to know when to stop. Treating one like the other is how strong candidates underperform.'
cover: /assets/img/ui-server-state.png
reading_minutes: 4
related_practice: [data-table-sort, form-field-molecule, accessible-combobox]
---

A take-home and a live coding round look like the same task — build something — but
they reward almost opposite things, and candidates who treat them identically leave
signal on the table. Live rewards visible thinking under pressure and a working
answer in forty minutes. A take-home rewards polish, structure, and judgement,
because the reviewer is reading finished code with no time pressure and comparing
it to everyone else's. Know which game you are playing.

## They are reading the code, not watching you

In a live round the interviewer watches your process — how you decompose, what
questions you ask, how you handle a stumble. In a take-home they see none of that;
they see the artifact. So the artifact has to speak for you: clear structure, a
README that explains your decisions, sensible commits, and code that reads like you
meant it. The take-home is a writing sample as much as a coding sample, and the
"writing" includes how you organized the project and explained your choices. A
correct solution with no explanation and a messy structure loses to a slightly less
complete one that is legible and reasoned.

## Show the judgement, including what you cut

A take-home almost always has more scope than time, on purpose — it tests whether
you can prioritize. The strongest submissions do the core well, then *explicitly
say* what they deliberately left out and why: "I didn't add virtualization; here is
where I would if the list grew." That note shows senior judgement — you saw the
trade-off and made a deliberate call — where an attempt to do everything, half-done,
shows the opposite. State your assumptions and your cuts in the README; the
reviewer is specifically looking for whether you know where to stop.

## Tests and accessibility are the differentiators

With no time pressure, the things that get skipped live are exactly what
distinguishes a take-home. A few meaningful tests — of the tricky logic, not
trivial getters — signal that you test by default. Accessibility done properly —
keyboard operation, correct roles, managed focus — signals that you consider it
part of "done," not an add-on. These are cheap to include when you are not racing a
clock, and their absence is noticed, because the reviewer knows you had the time.

## Polish the edges, then stop

Finally, spend your last hour on the edges that reveal care: the empty state, the
error state, the loading state, the too-long text that breaks the layout. Handling
these signals that you think about real usage, not just the happy demo. But also
know when to stop — a take-home that clearly consumed twenty hours reads as poor
judgement (or worse, as a red flag about your time), not as dedication. Do the core
excellently, cover the important edges, document your reasoning, and ship it. The
data-table and form-field exercises are exactly the kind of component a take-home
asks for, where the edges and the accessibility are where the evaluation actually
happens.
