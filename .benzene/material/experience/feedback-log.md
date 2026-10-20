---
updated: 2026-10-17
items: 0
overdue: 0
---

# Feedback log

Every piece of feedback the site gets, where it came from, and the response a person sends. One row per item, the
feedback paraphrased in a line, never a name, handle or the comment's own text. Status is open, answered or shipped.
The bars (cxo.md 1 to 3): every public comment logged within 7 days, a first response within 24 hours at the median,
and no item older than 30 days left open without a response.

## Sources

The channels feedback arrives on, and the read-only instrument that collects each (cxo.md `## Channels`).

| Source | What arrives | Instrument | Cadence |
|---|---|---|---|
| GitHub issues | Bug reports, content corrections, skill and question requests on the repository | GitHub API (`/repos/.../issues`, `/search/issues`) | Weekly import |
| LinkedIn company page | Comments on the page's posts | Upload-Post U9 (posts), U10 (comments) | Weekly |
| LinkedIn personal (the founder's profile) | Comments on posts, where most of the audience is today | ConnectSafely C8 (posts), C9 (comments), C11 (proof of our reply) | Weekly, quota (C2) read first |
| Instagram | Comments on posts and carousels | Upload-Post U10 | Daily |
| Facebook page | Comments on posts | Upload-Post U10 | Weekly |
| X | Replies to posts | Upload-Post U10 | Weekly |
| YouTube | Comments on videos | Upload-Post U10 | Weekly |
| The site | Lesson and question friction | None yet: the site has no feedback link or form (`ux-model.md`, Where it breaks, item 4) | Continuous, once built |
| Reviews and mentions | Unprompted praise and complaints on Hacker News, Reddit, review sites | HN Algolia API, Reddit search RSS | Weekly |
| Community | Questions and office-hour requests | None yet: no community channel exists | Weekly, once built |

## Responses

Overdue (older than 30 days with no response): none.

| date | source | feedback | response | status |
|---|---|---|---|---|
| 2026-10-17 | onboarding | no feedback collected yet; channels listed above | the CXO logs each item weekly | open |
