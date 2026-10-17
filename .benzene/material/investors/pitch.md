---
status: draft
updated: 2026-10-17
owner: cio
sources:
  - .benzene/standards/cio.md
  - .benzene/standards/cfo.md
  - .benzene/standards/cmo.md
  - .benzene/standards/cxo.md
  - .benzene/material/experience/analytics.md
  - .benzene/material/experience/ux-model.md
  - .benzene/material/investors/traction.json
---

# Pitch: elegantfrontend.training

Draft for the CEO. Nothing here is sent to an investor or a backer: a person sets `status: live`, and only once
`traction.json` records at least 7,000 newsletter subscribers (cio.md, bar 5). Evidence IDs `[E#]` point to the
`## Evidence` table of `.benzene/standards/cio.md` unless another report is named; every page there was fetched on
2026-10-17.

## Problem

AI now writes the components I was hired to write, and I cannot tell which frontend skills still get me hired. A
coding agent hands back a plausible atom, container or reducer in seconds. What it does not hand back is the judgement:
which layer the code belongs in, what crosses the component boundary as props and events, which loading, skeleton and
accessibility states it skipped, and whether the proxy or session code it wrote is the plausible-but-insecure answer.
The developers who keep frontend work are the ones who can name those terms, brief an agent in them and review its diff
against a guardrail. Interview banks teach recall, video platforms teach frameworks, and nobody teaches the vocabulary
and the Agent Skills that encode it as one free curriculum.

## For whom

