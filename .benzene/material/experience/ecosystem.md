---
updated: 2026-10-17
source: .benzene/standards/cxo.md (Ecosystem map, Evidence, Analytics instruments; every figure fetched 2026-10-17, URLs there)
---

# Ecosystem

What our learners plug into, where they gather, and what they used before us. Competitors are named by product, not
by the people behind them. Figures are as the report fetched them on 2026-10-17; the competitor watch in the weekly
snapshot keeps the community sizes current.

## Integrations

What the site connects to today (read from the repo on 2026-10-17):

| Integration | What it does for the learner | Where |
|---|---|---|
| `npx elegant` CLI | Scaffolds one of six templates: React with Redux, Redux Toolkit or Saga; Angular with NgRx; Vue with Pinia; Web Components with Saga | `index.js`, `templates/` |
| Agent Skills | Every lesson and question names a `SKILL.md`; each page shows a one-command `npx skills add ... --skill <slug>` install and a download (Agent Skills open standard, for `~/.claude/skills/` and similar) | `skills/` (copied to `/skills/` at deploy), `_includes/doc-skill-download.html` |
| In-browser workspace | Runs a question's tests in the page, the same tests that run under Node; component questions use a vendored Preact runtime, no CDN | `docs/assets/js/playground.js` |
| Email accounts (Supabase) | Sign-up, password, magic link and reset; progress syncs to the account across browsers | `docs/account/`, `account-supabase.js`, `progress-sync.js` |
| Device profiles | Progress per name in this browser, moved by JSON export and import; no verification | `account.js` |
| PayPal sandbox | Checkout for the Pro and Lifetime tiers; test money only, no secret in the repo | `docs/pricing/`, `assets/js/pricing.js` |
| The book | The whole glossary as one PDF, readable offline | `docs/assets/book/` |
| Google Analytics tag | Present in the site config; the CXO does not read it yet (cxo.md: "Google Analytics comes later") | `docs/_config.yml` |

What the CXO reads with (read-only, cxo.md `## Analytics instruments`): Upload-Post for Instagram, Facebook, the
LinkedIn company page, X and YouTube; ConnectSafely for personal LinkedIn. No upload, comment, react, message, connect
or follow endpoint is ever called.

What competitors integrate, and what it means for us (cxo.md ecosystem map):

| Integration | Who has it | For us |
|---|---|---|
| Agent Skills or AGENTS.md shipped with the content | patterns.dev (`npx skills add`, 58 skills), Frontend Mentor (AGENTS.md and CLAUDE.md in every challenge), Scrimba ("Skills Challenge", "Intro to MCP", "Learn Context Engineering") | Our core. We ship a skill per lesson with a one-command install; the gap is a public tracker whose issues feed the log (bar 13) |
| Full editor in the browser | GreatFrontEnd (VS Code-style editor, Vim mode), BigFrontEnd.dev (VS Code editor, TypeScript) | Our workspace is a plain editor with Run and Reset |
| AI inside the product | roadmap.sh AI Tutor, BigFrontEnd.dev "AI solutions", Frontend Mentor AI code review (1 a month free, unlimited on Pro) | None yet |
| Login with GitHub | Frontend Mentor | We need no login to start; email only to sync |
| Mobile apps and offline | Frontend Masters (iOS, Android, offline viewing) | The PDF book is our offline form |
| Certificates | GreatFrontEnd (printable, paid plans), Frontend Masters, Epic React, Scrimba (career path), the CSS for JS Devs and Joy of React courses (PDF with a unique verification URL), bootcamp.dev (attendance) | Ours is printable but not verifiable (bar 11) |
| Hiring and job help | Frontend Mentor hiring platform, Frontend Masters "Job Hunting in the Age of AI" workshop, Joy of React "Job Hunting Kit" (11 mock interviews) | Company-loop guides only; no job module (bar 12) |
| Teams, affiliates, discounts | GreatFrontEnd (15% affiliate, 40% student discount), Frontend Masters (teams of 10+), Joy of React and CSS for JS Devs (20% student, regional pricing, 30-day refund), Scrimba (20% referral) | Discounts are the CFO's; the between-jobs bar is at least 40% (bar 7) |

## Communities

Where this audience gathers and how competitors listen there.

