---
title: "The URL is state too — and often the right place for it"
layout: post
slug: the-url-is-state-too
date: 2026-08-22
author: The Elegant team
category: terminology
tags: [state, routing, url, ux]
description: Filters, tabs, search queries and pagination all belong in the URL more often than in a store. If a user would want to bookmark, share, or reload into a view, that view's state should live in the address bar.
cover: /assets/img/state-system-diagram.png
reading_minutes: 3
related_practice: [query-string-state, design-search-experience]
---

Developers instinctively reach for component state or a store for filters, the
active tab, a search query, the current page of results. Often the right home is
somewhere they forget is stateful at all: the URL. The address bar is shared,
persistent, and free, and putting the right state there fixes a class of UX
complaints in one move.

## The test: would they bookmark it?

The question that decides is simple: if a user reloaded this page, or bookmarked
it, or sent the link to a colleague, would they expect to land back in this same
view? If yes, that view's state belongs in the URL. A filtered, sorted, page-3
product list that resets to defaults on reload is a bug users feel even if they
cannot name it — they lost their place. Encode the filters and page in the query
string and reload restores them, the back button works, and the link is
shareable. None of that needs a store; it needs `?category=state&sort=new&page=3`.

## What belongs in the URL, and what doesn't

URL state is for view state a user would want to return to: search queries,
filters, sort order, pagination, the open tab, a selected item's id. It is *not*
for ephemeral UI (a dropdown's open/closed), for large or sensitive data (never
put a token or a huge blob in the query string), or for state that changes many
times a second (a drag position would spam history). The line is roughly "would a
human want this in a bookmark?" — durable, shareable view state yes; transient
interaction state no.

## Round-tripping without fighting the router

The mechanics are where people stumble. The URL is the source of truth, so read
state *from* it on load and on every navigation, and write *to* it (replacing
rather than pushing history for rapid changes like typing) when the user changes a
filter. The trap is holding the state in both a store and the URL and trying to
sync them — you are back to the duplication problem, now with the browser as the
second owner. Pick the URL as the single source for that state and derive the
component's view from it; do not mirror it into local state "for convenience."

Treating the URL as state also composes with search-as-you-type: debounce the
input, then write the settled query to the URL so a reload re-runs the same
search. The address bar is the most under-used store in the frontend, and moving
filters and queries into it is often less code than the store version, not more —
plus you get sharing, bookmarking, and the back button for free. The
query-string-state exercise is exactly this round-trip, and the search-experience
design question is where it pays off.
