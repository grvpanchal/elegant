---
title: "In the coding round, your narration is most of the score"
slug: narrate-your-thinking-in-the-coding-round
layout: post
date: 2026-07-18
author: The Elegant team
category: interview
tags: [interview, communication, coding, career]
description: 'The interviewer cannot read your mind, and they are scoring your thinking, not just your code. Silence while you type — even to a correct answer — leaves most of the available signal unspoken. Talk.'
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [debounce-utility, event-emitter, deep-clone]
---

Here is the thing candidates get wrong about the coding round: the interviewer is
scoring your *thinking*, and they can only see the part you say out loud. Type in
silence to a perfectly correct answer and you have shown them the destination but
none of the journey — how you decomposed the problem, which trade-offs you weighed,
how you caught your own bug. Most of the available signal is in that journey, and
silence throws it away. Narrating your thinking is not a soft skill bolted onto the
round; on a scorecard that asks "problem-solving," "communication," and "handles
ambiguity," it *is* the round. Talk.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="nc-t nc-d" class="blog-figure__svg">
  <title id="nc-t">Silent coding shows only the answer; narration exposes the whole scored process</title>
  <desc id="nc-d">Left: a silent path from problem to answer, only the endpoints visible. Right: a narrated path showing clarify, approach, trade-off, test — all visible to the scorer.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">silent</text>
  <circle cx="70" cy="90" r="10" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="70" y="118" text-anchor="middle" fill="#819198" font-size="8">problem</text>
  <circle cx="240" cy="90" r="10" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="240" y="118" text-anchor="middle" fill="#819198" font-size="8">answer</text>
  <path d="M80 90 L228 90" stroke="#dce6f0" stroke-width="2" stroke-dasharray="4 4"/><text x="150" y="82" text-anchor="middle" fill="#819198" font-size="8">(nothing visible)</text>
  <line x1="330" y1="18" x2="330" y2="175" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">narrated</text>
  <g font-size="8" text-anchor="middle" fill="#157878">
    <circle cx="380" cy="90" r="9" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="380" y="115">problem</text>
    <circle cx="440" cy="70" r="8" fill="#e8f0f8" stroke="#157878"/><text x="440" y="55">clarify</text>
    <circle cx="500" cy="90" r="8" fill="#e8f0f8" stroke="#157878"/><text x="500" y="115">approach</text>
    <circle cx="555" cy="70" r="8" fill="#e8f0f8" stroke="#157878"/><text x="555" y="55">trade-off</text>
    <circle cx="600" cy="90" r="9" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="600" y="115">test</text>
  </g>
  <path d="M389 90 L432 74 L492 88 L547 74 L591 88" fill="none" stroke="#157878" stroke-width="2"/>
</svg>
<figcaption>Silent coding hands the scorer two dots. Narration draws the whole path — clarify, approach, trade-off, test — which is the part the rubric actually grades.</figcaption>
</figure>

## Narrate the four beats

You do not need a monologue — you need to voice four beats. **Clarify** the problem
before coding; **state your approach** before typing; **flag trade-offs** as you make
them; and **test out loud** at the end. Even a terse version of each turns invisible
thinking into scored signal:

```js
// "First, edge cases: what if wait is 0? what if it's called after cancel?"  ← clarify
// "I'll close over a timer id and reset it each call — that's debounce."       ← approach
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);                              // "each call cancels the pending one" ← narrate
    t = setTimeout(() => fn(...args), wait);
  };
}
// "Let me trace: called 3x fast → only the last fires after `wait`. Correct."  ← test out loud
```

The comments above are what you *say*, not what you type — but voicing them is what
fills the scorecard.

## Ambiguity is a prompt to talk, not a trap

When a problem is under-specified — and interviewers under-specify on purpose — the
worst move is to silently pick an interpretation and code. The scored behaviour is
to surface the ambiguity and decide with the interviewer:

```text
You: "Should the search be case-sensitive? And do I debounce the input or search on submit?"
Interviewer: "Case-insensitive, and debounce it."
You: "Got it — I'll debounce at 300ms and lowercase both sides before comparing."
```

You just demonstrated requirements-gathering, a trade-off decision, and
communication — three rubric lines — before writing a line of logic.

## Talk yourself through the stuck moment, too

The narration matters most exactly when it feels hardest: when you are stuck.
Silent flailing looks like panic; narrated debugging looks like competence. "This
is returning undefined — let me check whether the closure is capturing the right
variable" shows a process the interviewer can *follow and reward*, and it often
prompts a small hint you would never have gotten in silence. The habit to build is
constant, low-key commentary — approach, trade-off, self-correction — so that by the
end the interviewer has seen not just that you can code, but *how you think*, which
is the thing they were sent to measure. Practise it by solving the debounce-utility,
event-emitter, and deep-clone exercises *out loud*, alone, until narrating is
automatic under pressure.