| Community | Size (cxo.md, 2026-10-17) | Listening ritual |
|---|---|---|
| Scrimba Discord | 85,686 members, 5,005 online | Weekly Town Hall, every Tuesday; in-course "Give Feedback!" lessons |
| roadmap.sh Discord and GitHub | 51,961 members; repo with 3 open and 3,214 closed issues | Monthly changelog; issues answered in about 1 to 2 days |
| Frontend Mentor Discord | 38,950 members, 2,441 online | Solution code reviews, hackathons |
| Epic Web Discord | 15,075 members, 1,523 online | Weekly office hours, a call-in podcast, learning clubs, a conference |
| GreatFrontEnd Discord and feedback repo | Premium 10,690, public 2,801 (site-stated); repo with 58 open and 351 closed issues | Public issue tracker; close times slipped from a 2.9-day median (2022) to 697 days (2024) |
| BigFrontEnd.dev Discord | 2,102 members, 50 online | No public changelog or replies found |
| Joy of React and CSS for JS Devs | Private buyers' Discord, "thousands of members" | Author answers "almost daily"; pre-launch test squads of about 70 and about 30 |
| patterns.dev | Newsletter, "12,000+ developers"; skills repo 255 stars | Repo discussions on, 0 posts |
| Reddit: r/Frontend, r/cscareerquestions | Sizes unverified (Reddit returned 403) | Where our audience describes job loss and AI fear in its own words; read through search RSS |
| Hacker News | Launch threads cited in cxo.md | Founders who replied in-thread (Scrimba, Frontend Mentor) won early trust |
| Devographics surveys (State of JS, React, CSS, HTML) | State of JS 2025: 13,002 respondents | Usage-only Resources lists; being named there is bar 16 |

**Ours:** no community channel yet. Bar 9 asks for one by launch, its member count in every weekly snapshot, and a
weekly live office hour once it reaches 100 members. Until then the channels are the social accounts and the
repository's GitHub issues (see `feedback-log.md`).

## Alternatives users come from

What our personas have used before arriving, what they liked there, and what pushed them out (cxo.md competitors
table, praise and complaints, all fetched 2026-10-17).

| Alternative | What it sells | Price (cxo.md) | Why they used it | Why they look elsewhere |
|---|---|---|---|---|
| GreatFrontEnd | Interview questions, system design, projects | $39/mo, $85/quarter, $120/yr, $180 lifetime | In-browser "solve a question", no signup to start, fundamentals | Feedback backlog grew for two years; tests time out in one long-open issue |
| Frontend Masters (now Master.dev) | 300+ video courses, 24 paths | $39/mo or $390/yr | Production quality, no fluff; four of its ten most popular courses are about AI | Price versus unemployment; stuck on a lesson with no help; a no-refund complaint |
| BigFrontEnd.dev | 600+ coding questions | $6/mo or $48/yr | Cheapest in-browser practice, large free selection | No refunds ("as a small team"); no visible feedback loop |
| Frontend Mentor | 120+ design-to-code challenges, hiring platform | Pro plan (price not in the report) | Real projects, community reviews; took newcomers to professional | GitHub login, local build and hosting before the first submission |
| Scrimba | Interactive screencasts, career paths, AI Engineer path | Pro (price unverified) | Interactive beats video; closest to our AI-skills niche | Misleading cancellation and no renewal reminders; no pathway to a first job; stuck in a learning tool |
| CSS for JS Devs, Joy of React | Two premium interactive courses | Unverified | Exercises at the edge of ability; author answers questions | Priced for corporate education budgets; paid only, no free lesson |
| Epic React, Epic Web | Workshop-app courses, Epic AI | Unverified ("Loading price") | Explains the why; office hours | A heavy lift for unemployed developers; local CLI install; felt sidelined in favour of another framework |
| roadmap.sh | Free roadmaps, AI Tutor | Free | Map before territory; one click, no login | Too high level to be useful; lists of words |
| patterns.dev | Free pattern articles, Agent Skills repo | Free | Installable skills, free ebook | Breadth without depth; reads as dated; issues left unanswered |
| bootcamp.dev | Cohort bootcamp including Claude Code | $399 or $44/week | Took in an unemployed learner who credits it for a career; free handbooks | Cohort waitlist; gated PDF downloads behind an email form |

**The gap we can own** (cxo.md): nobody combines zero-signup in-browser first lessons, installable Agent Skills, a
job-outcome bridge and pricing built for people without a salary. Scrimba is nearest on skills; Frontend Mentor and
patterns.dev are moving into AGENTS.md and Skills. We already have the first two; the job bridge and the
between-jobs price are not built yet.