The frontend developer displaced by AI, in four situations the CXO's model separates
(`.benzene/material/experience/ux-model.md`, 2026-10-17): the early-career developer who was laid off or never hired;
the mid-level React developer about five years in, applying widely and hearing back rarely; the senior engineer who
already drives coding agents and needs to direct and review them; and the Angular, Vue or Web Components developer whose
framework's job pool shrank first. Front-end postings fell 25% from January 2024 to January 2025 while full-stack rose 9%
([LeadDev](https://leaddev.com/ai/does-ai-spell-death-front-end-engineering), TalentNeuron data, via cxo.md).
They share one constraint: no salary, so price is the first filter and anything paid must be reversible.

## Why now

Five outside signals from 2025 and 2026 say the displaced frontend developer is a funded problem with no frontend-specific
answer yet, and that incumbents have started to close the gap:

- [Inside Higher Ed, 2025-01-09](https://www.insidehighered.com/news/tech-innovation/teaching-learning/2025/01/09/changes-boot-camp-marks-signal-shifts-workforce): 2U shut its bootcamps in December 2024, and Epicodus and Momentum closed in 2024, with AI cited; the cheap retraining route for juniors is gone [E65].
- [IT Brief, 2026-01-19](https://itbrief.co.uk/story/coding-jobs-squeezed-as-ai-reshapes-developer-roles): US software-developer listings fell over 70% from Q1 2023 to Q1 2025 (unnamed analytics firms, directional), and a Stanford study found entry-level coding listings down 13% over three years [E66].
- [NextWork seed, 2026-03-04](https://www.vcaonline.com/news/2026030403/nextwork-raises-4-45m-seed-round-to-accelerate-ai-skill-verification-for-the-workforce/): a $4.45M seed on "AI is reshaping the workforce faster than people can adapt", with learning as "verifiable proof of work" for career switchers aged 25 to 35 [E63].
- [Master.dev rebrand, 2026-06-15](https://blog.master.dev/today-frontend-masters-becomes-master-dev/): four of Frontend Masters' ten most-watched courses are AI courses, and an "agent harness engineering" course is in progress [E14].
- [RAISE US, 2026-06-25](https://letsdatascience.com/news/ai-disrupts-workplaces-new-nonprofit-hopes-to-aid-workers-a9150b05): over $500M committed to training Americans displaced by AI, with Anthropic and the OpenAI Foundation among the anchor partners [E60].

Read together: the money and the demand exist, the public programmes target trades and broad coalitions rather than
frontend [E61], and the window closes as the incumbents ship their harness courses in 2026.

## Traction

Pre-revenue and below the audience floor. Every figure is copied from the record named on its line.

- GitHub: 1 star and 3 forks on a repository created 2023-09-04 ([GitHub API](https://api.github.com/repos/grvpanchal/elegant), read 2026-10-17).
- npm: 257 downloads of the `elegant` CLI from 2026-09-13 to 2026-10-12 ([npm API](https://api.npmjs.org/downloads/point/last-month/elegant), read 2026-10-17).
- Audience: 2,637 followers across channels, 2,626 of them on the personal LinkedIn account and 11 on the brand's Instagram (9) and LinkedIn page (2) (`.benzene/material/experience/analytics.md`, captured 2026-10-17).
- Reach: 128 post impressions and 154 profile viewers on the personal LinkedIn account, as read for 2026-W42 (`.benzene/material/experience/analytics.md`, 2026-10-17).
- Newsletter subscribers: 0 on the record, because subscribers are not measured yet; the ConnectSafely count of 10 is newsletters, not subscribers (`.benzene/material/investors/traction.json`, 2026-10-17).
- Product built: 45 Agent Skills (`./skills/*/SKILL.md`), 47 practice questions (`./docs/_data/questions.yml`), 4 free courses with 28 lessons (`./docs/_data/courses.yml`) and 7 templates (`./templates/`), counted 2026-10-17.
- Live today: the home page, the practice bank and the glossary answer at https://elegantfrontend.training/; the courses and pricing pages are in the repository but returned 404 on the live domain on 2026-10-17.
- Revenue: none; checkout runs in PayPal sandbox and every paid tier shows `price_usd: 0` (`./docs/_data/pricing.yml`, 2026-10-17).
- Gap to the floor: 7,000 newsletter subscribers are required before this pitch goes live (`.benzene/standards/cio.md` bar 5, 2026-10-17).

## Ask

One amount: **$4,000**. One count: **100 backers**, the founding backers, at an average pledge of forty dollars. One window: **2027-03-01
to 2027-03-31**, thirty days, close to the 33-day You Don't Know JS campaign that drew 500 backers [E57]. The window opens only when the audience floor is met; if it is not met two weeks before the open date, the CEO
moves both dates together. Sizing: 100 backers is 1.4% of the 7,000-subscriber floor, the share Josh W. Comeau planned on
(380 copies from about 28k emails [E35]). It is a presale, not a donation drive, because about 370k stars on roadmap.sh
produced 7 current sponsors [E42][E46]. A backer gets an opt-in founding-backer line on the site, a vote on the fifth free
course, and the full pledge credited toward the Annual tier once the CEO approves the CFO's proposed prices
(`.benzene/material/finance/pricing.md`); the CFO, not this file, sets how a pledge converts. Nothing on the free site is gated on a pledge. Below 50 backers at the
close, every pledge is refunded in full.

## Use of funds

Itemised against the ask; the line totals sum to it. Unit rates are written in USD so the dollar sign marks only the
totals.

**Minimum** (met at 50 backers; below it every pledge is refunded):

- $249: PayPal fees on 100 pledges at forty dollars, at the international rate of 4.99% plus 0.49 USD each (cfo.md fee table).
- $140: refund reserve for the 30-day refund window, at Frontend Mentor's launch refund rate of 3.5% (10 of 284, cfo.md E20).
- $288: Upload-Post Basic for 12 months at 24 USD a month, the posting and analytics API the CMO and CXO cells use (cmo.md E236).
- $50: Hashnode Pro for one year, which its API requires for syndication (cmo.md E227).
- $1,273: model spend for the cells to keep the four courses, 47 questions and 45 skills current for a year and to ship the job-hunting module and the outcomes log; that is about 106 USD a month, inside the CFO's SIMULATED ceiling of 92 to 110.50 USD a month (`.benzene/material/finance/business-model.md`), and at least 2,121 tasks at the CTO's 0.60 USD per-task cap (`.benzene/benzene.yaml`).

**Stretch** (backers 51 to 100):

- $400: the CMO's twelve-week paid plan: two LinkedIn boosts at 25 USD a day for 4 days, two Meta boosts at 50 USD, and one YouTube Promote at 100 USD, under the boost ceiling (cmo.md section 10).
- $1,600: model spend for the fifth free course the backers vote on and new harness-format questions beyond today's 6; at least 2,666 tasks at the same cap.

No line pays a salary: the organisation's labour is its AI cells, and the one human, the CEO, approves every item.

## Risks

- **The floor may not be met.** The record shows 0 measured subscribers against a 7,000 floor, and 2,626 of the 2,637 followers sit on one personal LinkedIn account. If that account stalls, the brand has 11 followers of its own.
- **The average pledge may come in lower.** You Don't Know JS averaged $32.80 a backer ($16,400 from 500 [E57]); Frontend Mentor's first two weeks averaged $43.31 ($12.3k from 284, cfo.md E20). At the lower average, 100 backers raise $3,280, enough for the Minimum but not the whole Stretch.
- **Incumbents are closing the gap.** Scrimba's free Learn Agentic Coding covers MCP, permissions and skills [E20], Master.dev is recording agent harness engineering [E14], and Epic AI teaches MCP [E33].
- **An AI-run organisation has no face.** Every case in cio.md had a named teacher behind it. We substitute records anyone can check: API-read numbers, dated files and a refund window.
- **The job data is directional.** The over-70% listings figure is attributed to unnamed firms [E66], and public displacement money goes to trades first [E61].
- **The site is not ready to take money.** Courses and pricing return 404 on the live domain, and `docs/` has no terms, privacy or refund page yet (`.benzene/material/finance/legal.md`). PayPal is not a merchant of record, so the sales-tax position needs advice before any pledge is captured.

## Competition

Prices and coverage as fetched on 2026-10-17. "AI-harness coverage" means teaching a developer to direct and review a
coding agent with installable skills, guardrails and evals, not using AI inside the product.

| Competitor | Price | AI-harness coverage | Source |
|---|---|---|---|
| GreatFrontEnd | $39/mo, $120/yr, $180 lifetime | None found: interview prep with per-company question sets | https://www.greatfrontend.com/interviews/pricing (cio.md E2) |
| Master.dev (was Frontend Masters) | $39/mo or $390/yr | Rising: 4 of its top 10 courses are AI; an agent harness engineering course is in progress | https://master.dev/join/ (cfo.md E7), https://blog.master.dev/today-frontend-masters-becomes-master-dev/ (cio.md E14) |
| Scrimba | $49/mo list; $191.09/yr with the Halloween 2026 coupon | Closest: free Learn Agentic Coding (35 lessons, MCP, permissions, skills); Pro Learn AI Agents (32 lessons) | https://scrimba.com/pricing (cfo.md E24), https://scrimba.com/ (cio.md E20) |
| Frontend Mentor | $15/mo, $120/yr | AI code review on every Pro solution; no harness lessons found | https://www.frontendmentor.io/pro (cio.md E25, cfo.md E15) |
| BigFrontEnd.dev | $6/mo, $48/yr | Free ChatGPT-written solutions; no harness | https://bigfrontend.dev/premium (cio.md E27) |
| roadmap.sh | Pro $10/mo; Team $10/seat/mo, 3-seat minimum | An AI tutor and course generator; teaches about topics, not skills for a codebase | https://roadmap.sh/premium (cio.md E45) |
| Epic AI (Kent C. Dodds) | Epic MCP $500 | MCP application design in four workshops, marked under construction | https://www.epicai.pro/ (cio.md E33, cfo.md E40) |
| CSS for JavaScript Developers (Josh W. Comeau) | $149 / $279 / $399 | None: CSS mental models | https://css-for-js.dev/ (cio.md E39, cfo.md E44) |
| patterns.dev | Free; Leanpub suggests $9.99 | None: a pattern catalogue; the newsletter adds weekly AI briefings | https://www.patterns.dev/ (cio.md E56), https://leanpub.com/learningpatterns/ (cfo.md E57) |
| elegantfrontend.training (us) | $0: the whole site is free; the CFO's proposed $12/mo, $99/yr and $139 lifetime await the CEO and are not live | 45 Agent Skills, one per UI, Server or State term, and a 7-lesson Agent Skills course on guardrails, thresholds and evals | https://github.com/grvpanchal/elegant, `.benzene/material/finance/pricing.md` |

The gap the table shows: the cheap platforms ($6 to $15 a month) teach recall and projects with AI bolted on as a
feature, and the platforms that teach agents (Scrimba, Master.dev, Epic AI) teach them generically. None ties a
frontend term such as selector, container or skeleton to the installable SKILL.md and the guardrail an agent is held to.
