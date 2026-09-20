---
title: "Debugging is a skill you can practice, not a talent you're born with"
slug: debugging-is-a-skill-you-can-practice
layout: post
date: 2026-06-17
author: The Elegant team
category: career
tags: [career, debugging, process, craft]
description: 'Fast debuggers are not smarter — they follow a method. Reproduce, isolate, form a hypothesis, test it, repeat. Guessing and changing things at random feels like debugging and mostly wastes time.'
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [event-emitter, deep-clone, debounce-utility]
---

The engineer who finds the bug in five minutes while you have been at it for an hour
is not smarter — they are following a *method*, and you are guessing. Debugging feels
like a talent because we watch the fast result and miss the process. But the process
is learnable and repeatable: **reproduce, isolate, hypothesise, test, repeat.**
Changing things at random and re-running feels like debugging and is mostly a way to
spend an afternoon adding new bugs on top of the old one. The method turns a bug from
a mystery into a search, and a search always terminates.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="db-t db-d" class="blog-figure__svg">
  <title id="db-t">The debugging loop: reproduce, isolate, hypothesise, test, repeat</title>
  <desc id="db-d">A cycle of five steps — reproduce, isolate, hypothesise, test — looping back to isolate until the bug is found, with a dot travelling the loop.</desc>
  <g font-size="9" text-anchor="middle">
    <rect x="30" y="70" width="100" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="80" y="94" fill="#155799">reproduce</text>
    <rect x="170" y="70" width="100" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="220" y="94" fill="#157878">isolate</text>
    <rect x="310" y="70" width="110" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="365" y="94" fill="#157878">hypothesise</text>
    <rect x="460" y="70" width="100" height="40" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="510" y="94" fill="#c2571a">test one</text>
  </g>
  <g stroke="#819198" stroke-width="2" marker-end="url(#db-a)"><path d="M130 90 L168 90"/><path d="M270 90 L308 90"/><path d="M420 90 L458 90"/></g>
  <path d="M510 110 C 510 155, 220 155, 220 112" fill="none" stroke="#c2571a" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#db-a)"/><text x="365" y="150" text-anchor="middle" fill="#c2571a" font-size="9">wrong? narrow and repeat</text>
  <defs><marker id="db-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
  <circle r="6" fill="#157878"><animateMotion dur="4s" repeatCount="indefinite" path="M80 90 L220 90 L365 90 L510 90"/></circle>
</svg>
<figcaption>The loop always terminates: each pass isolates a smaller region and tests one hypothesis, so the space of "where the bug could be" only shrinks.</figcaption>
</figure>

## Reproduce it reliably first

You cannot fix what you cannot trigger on demand. Before touching any code, find the
exact steps and inputs that make the bug happen every time — a failing test is the
gold standard, because it reproduces the bug *and* proves the fix. A bug you can only
sometimes trigger is a bug you cannot know you fixed:

```js
// the first move: capture the bug as a reproduction — ideally a failing test
test("cart total is wrong when an item is removed then re-added", () => {
  const cart = addItem(removeItem(makeCart([{ id: 1, price: 10 }]), 1), { id: 1, price: 10 });
  expect(cartTotal(cart)).toBe(10);   // fails today; will prove the fix tomorrow
});
```

## Isolate by halving the space

The core technique is binary search over the *code*, not over random guesses. The
bug lives somewhere between "input is correct" and "output is wrong" — so check the
midpoint. Is the value right halfway through the pipeline? If yes, the bug is in the
second half; if no, the first. Each check halves where it can be:

```js
function pipeline(input) {
  const a = step1(input);
  console.log("after step1:", a);   // midpoint probe: is it already wrong here?
  const b = step2(a);
  return step3(b);
}
// right at step1 but wrong at output → bug is in step2 or step3. Halve again.
```

Two or three halvings usually pin a bug to a few lines, no matter how large the
codebase.

## One hypothesis, one change, then verify

The discipline that separates method from flailing: form a *specific* hypothesis
("the total is wrong because removed items aren't filtered"), change *one* thing to
test it, and re-run. If it fixes it, you understood the bug; if not, you learned
something and narrow again — but you never change five things at once, because then a
pass tells you nothing about *which* change mattered, and you have added four
untested edits. Keep a note of what you have ruled out so you do not loop. The whole
method — reproduce reliably, isolate by halving, test one hypothesis at a time — is
just making the search *systematic* instead of *lucky*, and it is entirely
practisable: every bug you fix this way makes the next one faster. The event-emitter,
deep-clone, and debounce-utility exercises are good practice grounds precisely
because their edge cases produce subtle bugs that reward the method and punish
guessing.
