---
competitor: ""
post: ""
date: ""
media: ""
hook: ""
text_chars:
reach:
source: "CMO report, 'Networks we could not read directly' (X): profiles are JavaScript-only and help.x.com / business.x.com returned 403"
---

# X: the report records no competitor post

The CMO report (fetched 2026-10-17) **could not read any competitor's X posts**. X profiles render only with
JavaScript, and help.x.com, help.twitter.com and every business.x.com page returned HTTP 403. Its words: "We could not
read competitors' X post formats or posting cadence." So no best post is recorded here, and every number field above
is empty on purpose.

**What it does record: audience only (raw `followers:` from the HTML x.com serves before JavaScript).**

| Account | Raw X followers | Evidence |
|---|---|---|
| Addy Osmani (patterns.dev) | 426,591 | [E134] |
| Kent C. Dodds (Epic) | 331,517 | [E107] |
| Lydia Hallie (patterns.dev) | 138,318 | [E134] |
| Master.dev | 133,150 | [E48] |
| Josh W. Comeau | 122,260 | [E127] |
| Bytes | 66,303 | [E154] |
| Flavio Copes | 65,461 | [E101] |
| Scrimba | 46,657 | [E81] |
| Frontend Mentor | 44,357 | [E64] |
| roadmap.sh | 10,223 | [E142] |
| GreatFrontEnd | 9,548 | [E24] |
| BFE.dev | 1,171 | [E55] |
| **@elegantfrontend** | **0** | [E8] |

**The bar we hold instead (official sources only).**

- 280 weighted characters per post and per thread part; a URL counts 23 and an emoji 2 [E200].
- At most one URL per thread: a post with a link costs $0.200 on the API against $0.015 without [E203].
- The "1–2 hashtags" guidance came only from a search snippet (Unverified in the report), so our rule of at most 2 is
  a choice of ours, not a competitor fact.

When a competitor's X post becomes readable (an embed, a Wayback capture or an API read), record it here with its URL.
