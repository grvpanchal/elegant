---
title: Launch plan, first twelve weeks
owner: cmo
week_1: 2026-W43
launch_date: 2026-11-10
showcase_url: https://elegantfrontend.training/practice/
source: .benzene/standards/cmo.md (Launch stories; Playbooks 6, 9 and 10; bar items 12, 22 and 23)
---

# Launch plan

## Positioning

**For** frontend developers who lost their job, or most of it, to AI. They can still ship a component. What is
scarce now is the person who can name the boundary, write the check and say when an agent's work is done.

**The promise.** Every lesson is one frontend term from the UI, Server or State layer, plus the Agent Skill that
encodes it, plus a practice question with real tests that runs in the browser. It is free and needs no sign-up.

**Why not "AI" alone.** That message is taken. Master.dev says "Learn the Dev Skills to Thrive in the Age of AI" and
gives away a Claude Code course [E36][E39]. Scrimba sells "Learn Agentic Coding" [E77]. Frontend Mentor posts AI advice
for beginners [E61]. Our angle is **terminology plus harness**: the words you brief an agent in, and the checks that
hold it to them.

**One free thing per campaign.** Every campaign points at a single free, no-account showcase with a UTM link. That is
what GreatFrontEnd ("No signup required"), Scrimba ("Takes 2 min - no signup") and Frontend Mentor ("Start building
free") all do [E13][E77][E58]. Ours are:

- the practice bank;
- four free courses, 28 lessons in all according to `docs/_data/courses.yml`. They are in the repository, but `/courses/`
  returned 404 on the live site on 2026-10-17, so no post may link them until they ship;
- the free PDF book and the study plans (both live).

The first campaign, `state-selectors`, points at `/practice/memoized-selector.html`.

**On launch day we submit a free teaching artifact, not a pitch.** Free artifacts scored in the hundreds on Hacker
News: patterns.dev's free book 627, roadmap.sh 362, Scrimba's free course 329. Product pitches scored in single
digits: GreatFrontEnd 1, Epic React 4, The Valley of Code 9 [E135][E147][E87][E32][E114][E100].

## Channels

| Channel | Account | Job in the launch | Weekly cadence (weeks 1–12) | Constraint to respect |
|---|---|---|---|---|
| LinkedIn Page | "Elegant Architecture" | Terminology carousels; the launch post | 5 posts, 2 of them document decks (7 and 3 in launch week) [E22][E155] | The report got HTTP 404 on `/company/elegant-architecture` [E10]. Post only to the Page Upload-Post is connected to. Never boost a poll or a post that was already boosted [E187][E188] |
| LinkedIn newsletter | founder's member profile first | Weekly issue; launch edition in week 4 | 1 issue, same weekday | A Page needs more than 150 followers to be evaluated for its own newsletter [E171]. A person publishes it; there is no API [E177] |
| X | @elegantfrontend | Threads that lead with the term; launch-day replies | 5 posts + 1 thread (7 + 2 in launch week) | 280 weighted characters. A URL costs $0.200 against $0.015 [E203], so at most 1 URL per thread |
| Instagram | @elegantfrontend | Carousels from the LinkedIn decks; Reels | 2 carousels + 1 Reel | 2–10 slides, JPEG at 4:5; at most 5 hashtags (our choice) [E209][E210] |
| Facebook | Page "Elegant Architecture" | The twin of every Instagram campaign | 3 posts | `facebook.com/elegantarchitecture` is another business [E9]: never link it |
| YouTube | @elegantfrontend | One Short a week; the launch video | 1 Short | Title at most 100 characters, description at most 5,000 bytes [E217] |
| Blog + syndication | elegantfrontend.training/blog | Articles with canonical links back to the site | 3 articles; dev.to 2, Hashnode 2, Medium 1 | Disclose AI help within the first two paragraphs [E158][E159]. Hashnode's API needs Pro [E227]. Medium is a manual import [E228][E231] |
| Hacker News, Product Hunt | the founder's own accounts | Launch day only | — | A person submits by hand. Never ask for upvotes |

## Timeline

| Week | Dates | Theme | Material |
|---|---|---|---|
| 0 | 2026-10-12 → 10-18 (W42) | Set-up | profile, competition, the first campaign drafted, newsletter #1 (`newsletter/2026-W42.md`) |
| 1 | 2026-10-19 → 10-25 (W43) | State: selectors (moved up from the report's week 5) | campaign `state-selectors`: 5 LinkedIn posts (2 decks), 1 X thread, 1 Instagram carousel and its Facebook twin, article `selectors-must-return-the-same-reference` |
| 2 | 2026-10-26 → 11-01 (W44) | UI terms | "N UI pairs that sound similar" deck; newsletter #2 |
| 3 | 2026-11-02 → 11-08 (W45) | Server terms; launch teaser | the teaser names the launch date and opens a waitlist (newsletter + LinkedIn) |
| **4** | **2026-11-09 → 11-15 (W46)** | **Launch week** | **Launch day, Tuesday 2026-11-10:** Show HN, Product Hunt, the dev.to launch post, LinkedIn, X, the newsletter launch edition and the YouTube launch video. All go out on one date with one showcase [E68][E70][E71]. Answer every comment that day [E109] |
| 5 | 2026-11-16 → 11-22 (W47) | UI terms (swapped with week 1) | day-7 launch results recorded 2026-11-17 |
| 6 | 2026-11-23 → 11-29 (W48) | Harness Agent Skills | checkpoint: LinkedIn Page followers |
| 7 | 2026-11-30 → 12-06 (W49) | A 30-day harness challenge opens (FM30-style [E74]) | first boost allowed, LinkedIn, at most $100, only for a post at 2× its median |
| 8–9 | 2026-12-07 → 12-20 (W50–51) | Challenge | Meta boost at most $50 (W50); LinkedIn boost at most $100 (W51) |
| 10 | 2026-12-21 → 12-27 (W52) | Long-form video | YouTube Promote $100. Holiday week: schedule ahead |
| 11 | 2026-12-28 → 2027-01-03 (W53) | Challenge finalists, public vote | Meta boost at most $50 |
| 12 | 2027-01-04 → 01-10 (2027-W01) | Results | the campaign results post; newsletter checkpoint |

## Success criteria

Fixed now, before launch, and read back on the dates below. Each target is a competitor's recorded launch, so a miss
is a real miss.

| Criterion | Target | Set by (report evidence) | Today (2026-10-17) | Read on |
|---|---|---|---|---|
| Show HN points | ≥ 32 | Frontend Mentor's Show HN, 2018-10-10: 32 points, 11 comments [E71] | no HN launch [E11] | 2026-11-17, via `hn.algolia.com/api/v1/items/<id>` |
| Product Hunt rank | top 5 of the day | Frontend Mentor: "#3 Product of the Day", 257 points, 2020-03-26 [E70] | no page | 2026-11-11 |
| dev.to launch post | ≥ 248 reactions | Frontend Mentor's launch post: 248 reactions, 52 comments [E68] | 0 dev.to articles [E11] | 2026-11-17, via the dev.to API |
| LinkedIn Page followers | > 150 | LinkedIn's Page newsletter threshold [E171] | 2 (analytics snapshot) | 2026-11-29, end of week 6 |
| Newsletter subscribers | ≥ 1,000 | Josh W. Comeau's list of about 1k before his launch run [E122] | 10 (snapshot, ConnectSafely `newsletters`) | 2027-01-10, end of week 12 |
| Cadence held | 5 LinkedIn posts (2 decks), 1 newsletter and 3 articles every ISO week | GreatFrontEnd: 10 posts in 5 days, 3–4 articles a week [E22][E19]; Bytes has never missed a slot [E152] | 0 / 1 / 1 | every Sunday, `python3 .benzene/checks/material.py <bar>` |
| Paid spend | ≤ $500 in total, none before 2026-11-30 | the report's budget rule; Frontend Mentor reached 200k members without ads [E72] | $0 | every boost proposal (`material.py boosts`) |

**What the launch stories warn about.**

- Launch to an audience that already exists. Josh grew his list 28× before launch [E122]. That is why the newsletter
  and Page-follower checkpoints come before any paid spend.
- Launch on one date. Frontend Mentor put Product Hunt, Show HN and dev.to on the same day [E68][E70][E71].
- Keep any offer short and dated. Kent's was 24 hours at 40% off [E108]; Josh kept registration open for one week
  [E122]. Prices and discounts belong to the CFO office and are not set here.
- Write down the failures too, as Kent did: workshops "cancelled due to lack of sales (due to marketing problems)"
  [E109]. The week-12 results post reports every row of the table above, hit or miss.
