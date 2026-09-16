---
title: Pick a rendering strategy
layout: question
slug: render-strategy-choice
format: quiz
difficulty: medium
layer: server
topics: [ssr, ssg, app-shell, seo]
skill: server-ssr
minutes: 10
summary: Four product briefs, four rendering decisions, and the cost each one hides.
---

Rendering strategy is the first decision in a frontend design, and every
downstream choice inherits it. These four briefs each point at a different
answer.

{% include quiz.html id="render-strategy-1"
   question="Documentation for an open-source library. Content changes when a release ships. Must rank in search."
   options="A|SSR on every request;;B|SSG at build time, rebuilt on release;;C|Client-rendered behind an app shell;;D|SSR with a 60-second edge cache"
   correct="B"
   explanation="The content is the same for everyone and changes on a schedule you control, so there is nothing to compute per request. Static generation gives you the cheapest possible delivery and perfect crawlability. SSR would burn servers producing identical bytes; a client-rendered shell would hand crawlers an empty page." %}

{% include quiz.html id="render-strategy-2"
   question="A logged-in analytics dashboard. Data is per-user, refreshed every few seconds, and behind auth."
   options="A|SSG with client-side hydration;;B|SSR on every request;;C|Client rendering behind an app shell;;D|SSG per user at build time"
   correct="C"
   explanation="Nothing here is crawlable and nothing is shared between users, so server rendering buys you a first paint of data that is stale by the time it arrives — and costs a server render per view. An app shell paints the chrome instantly and streams the data in. D is not a strategy: you cannot build pages for users who have not signed up yet." %}

{% include quiz.html id="render-strategy-3"
   question="A news homepage. Content changes every few minutes, traffic spikes hard, and search matters."
   options="A|SSG rebuilt every few minutes;;B|Client rendering behind an app shell;;C|SSR with a short edge cache and stale-while-revalidate;;D|SSR with no cache"
   correct="C"
   explanation="A short edge cache turns a traffic spike into one origin render per interval, and stale-while-revalidate keeps the page fast during the refresh. Uncached SSR (D) makes every reader a server render, which is exactly the wrong shape for a spike. Frequent full rebuilds (A) get slower as the site grows and still lag the news." %}

{% include quiz.html id="render-strategy-4"
   question="What is the cost of choosing SSR that teams most often discover late?"
   options="A|Search engines cannot index server-rendered HTML;;B|Cache invalidation and server capacity become your problem, and personalisation fragments the cache;;C|You cannot use a component framework;;D|The bundle gets larger"
   correct="B"
   explanation="SSR moves work to a machine you now have to run, scale and cache correctly. Personalising the HTML splits the cache key per user, which quietly turns a cached page into an uncached one — the failure shows up as a cost graph, not an error." %}

## Related

- Reading: [SSR](../server/ssr.html) · [SSG](../server/ssg.html) · [App shell](../server/app-shell.html) · [SEO](../server/seo.html)
- Playbook: [Frontend system design](../playbooks/system-design.html)
- Agent Skill: `server-ssr`
