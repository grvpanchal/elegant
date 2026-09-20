---
title: "The take-home is a different game from the live round"
slug: the-take-home-is-a-different-game
layout: post
date: 2026-07-21
author: The Elegant team
category: interview
tags: [interview, take-home, quality, career]
description: 'A live coding round rewards thinking out loud under time pressure. A take-home rewards the opposite — polish, structure, tests, and the judgement to know when to stop. Treating one like the other is how strong candidates underperform.'
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [data-table-sort, form-field-molecule, accessible-combobox]
---

A take-home and a live coding round look similar — build a thing — but they reward
opposite behaviours, and strong candidates underperform by playing one like the
other. The live round rewards *thinking out loud under time pressure*: rough is fine,
narration is everything, done-ish beats silent-and-perfect. The take-home rewards the
inverse: *polish, structure, and judgement*, evaluated cold from the artifact alone,
with no narration to explain it. In a take-home nobody hears you reason, so the code,
the tests, the README, and the boundaries have to reason *for* you. The skill is
recognising which game you are in and playing it deliberately.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="th-t th-d" class="blog-figure__svg">
  <title id="th-t">Live rewards narrated speed; take-home rewards cold-read polish</title>
  <desc id="th-d">Two columns. Live round: time-boxed, narration scored, rough acceptable. Take-home: unhurried, artifact scored, polish and structure expected.</desc>
  <text x="160" y="26" text-anchor="middle" fill="#155799" font-size="11" font-weight="700">live round</text>
  <g fill="#155799" font-size="10"><text x="60" y="60">⏱ time-boxed</text><text x="60" y="84">🗣 narration scored</text><text x="60" y="108">✎ rough is fine</text><text x="60" y="132">↦ done-ish &gt; silent-perfect</text></g>
  <line x1="330" y1="18" x2="330" y2="175" stroke="#dce6f0"/>
  <text x="480" y="26" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">take-home</text>
  <g fill="#c2571a" font-size="10"><text x="380" y="60">🗓 unhurried</text><text x="380" y="84">📄 artifact scored cold</text><text x="380" y="108">✨ polish expected</text><text x="380" y="132">🧱 structure + tests + README</text></g>
</svg>
<figcaption>Same task, opposite rules. Live: narrate, be rough, be fast. Take-home: no narration reaches the grader, so the artifact must carry the reasoning.</figcaption>
</figure>

## The artifact is the only thing that speaks

Because a reviewer reads a take-home cold, everything you would *say* in a live round
has to be *written* into the submission. Structure the project the way a real
codebase is structured, not as one long file; the folder layout is itself a signal:

```text
src/
  ui/            presentational components (no fetching)
  containers/    where data enters
  state/         reducers, selectors
  lib/           pure helpers
  App.test.jsx   real assertions, not a smoke test
README.md        setup, decisions, trade-offs, known limits
```

A clean structure says "I know where things belong" without you being in the room to
say it.

## Tests and a decisions note do the narrating

In a live round you narrate trade-offs out loud; in a take-home you write them down.
A short "Decisions" section in the README and a handful of meaningful tests are how
your reasoning reaches the grader:

```js
// tests are your narration in a take-home: they show what you thought mattered
test("filters are debounced and case-insensitive", async () => {
  render(<Search />);
  await userEvent.type(screen.getByRole("searchbox"), "AbC");
  await waitFor(() => expect(api.search).toHaveBeenCalledWith("abc"));  // one call, lowercased
});
```

That test says, without a word spoken: "I chose to debounce, I made search
case-insensitive, and I verified both."

## Judgement is knowing when to stop

The trap that sinks strong candidates is treating a take-home as unbounded and
over-building — a state library for a three-screen app, an abstraction for a case
that appears once. The judgement being measured includes *scope*: solve the problem
well, make it accessible and tested, and then **stop**, noting further steps in the
README rather than building them. Timebox yourself honestly (most take-homes state
an expected effort — respect it, and if you exceed it, say so), because a reviewer
can tell the difference between "finished cleanly in the time" and "spent a weekend
gold-plating." Play the take-home for polish, structure, tests, and restraint — the
opposite of the live round's rough-and-fast narration — and you convert the same
skills into the signal *this* game rewards. The data-table-sort and accessible-combobox
exercises make good take-home-style pieces precisely because finishing them *well* —
tested, accessible, and scoped — is where the judgement shows.
