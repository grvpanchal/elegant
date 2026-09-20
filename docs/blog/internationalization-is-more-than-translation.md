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
reading_minutes: 4
related_practice: [design-localized-app]
---

Teams approach internationalization as a translation problem — swap the English
strings for other languages — and discover in production that translation is the
easy, visible tenth of it. A locale changes far more than words: how dates and
numbers are written, how money is formatted, how plurals work, which direction text
flows, and whether your layout survives a language where the same sentence is twice
as long. Underestimating that is why "we'll add languages later" is usually a
rewrite.

## Formatting is locale-specific and built into the platform

Dates, numbers, and currency are formatted differently in every locale — decimal
commas versus points, day-month versus month-day, currency symbols and their
placement. Do not hand-roll this; the platform's `Intl` APIs (`Intl.DateTimeFormat`,
`Intl.NumberFormat`) do it correctly for every locale, including edge cases you
would never think of. Hard-coding `$` or `MM/DD/YYYY` is a localization bug waiting
for its first non-US user. Formatting is not translation, and it breaks silently for
users whose conventions differ from the developer's.

## Plurals and interpolation are not string concatenation

"You have {n} messages" is a trap. Languages have different plural rules — some have
one plural form, some have several, some none — so `n + " messages"` is wrong in
most of the world, and building sentences by concatenating fragments produces
ungrammatical output because word order differs by language. The fix is a
message-formatting system (ICU MessageFormat and friends) that handles plural
categories and lets translators reorder the whole sentence, treating the string as a
template with rules, not a puzzle assembled from pieces. Concatenation is the
number-one i18n code smell.

## Layout must survive the words it will hold

Translated text changes length dramatically — German and Finnish run long, and some
scripts are taller. A button sized exactly to "OK" breaks on a language where the
same word is fifteen characters; a layout that assumes short labels overflows or
truncates. Design flexible layouts that expand with their content, test with a
pseudo-locale that lengthens strings, and never assume the English length is the
budget. And right-to-left languages (Arabic, Hebrew) flip the entire layout, so use
logical CSS properties (`margin-inline-start`, not `margin-left`) so the UI mirrors
correctly instead of breaking.

## Decide where localization happens

Architecturally, the big decision is where the locale is resolved. Server-side
rendering can produce the right language and formats in the initial HTML — good for
SEO and for avoiding a flash of the wrong locale — driven by the request's
`Accept-Language` or a path segment. Client-side switching is more flexible but
risks that flash and complicates SEO. Many apps do both: server-render the initial
locale, allow client switching after. Getting this seam right early is far cheaper
than retrofitting it. The localized-app design exercise is exactly this set of
decisions — formatting, plurals, layout, and where the locale is resolved — treated
as the architectural problem it is.
