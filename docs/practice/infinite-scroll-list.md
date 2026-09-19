---
title: Build an infinite-scroll list
layout: question
slug: infinite-scroll-list
format: ui-coding
difficulty: hard
layer: ui
topics: [organism, skeleton, events]
skill: ui-organism
minutes: 45
frameworks: [react, vue]
summary: A sentinel, an IntersectionObserver, and all the ways an infinite list traps the people using it.
---

Build a list that loads the next page as the user approaches the bottom.

- Loading starts before the user reaches the end, not after.
- Exactly one request is in flight at a time; scrolling fast must not fire five.
- A failed page shows a retry that does not lose the pages already loaded.
- The end of the data says so, and stops observing.
- Keyboard and screen-reader users can reach everything, including whatever
  follows the list.

Starter files are in `practice/workspace/infinite-scroll-list/<framework>/`.

## Solution

### Approach 1: an IntersectionObserver on a sentinel

```jsx
useEffect(() => {
  const node = sentinelRef.current;
  if (!node || done) return;
  const observer = new IntersectionObserver(
    (entries) => { if (entries[0].isIntersecting) loadMore(); },
    { rootMargin: "400px" }     // start loading 400px early
  );
  observer.observe(node);
  return () => observer.disconnect();
}, [loadMore, done]);
```

`rootMargin` is what turns "loads when you hit the bottom" into "the next page
is already there". Scroll-event handlers with `getBoundingClientRect` do the
same job while forcing layout on every frame; the observer costs nothing until
it fires.

Disconnecting when `done` is the part people leave out, and it is why exhausted
lists keep firing requests at a server that has nothing left to send.

### Approach 2: a guarded loader the observer merely triggers

The observer can fire several times before the first response lands, so the
guard belongs in the loader, not in the observer:

```jsx
const inFlight = useRef(false);
const loadMore = useCallback(async () => {
  if (inFlight.current || done) return;
  inFlight.current = true;
  setStatus("loading");
  try {
    const page = await fetchPage(cursor);
    setItems((prev) => [...prev, ...page.items]);
    setCursor(page.nextCursor);
    setDone(!page.nextCursor);
    setStatus("idle");
  } catch (err) {
    setStatus("error");          // keep the items already loaded
  } finally {
    inFlight.current = false;
  }
}, [cursor, done]);
```

A ref rather than state, because a state update is asynchronous and the second
observer callback would read the old value and fire anyway. This is the bug that
shows up as duplicated rows the first time someone flicks the scrollbar.

## Trade-offs

**Cursor vs offset pagination.** Offset is simpler and duplicates or skips rows
when the underlying list changes between pages — which, in an infinite feed, it
always does. Cursors are stable and cannot jump to an arbitrary page, which
infinite scroll does not need anyway.

**Infinite scroll costs you the footer.** Anything below the list becomes
unreachable, because the list grows as fast as the user scrolls. If there is a
footer with anything in it, use a "Load more" button, or a hybrid: auto-load
three pages, then require a click. This is a product decision the component
should surface, not hide.

**Memory.** Ten thousand DOM nodes will make a phone stutter no matter how
efficiently you appended them. Past a few thousand rows the answer is
virtualisation, and virtualisation plus infinite scroll is meaningfully harder
than either alone — so decide which problem you actually have before building
both.

**Announce the new rows.** Appending silently means a screen-reader user's
cursor stays where it was with no indication anything happened. A polite live
region saying "20 more results, 120 total" after each page is the minimum, and
`aria-busy` on the list while loading tells them why nothing is moving yet.

**Restoring position.** Navigating into a row and back should not dump the user
at the top of a one-page list. Persist the loaded pages and the scroll offset,
or accept that the back button is broken — but know which one you shipped.

## Related

- Reading: [Organism](../ui/organism.html) · [Skeleton](../ui/skeleton.html) · [Events](../ui/events.html)
- Agent Skill: `ui-organism`
