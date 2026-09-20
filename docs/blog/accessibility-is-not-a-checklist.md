---
title: "Accessibility is not a checklist you run at the end"
slug: accessibility-is-not-a-checklist
layout: post
date: 2026-06-20
author: The Elegant team
category: terminology
tags: [ui, accessibility, quality, process]
description: 'Automated checkers catch maybe half of accessibility issues, and only the mechanical half. The rest — does the keyboard flow make sense, does the screen reader tell a coherent story — needs building in, not auditing on.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [harness-a11y-gate, accessible-combobox, form-field-molecule]
---

The comfortable model of accessibility is a checklist you run before launch: an
automated scan, fix the red items, ship. It is comfortable because it is
deferrable, and it is wrong because of what the scanners can and cannot see.
Automated tools catch roughly half of accessibility issues, and only the
*mechanical* half — a missing `alt`, a low-contrast colour, an input without a
label. The other half is about whether the experience actually *works* for someone
using a keyboard or a screen reader: does focus go somewhere sensible when a dialog
opens, does the reader announce a coherent story, can you complete the task without
a mouse. None of that is a checkbox. It is built in, or it is absent.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="ac-t ac-d" class="blog-figure__svg">
  <title id="ac-t">Automated checks cover the mechanical half; the experiential half needs building in</title>
  <desc id="ac-d">A bar split in two. The left half, labelled automated, covers contrast, alt text and labels. The right half, labelled needs building in, covers keyboard flow, focus order and screen-reader narrative.</desc>
  <rect x="40" y="70" width="270" height="60" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="175" y="95" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">automated (~half)</text><text x="175" y="115" text-anchor="middle" fill="#819198" font-size="9">contrast · alt · missing labels</text>
  <rect x="330" y="70" width="270" height="60" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="465" y="95" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">built in (the rest)</text><text x="465" y="115" text-anchor="middle" fill="#819198" font-size="9">keyboard flow · focus · reader narrative</text>
  <text x="320" y="45" text-anchor="middle" fill="#606c71" font-size="10">a scanner sees the left; only design and testing cover the right</text>
</svg>
<figcaption>The scanner's territory is the mechanical left half. The experiential right half — the part users actually feel — is designed and tested in, never audited on.</figcaption>
</figure>

## What the scanner sees, and what it misses

Run an automated checker and it will reliably flag the mechanical faults. Those are
worth fixing and worth automating in a gate:

```js
// axe catches the mechanical half — automate it so it never regresses
import { axe } from "vitest-axe";
test("dialog has no obvious a11y violations", async () => {
  const { container } = render(<Dialog open />);
  expect(await axe(container)).toHaveNoViolations();   // contrast, roles, labels
});
```

What that test *cannot* tell you: when the dialog opens, did focus move into it? Can
you close it with Escape? When you close it, does focus return to the button that
opened it? A perfectly "0 violations" dialog can fail every one of those.

## The experiential half is a design decision

Consider a modal. The accessible behaviour is a sequence of decisions no scanner
can make for you — move focus in on open, trap it while open, restore it on close:

```jsx
function Dialog({ open, onClose, children }) {
  const ref = useRef(null);
  const opener = useRef(null);
  useEffect(() => {
    if (open) {
      opener.current = document.activeElement;   // remember where focus was
      ref.current?.focus();                       // move focus INTO the dialog
    } else {
      opener.current?.focus();                    // restore it on close
    }
  }, [open]);
  return open ? <div role="dialog" aria-modal="true" tabIndex={-1} ref={ref}
    onKeyDown={(e) => e.key === "Escape" && onClose()}>{children}</div> : null;
}
```

That is not something you "check for" at the end — it is how the component is
built, or it is broken.

## Build it in, then gate the mechanical part

The honest process has two layers. Design and build the experiential accessibility
from the start — keyboard operability, focus management, a sensible reading order,
real labels — because retrofitting it means rewriting components. Then put the
*mechanical* half behind an automated gate so the easy regressions never ship. The
gate is not the strategy; it is the floor. Treating the whole thing as a
launch-week audit guarantees you find the expensive, structural problems at the
most expensive possible moment. The harness-a11y-gate exercise builds the automated
floor, and the accessible-combobox exercise is where the experiential half — focus,
keyboard, announcements — has to be designed in, because no scanner will hand it to
you.
