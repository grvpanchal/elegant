# CXO: how the competition listens

Standard for the CXO office of **elegantfrontend.training**, a training site that teaches frontend terminology and AI-harness Agent Skills to frontend developers who lost their jobs to AI. It covers how ten competitors collect and answer feedback, the ecosystem around them, how fast they get a learner to a first lesson, and the read-only analytics we use to listen: Upload-Post for Instagram, Facebook, LinkedIn page, X and YouTube, and ConnectSafely for personal LinkedIn. Google Analytics comes later.

**Sourcing rule.** Every number below comes from a page fetched on **2026-10-17**, and its URL sits next to it. Wayback snapshots carry their own snapshot date. Some figures are my own calculations from fetched data, and they are labelled "computed". Anything I could not confirm is listed under `## Unverified`.

## Competitors

| # | Competitor | What they sell | Scale they state | Why it matters to us |
|---|---|---|---|---|
| 1 | **GreatFrontEnd** (greatfrontend.com) | Frontend interview questions, system design, real-world projects. Monthly $39, Quarterly $85, Annual $120, Lifetime $180 (https://www.greatfrontend.com/pricing) | "2M+ engineers helped" (https://www.greatfrontend.com) | Closest in-browser "solve a question" model. Has a public feedback repo. |
| 2 | **Frontend Masters**, now **Master.dev** (frontendmasters.com redirects to master.dev; rebrand post 2026-06-15, https://blog.master.dev/?p=9941) | 300+ video courses and 24 learning paths. $39/mo or $390/yr (https://master.dev/join/) | "500k+ developers" (https://master.dev/join/) | Says "Four of our ten most popular courses right now are about AI" (https://blog.master.dev/?p=9941). Also sponsors State of JS. |
| 3 | **BigFrontEnd.dev** (bigfrontend.dev) | 600+ frontend coding questions. Premium $6/mo or $48/yr (https://bigfrontend.dev/premium) | "FRIENDS 50k+" (https://bigfrontend.dev) | Cheapest in-browser practice. Almost no visible feedback loop. |
| 4 | **Frontend Mentor** (frontendmentor.io) | 120+ design-to-code challenges, Pro plan, hiring and teams products | 1,202,288 developers (https://www.frontendmentor.io) | Best-documented early history. Ships AGENTS.md/CLAUDE.md in every challenge. |
| 5 | **Scrimba** (scrimba.com) | Interactive "scrim" screencasts, career paths, AI Engineer path | "more than two million users" (https://scrimba.com/op/pub/app01/data?v=1) | MDN's course partner. Already teaches "Intro to MCP", "Learn Context Engineering" and a "Skills Challenge", the closest overlap with our niche. |
| 6 | **Josh W. Comeau** (css-for-js.dev, joyofreact.com) | Two premium interactive courses | "more than 32,000 developers" taught CSS (https://courses.joshwcomeau.com/letter-to-your-manager) | Benchmark for launching with an email list plus beta testers. |
| 7 | **Kent C. Dodds / Epic Web** (epicweb.dev, epicreact.dev, kentcdodds.com) | Workshop-app courses (Epic React, Epic Web, Epic AI) | "Join 40,000+ developers in the Epic Web community" (https://www.epicweb.dev). Epic React "taught React to over 30,000 people" (https://www.epicreact.dev) | Benchmark for office hours, a call-in podcast and certificates. |
| 8 | **roadmap.sh** (roadmap.sh) | Free role and skill roadmaps, AI Tutor, lesson packs | "+3.2M Registered Users", "370K GitHub Stars" (https://roadmap.sh) | Largest open feedback surface (GitHub). Gets learners in with zero friction. |
| 9 | **patterns.dev** (Lydia Hallie and Addy Osmani) | Free pattern articles, ebook, Agent Skills repo | "Join 12,000+ developers" newsletter (https://www.patterns.dev/newsletter) | Ships Agent Skills via `npx skills add PatternsDev/skills/react` (https://github.com/PatternsDev/skills). |
| 10 | **Flavio Copes** (flaviocopes.com, bootcamp.dev) | Free handbooks, a $399 cohort bootcamp that includes Claude Code | Bootcamp "helping 4301 people" (Wayback 2026-09-02, https://web.archive.org/web/20260902065100/https://bootcamp.dev/) | Cohort model that explicitly took in an unemployed learner. |

## Evidence

All rows fetched 2026-10-17. "Invite API" means `https://discord.com/api/v9/invites/<code>?with_counts=true`. "GitHub API" means `https://api.github.com/repos/<owner>/<repo>` and `/search/issues`.

### Feedback channels and their sizes

| Competitor | Channel | Size | Source |
|---|---|---|---|
| Scrimba | Discord | 85,686 members, 5,005 online | Invite API, code `nDebDaqCcR` (from scrimba.com/discord) |
| Scrimba | Weekly Town Hall | "Every Tuesday" | https://scrimba.com/articles/how-scrimba-came-to-be/ |
| Scrimba | Trustpilot | 4.1 from 78 reviews. Replied to 25% of negative reviews | https://www.trustpilot.com/review/scrimba.com |
| Scrimba | In-course feedback | Lessons titled "Give Feedback!" / "Please give feedback!" | https://scrimba.com/op/pub/app01/data?v=1 |
| roadmap.sh | Discord | 51,961 members, 2,962 online. Homepage claims "52K" | Invite API, code `GBY7zEc3uB`; https://roadmap.sh |
| roadmap.sh | GitHub `nilbuild/developer-roadmap` (formerly `kamranahmedse/...`) | 369,690 stars, 45,097 forks. 3 open and 3,214 closed issues. Discussions off. Last 30 days: 17 issues opened, 14 closed | GitHub API |
| Frontend Mentor | Discord | 38,950 members, 2,441 online | Invite API, code `UAfh3qzhYb` (from https://www.frontendmentor.io) |
| Frontend Mentor | Solution code reviews and AI review | AI review: 1/month free (down from 2), unlimited on Pro | https://www.frontendmentor.io/articles/ai-code-review |
| Frontend Mentor | Product Hunt | Launch 2020-03-26, #3 of day, 257 upvotes. 5.0 from 2 reviews | https://www.producthunt.com/products/frontend-mentor/reviews |
| Frontend Mentor | GitHub footprint | 44,174 repos match "frontendmentor" | GitHub search API |
| Epic Web / Kent | Discord ("Epic Web") | 15,075 members, 1,523 online | Invite API, code `euBTshKEnm` (from https://kcd.im/discord) |
| Epic Web / Kent | GitHub `epicweb-dev/epic-stack` | 5,538 stars, 270 discussions, 298 closed and 5 open issues | GitHub API |
| Epic Web / Kent | Testimonials | 56 entries (53 distinct people) | https://kentcdodds.com/testimonials |
| Epic Web / Kent | "Call Kent" podcast and weekly Discord office hours | Season 5 has 29 episodes. Questions are "120 seconds or less" | https://kentcdodds.com/calls, https://kentcdodds.com/discord |
| GreatFrontEnd | Discord | Premium 10,690, public 2,801 (site-stated) | https://www.greatfrontend.com/community/discord |
| GreatFrontEnd | GitHub feedback repo `greatfrontend/greatfrontend` | 362 stars. 58 open and 351 closed issues. 46 discussions. Created 2022-11-23 | GitHub API |
| Frontend Masters | Reviews page | About 82 testimonials. App Store 4.7, Google Play 4.8, G2 4.8 | https://master.dev/reviews/ |
| Frontend Masters | Trustpilot | 4.7 from 39 reviews (87% 5-star, 5% 1-star). No company replies visible | https://www.trustpilot.com/review/frontendmasters.com |
| Frontend Masters | Member survey | Cited as the basis for the rebrand | https://blog.master.dev/?p=9941 |
| Frontend Masters | GitHub org | 69 repos, 1,866 followers, 432 open issues/PRs summed | https://api.github.com/orgs/FrontendMasters |
| BigFrontEnd.dev | Discord | 2,102 members, 50 online | Invite API, code `9PuEUwQmCj` |
| BigFrontEnd.dev | Usage signal on problem #1 | 38,015 accepted out of 108,021 tried (35.2% acceptance, computed) | https://bigfrontend.dev/problem/implement-curry |
| Josh W. Comeau | Private Discord (buyers) | "thousands of members". Josh answers "almost daily" | https://www.joyofreact.com/, https://css-for-js.dev/ |
| Josh W. Comeau | Pre-launch testers | About 70 in the Joy of React "Test Squad", about 30 for CSS for JS Devs | https://www.joyofreact.com/; https://failory.com/interview/css-for-js-developers |
| patterns.dev | GitHub `PatternsDev/skills` | 255 stars, 27 forks. Discussions on but 0 posts. 10 issues/PRs. 58 skills | GitHub API; https://github.com/PatternsDev/skills |
| Flavio Copes | Testimonials | "SEE ALL 42 TESTIMONIALS" | Wayback 2026-09-02 of bootcamp.dev (URL above) |

### Surveys (Devographics), method and usage

Method: "openly accessible online", every question optional, respondents "not filtered or selected in any way". Most come from past respondents' mailing list and social media (https://2025.stateofjs.com/en-US/about/). The Resources questions measure **usage only**, with no satisfaction score. Frontend Masters financially supports the survey (disclosed on the 2024 JS Resources page). Numbers come from each edition's `page-data.json`.

| Survey | Respondents | Usage figures for competitors | Source |
|---|---|---|---|
| State of JS 2025 | 13,002 | Courses (of 9,670 who answered): Frontend Masters 1,812 (18.74%), Epic React 449 (4.64%), Joy of React 363 (3.75%), Scrimba 216 (2.23%). People (of 1,902): Josh Comeau 133 (6.99%), Kent C. Dodds 54 (2.84%) | https://2025.stateofjs.com/page-data/en-US/resources/page-data.json |
| State of JS 2024 | 14,015 | Courses (of 10,057): Udemy 4,422 (43.97%), Frontend Masters 2,203 (21.91%), Epic React 583 (5.8%), Joy of React 406 (4.04%), Scrimba 258 (2.57%). People (of 2,092): Josh Comeau 120 (5.74%), Kent C. Dodds 86 (4.11%) | https://2024.stateofjs.com/page-data/en-US/resources/page-data.json |
| State of React 2025 | 3,760 | Courses (of 2,197): Frontend Masters 492 (22.39%), Joy of React 389 (17.71%), Epic React 308 (14.02%), Scrimba 84 (3.82%). Learning methods: "AI tools" 53.97% (up from 42.19% in 2024), paid courses 35.09% | https://2025.stateofreact.com/page-data/en-US/resources/page-data.json |
| State of CSS 2024 / 2025 | 9,706 / 5,506 | 2024 courses (of 1,302): Josh Comeau 61 (4.69%), Frontend Masters 47 (3.61%). 2025 people (of 971): Josh Comeau 177 (18.23%) | https://2024.stateofcss.com/page-data/en-US/resources/page-data.json, https://2025.stateofcss.com/page-data/en-US/resources/page-data.json |
| State of HTML 2024 / 2025 | 5,401 / 6,223 | No Resources page. 2024 web-platform resources (of 3,490): MDN 93.72%, web.dev 46.33% | https://2024.stateofhtml.com/page-data/en-US/other_tools/page-data.json, https://2025.stateofhtml.com/en-US/about/ |
| State of JS 2025, AI tools | 13,002 | Claude 4,845 (44.32%, up from 22.6%), Cursor 2,829 (25.88%), ChatGPT 6,519 (59.63%, down from 67.28%) | https://2025.stateofjs.com/page-data/en-US/other-tools/page-data.json |

**Not named** in any Resources list fetched: GreatFrontEnd, BigFrontEnd.dev, Frontend Mentor, Flavio Copes, patterns.dev and roadmap.sh. Being named there is a reachable milestone (see bar #13).

Job-market context: front-end postings fell **25%** globally from Jan 2024 to Jan 2025, while full-stack postings rose 9% (LeadDev, TalentNeuron data, https://leaddev.com/ai/does-ai-spell-death-front-end-engineering).

### Onboarding: what stands between a visitor and the first lesson

None of the competitors publishes a time-to-first-lesson figure. The step counts below are taken from the flows described on the cited pages.

| Competitor | Signup before first item? | Where the code runs | Path to first runnable item | Source |
|---|---|---|---|---|
| roadmap.sh | No | n/a (reading) | 1 click: `/frontend` returns full content with no login | https://roadmap.sh/frontend |
| patterns.dev | No | n/a (reading) | 1 click | https://www.patterns.dev |
| GreatFrontEnd | No ("No signup required") | In-browser editor with tests | Homepage, then question, then run | https://www.greatfrontend.com |
| BigFrontEnd.dev | No (free tier) | In-browser VS Code editor, local execution | Homepage, then problem, then submit | https://bigfrontend.dev |
| Scrimba | Free course. In 2017, saving code forced sign-up | In-browser scrim (pause and edit) | Free "Learn HTML and CSS" (122 lessons, 5h40m) | https://scrimba.com/learn-html-and-css-c0p; https://news.ycombinator.com/item?id=13814234 |
| Frontend Masters | Free account | Video | Free account unlocks 5 courses. No trial | https://master.dev/join/ |
| Frontend Mentor | GitHub login | Local machine, then you host it | Log in, download starter, build locally, host, submit. First challenge "taken" by 355,667 people | https://www.frontendmentor.io/challenges/qr-code-component-iux_sIO_H |
| Epic React | Account plus local CLI | Local workshop app | Run `npx epicshop init`, then `epicshop start`. Free tutorial has 20 lessons | https://github.com/epicweb-dev/epicshop |
| Josh W. Comeau | Purchase | In-browser playgrounds | Paid only. About 200 lessons, about 40 h | https://css-for-js.dev/ |
| Flavio Copes | No (blog/books). Bootcamp has a waitlist | Local | Books "Download all my books (yes, for free!)" | Wayback 2026-02-16, https://web.archive.org/web/20260216142311/https://flaviocopes.com/books/ |

### How they visibly answered feedback

| Competitor | Evidence of closing the loop | Source |
|---|---|---|
| GreatFrontEnd | Issue #7 (2022-11-29, "show test cases") was closed in about 5 hours. By 2023-01-24 the user wrote "you guys added Test Cases tab, thank you so much!!" | https://github.com/greatfrontend/greatfrontend/issues/7 |
| GreatFrontEnd | Median issue close time (computed from the GitHub API): **2.9 days in 2022** (9 issues), 69 d in 2023, **697 d in 2024**, 409 d in 2025, 32 d in 2026. 215 of 351 closures happened in Sep–Oct 2026. The vim-mode request (#124, 2024-03-21, five "+1" replies) was closed 2026-09-19 | https://github.com/greatfrontend/greatfrontend/issues/124 |
| roadmap.sh | Monthly changelog, latest entry 17 Sep 2026. A collaborator replies in about 1–2 days, e.g. #10434: "I've just added a new node with Base UI :)" | https://roadmap.sh/changelog; https://github.com/kamranahmedse/developer-roadmap/issues/10434 |
| Frontend Mentor | Founder in 2018: "I'm talking to them to see exactly what they feel would improve the offering". Later: "Everything we build is still a direct result of conversations that happen within the community". The AI-review cut was explained publicly ("costs us more to run") | https://news.ycombinator.com/item?id=18184149; https://www.starterstory.com/stories/we-built-a-180k-year-learn-to-code-community; https://www.frontendmentor.io/articles/ai-code-review |
| Scrimba | Founder posted 16 replies on the Launch HN, e.g. "We'll make sure to cancel the auto-advance". MDN: "Scrimba implemented all of our feedback" | https://news.ycombinator.com/item?id=24579699; https://developer.mozilla.org/en-US/blog/mdn-scrimba-partnership/ |
| Josh W. Comeau | Early-access email: "I decided to add React practice interview questions, because it was a popular request!" | https://www.joshwcomeau.com/email/jor-launch-004-faq-primary/ |
| Frontend Masters | Rebrand justified by "the feedback from customers has been clear" | https://blog.master.dev/?p=9941 |
| Kent C. Dodds | Newsletter replies: Kent "reads and tries to answer". Also weekly office hours | https://kentcdodds.com/subscribe |
| Flavio Copes | 6 author replies on "Show HN: A JavaScript Handbook" (239 pts), e.g. "Will add in a revision soon!" | https://news.ycombinator.com/item?id=18432436 |
| patterns.dev | Skills issue #6 got a reply the next day but is still open. Issue #9 (images 404) has 0 comments. No author replies on the 627-pt HN thread | https://github.com/PatternsDev/skills/issues/6; https://news.ycombinator.com/item?id=46226483 |
| BigFrontEnd.dev | No changelog, roadmap or public replies found | https://bigfrontend.dev |

### Early history: the audience at which feedback began to steer

| Competitor | Audience when feedback first steered the product | Source |
|---|---|---|
| Frontend Mentor | Show HN in Oct 2018 got **32 points**, with a Slack community as the channel. The founder was already "talking to them". The platform beta (Apr 2019) was "Based on community feedback". By Aug 2021: 200,000+ members, 1,500+ paid, Slack 70,000+ | https://news.ycombinator.com/item?id=18184149; https://www.starterstory.com/stories/we-built-a-180k-year-learn-to-code-community |
| Josh W. Comeau | Before launch: 20k newsletter, 11k waitlist, **about 30 testers** shaping the course. The pre-sale sold "almost 5000 copies" with the course about 50% done, and buyers steered the rest | https://failory.com/interview/css-for-js-developers |
| Scrimba | "nine months to reach **5,000 users**", then tripled to 15,000 in a week after one course. Monetised at "hundreds of thousands". Launch HN (2020): "over 3000" Career Path enrollees | https://scrimba.com/articles/how-scrimba-came-to-be/; https://news.ycombinator.com/item?id=24579699 |
| GreatFrontEnd | Launched on top of the founder's existing repos (front-end-interview-handbook, 44,005 stars). "more than 130 questions" at launch (Wayback 2022-10-02). First user request shipped within about 2 months | https://web.archive.org/web/20221002191548/https://www.greatfrontend.com/; GitHub API |
| roadmap.sh | 858 stars one day after creation (Wayback 2017-03-16), 39,295 by 2018-02-06. Weekly "drop your feedback" plan in 2019 | https://news.ycombinator.com/item?id=21591911 |
| patterns.dev | HN posts got 2 pts (2021), 4 pts (2022), 50 pts (2023), 627 pts (2025), with no visible feedback loop | https://news.ycombinator.com/item?id=46226483 |

## What users say

### Praise (what to copy)

- **Fundamentals with no fluff.** "High-production quality, world-class teachers, and no fluff." (Frontend Masters, Trustpilot, 2026-03-12, https://www.trustpilot.com/review/frontendmasters.com). "It helped me bridge the gaps in my knowledge of the core fundamentals" (GreatFrontEnd, https://www.greatfrontend.com).
- **Fast human help.** "it is very nice to get prompt help :)" (GreatFrontEnd, https://github.com/greatfrontend/greatfrontend/issues/7). Josh "has humbly responded to inquiries and comments I've sent by email or Twitter" (https://news.ycombinator.com/item?id=26694521).
- **Interactive beats video.** "For JavaScript I've found Scrimba to be worlds better than anything on Udemy or Coursera" (https://news.ycombinator.com/item?id=46302109). "the courses' exercises challenge you to work just at the edge of your abilities" (Josh, https://news.ycombinator.com/item?id=37330001).
- **Explains the why.** "It doesn't just tell you what to do, but it explains how to do it and why." (Kent, https://kentcdodds.com/testimonials).
- **Free and generous.** "Whoever created this site, thank you x1,000,000" (BFE.dev, https://www.teamblind.com/post/whoever-runs-bfedev-youre-the-mvp-swruj8lz). "bfe.dev is free and has a drastically larger selection of problems" (https://news.ycombinator.com/item?id=35242718).
- **Map before territory.** "I can point them to this." (roadmap.sh, https://news.ycombinator.com/item?id=21597630).
- **Outcomes for the unemployed** (our audience). "I took Flavio's bootcamp in 2021 while I was unemployed, and it is one of the best things I've done for my career." (Wayback of bootcamp.dev, 2026-09-02). "Frontend Mentor transformed me from a newbie to a professional developer" (https://www.frontendmentor.io).

### Complaints (what to avoid)

- **Price versus unemployment.** Epic React was "a heavy lift for new or unemployed devs during a pandemic" (https://dev.to/dylanesque/course-review-epic-react-a4m). "too many good, more affordable resources out there to justify the $400 annual cost" (Frontend Masters, https://www.trustpilot.com/review/frontendmasters.com?stars=1&stars=2). Josh is "priced so high" to "use up corporate education budgets" (https://news.ycombinator.com/item?id=39696261).
- **Stuck with no help.** "If you get stuck on a FEM lesson, you're kinda out of luck unfortunately." (https://dev.to/beznet/review-100-hours-of-front-end-masters-5akd).
- **Billing traps.** "the cancelation process for subscriptions is truly disgusting and misleading." and "They don't send you any renewal reminders email" (Scrimba, https://www.trustpilot.com/review/scrimba.com). "Took money and restricted access in a week, no refund" (Frontend Masters, Trustpilot URL above). "As a small team, we don't offer refund." (BFE.dev, https://bigfrontend.dev/premium).
- **No path to a job.** "they don't provide a pathway to go from education to… landing your first entry level position." (Scrimba, https://news.ycombinator.com/item?id=24581403).
- **Tool limits.** "I was stuck in a learning tool, not a full text editor or IDE." (Scrimba, https://news.ycombinator.com/item?id=24581418). "I would love to see vim mode supported" (GreatFrontEnd, https://github.com/greatfrontend/greatfrontend/issues/124). Tests time out, in an issue open since 2025-01-04 (https://github.com/greatfrontend/greatfrontend/issues/195).
- **Shallow or stale.** "too high level to actually be useful" and "bags of words" (roadmap.sh, https://news.ycombinator.com/item?id=21591441). "reads like its 2017 ... breadth but no depth" (patterns.dev, https://news.ycombinator.com/item?id=46231327). Epic React "seemed to have been kicked to the curb in favor of ... Remix" (https://news.ycombinator.com/item?id=33411139).
- **Gated downloads.** "I have to fill in a form and confirm an e-mail subscription before I can download the PDF." (Flavio, https://news.ycombinator.com/item?id=24997445).

### Our audience, in their own words

- "FE devs will be the first to get laid off in AI era as AI + MCP is able to do any FE task… I'm also scared" (r/Frontend, 2026-02-23, https://www.reddit.com/r/Frontend/comments/1rc586k/future_of_core_frontend_developers_in_ai_and_mcp/)
- "Is frontend a sinking ship… I don't know how I should be spending my time in terms of learning." (r/cscareerquestions, 2025-12-14, https://www.reddit.com/r/cscareerquestions/comments/1pmb6oa/5_yoe_react_dev_laid_off_last_september_and_dont/)
- "In 8 months of job searching sending out hundreds of applications I have had maybe 10 or so callbacks." (r/cscareerquestions, 2026-05-09, https://www.reddit.com/r/cscareerquestions/comments/1t8jz1y/5_yoe_is_there_any_recourse_i_can_take_other_than/)
- "it does meaningfully compress the idea → working prototype loop when you can direct and review while the agent executes." (r/Frontend, 2025-12-21, https://www.reddit.com/r/Frontend/comments/1ps4vu1/how_usable_are_ai_coding_agents_for_frontend_work/)

The Reddit text was read through Reddit's search RSS feed. Reddit pages and JSON returned 403.

## Ecosystem map

| Competitor | Community | Integrations / AI | Certificates | Jobs / hiring | Affiliate / teams / discounts |
|---|---|---|---|---|---|
| GreatFrontEnd | Discord, public and premium | VS Code-style editor with Vim mode (closed #124). Projects platform where "about 80% of challenges are free" (https://www.greatfrontend.com/blog/a-real-world-projects-platform-for-front-end-engineers) | Printable, for study plans on Quarterly/Annual/Lifetime (https://www.greatfrontend.com/pricing) | None (Careers is their own hiring) | Affiliate 15%, 7-day cookie (https://www.greatfrontend.com/affiliates). 40% student discount |
| Frontend Masters | No official Discord found (master.dev/discord returns 404). Live-workshop chat | iOS/Android apps, offline viewing, transcripts. GitHub Student Pack: 6 months free (https://master.dev/faq/) | Yes, light/dark. Public profile after 10+ hours (https://master.dev/features/) | Workshop "Job Hunting in the Age of AI", 2026-11-11 (https://master.dev/) | Teams of 10+ at $24.50/seat/mo. Enterprise SSO |
| BigFrontEnd.dev | Discord | VS Code editor, TypeScript, screen recording, "AI solutions from ChatGPT" (https://bigfrontend.dev) | None found | None | Premium $6/mo, no refunds |
| Frontend Mentor | Discord, solution reviews, hackathons (FM30) | GitHub login, Figma files (Pro), AGENTS.md and CLAUDE.md in every challenge (https://www.frontendmentor.io/articles/agents-md-files-in-every-challenge) | None found | Hiring platform, 14-day trial (https://hiring.frontendmentor.io) | Teams (https://teams.frontendmentor.io), partner program |
| Scrimba | Discord, weekly Town Hall | MDN partnership. AI Engineer path, "Intro to MCP", "Learn Context Engineering", "Multiple AGENTS.md files", "Skills Challenge" (https://scrimba.com/op/pub/app01/data?v=1) | Certificate for the Frontend Career Path (https://developer.mozilla.org/en-US/blog/mdn-scrimba-partnership/) | Code reviews on Pro. No job board found | "Scrimbassadors" referral (20% off) |
| Josh W. Comeau | Private Discord for buyers | Custom course platform | PDF with a unique verification URL (https://css-for-js.dev/) | Joy of React "Job Hunting Kit", 11 mock interviews (https://www.joyofreact.com/) | Team licenses 10–20% off. 20% student discount, regional pricing, 30-day refund |
| Epic Web / Kent | Discord, office hours, KCD Learning Clubs, Epic Web Conf | Epic Workshop app (`npx epicshop init`), Epic AI (epicai.pro) | Completion certificates (https://www.epicreact.dev) | None found | 30-day money-back |
| roadmap.sh | Discord, GitHub | AI Tutor (roadmap, course, guide, quiz) at https://roadmap.sh/ai. Lesson packs | None found | None found | — |
| patterns.dev | Newsletter | Agent Skills repo for `.claude/skills/`, `.cursor/skills/`, `.codex/skills/` (https://github.com/PatternsDev/skills) | None | None | Free ebook |
| Flavio Copes | Bootcamp Discord | Bootcamp stack includes Claude Code. AI Workshop cohort 2–22 Dec (Wayback 2026-10-15, https://web.archive.org/web/20261015191424/https://flaviocopes.com/cohorts/) | "CERTIFICATE OF ATTENDANCE" (bootcamp.dev Wayback) | Testimonials cite jobs landed | $399 or $44/week. 14-day refund |

**Gap we can own.** Nobody combines (a) zero-signup, in-browser first lessons, (b) installable Agent Skills, (c) a job-outcome bridge, and (d) pricing built for people without a salary. Scrimba is the nearest threat on (b), and Frontend Mentor and patterns.dev are moving into AGENTS.md and Skills.

## Analytics instruments

Both providers were read from their own docs on 2026-10-17. Upload-Post: the index https://docs.upload-post.com/llms.txt plus the raw markdown pages (`.md` suffix) cited per row. ConnectSafely: https://connectsafely.ai/docs/api, https://connectsafely.ai/docs/api/overview, https://connectsafely.ai/docs/api/linkedin-analytics, the per-endpoint pages linked below, and the full docs dump https://connectsafely.ai/docs/llms-full.txt (24,739 lines). **Every endpoint listed is read-only.** CXO scripts must never call upload, comment-create, react, message, connect or follow endpoints.

### Upload-Post (Instagram, Facebook, LinkedIn company page, X, YouTube)

- **Base URL:** `https://api.upload-post.com`.
- **Auth header (every call):** `Authorization: Apikey <UPLOAD_POST_API_KEY>` (https://docs.upload-post.com/guides/authentication.md). The scheme word is `Apikey`, not `Bearer`. The analytics page calls the value a "JWT", but the header format is the same.
- **Rate limits** (https://docs.upload-post.com/guides/rate-limits.md):
  - Headers `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` (Unix timestamp) come back on every authenticated response. `429` when exceeded.
  - Free and Basic: 60 req/min and 300 req/10 min. Professional 100/500, Advanced 200/1,000, Business 500/2,500.
  - Each profile adds 2 req/min and 10 req/10 min. Hard ceiling 1,000/min and 5,000/10 min.
  - 10 consecutive invalid keys block the IP for 5 minutes.
- **Separate analytics limit** (https://docs.upload-post.com/api/get-analytics.md): live per-post endpoints are capped at **100 requests per 5 minutes**. `/post-analytics/cached` is exempt.
- **Plan** (https://docs.upload-post.com/resources/pricing-and-limits.md): Free is $0 with 2 profiles and 10 uploads/mo. Paid plans "include ... scheduling and analytics" (Basic $24/mo, 5 profiles).

| # | Read-only endpoint | Returns | Doc |
|---|---|---|---|
| U1 | `GET /api/uploadposts/me` | Key validity, email, plan. Run it first as a health check | https://docs.upload-post.com/api/current-user.md |
| U2 | `GET /api/uploadposts/users` | Profiles, `social_accounts` per platform, `reauth_required` | https://docs.upload-post.com/api/user-profiles.md |
| U3 | `GET /api/analytics/{profile_username}?platforms=instagram,facebook,linkedin,x,youtube`. Extra params: `page_id` (Facebook), `days=1..365` (Facebook only), `page_urn` (LinkedIn only) | Per platform: `followers`, `reach`, `views`, `impressions`, `profileViews`, `likes`, `comments`, `shares`, `saves`, `reach_timeseries` (30 d), YouTube `watch_time_minutes`, `metric_type` | https://docs.upload-post.com/api/get-analytics.md |
| U4 | `GET /api/uploadposts/total-impressions/{profile_username}`. Params: `period=last_week`, `start_date`/`end_date`, `platform`, `breakdown=true`, `metrics=followers,likes,comments,shares` | De-duplicated total impressions, or the named metrics summed, per platform and per day | same page |
| U5 | `GET /api/uploadposts/post-analytics/{request_id}` (optional `platform=`) | Live post metrics, plus `profile_snapshot_at_post_date` and `profile_snapshot_latest` (the follower delta around a post) | same page |
| U6 | `GET /api/uploadposts/post-analytics?platform_post_id=..&platform=..&user=..` | Live metrics for any post, including organic ones | same page |
| U7 | `GET /api/uploadposts/post-analytics/cached?user=..&platform=..&limit<=200&cursor=..&since=..&until=..` | Bulk replay of previously fetched post metrics, with `cached_posts_in_range` vs `published_posts_in_range` | same page |
| U8 | `GET /api/uploadposts/platform-metrics` (public) | Metric keys per platform | same page |
| U9 | `GET /api/uploadposts/media?platform=..&user=..&limit=..&cursor=..` | Recent posts and their IDs (input for U6). Max page 100 (YouTube 50). No cursor on LinkedIn | https://docs.upload-post.com/api/instagram-media.md |
| U10 | `GET /api/uploadposts/comments?platform=..&user=..&post_id=..` | Comments on our posts (Instagram, Facebook, YouTube, LinkedIn, TikTok, X, Threads, Bluesky). Raw text for the feedback log | https://docs.upload-post.com/api/comments.md |
| U11 | `GET /api/uploadposts/history` (`profile_username`, `status`, `start`, `end`, `limit` 10/20/50/100) | What we posted, with `request_id`s for U5 | https://docs.upload-post.com/api/upload-history.md |
| U12 | `GET /api/uploadposts/facebook/pages`, `GET /api/uploadposts/linkedin/pages` | The `page_id` and organization URN that U3 needs | https://docs.upload-post.com/llms.txt |

Caveats, from the same pages:

- **Personal LinkedIn is not covered by Upload-Post.** Analytics and the media list work "only for organization/company pages you administer ... because LinkedIn's API does not expose member-level analytics". A personal profile returns `400` on the media list. Personal LinkedIn metrics come from ConnectSafely.
- Instagram `follower_demographics` needs **100+ followers**. Engaged-audience demographics need about 100 engaged accounts and arrive about 48 h late. Below those thresholds the API returns `{}`, which means "not enough data", not failure.
- `/api/uploadposts/audience` (daily follower gains and losses, online hours) answers **only `platform=tiktok`** (https://docs.upload-post.com/api/audience.md), so it is useless for our five channels.
- Never add up `reach_timeseries` across platforms without checking `metric_type` (reach vs views vs impressions). Facebook snapshots are rolling 30-day totals, so for an exact window use U3 with `days=N`.
- The U7 cache fills only from live reads. The weekly script must call U5 or U6 once for every new post.

### ConnectSafely (personal LinkedIn)

- **Base URL:** `https://api.connectsafely.ai`. Code samples prefix every path with `/linkedin`, e.g. `https://api.connectsafely.ai/linkedin/analytics/followers`. Sandbox: `https://sandbox.api.connectsafely.ai`.
- **Auth header:** `Authorization: Bearer <CONNECTSAFELY_API_KEY>` (RFC 6750). The key comes from https://connectsafely.ai/api-key. Account-scoped calls return `403 NO_API_SEAT_FOR_ACCOUNT` without an active API seat.
- **Rate limits** (https://connectsafely.ai/docs/api/overview):
  - Default **60 requests/minute**, with bursts up to **100 requests/10 seconds**.
  - Calls to the same LinkedIn account are paced automatically at a "natural, human-like cadence". A held request can return `429` with `Retry-After`.
  - Action headers (https://connectsafely.ai/docs/api): `X-RateLimit-Action`, `X-RateLimit-Limit`, `X-RateLimit-Used`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` (ISO 8601). Follow/unfollow is limited to 100/day per account.
  - Errors look like `{"success": false, "code": "...", "message": "..."}`.
- The CLI reference counts the Analytics group as "7 commands, 0 writes" (https://connectsafely.ai/docs/llms-full.txt).

| # | Read-only endpoint (path after `/linkedin`) | Returns | Doc |
|---|---|---|---|
| C1 | `GET /accounts` (`q=` optional) | Connected accounts and `apiSeatAllocated`. Database-only, no LinkedIn call | https://connectsafely.ai/docs/api/linkedin-account/get-accounts-list-linkedin-accounts |
| C2 | `GET /account/{accountId}/quota` | Used, limit and remaining per feature. "makes no LinkedIn call ... safe to poll" | https://connectsafely.ai/docs/api/linkedin-account/get-account-accountid-quota-get-account-quota |
| C3 | `GET /analytics/creator/dashboard?accountId=` | `postImpressions`, `totalFollowers`, `profileViewers`, `searchAppearances`, each with `value`, `changePercent`, `changeDirection` and `comparison`. Plus `weeklyProgress` posts and comments | https://connectsafely.ai/docs/api/linkedin-analytics/get-analytics-creator-dashboard-get-creator-dashboard |
| C4 | `GET /analytics/followers`. Params: `resultType=AUDIENCES\|CONTENT\|ENGAGEMENT\|GROWTH`, `timeRange=past_7_days\|past_14_days\|past_30_days\|past_90_days\|past_year\|custom`, `lineChartType=daily\|weekly\|monthly`, `startDate`, `endDate` | Summary metrics (e.g. "Total followers") and chart points (e.g. new followers per day) | https://connectsafely.ai/docs/api/linkedin-analytics/get-analytics-followers-get-followers-analytics |
| C5 | `POST /analytics/post/summary`, body `{"postUrl": "..."}`. Read-only despite the POST | Impressions, members reached, in/out-of-network split, profile viewers and followers gained, reactions, comments, reposts, saves, sends, viewer demographics | https://connectsafely.ai/docs/api/linkedin-analytics/post-analytics-post-summary-get-post-analytics-summary |
| C6 | `GET /analytics/network/summary` | Exact connections, plus groups, events, pages and newsletters | https://connectsafely.ai/docs/api/linkedin-analytics/get-analytics-network-summary-get-network-summary |
| C7 | `GET /analytics/connections/count` | Exact connection count (not "500+") | https://connectsafely.ai/docs/api/linkedin-analytics/get-analytics-connections-count-get-connection-count |
| C8 | `POST /posts/latest`, body `{"profileId" or "profileUrn", "count" <= 20}` | Recent posts with `numLikes`, `numComments`, `numShares`. Works for our profile and for competitors' public profiles | https://connectsafely.ai/docs/api/linkedin-posts/post-posts-latest-get-latest-posts |
| C9 | `POST /posts/comments/all`, body `{"postUrl", "maxComments"}` | Every comment on a post, which is raw feedback text | https://connectsafely.ai/docs/api/linkedin-posts/post-posts-comments-all-get-all-post-comments |
| C10 | `POST /profile/visitors`, body `{"timeRange", "maxVisitors"}` | Who viewed the profile | https://connectsafely.ai/docs/api/linkedin-user/post-profile-visitors-get-profile-visitors |
| C11 | `GET /account/{accountId}/comments`, `GET /account/{accountId}/reactions` | Our own comment and reaction history, which proves we replied | https://connectsafely.ai/docs/api/linkedin-analytics/get-account-accountid-comments-get-account-comments |

Caveats, from the same pages:

- C5 works only for the connected account's own posts. Counts are LinkedIn estimates and every field "is nullable". If the LinkedIn UI is not in English, the profile-activity and engagement cards come back `null`.
- The LinkedIn Analytics overview still lists `POST /linkedin/analytics/followers`. Its link returns 404 (https://connectsafely.ai/docs/api/linkedin-analytics/post-analytics-followers-get-followers-analytics, fetched 2026-10-17), while the live endpoint page documents `GET`. **Use `GET`.**
- SSI (Social Selling Index) is part of the Sales Navigator API and requires "an active Sales Navigator seat".
- C8, C9 and C10 hit LinkedIn on our account's behalf. Run them weekly, never in a loop, and read C2 first.

### Weekly snapshot shape (what the CXO script writes)

`.benzene/cxo/analytics/YYYY-Www.json` uses one file per ISO week. Its keys come straight from the endpoints above:

```json
{
  "week": "2026-W42", "captured_at": "2026-10-17T09:00:00Z",
  "upload_post": { "instagram": {"followers":0,"reach":0,"views":0,"likes":0,"comments":0,"shares":0,"saves":0},
                   "facebook":  {"followers":0,"reach":0,"impressions":0},
                   "linkedin_page": {"followers":0,"reach":0},
                   "x": {"followers":0,"impressions":0}, "youtube": {"followers":0,"views":0,"watch_time_minutes":0},
                   "total_impressions_last_week": 0 },
  "connectsafely": { "totalFollowers":0, "postImpressions":0, "profileViewers":0, "searchAppearances":0, "connections":0 },
  "competitors": { "discord": {"scrimba":0,"roadmap_sh":0,"frontend_mentor":0,"epic_web":0,"bfe":0},
                   "github": {"roadmap_sh_open_issues":0, "gfe_feedback_open_issues":0} },
  "errors": []
}
```

Sources for each block: Upload-Post fields from U3 and U4. ConnectSafely fields from C3 and C6. Competitor Discord counts from the invite API (`approximate_member_count`). GitHub counts from the GitHub API. An empty `{}` from Upload-Post is stored as `null` with a note in `errors`, never as `0`.

## The bar for our product

Every standard below is measurable. Each lists the target, the competitors who set it, and how a small script checks it. The feedback log is `.benzene/cxo/feedback.jsonl`, one entry per line: `{id, received_at, source, source_url, author_hash, text, category, response_url, responded_at, status, shipped_in}`.

1. **Every public comment is logged.** Target: at least 95% of comments on our posts are in the log within 7 days. Set by: GreatFrontEnd's public tracker (351 closed issues) and roadmap.sh (3,214 closed issues). Check: count comments from U10 (each platform) and C9 (LinkedIn personal) for posts in the week, then count log entries whose `source_url` matches those posts. The ratio must be at least 0.95.
2. **First response is fast.** Target: median first response at most 24 h, and 90% within 72 h. Set by: GreatFrontEnd issue #7 (about 5 h; 2022 median 2.9 d), roadmap.sh (1–2 d) and patterns.dev skills #6 (next day). The anti-example is GreatFrontEnd's 2024 median of 697 d. Check: median(`responded_at − received_at`) over the last 30 days of the log. On LinkedIn, also confirm the reply exists in C11.
3. **No silent backlog.** Target: zero log items older than 30 days with `status=open` and no `response_url`. Set by: roadmap.sh (3 open vs 3,214 closed). The anti-examples are the GreatFrontEnd backlog of 2024–25 and patterns.dev #9 (0 comments). Check: filter the log for open items with `received_at` before today − 30 d and no response; the count must be 0.
4. **The loop is closed in public.** Target: at least one dated changelog entry per month that cites at least one feedback `id`. Set by: roadmap.sh (monthly changelog), Josh ("because it was a popular request!"), Frontend Mentor ("direct result of conversations") and the Scrimba/MDN partnership ("implemented all of our feedback"). Check: parse the changelog file. The newest entry must be under 31 days old and match `fb-\d+`.
5. **Zero signup before the first lesson.** Target: from the homepage, at most 2 clicks and at most 3 minutes to a runnable, passing first exercise in the browser, with no account. Set by: GreatFrontEnd ("No signup required"), roadmap.sh (1 click), BigFrontEnd.dev and Scrimba (free in-browser). The anti-examples are Frontend Mentor (GitHub login, local build) and Epic (`npx` install). Check: a Playwright script starts at `https://elegantfrontend.training`, clicks the first-lesson CTA, runs the exercise, and asserts that the pass state appears and that elapsed time is at most 180 s with no auth page seen.
6. **A meaningful free tier.** Target: the first module is free, with at least 20 lessons. Set by: Epic's free "Get Started With React" (20 lessons), Scrimba's free HTML/CSS course (122 lessons), Frontend Masters' 5 free courses, and GreatFrontEnd's "about 80% of challenges are free" on Projects. Check: count lessons with `free: true` in the content manifest.
7. **Pricing an unemployed learner can afford.** Target: a discount of at least 40% for learners who self-declare they are between jobs, plus regional pricing. Set by: GreatFrontEnd (40% student discount) and Josh (20% student discount plus regional pricing). The motivating complaint: Epic React was "a heavy lift for new or unemployed devs". Check: the pricing-page JSON exposes `discounts.between_jobs >= 0.40`.
8. **Billing nobody complains about.** Target: a 30-day refund, a renewal reminder at least 7 days ahead, one-click cancel, and zero log items tagged `billing-complaint` per quarter. Set by: Josh and Epic (30-day refund). The anti-examples are Scrimba ("cancelation process ... misleading", "don't send you any renewal reminders"), BigFrontEnd.dev ("we don't offer refund") and Frontend Masters ("no refund"). Check: count `category=="billing-complaint"` in the log over 90 days; it must be 0. Also check that the reminder job ran for every renewal in billing events.
9. **A community with a published size and a weekly live slot.** Target: a community channel exists by launch. Its member count goes in every weekly snapshot. A weekly live office hour starts at 100 members. Set by: Scrimba (85,686 members, Town Hall every Tuesday), Epic Web (15,075 members, weekly office hours) and roadmap.sh (51,961 members, count shown on the homepage). Check: the snapshot has `community.members` and the events log has at least 1 `office_hour` per ISO week once members ≥ 100.
10. **Analytics snapshot every week.** Target: 52 snapshots a year, no gap over 8 days, and every named metric in the snapshot shape present or explicitly `null` with a reason. Set by: the published counts competitors use as public proof (roadmap.sh's "52K Discord Members", Frontend Mentor's 1,202,288 developers). The data comes from Upload-Post (U3, U4) and ConnectSafely (C3, C6). Check: list `.benzene/cxo/analytics/*.json`, assert consecutive ISO weeks and validate the keys.
11. **Verifiable certificates.** Target: every completion issues a certificate at a unique public URL that returns 200 and names the learner and the course. Today `docs/assets/js/certificate.js` prints a certificate client-side and the site has no backend, so until then each certificate carries an ID whose hash is listed in a published `certificates.json`. Set by: Josh (unique verification URL), Scrimba (MDN-backed career path certificate), Frontend Masters and Epic React (certificates) and GreatFrontEnd (printable, paid plans). Check: fetch every issued URL and assert 200 and the learner name in the HTML.
12. **A bridge to a job, with tracked outcomes.** Target: a job-hunting module ships with the first paid tier, and at least 20% of completers report an outcome (interview, offer or none) within 90 days. Set by: Josh ("Job Hunting Kit", 11 mock interviews), Frontend Masters ("Job Hunting in the Age of AI"), the Frontend Mentor hiring platform and Flavio (unemployed testimonial). The motivating gap is Scrimba's "no pathway to ... first entry level position". Check: `outcomes.jsonl` entries / completers older than 90 days ≥ 0.20.
13. **Skills ship as installable artifacts, with a public tracker.** Target: every lesson ships a `SKILL.md` (plus `AGENTS.md`) installable in one command, in a public GitHub repo with Issues on. Issues are a log `source`. Set by: patterns.dev (`npx skills add`, 58 skills), Frontend Mentor (AGENTS.md/CLAUDE.md in every challenge) and Scrimba ("Skills Challenge"). Check: walk the lessons directory and assert `SKILL.md` exists. Then `GET https://api.github.com/repos/<us>/<repo>` must show `has_issues: true`. Issues are imported into the log weekly.
14. **Testimonials with a source.** Target: 10 testimonials by the first 1,000 learners and 50 by 10,000. Each needs consent, a source URL and a log `id`. Set by: Frontend Mentor (10 on the homepage), Flavio (42), Kent (56) and Frontend Masters (about 82). Check: count `testimonials.json` items whose `source_url` and `consent_at` are both set.
15. **Every negative public review gets a reply.** Target: 100% of reviews of 1–2 stars (or negative comments) answered within 72 h. Set by: Scrimba (replies to 25% of negative Trustpilot reviews). The anti-example is Frontend Masters (no visible replies). Check: log items with `sentiment=="negative"` and `source in {trustpilot, reddit, hn, x, linkedin}` must all have `responded_at − received_at ≤ 72h`.
16. **A learner survey, plus being named where the field is counted.** Target: an in-product survey every quarter once we have 100 learners, and our name appearing in the State of JS or State of React "courses" answers by the 2027 edition. Set by: Frontend Masters (member survey drove the rebrand), Scrimba ("Give Feedback!" lessons), and the Devographics listings (Frontend Masters 18.74%, Scrimba 2.23%; GreatFrontEnd, Frontend Mentor and roadmap.sh not listed). Check: survey files exist per quarter. Then grep the edition's `resources/page-data.json` for `elegantfrontend`.

### Audience threshold: when feedback starts to steer the product

**Proposal.** User feedback starts to **steer the roadmap** at **30 distinct people giving substantive feedback in a rolling 30-day window**, or at **5,000 combined audience**, whichever comes first.

- **Combined audience** is the sum of: followers across Instagram, Facebook, LinkedIn page, X and YouTube (U3 `followers`), personal LinkedIn `totalFollowers` (C3), registered learners and community members. Take the values from the weekly snapshot.
- **Once steering**, a request goes onto the roadmap when **at least 3 distinct people raised it across at least 2 channels**, or when 1 paying learner reports it as a blocker.
- **Below the threshold**, every item is still logged and answered (bars 1–3 apply from day one). The roadmap then follows the competitor bar above, not individual requests.
- **At 5,000**, add a weekly public ritual (office hour or "you asked, we shipped" post). **At 10,000**, run a quarterly survey.

Why these numbers, from the competitors' own early history:

- **30 people is enough to shape a course.** Josh shaped CSS for JS Devs with "about 30" testers (failory, 2021) and Joy of React with about 70 "Test Squad" members (https://www.joyofreact.com/). Both happened before thousands of buyers arrived.
- **Feedback steered Frontend Mentor's product from a tiny base.** It was steering from a 32-point Show HN and a Slack group (2018). The platform itself was then built "Based on community feedback" within about a year (https://news.ycombinator.com/item?id=18184149; Starter Story 2021). Waiting for a large audience is not what the successful ones did.
- **5,000 is where signal becomes reliable.** Scrimba spent "nine months to reach 5,000 users", and the next course launch tripled it to 15,000 in a week (https://scrimba.com/articles/how-scrimba-came-to-be/). Josh's early-access pre-sale reached "almost 5000 copies", and buyer requests (interview questions) then changed the course (failory; https://www.joshwcomeau.com/email/jor-launch-004-faq-primary/). Scrimba only ran a weekly Town Hall later, once the community was in the tens of thousands.
- **Listening must not slip as volume grows.** GreatFrontEnd's median close time went from 2.9 days (2022) to 697 days (2024). That is why bars 2–3 apply at every size, and why steering adds a 3-person/2-channel rule instead of acting on the loudest single voice.
- **Our audience is small but urgent.** The audience is laid-off frontend developers ("hundreds of applications ... maybe 10 or so callbacks"). That favours the lower trigger, 30 people, over waiting for scale.

## Channels

What the CXO office listens on. "Instrument" names the endpoint from `## Analytics instruments`.

| Channel | What we hear | Instrument (read-only) | Cadence | Feeds |
|---|---|---|---|---|
| Instagram | Followers, reach, views, saves, comments | U3, U9→U6, U10 | Weekly. Comments daily | Snapshot, feedback log |
| Facebook Page | Followers, reach, impressions (`days=7`), comments | U12→U3 (`page_id`, `days`), U10 | Weekly | Snapshot, log |
| LinkedIn company page | Followers, reach, posts, comments | U12→U3 (`page_urn`), U9, U10 | Weekly | Snapshot, log |
| LinkedIn personal (founder) | Total followers, post impressions, profile viewers, search appearances, per-post reach and demographics, comments | C3, C4 (`GROWTH`, `past_7_days`), C5, C8, C9, C11 | Weekly. Check C2 first | Snapshot, log, response proof |
| X | Followers, impressions, replies | U3, U6 (`platform=x`), U10 | Weekly | Snapshot, log |
| YouTube | Subscribers, views, watch time, comments | U3, U6, U10 | Weekly | Snapshot, log |
| Our community (Discord or similar) | Member count, questions, office-hour attendance | Discord invite API `approximate_member_count` (no auth) | Weekly | Snapshot (bar 9) |
| Skills GitHub repo | Issues and discussions on skills | `api.github.com/repos/<us>/<repo>`, `/search/issues` | Weekly import | Log (bar 13) |
| Site feedback form and in-lesson "Give feedback" | Lesson-level friction | Own endpoint → `feedback.jsonl` | Continuous | Log |
| Reviews and mentions (HN, Reddit, Trustpilot) | Unprompted praise and complaints | HN Algolia API. Reddit search RSS (the JSON API returned 403 unauthenticated). Trustpilot page | Weekly | Log (bar 15) |
| Competitor watch | Their community sizes and open-issue backlogs | Discord invite API, GitHub API, Devographics `page-data.json`, ConnectSafely C8 for competitors' public LinkedIn posts | Weekly (Devographics yearly) | Snapshot `competitors` block |
| Google Analytics (later) | Time to first lesson, funnel drop-off | GA4 Data API, to be specified when it is connected | — | Bar 5, cross-checked against the Playwright timing |

## Unverified

- **Time to first solved question or first lesson** for every competitor. No competitor publishes it and I did not time any flow. The step counts in the onboarding table come from the flows described on their pages.
- **Reddit subscriber counts** for r/Frontend, r/webdev, r/learnprogramming and r/cscareerquestions. `about.json` returned 403. The only figure seen, r/Frontend at 237,540 on subredditstats.com, was last checked in Dec 2023 and is stale. I also have no Reddit quotes about any named competitor.
- **The six unlisted competitors.** I could not confirm that GreatFrontEnd, BigFrontEnd.dev, Frontend Mentor, Flavio Copes, patterns.dev and roadmap.sh sit inside Devographics' "other answers". The summary data has no per-name breakdown.
- **Frontend Masters:** founding year and early audience numbers (only an HN post from 2013-04-05 and the GitHub org date 2013-10-04 were found). No official Discord confirmed. G2 review count (g2.com returned 403).
- **GreatFrontEnd:** exact launch date, early user counts, total testimonial count (loaded by JavaScript), and whether a public changelog exists (`/changelog` returned 404).
- **BigFrontEnd.dev:** founder, launch date, early audience, what "FRIENDS 50k+" measures, and any changelog or roadmap. The site returned 403 directly and was read through a reader proxy.
- **Frontend Mentor:** the Indie Hackers milestone "10,000 registered users / $1,000 monthly revenue" (403, title seen in search only, no date) and the Orbit "50k+ Slack" claim (530).
- **Scrimba:** current Pro price (JS-rendered), founding year on a first-party page, and the "two million users" figure. That figure appears in an instructor bio, while the 2024 article says "well over a million".
- **Josh W. Comeau:** current newsletter size, Discord member count (the Discord is private), current course prices ($399/$599 appeared only in search snippets), and the Indie Hackers AMA (403).
- **Kent C. Dodds / Epic Web:** Epic React and Epic Web prices (the page showed "Loading price"), Epic Web certificate and refund terms (FAQ not rendered), early newsletter size, and the time to first exercise for epicshop.
- **roadmap.sh:** whether the AI Tutor needs signup and what its limits are. The "1.25 million developers (2024)" figure comes from a third-party HN post, not roadmap.sh.
- **patterns.dev:** launch date beyond its first HN post (2021-12-20) and star growth (the stargazer API was not reachable).
- **Flavio Copes:** newsletter size. The live pages returned 403, so every Flavio figure comes from a Wayback snapshot dated as cited.
- **Search snippets I did not fetch:** "frontend is dead" claims from a GreatFrontEnd blog post, the DOU H1 2026 report (frontend postings down 515, 198 applications per posting) and a LinkedIn post.
- **Upload-Post per-platform analytics throttles** beyond the documented 100 requests per 5 minutes on live post analytics. Also whether the Free plan returns analytics at all: the pricing page says paid plans "include ... analytics" and does not mention Free.
- **ConnectSafely:** API seat price (https://connectsafely.ai/pricing was not fetched) and the per-feature daily quotas for read calls such as `PROFILE_VIEW`. The 120/day limit seen is only an example value in the C2 docs. The OpenAPI spec at `https://api.connectsafely.ai/linkedin/openapi.json` did not resolve from this environment.
