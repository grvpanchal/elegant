---
title: "A component should do one job, and you should be able to name it"
slug: the-single-responsibility-of-a-component
date: 2026-06-21
layout: post
author: The Elegant team
category: architecture
tags: [ui, components, architecture, maintainability]
description: 'If you cannot describe a component in one sentence without saying "and", it is doing too much. The single-responsibility test is the cheapest way to know when to split — and where.'
cover: /assets/img/atomic-design.png
reading_minutes: 5
related_practice: [atom-boundaries, presentational-vs-container]
---

The single-responsibility principle has a wonderfully cheap test for components: try to
describe what the component does in one sentence. If you cannot do it without an "and,"
it is doing too much. "It shows the user's profile" is one responsibility. "It fetches
the user *and* renders the profile *and* handles the edit form *and* manages the
toast" is four, and the "and"s are telling you exactly where the split lines are. This
test costs nothing, applies at any level, and answers the two hard questions of
component design at once — *when* to split (when you need an "and") and *where* (at each
"and").

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="sr-t sr-d" class="blog-figure__svg">
  <title id="sr-t">A component with many 'and's splits into single-responsibility pieces</title>
  <desc id="sr-d">Left: one component described with three 'and's. Right: it splits into three components, each described by one sentence with no 'and'.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">one "and"-heavy component</text>
  <rect x="50" y="45" width="200" height="90" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="150" y="72" text-anchor="middle" fill="#c2571a" font-size="9">fetches user AND</text><text x="150" y="90" text-anchor="middle" fill="#c2571a" font-size="9">renders profile AND</text><text x="150" y="108" text-anchor="middle" fill="#c2571a" font-size="9">handles edit form</text>
  <path d="M255 90 L305 90" stroke="#819198" stroke-width="2" marker-end="url(#sr-a)"/><text x="280" y="82" fill="#819198" font-size="8">split at each "and"</text>
  <g fill="#e8f0f8" stroke="#157878" stroke-width="2" font-size="8" text-anchor="middle">
    <rect x="330" y="40" width="130" height="28" rx="5"/><text x="395" y="58" fill="#157878">Container (fetches)</text>
    <rect x="330" y="76" width="130" height="28" rx="5"/><text x="395" y="94" fill="#157878">Profile (renders)</text>
    <rect x="330" y="112" width="130" height="28" rx="5"/><text x="395" y="130" fill="#157878">EditForm (edits)</text>
  </g>
  <defs><marker id="sr-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Each "and" in the description is a seam. Split there and every resulting component passes the one-sentence test — one job, nameable.</figcaption>
</figure>

## The "and" is the split line

Watch the test find the seams. This component's description needs three "and"s, and
each one marks a responsibility that wants its own home:

```jsx
// "fetches the user AND renders the profile AND owns the edit form" — three jobs
function UserProfile({ id }) {
  const user = useSelector((s) => s.users.byId[id]);   // job 1: get the data
  const [editing, setEditing] = useState(false);        // job 3: edit mode
  useEffect(() => { dispatch(loadUser(id)); }, [id]);   // job 1 again
  return editing
    ? <form>{/* 30 lines of edit form — job 3 */}</form>
    : <div>{/* profile markup — job 2 */}</div>;
}
```

Split at the "and"s and each piece gets a one-sentence description: a container that
fetches, a presentational profile that renders, and an edit form that edits.

## Each piece is nameable, testable, reusable

The payoff of one-job components is concrete. A component that does one thing is
**nameable** (its name is the sentence), **testable** (you test one behaviour, not a
tangle), and **reusable** (the profile renderer can appear anywhere, because it does
not drag fetching and editing with it):

```jsx
function UserProfileContainer({ id }) {          // "fetches the user"
  const user = useUser(id);
  return <UserProfile user={user} />;
}
function UserProfile({ user }) {                 // "renders the profile" — pure, reusable
  return <div>{user.name}</div>;
}
```

Three small components you can each hold in your head beat one you cannot.

## Responsibility, not line count, is the metric

The nuance that keeps this from becoming dogma: the rule is about *responsibility*, not
size. A 200-line component that does one genuinely complex thing (a rich date picker)
can be fine; a 20-line one that fetches, transforms, and renders is doing three things
and should split. So do not chase a line limit — chase the one-sentence test, and let
it tell you both when (an "and" appeared) and where (at that "and"). Over-splitting has
its own cost, too: a component so tiny it only forwards props adds indirection without
earning it, so split when there is a *real* second responsibility, not on reflex. The
whole discipline fits in a sentence about sentences: if you can't name it in one
without "and," split it there. The atom-boundaries and presentational-vs-container
exercises are this test applied — placing a component by its single job and pulling the
extra jobs out.
