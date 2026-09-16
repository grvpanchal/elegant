---
title: The frontend system design playbook
layout: doc
slug: system-design
description: A repeatable structure for frontend system design questions — requirements, rendering strategy, data flow, budgets, and the failure modes that separate a design from a diagram.
order: 20
---

# The frontend system design playbook

"Design Twitter's feed" is not a smaller version of "design Twitter". The
database is someone else's problem. Yours is everything between the network and
the pixel: what renders where, what is cached and for how long, how much
JavaScript the user pays for, and what the screen looks like while the data is
still in flight.

Frontend design rounds are graded on structure more than on cleverness, which
is good news — structure is learnable. What follows is a shape you can put on
almost any question.

## Start by shrinking the problem

The first two minutes decide the rest. Ask what the product actually has to do
before you draw anything: who uses it, on what, how much data, how fresh does
it have to be, and what is explicitly out of scope. Write the answers down
where the interviewer can see them, because you will be held to them and so
will they.

Three questions earn their time in almost every round. *How fresh must this
be?* separates a page you can cache at the edge for an hour from one that needs
a live connection, and that single answer eliminates half the design space.
*What is the slowest device and network you care about?* turns "make it fast"
into a budget. *What happens when it fails?* is the question that most reliably
surprises interviewers, because most candidates never ask it.

Say what you are not building. "I am going to assume the search backend exists
and returns ranked results in under 200ms" is not dodging; it is scoping, and
it buys you the time to design the part being examined.

## Rendering strategy is your first real decision

Everything downstream depends on where the HTML comes from, so decide it early
and out loud. [SSG](../server/ssg.html) for content that changes on a schedule
and is the same for everyone. [SSR](../server/ssr.html) when the first paint
must contain personalised or fresh data and the page has to be indexable.
Client rendering behind an [app shell](../server/app-shell.html) for
application surfaces that live behind a login, where the first paint is a
skeleton and nothing needs to be crawled.

Most real products are a mix, and saying so is a strength rather than a hedge —
as long as you draw the line. "Marketing pages static, the feed server-rendered
for the first screen then hydrated, the settings area a client-rendered shell"
is a design. "We could use any of them depending on requirements" is not.

Then say what it costs. Server rendering buys first paint and pays in server
capacity and cache complexity. Static generation buys the cheapest possible
delivery and pays in build time and staleness. Client rendering buys the
simplest deployment and pays with an empty screen on a cold cache.

## Data flow, in one direction

Draw the path a single piece of data takes: request, response, cache, store,
component. Then say which layer owns each concern, because the most common way
a frontend design falls apart is that two layers own the same thing.

Server state and client state are different animals and want different
treatment. A cached list of posts has a fetch status, a stale time and a
revalidation policy; a "which tab is open" flag has none of those. Put them in
the same [store](../state/store.html) and you end up hand-writing loading flags
for the rest of the project. Say which library or pattern owns each, and why.

Talk about [selectors](../state/selectors.html) when the shape the components
want differs from the shape the server sends — which is nearly always. The
point worth making is not that memoisation is fast; it is that the derived
shape lives in one place instead of being recomputed slightly differently in
four components.

For anything paginated, name the strategy and its failure mode. Offset
pagination is simple and duplicates or skips rows when the underlying list
changes between pages. Cursor pagination is stable and cannot jump to page
seven. Pick one, say why, and say what you would do about the weakness.

## Budgets make a design falsifiable

A design with no numbers cannot be wrong, which is why interviewers push for
them. Commit to a few:

- A JavaScript budget for the critical path, and what you drop if you exceed it.
- A first-paint target on the slow device you named earlier.
- A cache policy per resource class: immutable versioned assets for a year, the
  HTML shell for minutes, API responses by freshness requirement.
- A layout-stability budget, which is really a rule: every async region reserves
  its space before the data arrives.

Then say how you would know. "We ship this behind a flag to 5% and watch p75
first paint and the error rate per route" is a better ending than a longer
diagram.

## Failure, offline and the empty screen

Design the unhappy paths explicitly, because that is where products are
actually judged. What does the user see when the request is slow — a spinner, a
[skeleton](../ui/skeleton.html), or stale content with a freshness marker?
Stale-with-a-marker is usually right for a feed and usually wrong for a
balance. What happens when the request fails: retry with backoff, fall back to
cache, or surface an error the user can act on? What is on screen before any
data exists at all?

If the product plausibly runs offline, say what a [PWA](../server/pwa.html)
buys and what it costs: a service worker gives you offline reads and a much
harder deployment story, because now two versions of your application can be
live in the same browser.

## The failure modes

**Designing a backend.** Sharding and replication are not your round. Every
minute there is a minute not spent on rendering, caching or state.

**A diagram with no decisions.** Boxes and arrows are the notation, not the
answer. Each box should come with a sentence saying why it exists and what you
rejected.

**Refusing to choose.** Naming three options and their trade-offs is the setup;
picking one is the answer.

**Ignoring the first load.** Application designs that assume a warm cache and a
logged-in user skip the moment most users actually experience.

**Leaving out failure.** A design that only describes success is half a design,
and it is the half the interviewer already assumed you could do.

## Practice

- [Design an embeddable widget](../practice/design-embeddable-widget.html) —
  real constraints, a hostile environment, and a versioning decision you cannot
  take back.
- [Memoize a derived selector](../practice/memoized-selector.html) — the data
  layer of the above, in code.
- Then read [MFE](../server/mfe.html) and [Protocol](../server/protocol.html)
  before any round at a company with more than one frontend team.
