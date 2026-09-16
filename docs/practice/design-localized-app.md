---
title: Design a localized application
layout: question
slug: design-localized-app
format: system-design
difficulty: easy
layer: server
topics: [localization, seo, router, ssr]
skill: server-localization
minutes: 25
summary: Locale detection, URL shape, bundle splitting and the formatting bugs that only appear in someone else's language.
---

An English app is launching in French, German, Japanese and Arabic. Design the
localization: how a locale is chosen, what the URLs look like, how translations
reach the browser, and what breaks that English never revealed.

## Solution

### The URL carries the locale

`/fr/products/123`, not a cookie, not a header alone. A path prefix is
shareable, cacheable per locale, indexable by search engines, and visible — a
user who lands in the wrong language can see why and fix it.

Detection runs once, on first visit to the bare path: read `Accept-Language`,
pick the best supported match, redirect to the prefixed URL, and remember the
choice. After that the URL is the source of truth, and a manual switcher writes
a new URL rather than a new cookie. `hreflang` links tie the locale variants
together so search engines index them as alternates instead of duplicates.

### Translations are code-split like everything else

One bundle per locale per route, loaded with the route. Shipping every language
to every user is the most common mistake and the easiest to measure — it shows
up directly in transfer size.

Keys are namespaced by feature (`checkout.summary.total`), never by English
text. Using the English string as the key means every copy edit silently breaks
every other language, and you find out from a user.

### Format with `Intl`, never by hand

Dates, numbers, currencies, plurals and relative times all belong to
`Intl.DateTimeFormat`, `Intl.NumberFormat` and `Intl.PluralRules`. Hand-written
formatting is where localization bugs live: `1,000.50` is `1.000,50` in German,
and a "just add an s" plural is wrong in most languages — Arabic has six plural
categories, Japanese has one.

Interpolate, never concatenate. `"You have " + n + " items"` cannot be
translated into a language with different word order; `t("cart.items", { n })`
can.

### Right-to-left is a layout property, not a translation

Arabic needs `dir="rtl"` on `<html>` and logical CSS properties throughout:
`margin-inline-start` instead of `margin-left`, `inset-inline-end` instead of
`right`. Done that way, RTL costs almost nothing. Retrofitted with a mirrored
stylesheet, it costs a quarter.

Directional icons — back arrows, progress chevrons — must flip. Logos and media
controls must not.

### What breaks that English never showed

| Problem | Where it appears |
|---|---|
| German compound words overflow buttons | fixed-width controls; test with a 40% longer pseudo-locale |
| Japanese has no spaces | line-breaking and truncation by character count |
| Sorting | `Intl.Collator`, not `Array.sort` — ä sorts differently in Swedish and German |
| Dates | `DD/MM` vs `MM/DD` is a wrong date, not a formatting nit |
| Hardcoded strings | an aria-label, a `<title>`, an error from a catch block |

## Trade-offs

**Path prefix vs subdomain vs domain.** The prefix is simplest and keeps one
origin, so storage and auth just work. Country domains rank better locally and
multiply your infrastructure and certificate story. Subdomains sit in between
and split your cookies.

**SSR per locale** multiplies your cache keys by the number of languages, which
is fine at four and worth thinking about at forty. Static generation per locale
multiplies build time instead — usually the better trade, since builds are
cheap and requests are not.

**Machine translation to launch** gets you to market and produces confidently
wrong text in exactly the places that matter — legal copy, error messages,
anything with a negation. Use it for breadth, review the paths that involve
money or consent.

## Related

- Reading: [Localization](../server/localization.html) · [SEO](../server/seo.html) · [Router](../server/router.html) · [SSR](../server/ssr.html)
- Agent Skill: `server-localization`
