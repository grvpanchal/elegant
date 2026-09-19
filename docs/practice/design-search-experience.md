---
title: Design a search-as-you-type experience
layout: question
slug: design-search-experience
format: system-design
difficulty: medium
layer: server
topics: [api, ajax, router, seo]
skill: server-api
minutes: 35
summary: Debounce, cancellation, out-of-order responses, caching and the URL — the five things that decide whether search feels instant or broken.
---

A catalogue of two million products needs search-as-you-type: results update
while the user types, with filters and a shareable URL.

Design the client side. Be explicit about request volume, ordering, caching,
what the URL holds and what the user sees while results are in flight.

## Solution

### Five problems, in the order they bite

**1. Too many requests.** Debounce input by 200–300ms. Below 150ms you are
paying for keystrokes nobody wanted searched; above 400ms it stops feeling
live. Also enforce a minimum query length (2 characters), because one character
matches everything and costs the most to rank.

**2. Out-of-order responses.** This is the bug that survives every other fix.
Type `ip`, then `iphone`; the response for `ip` arrives second and overwrites
the results for `iphone`. Debouncing makes it rarer and does not prevent it.

Two correct fixes, and you want both:

```js
// cancel the previous request
controller?.abort();
controller = new AbortController();
const res = await fetch(url, { signal: controller.signal });

// and ignore any response that is not for the current query
if (query !== latestQueryRef.current) return;
```

Abort saves the bandwidth; the identity check is what guarantees correctness,
because an aborted request can still have its response in flight.

**3. The gap while typing.** Never blank the list. Keep the previous results
visible, dimmed, with `aria-busy="true"` on the region — the user is comparing
against what they just saw, and an empty screen destroys that. A
[skeleton](../ui/skeleton.html) is right for the *first* search and wrong for
every subsequent one.

**4. Repeat queries.** Users backspace constantly, so the query the user just
had is the most likely next query. An LRU keyed on the full request (query +
filters + page) with a short TTL makes backspacing instant and costs almost
nothing.

**5. The URL.** Query, filters, sort and page belong in the query string —
[shareable, back-button-correct, cacheable](../server/router.html). Use
`replaceState` while typing and `pushState` on a deliberate action (submitting,
changing a filter), or every keystroke becomes a history entry and the back
button takes forty presses to escape.

### Ranking and empty states

The empty state is part of the design, not an afterthought. "No results for
*wireles headphones*" plus a spelling suggestion and the filters that could be
relaxed recovers a session that would otherwise end. Show which filter excluded
everything — usually it is one.

### Accessibility

The results region is `aria-live="polite"` announcing a count, not the results
themselves ("24 results"). The input is a
[combobox](../practice/accessible-combobox.html) if you show a suggestion
dropdown, with `aria-activedescendant` so arrowing through suggestions does not
take focus out of the field.

### What you measure

| Signal | Why |
|---|---|
| Requests per search session | whether the debounce is doing its job |
| p75 keystroke-to-render | the number the user feels |
| Share of searches with zero results | usually a ranking or synonym problem, not a UI one |
| Cache hit rate on backspace | cheap latency you are leaving on the table |
| Searches abandoned before any click | the honest measure of whether it works |

## Trade-offs

**Debounce vs throttle.** Debounce waits for a pause, which is right for typing.
Throttle emits at a fixed rate, which is right for scroll. Using throttle here
fires mid-word and searches for prefixes nobody meant.

**Client cache vs edge cache.** An LRU in memory is instant and per-tab; an edge
cache is shared and survives reloads, and it can only cache what is not
personalised. Do both — they serve different requests.

**Instant search vs submit.** Search-as-you-type costs roughly ten times the
query volume and wins on discovery. On an expensive backend, or where each query
runs an LLM, a submit button is a legitimate design and not a worse one.

**`replaceState` while typing** keeps history clean and means a mid-typing back
navigation leaves the page entirely. That is the right default, and it surprises
people, so pushState on the actions that feel like decisions.

## Related

- Reading: [API](../server/api.html) · [AJAX](../state/ajax.html) · [Router](../server/router.html)
- Practice: [Round-trip filter state through the URL](../practice/query-string-state.html)
- Agent Skill: `server-api`
