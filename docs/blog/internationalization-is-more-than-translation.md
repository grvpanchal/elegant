---
title: "Internationalization is more than swapping the words"
layout: post
slug: internationalization-is-more-than-translation
date: 2026-07-14
author: The Elegant team
category: architecture
tags: [server, i18n, localization, ux]
description: 'Translating strings is the easy, visible part. The hard part is everything else a locale changes — dates, numbers, currency, plurals, text direction, and layouts that must survive words twice as long.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 5
related_practice: [design-localized-app]
---

Internationalization gets mistaken for "translate the strings," because that is the
visible part. It is the easy part. The hard part is everything *else* a locale changes:
how dates and numbers and currency are formatted, how plurals work (some languages have
six plural forms, not two), which direction the text runs, and whether your layout
survives a language where the same label is twice as long. A page that swaps English for
German but breaks its buttons, mis-formats every price, and mangles plurals is not
localized — it is translated and broken. Building for i18n from the start is far cheaper
than retrofitting it, because it touches formatting, layout, and data throughout.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="i18-t i18-d" class="blog-figure__svg">
  <title id="i18-t">Translation is one layer; a locale also changes format, plurals, direction and layout</title>
  <desc id="i18-d">A stack: strings (translation) on top, then formatting (dates, numbers, currency), plurals, text direction (LTR/RTL), and layout that must absorb longer words.</desc>
  <g font-size="9" text-anchor="middle">
    <rect x="180" y="25" width="280" height="26" rx="5" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="320" y="42" fill="#157878">strings (the visible, easy layer)</text>
    <rect x="150" y="57" width="340" height="26" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="320" y="74" fill="#c2571a">formats: dates · numbers · currency</text>
    <rect x="150" y="89" width="340" height="26" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="320" y="106" fill="#c2571a">plurals (0,1,few,many…) · gender</text>
    <rect x="150" y="121" width="340" height="26" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="320" y="138" fill="#c2571a">direction: LTR / RTL</text>
    <rect x="130" y="153" width="380" height="26" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="320" y="170" fill="#c2571a">layout that absorbs 2x-longer words</text>
  </g>
</svg>
<figcaption>Translation is the top layer. Everything under it — formats, plurals, direction, and a layout that flexes — is the work that actually makes an app localized.</figcaption>
</figure>

## Format with the platform, don't hand-roll

Never concatenate a date or a price by hand — the rules differ per locale and the
platform already knows them. `Intl` formats dates, numbers, and currency correctly for
any locale, including separators, symbols, and ordering:

```js
// let the platform apply each locale's rules — don't build "$1,234.50" by hand
new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(1234.5);
// → "1.234,50 €"   (comma decimal, dot thousands, symbol after, in German)
new Intl.DateTimeFormat("ja-JP").format(new Date());   // → "2026/07/14" in Japanese order
```

Hand-formatting is where localization quietly breaks: an American date shown to a
European reader is not just ugly, it is *wrong* (is 03/04 March 4th or April 3rd?).

## Plurals and interpolation are not string concatenation

"1 item" vs "2 items" looks trivial in English and is a trap: many languages have
several plural categories, and gluing a number to a suffix cannot express them. Use a
message format that takes the count and picks the right form per locale:

```js
// ICU MessageFormat: the library picks the correct plural form for the locale
const msg = new IntlMessageFormat(
  "{count, plural, =0 {No items} one {# item} other {# items}}", locale
);
msg.format({ count: 0 });   // "No items"  — and Polish/Russian get their own 'few'/'many'
```

Never build a sentence by concatenating pieces, either — word order differs across
languages, so the whole sentence is one translatable message with named slots.

## Design the layout and direction to flex

The two things that silently break are *length* and *direction*. German and Finnish
words can be twice the English length, so a button sized to "Save" clips "Speichern
unter" — design flexible, wrapping layouts, never fixed pixel widths around text. And
right-to-left languages (Arabic, Hebrew) mirror the entire layout, so use
direction-agnostic CSS (logical properties like `margin-inline-start`, not
`margin-left`) and let `dir="rtl"` flip it:

```css
/* logical properties flip automatically for RTL — margin-left would not */
.card { padding-inline-start: 1rem; text-align: start; }
```

Internationalization done right is a set of habits applied from the start: format with
`Intl`, express plurals and sentences as whole messages, and build layouts that absorb
longer text and mirror for RTL. Retrofitting these later means auditing every date,
price, sentence, and fixed width in the app — which is exactly why it is a foundation,
not a feature. The design-localized-app exercise walks through all of it together,
which is where "more than translation" stops being a slogan and becomes a checklist.
