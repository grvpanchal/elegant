---
title: Build a toast notification stack
layout: question
slug: toast-notifications
format: ui-coding
difficulty: medium
layer: ui
topics: [organism, events, accessibility]
skill: ui-organism
minutes: 40
frameworks: [react, vue]
summary: Stacked, auto-dismissing toasts that a screen reader announces and a keyboard can reach — without stealing focus.
---

Build a toast system: something anywhere in the app calls `notify("Saved")` and
a message appears bottom-right, then disappears.

- Toasts stack; the newest is nearest the corner and older ones shift.
- Each dismisses itself after 5 seconds, or immediately on its close button.
- The timer pauses while the pointer is over the toast **or** while focus is
  inside it, and resumes on leave.
- A screen reader announces new toasts without focus moving to them.
- `error` toasts are announced assertively and do **not** auto-dismiss.

Starter files are in `practice/workspace/toast-notifications/<framework>/`.

## Solution

### Approach 1: one live region, toasts rendered into it

A single container carries the live region, and toasts are just children.

```jsx
<div className="toast-stack">
  <div aria-live="polite" aria-atomic="false" className="toast-stack__region">
    {toasts.filter(t => t.tone !== "error").map(renderToast)}
  </div>
  <div role="alert" className="toast-stack__region">
    {toasts.filter(t => t.tone === "error").map(renderToast)}
  </div>
</div>
```

Two regions, because politeness is a property of the region and not of the
message. A `polite` region waits for the user to pause; `role="alert"` (which
is `assertive` plus `atomic`) interrupts. Putting an error into the polite
region means the user hears about a failed save after whatever they were
reading — which is the wrong order for the one message that needs acting on.

The regions must exist in the DOM **before** the first toast is added.
Injecting a live region and its content in the same tick is the single most
common reason a toast is never announced: the screen reader has nothing to
observe a change against.

### Approach 2: a toast component that owns its own timer

Each toast holds its own `setTimeout` and pause state, and calls
`onDismiss(id)` when it expires.

```jsx
function Toast({ id, message, tone, onDismiss }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || tone === "error") return;
    const timer = setTimeout(() => onDismiss(id), 5000);
    return () => clearTimeout(timer);
  }, [paused, tone, id, onDismiss]);
  return (
    <div className={`toast toast--${tone}`}
         onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
         onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <p className="toast__message">{message}</p>
      <button type="button" onClick={() => onDismiss(id)} aria-label={`Dismiss: ${message}`}>×</button>
    </div>
  );
}
```

Local timers keep the parent a plain list and make pausing trivial — the effect
re-runs and the old timeout is cleaned up. The cost is that the parent cannot
answer "how long until this clears", which matters if you ever want a progress
bar on the toast.

A single parent timer over a sorted queue gives you that, and buys a great deal
of bookkeeping you do not need yet.

## Trade-offs

**Focus is the decision that separates a good toast from a hostile one.** Never
move focus to a toast. A toast is not a dialog: the user did not ask for it,
and yanking focus mid-typing loses keystrokes and their place. The consequence
is that the close button is unreachable by Tab until focus naturally arrives
there, which is why auto-dismiss and the live-region announcement have to carry
the weight.

**Pausing on focus, not just hover, is the accessibility fix people skip.** A
keyboard user who tabs into a toast to dismiss it will otherwise watch it
vanish mid-reach. `onFocusCapture` / `onBlurCapture` (or `focusin`/`focusout`
on the element) is two lines and it is what makes the timer humane.

**Errors that auto-dismiss are errors that never happened.** Five seconds is
fine for "Saved". It is not fine for "Could not save — your changes are still
here", which needs to survive until it is read. Tie the dismissal policy to
tone, not to a global constant.

**Stacking limit.** An unbounded stack covers the screen during a retry storm.
Cap it (three is common), drop the oldest, and collapse duplicates by message —
otherwise a failing poll turns your notification system into a denial of
service on your own UI.

## Related

- Reading: [Organism](../ui/organism.html) · [Events](../ui/events.html) · [Accessibility](../ui/accessibility.html)
- Agent Skill: `ui-organism`
