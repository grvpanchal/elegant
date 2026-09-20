---
title: "Controlled vs uncontrolled inputs: who owns the value?"
layout: post
slug: controlled-vs-uncontrolled-inputs
date: 2026-09-06
author: The Elegant team
category: terminology
tags: [ui, forms, state, components]
description: The whole controlled-versus-uncontrolled question comes down to one thing — does your component's state own the input's value, or does the DOM? Pick per field, not per app.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [form-field-molecule, query-string-state]
---

The controlled-versus-uncontrolled debate sounds like a framework quirk and is
really one clean question: **who owns the input's value?** In a controlled input,
your component's state owns it — the value comes from state, and every keystroke
goes through a handler that updates state, which re-renders the input. In an
uncontrolled input, the DOM owns it — the browser tracks the value internally and
you read it only when you need it. Neither is "correct"; they are two ownership
models, and the right choice is per field, driven by whether you need to *react* to
the value as it changes.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="cu-t cu-d" class="blog-figure__svg">
  <title id="cu-t">Controlled inputs loop value through state; uncontrolled inputs keep it in the DOM</title>
  <desc id="cu-d">Controlled: state to value to input, keystroke to onChange back to state, a closed loop. Uncontrolled: the DOM holds the value and a ref reads it only on submit.</desc>
  <text x="160" y="26" text-anchor="middle" fill="#155799" font-size="11" font-weight="700">controlled</text>
  <rect x="60" y="45" width="90" height="34" rx="6" fill="#e8eefb" stroke="#155799" stroke-width="2"/><text x="105" y="67" text-anchor="middle" fill="#155799" font-size="10">state</text>
  <rect x="220" y="45" width="90" height="34" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="265" y="67" text-anchor="middle" fill="#155799" font-size="10">input</text>
  <path d="M150 55 L218 55" stroke="#157878" stroke-width="2" marker-end="url(#cu-a)"/><text x="184" y="47" fill="#157878" font-size="8">value</text>
  <path d="M218 72 L150 72" stroke="#fe854c" stroke-width="2" marker-end="url(#cu-a)"/><text x="184" y="90" fill="#c2571a" font-size="8">onChange</text>
  <line x1="340" y1="20" x2="340" y2="180" stroke="#dce6f0"/>
  <text x="480" y="26" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">uncontrolled</text>
  <rect x="420" y="60" width="120" height="34" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="480" y="82" text-anchor="middle" fill="#c2571a" font-size="10">DOM owns value</text>
  <path d="M480 94 L480 130" stroke="#819198" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#cu-a)"/><text x="520" y="115" fill="#819198" font-size="8">ref.value</text>
  <rect x="425" y="132" width="110" height="26" rx="5" fill="#f3f6fa" stroke="#155799"/><text x="480" y="150" text-anchor="middle" fill="#155799" font-size="9">read on submit</text>
  <defs><marker id="cu-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Controlled runs every keystroke through state and back — a closed loop. Uncontrolled leaves the value in the DOM and reads it once, on demand.</figcaption>
</figure>

## Controlled: state owns the value

A controlled input has its `value` bound to state and an `onChange` that updates it.
The state is now the single source of truth, which means you can *react* to every
change — validate live, format as-you-type, enable a button, mirror the value
elsewhere:

```jsx
function Search() {
  const [q, setQ] = useState("");
  return (
    <input
      value={q}                                  // value comes FROM state
      onChange={(e) => setQ(e.target.value)}     // every keystroke updates state
    />
  );
  // now `q` is available to filter, validate, or debounce on each change
}
```

The cost is a render per keystroke and the discipline of keeping the loop closed —
forget the `onChange` and the input appears frozen, because state never updates.

## Uncontrolled: the DOM owns the value

An uncontrolled input lets the browser hold the value; you grab it with a ref only
when you need it, typically on submit. There is no per-keystroke render and no
state to manage:

```jsx
function SignupForm() {
  const email = useRef(null);
  const onSubmit = (e) => {
    e.preventDefault();
    sendSignup(email.current.value);   // read the DOM value once, on submit
  };
  return <form onSubmit={onSubmit}><input ref={email} defaultValue="" /></form>;
}
```

Note `defaultValue`, not `value`: you seed the initial value but do not bind it, so
the DOM stays in charge.

## Choose per field by "do I need to react?"

The decision rule is simple and it is per *field*, not per app. Use **controlled**
when you need to respond to the value as it changes — live validation, formatting,
a dependent field, a character counter, disabling submit until valid. Use
**uncontrolled** when you only need the value at the end and want to avoid the
render churn — a large form of plain fields, a file input (which is always
uncontrolled), integrating a non-React widget. Many real forms mix the two: an
email field that validates live is controlled, while the twelve plain text fields
beside it are uncontrolled for performance. The trap to avoid is switching an input
between the two across renders (a `value` that is sometimes `undefined`), which
makes React warn and behave erratically — pick an owner per field and keep it. The
form-field-molecule exercise builds a field that supports both modes cleanly, which
is the clearest way to internalise that "controlled or not" is an ownership choice,
not a rule.
