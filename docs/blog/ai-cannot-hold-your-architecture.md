---
title: "AI cannot hold your architecture, so you have to"
slug: ai-cannot-hold-your-architecture
layout: post
date: 2026-07-31
author: The Elegant team
category: ai-and-frontend
tags: [ai, architecture, state, quality]
description: 'A model has no memory of your system and no stake in its shape, so it optimizes each task locally and erodes the structure globally. The durable job is owning the architecture the model keeps forgetting.'
cover: /assets/img/ui-server-state.png
reading_minutes: 6
related_practice: [harness-state-shape, presentational-vs-container, normalize-entities]
---

A language model answers the prompt in front of it. It does not carry a model of
your whole system between requests, it has no stake in whether your architecture
survives the next quarter, and it will happily optimise the current task in a way
that is locally sensible and globally corrosive. This is not a flaw you can prompt
away — it is structural. The context window is finite, each request is largely
fresh, and "make this one thing work" is a different objective from "keep the
system coherent." So the architecture — the boundaries, the invariants, the shape
of state — is the one thing that cannot be delegated. Someone with continuity and
a stake has to hold it, and that someone is you.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="ah-t ah-d" class="blog-figure__svg">
  <title id="ah-t">Each locally-optimal task nudges the structure until it drifts</title>
  <desc id="ah-d">A straight architecture line at the top. Below it, a series of individual task fixes each pulling slightly off-line, and the accumulated path drifting far from the intended structure.</desc>
  <line x1="30" y1="55" x2="610" y2="55" stroke="#157878" stroke-width="2.5"/><text x="30" y="42" fill="#157878" font-size="11" font-weight="700">intended architecture</text>
  <path d="M30 90 L110 100 L190 96 L270 118 L350 128 L430 150 L510 158 L590 178" fill="none" stroke="#c2571a" stroke-width="2.5"/>
  <g fill="#fff4ec" stroke="#fe854c" stroke-width="1.5"><circle cx="110" cy="100" r="5"/><circle cx="190" cy="96" r="5"/><circle cx="270" cy="118" r="5"/><circle cx="350" cy="128" r="5"/><circle cx="430" cy="150" r="5"/><circle cx="510" cy="158" r="5"/></g>
  <text x="120" y="90" fill="#819198" font-size="9">each "just make it work"</text>
  <text x="470" y="195" fill="#c2571a" font-size="10" font-weight="700">drift nobody decided on</text>
  <line x1="590" y1="55" x2="590" y2="178" stroke="#dce6f0" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="600" y="120" fill="#819198" font-size="9" transform="rotate(90 600 120)">gap</text>
</svg>
<figcaption>No single task moves far off the line. The sum of a hundred locally-reasonable fixes is a structure no one chose.</figcaption>
</figure>

## Local optimisation, global erosion

The mechanism is easy to watch. Ask for "show the user's name in the header" and
the shortest correct answer is to fetch the user inside the header component.
Ask for "add a total to the cart summary" and the shortest answer is to store the
total as a field. Each is fine in isolation. Together they put fetching in the UI
layer and derived data in the store — two boundaries gone — and no reviewer saw a
"bad" diff, only a series of reasonable ones:

```jsx
// locally reasonable, globally wrong: a presentational header now fetches
function Header() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch("/api/me").then(r => r.json()).then(setUser); }, []);
  return <span>{user?.name}</span>;   // the boundary didn't break; it dissolved
}
```

## The fix is to externalise the memory the model lacks

You cannot give the model continuity, but you can put the architecture *outside*
it, where every task must pass through it. That is what a written spec plus
executable checks are for: the invariants live in the repo, not in someone's head,
so a locally-optimal change that violates them fails loudly:

```js
// the architecture, made explicit and enforceable
test("presentational components never fetch", () => {
  const uiFiles = glob("src/ui/**/*.jsx");
  for (const f of uiFiles) {
    expect(read(f)).not.toMatch(/\bfetch\(|useQuery|useEffect.*fetch/);
  }
});
```

Now the fetching header does not merge, and the model's missing memory is supplied
by a check that never forgets.

## Own the shape, delegate the typing

The healthy division of labour is precise: let the model do the *typing* —
generate the component body, fill in the boilerplate, draft the test — and keep
for yourself the *decisions* that require holding the whole system in mind: where
this state belongs, which layer may talk to which, what the store's shape is
allowed to be. Then encode those decisions so they survive the next hundred
generations. The engineers who struggle in this era are the ones who tried to
compete with the model at typing; the ones who thrive moved up to owning the
structure and made that structure executable. The harness-state-shape and
presentational-vs-container exercises are deliberately about that boundary — the
one the model will erode by default and you have to hold on purpose.
