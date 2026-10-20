---
title: "SSR: HTML per request, and the hydration bill"
layout: lesson
course: server-layer
slug: ssr
term: server/ssr
skill: server-ssr
practice: render-strategy-choice
description: "What server rendering buys, what it costs on every request, and the three mistakes agents make in SSR code: browser APIs, unescaped state, a fresh store."
insight: "SSR sends a fully rendered HTML document for each request, so people and crawlers see content before any JavaScript runs, and the same components then hydrate in the browser. The price is a server render per request and a contract: the client must start from exactly the state the server rendered with."
---

## What SSR is, precisely

With client-side rendering the browser receives an empty shell and waits for
JavaScript to build the page. With [SSR]({{ '/server/ssr.html' | relative_url }})
the server generates the full HTML for every request, and the browser can paint
text and images immediately. The code is *universal*: the same components render
under Node and in the browser, and the client then **hydrates** — attaches its
event listeners to the HTML that is already there instead of rebuilding it.

The doc's Redux-Saga example shows the whole sequence. Create a store for the
request, dispatch the data request, `store.dispatch(END)` and await the saga task
so every fetch has finished, `renderToString` inside the `Provider`, then embed
`store.getState()` in the page as `window.__PRELOADED_STATE__` ahead of the
client bundle.

## Three mistakes, in code an agent will write

1. **Browser APIs on the server.** Reading `window.innerWidth` during render
   crashes Node, which has no `window`. Guard it, or move it into `useEffect`,
   which only runs in the browser.
2. **Unescaped serialised state.** The safe line escapes `<`:

   ```js
   window.__STATE__ = ${JSON.stringify(state).replace(/</g, '\\u003c')}
   ```

   Without the `replace`, a user-supplied string containing `</script>` closes
   the tag and whatever follows it runs. It is an XSS hole in the most innocent
   line on the page.
3. **A fresh store on the client.** `createStore(reducer)` without the preloaded
   state renders different content from the server's, so React discards the
   server HTML and renders again. You pay for SSR and get client rendering.

## When not to use it

The skill's DON'T list is the most useful part of any brief: don't server-render
highly personalised pages that nobody needs to find in search, don't use SSR
where SSG would work (static is faster), and don't ignore the server CPU each
request costs.

The practice quiz turns that into four briefs. A logged-in analytics dashboard
is not an SSR page: nothing on it is crawlable and nothing is shared between
users, so an app shell that streams data wins. A news homepage *is* SSR, but
behind a short edge cache with `stale-while-revalidate`, because uncached SSR
makes every reader in a traffic spike a server render. And the cost teams find
late is cache invalidation and capacity: personalising the HTML splits the cache
key per user and quietly turns a cached page into an uncached one.

## Review checklist for agent-written SSR

1. Data is fetched in the server-side step, before render, not in a client
   effect.
2. Nothing reads `window`, `document` or `localStorage` during the server
   render.
3. Serialised state escapes `<`.
4. The client store is created from the preloaded state.
5. The route is SEO-critical or dynamic enough to justify a render per request.
