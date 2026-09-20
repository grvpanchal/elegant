---
title: "AI does not remove technical debt — it lets you create it faster"
layout: post
slug: ai-and-technical-debt
date: 2026-07-29
author: The Elegant team
category: ai-and-frontend
tags: [ai, technical-debt, quality, guardrails]
description: 'A model that generates code at ten times human speed also generates debt at ten times human speed, if you let it. The productivity is real; so is the pile it can leave behind without a standard to hold it to.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 5
related_practice: [harness-atom-guardrail, harness-state-shape]
---

There is a comforting story that AI will clean up our codebases. The opposite is the
default. A model that writes code ten times faster also writes *debt* ten times
faster, because it optimises each task locally and has no stake in the whole. The
productivity is real — and so is the pile it leaves behind if nothing holds it to a
standard. Technical debt is not a byproduct of slow humans that speed removes; it is
what accumulates when changes are made without regard for the system's shape, and a
fast generator makes changes faster than that regard can keep up. AI is an
accelerator, and an accelerator points debt whichever way you were already headed.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="td-t td-d" class="blog-figure__svg">
  <title id="td-t">Without a standard, faster generation means a faster-growing debt curve</title>
  <desc id="td-d">Two curves over time. Without guardrails, debt rises steeply with AI speed. With a guardrail floor, debt stays flat because each change is held to a standard.</desc>
  <line x1="50" y1="150" x2="600" y2="150" stroke="#606c71" stroke-width="1.5"/><text x="320" y="172" text-anchor="middle" fill="#819198" font-size="9">changes over time →</text>
  <line x1="50" y1="20" x2="50" y2="150" stroke="#606c71" stroke-width="1.5"/><text x="30" y="90" fill="#819198" font-size="9" transform="rotate(-90 30 90)">debt</text>
  <path d="M50 150 Q 300 140, 600 40" fill="none" stroke="#c2571a" stroke-width="2.5"/><text x="560" y="35" fill="#c2571a" font-size="9" text-anchor="end">no standard</text>
  <path d="M50 150 L600 138" fill="none" stroke="#157878" stroke-width="2.5"/><text x="560" y="128" fill="#157878" font-size="9" text-anchor="end">guardrail floor</text>
</svg>
<figcaption>Speed does not bend the debt curve down; a standard does. Without one, faster generation just climbs the curve faster.</figcaption>
</figure>

## The debt AI adds looks like progress

The dangerous thing is that AI-generated debt arrives disguised as velocity. Each
diff works and ships, so the dashboard looks great — while boundaries erode, the
store fills with derived fields, and the same near-duplicate component appears in
five places because generating a fresh one was easier than finding the existing one:

```jsx
// generated three times across the app, slightly different each time — debt as "done"
function UserBadgeV2({ user }) {
  const data = useSelector((s) => s.users.byId[user.id]);   // fetches in the UI, again
  return <span>{data?.name}</span>;
}
```

No single diff triggers a review flag. The pile is the sum, and the sum grows at
generation speed.

## The standard has to be executable

You cannot hold the line by intention when changes arrive faster than you can read
them — the only backstop that scales with generation is one that *runs*. Encode the
architecture rules as checks, and debt-adding changes fail at the door instead of
merging and compounding:

```js
// the standard, executable: a UI file that imports state fails the build
test("no state imports under ui/", () => {
  for (const f of glob("src/ui/**/*.jsx"))
    expect(read(f)).not.toMatch(/useSelector|from ['"].*\/state/);
});
```

Now the third duplicated, store-reaching badge does not land, and the debt curve
stays flat because each change is measured before it joins the pile.

## Speed is only a gift if the floor holds

The honest framing is that AI's speed is a genuine gift *conditional on* a standard
that holds at that speed. Pair fast generation with an executable guardrail and you
get the productivity without the pile — the model does the volume, the checks keep
the shape. Skip the guardrail and you get a codebase that grew a year's worth of debt
in a sprint, all of it looking like progress until the day a small change touches
fifty coupled places. This is the same lesson as "executable guardrails beat review,"
sharpened by throughput: the faster the generator, the more the floor matters, because
there is less and less time for a human to catch what slips. The harness-atom-guardrail
and harness-state-shape exercises build exactly the floor that keeps AI's speed from
becoming AI's debt.
