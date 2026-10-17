# COO: how the organisation is run

Scope: the management and operations standard that frontend-training competitors set, and how Linear runs cycles for a small team. This file grounds the COO's planning in Linear and sprint sizing per office (CTO, COO, CMO, CXO, CFO, CIO).

How the evidence was gathered (all fetched 2026-10-17):
- Live pages were fetched directly.
- Repository facts come from the GitHub REST and GraphQL APIs.
- "First seen" dates come from the Wayback Machine CDX index and the archived snapshot itself.

A first-capture date proves that something existed *by* that date. It is not a launch date. Every claim carries an evidence ID from `## Evidence`.

## Competitors

**roadmap.sh (Kamran Ahmed): open-core, community-run content, the most public operations of the set**
- **Team:**
  - Founder Kamran Ahmed is the named contact; he answers email and X himself ("I do reply to everyone") [R1].
  - Lesson packs are "written by our team", and a named writer (Carly Page) owns the Cybersecurity newsletter [R2].
  - In the last 50 issues, one maintainer (jcanalesluna) gave the first response on 29 [R5]. Headcount is not published.
- **Governance:**
  - Roadmaps are "created and reviewed by community and several subject matter experts", and there is "a process to review and approve" changes [R1].
  - A 148-line `contributing.md` sets content rules. Examples: a topic is explained in a "single paragraph", no self-promotion, one PR per content addition [R3].
  - The repo also has a code of conduct. GitHub community health is 71% [R3].
- **Roadmap and changelog:** a public changelog at `/changelog` has 21 dated entries from 13 Sep 2024 to 17 Sep 2026. The median gap is 31 days and the longest is 99 [R2]. Each entry mixes three kinds of item:
  - content: new roadmaps and lesson packs;
  - product: UI updates and AI Tutor tooltips;
  - marketing: newsletters and "Gift Roadmap Pro".
- **Release process:** content merges to `master` and is "synced to the website" [R3]. There is 1 GitHub release and there are 4 tags; the changelog page, not GitHub, is the release note [R3].
- **Contribution process:**
  - There are 5 YAML issue forms, and each applies a label: `topic-change`, `bug`, `roadmap contribution`, and so on.
  - `config.yml` sets `blank_issues_enabled: false` and routes roadmap requests, guidance and chat to Discord, and typos to PRs [R3].
  - The repo has 104 labels: one per roadmap slug, plus status labels such as `agreed`, `reviewed`, `Under Review`, `feedback left` and `investigating` [R3].
  - Automation does part of the triage [R4]:
    - it labels topic-change issues with the roadmap slug;
    - it closes them when no roadmap URL is given;
    - a daily cron closes PRs labelled `feedback left` after 7 days without activity.
- **Response:** of the last 50 issues, 48 got a response. The median first response was 20.7 h and the median time to close was 38.4 h. Only 3 of 3,217 issues are open [R5].
- **Support:** GitHub issues handle bugs and Discord handles requests (52K members). Email goes to the founder. The newsletter reaches 150,000+ [R1].

**GreatFrontEnd (Codeney Pte Ltd): paid from day one, with a public feedback tracker**
- **Team:** the team page lists 19 people [G1]:
  - 5 "Team" members: founder Yangshun Tay, two senior engineers, one engineer and one intern;
  - 7 "Expert" contributors;
  - 1 "Community" member;
  - 6 "Alumni".
- **Team in October 2022:** the same page listed 2 engineers [G7].
- **Roadmap:** `/interviews/roadmap` promises "See what we're building next and catch up on the latest GreatFrontEnd releases". Its items load client-side, so their content could not be read [G3]. A site-wide banner announces "New questions added in Oct 2026" [G3].
- **Contribution and triage:** the `greatfrontend/greatfrontend` repo is "Feedback and suggestions for GreatFrontEnd" [G5]:
  - it holds 409 issues, of which 58 are open;
  - it has 2 issue templates, `question-report` and `article-report`;
  - 14 labels are keyed to the content type: `question-algo`, `question-javascript`, `question-quiz`, `question-system-design`, `question-ui`, and `guide-*` per guide.
- **Response:** the founder gave the first response on 17 of the last 50 issues. The median first response was 355.3 h, and 9 of the 50 are still open with no reply [G5]. The contact page says "We usually get back within 1-2 days" [G4].
- **Content cadence:** the blog lists 106 distinct post dates. 65 of them fall in 2026 up to Oct 16, which is about 1.6 posting days a week [G6].

**Frontend Masters (renamed Master.dev on 15 Jun 2026): live-first production, founder-written marketing**
- **Team:** it started as a "solo venture (with contractors)" and grew into a team. A product designer was integrated in 2024 [M5]. The founder still "write[s] all the copy for the Frontend Masters website, course announcements, and newsletters", which reach 500,000+ people [M5]. Headcount is not published.
- **Planning:** the homepage schedules 8 live workshops from 22 Oct 2026 to 8 Apr 2027, which is 173 days ahead. Each one "Includes live Q&A and replay access", so a live event becomes the recorded course [M1].
- **Content cadence:** the blog has 745 posts, the first on 2022-09-08 [M3]. Three posts landed on three consecutive days (Oct 14–16, 2026) [M1].
- **Catalogue:** 300+ courses and 24 learning paths [M2].
- **Support:** email to `support@master.dev` [M1].
- **Customer input:** the rebrand came from a member survey [M2].

**Frontend Mentor (Matt Studdert): community-reviewed practice, plus Pro, Teams and Hiring**
- **Product:** 120+ projects across five difficulty levels. Free members get one AI review a month, and Pro gets one on every submission [FM1]. There are separate `teams.` and `hiring.` products [FM1].
- **Support:**
  - help happens in the Discord "help" channel ("The best (and quickest) way to get help");
  - billing goes to email, with "reply times are usually slower over the weekend";
  - refunds follow a 14-day fair-use policy [FM2].
- **Team:** in 2018 it was a solo founder [FM4]. Current headcount is not published.

**Epic Web (Kent C. Dodds with the bad-a.dev team): explicit production roles and decision records**
- **Team:** the credits page names 8 roles [E1]:
  - Instructor & Creator;
  - Executive Producer & Tech Lead;
  - Producer: "instructional design, writing, planning, project coordination, and marketing support";
  - Associate Producer: content migration, "QA reviews to identify fixes needed ahead of launch", event setup;
  - Product Designer & Developer;
  - Illustrator;
  - Video Editor;
  - Developer.
- **Content process:** content was "rigorously tested … in a series of live workshops and revised … based on feedback" before the self-paced release [E1].
- **Governance (Epic Stack, the open-source app template):**
  - `docs/decisions/` holds 48 numbered decision records plus `000-template.md`. That is about 1.2 a month over the repo's life [E3].
  - CONTRIBUTING says "check with me before doing a bunch of work" [E3].
  - The PR template has Summary, Test Plan, a checklist (tests updated, docs updated) and Screenshots [E3].
  - The 13 labels include `accepted`, `needs investigation`, `can't reproduce` and `example needed` [E3].
- **Releases:**
  - Epic Stack has 14 date-named releases (tag = `YYYY-MM-DD`, with a titled note) from 2024-05-29 to 2026-01-20 [E3].
  - The workshop app `epicshop` has 864 releases, from v1.0.0 on 2023-02-10 to v6.90.35 on 2026-10-13 [E4].
- **Response:**
  - Epic Stack: median first response 6.5 h, median close 12.1 h [E3].
  - kentcdodds.com: median first response 5.3 h [E5].
- **Agent operations (kentcdodds.com):**
  - a 30-line `AGENTS.md` that says "Keep it tiny and stable" and only links to 6 files in `docs/agents/`, including `bugfix-workflow.md` ("Reproduce the bug first");
  - a `skills-lock.json` that pins a `ship-pr` skill by hash;
  - in the last 50 PRs, one came from `devin-ai-integration` and 48 from Kent [E5].
- **Support:** email to `team@epicweb.dev`. The newsletter has 40,000+ subscribers [E2].

**Scrimba (Oslo): founder trio, user-generated screencasts first**
- **Team:** "three co-founders" in April 2017 [S1]. Current headcount is not published.
- **Feedback:** a public `scrimba/community` GitHub repo dates from 2016-12-20 [S3].
- **Sequence:** see `## The sequence`.

**Josh W. Comeau: solo, waitlist-driven launches**
- **Team:** "a solo indie hacker" [J1].
- **Support:**
  - email to `support@joshwcomeau.com`;
  - a Discord community;
  - a 30-day unconditional refund [J2].
- **Release notes:** these live in the course FAQ ("The most recent significant update was in December 2025"). Josh avoids "hard promises around future updates" [J2].

**patterns.dev (Lydia Hallie, Addy Osmani)**
- **Team:** 7 credited people: 2 co-creators and writers, plus contributors in engineering, writing and editing, illustration and "Whimsical UX" [P1].
- **Agent Skills:** on 2026-03-24 it shipped Agent Skills, 58 `SKILL.md` files installed with `npx skills add` [P2]. This is the closest analogue to our skills.

**BigFrontEnd.dev:** 600+ questions and premium content. Contact is Discord and X only [B1]. The team is not published, and direct fetches of the site return HTTP 403 [B3].

**Flavio Copes: solo**
- **Output:** 20+ ebooks and 2,100+ posts [F1].
- **Cohorts:** cohort courses have a waiting list, for example "a three-week intensive cohort starting October 28th" [F1].
- **Changelog:** a site changelog since 31 May 2026, with 68 dated entries up to 6 Oct 2026. It is "not a list of commits" [F2].
- **Bootcamp:** cohorts unlocked "new modules every week" [F3].

**Reference, not a competitor: Linear (the COO's tool)**
- **Cycles:** cycles run 1–8 weeks on a repeating schedule, with optional cooldowns. Up to 15 future cycles can exist [L1].
- **Rollover:** open issues roll over automatically, and an unfinished issue cannot stay in a closed cycle [L2].
- **Capacity:** capacity = velocity of the previous three completed cycles. With no history, it is estimated from member count [L3].
- **Sub-teams:** sub-teams inherit the parent's cycle schedule [L4].
- **Linear Method:**
  - "2-week cycles are the most common" [L5];
  - one named owner per project and issue [L5];
  - projects of "1–3 weeks with a team of 1–3 people" [L6];
  - a changelog "reminds you every week what happened" [L7].
- **Triage:** triage uses a rotating "Triage captain" [L13].
- **Plan limits:** Triage Rules, Triage Responsibility, Triage Intelligence and SLAs require the Business or Enterprise plan [L11][L12]. On a lower plan, the repo scripts in the bar below stand in for them.

## Evidence

All rows fetched 2026-10-17. "WB" means a Wayback Machine snapshot or CDX first capture with status 200.

| ID | Fact | Source URL | Fetched |
|----|------|------------|---------|
| L1 | Cycles "can last anywhere from 1-8 weeks" and follow a repeating schedule. An optional cooldown can follow each cycle ("Issues cannot be assigned to a cooldown"). "The maximum number of future cycles that can be created is 15." A cycle starts 12:01 AM in the team timezone. | https://linear.app/docs/use-cycles | 2026-10-17 |
| L2 | "Open issues generally roll over automatically". Issues moved to backlog, triage or canceled, or completed during cooldown, are not carried. "There is no way to keep unfinished issues in a closed cycle." Started and Completed issues can be auto-added to the current cycle. | https://linear.app/docs/use-cycles | 2026-10-17 |
| L3 | "Capacity is calculated from the velocity of the previous three completed cycles, i.e. the number of issues or estimate points completed". With no completed cycles, capacity is "roughly estimated from the number of members in the team". | https://linear.app/docs/use-cycles | 2026-10-17 |
| L4 | "sub-teams inherit the cycle schedule of their parent team". | https://linear.app/docs/use-cycles | 2026-10-17 |
| L5 | "2-week cycles are the most common in software building … Don't overload cycles … let unfinished items move to the next cycle automatically". "Every project should have a named owner … The same rule applies to issues". Keep a manageable backlog. Include bugs in cycles. "Write a changelog". | https://linear.app/method/introduction | 2026-10-17 |
| L6 | "Design projects so that they can be completed in 1–3 weeks with a team of 1–3 people. Smaller fixes or additions should take only hours or a day." | https://linear.app/method/scope-projects | 2026-10-17 |
| L7 | "One way to build in public is to publish a changelog … it reminds you every week what happened and encourages you to ship constantly." | https://linear.app/method/build-in-public | 2026-10-17 |
| L8 | Launch multiple times rather than once. Linear launched at company announcement, seed, open-to-all with pricing, and Series A. | https://linear.app/method/launching | 2026-10-17 |
| L9 | Estimate scales: Exponential 1,2,4,8,16 (extended 32,64), Fibonacci 1,2,3,5,8 (extended 13,21), Linear 1–5, and T-shirt XS–XL (extended XXL, XXXL; maps to Fibonacci). "By default, unestimated issues count as 1 point". "When estimates are too large, refine issue scope". | https://linear.app/docs/issue-property | 2026-10-17 |
| L10 | Default statuses are Backlog > Todo > In Progress > Done > Canceled. Priorities are No priority / Low / Medium / High / Urgent, and there are no custom priorities. | https://linear.app/docs/issue-property | 2026-10-17 |
| L11 | Default SLAs are Urgent 24 hours and High 1 week; Medium, Low and No priority remove the SLA. Rule durations range from 12 h to 4 weeks, or custom. SLAs need the Business or Enterprise plan. Risk levels: Low > 1 week, Medium within 1 week, High within 1 day, Breached. | https://linear.app/docs/issue-property | 2026-10-17 |
| L12 | Triage is a team inbox. Actions are Accept (1), Decline (2), Duplicate (3/MM) and Snooze (H). Triage responsibility rotates and can come from PagerDuty, OpsGenie, Rootly or incident.io. Rules run "top down". Intelligence, Rules and Responsibility need Business or Enterprise. No SLA is stated. | https://linear.app/docs/triage | 2026-10-17 |
| L13 | "Choose Triage captains … It's common to set up a rotation (e.g., weekly)". Linear's own practice: "a rotating Triage captain. Every engineer on the team participates." Example SLAs: urgent 24 h; high plus bug 1 week; low plus bug 2 weeks. | https://linear.app/docs/triage-manage-unplanned-work | 2026-10-17 |
| L14 | A project is "a grouping of issues that have a clear outcome or planned completion date". Only name and status are required. It has "a single lead field". Start and target dates are set at year, half, quarter, month or day precision. It has milestones. Initiatives group projects. | https://linear.app/docs/projects | 2026-10-17 |
| L15 | Updates carry a health of On track / At risk / Off track. Reminders run daily, weekly or biweekly. Follow-up nudges come "1 working day later, and 2 working days after this". "Update Missing" is shown when the update is "one reminder cycle + 3 days overdue". Linear's own practice: "The project lead adds weekly project updates", reviewed in weekly syncs. | https://linear.app/docs/initiative-and-project-updates | 2026-10-17 |
| L16 | The cycle graph shows scope (gray), target (dotted) and completed lines. "Cycle Success … Completed issues are fully counted, while started issues are counted as 25% done". The worked example is 10 issues, 5 done and 4 started, giving 60%. | https://linear.app/docs/cycle-graph | 2026-10-17 |
| L17 | Agents can be "delegated issues through assignment". With "Delegate … while keeping a human teammate as the assignee", the assignee stays responsible. Agent guidance exists at workspace and team level, and team guidance takes priority. "Agents are not counted as billable seats". | https://linear.app/docs/agents-in-linear ; https://linear.app/docs/assigning-issues | 2026-10-17 |
| L18 | The Linear changelog page shows 10 dated entries, 2 Jul to 8 Oct 2026. The median gap is 11 days and the maximum 18. | https://linear.app/changelog | 2026-10-17 |
| R1 | Creator Kamran Ahmed: "I do reply to everyone". Counts: 370K GitHub stars, +3.2M registered users, 52K Discord members, newsletter 150,000+. Roadmaps are "created and reviewed by community and several subject matter experts … a process to review and approve". The project is open-core, built with Astro and Tailwind. | https://roadmap.sh/about | 2026-10-17 |
| R2 | 21 dated changelog entries from 13 Sep 2024 to 17 Sep 2026. Median gap 31 days, maximum 99. Entries mix new roadmaps, lesson packs, newsletters and UI changes. "Everything is written by our team" (13 Jul 2026). | https://roadmap.sh/changelog | 2026-10-17 |
| R3 | Repo created 2017-03-15, 369,690 stars, community health 71%. Files: `contributing.md` (148 lines) and `code_of_conduct.md`. 5 issue forms and a `config.yml` with `blank_issues_enabled: false` and contact links to Discord. 104 labels. 1 release, 4 tags. | https://github.com/nilbuild/developer-roadmap ; https://api.github.com/repos/nilbuild/developer-roadmap/community/profile | 2026-10-17 |
| R4 | `label-issue.yml` adds the roadmap-slug label to `topic-change` issues and closes any without a roadmap URL. `close-feedback-pr.yml` runs on cron `0 0 * * *` and closes PRs labelled `feedback left` with "no activity for the past 7 days". | https://github.com/nilbuild/developer-roadmap/tree/master/.github/workflows | 2026-10-17 |
| R5 | 3,217 issues (3 open); 4,572 PRs merged. Last 50 issues (created 2026-07-09 to 2026-10-17): 48 got a response; median first response (comment by a non-author, or closure) 20.7 h; median close 38.4 h. jcanalesluna was the first responder on 29/50. 26 of the last 50 PRs were authored by github-actions. | https://api.github.com/graphql (repository nilbuild/developer-roadmap) | 2026-10-17 |
| R6 | WB first captures: `roadmap.sh` 2019-05-09 (3 roadmaps: Frontend, Backend, DevOps; "Email me the Updates"; "Become a Sponsor"); `/guides`, `/about` and `/signup` 2019-11-21; `/videos` 2023-01-06; `/teams` 2023-10-10; `/changelog` 2024-09-26; `/premium` 2025-07-23. | https://web.archive.org/web/20190509063855/http://roadmap.sh/ ; https://web.archive.org/cdx/search/cdx?url=roadmap.sh/teams | 2026-10-17 |
| G1 | The team page lists 19 people: 5 Team, 7 Expert, 1 Community, 6 Alumni. Footer: Codeney Pte Ltd. | https://www.greatfrontend.com/team | 2026-10-17 |
| G3 | "See what we're building next and catch up on the latest GreatFrontEnd releases." Items render client-side ("Loading..."). Banner: "New questions added in Oct 2026". | https://www.greatfrontend.com/interviews/roadmap | 2026-10-17 |
| G4 | "We usually get back within 1-2 days." Contact form plus "Join Discord". | https://www.greatfrontend.com/contact | 2026-10-17 |
| G5 | The repo `greatfrontend/greatfrontend` ("Feedback and suggestions for GreatFrontEnd") was created 2022-11-23; its first issue is #2, 2022-11-24. 409 issues (58 open). Templates: `article-report.md` and `question-report.md`. 14 labels, including `question-algo`, `question-javascript`, `question-quiz`, `question-system-design`, `question-ui` and `guide-*`. Last 50 issues (2026-05-17 to 2026-10-13): 41 got a response and 9 are open with none; median first response 355.3 h; first responder yangshun on 17/50. | https://github.com/greatfrontend/greatfrontend ; https://api.github.com/graphql | 2026-10-17 |
| G6 | The blog listing shows 106 distinct post dates, from Jun 17, 2023 to Oct 16, 2026. 65 of them are in 2026 (about 1.58 a week). | https://www.greatfrontend.com/blog | 2026-10-17 |
| G7 | WB timeline: 2022-01-09 parked Namecheap domain. 2022-10-02 pricing at $39/month, $79/year and $99 lifetime, with "130+ interview questions", study plans of 1 week, 1 month and 3 months, and "front end system design … (launching Oct 2022)". The team page on 2022-10-02 lists 2 engineers. Guidebook 2023-01-05; `/blog` 2024-01-05; `/projects` 2024-05-30; `/interviews/roadmap` 2024-07-14. GitHub org created 2022-08-06; `awesome-front-end-system-design` 2023-01-25; `top-javascript-interview-questions` 2024-06-10. | https://web.archive.org/web/20221002/https://www.greatfrontend.com/pricing ; https://web.archive.org/web/20221002/https://www.greatfrontend.com/team ; https://api.github.com/orgs/greatfrontend | 2026-10-17 |
| M1 | frontendmasters.com now serves "Master.dev". Support is `support@master.dev`. 8 upcoming live workshops run from 22 Oct 2026 to 8 Apr 2027, each "Includes live Q&A and replay access". Blog posts appeared on Oct 14, 15 and 16, 2026. Teams get "Save 37% … with 10 team members or more". | https://frontendmasters.com/ | 2026-10-17 |
| M2 | Rebrand post of June 15, 2026, by Marc Grabanski, CEO. The trigger was a member survey ("The name Frontend Masters is no longer relevant"). "300+ courses", "24 Learning Paths". | https://blog.master.dev/?p=9941 | 2026-10-17 |
| M3 | WordPress API: `x-wp-total: 745` posts; first post 2022-09-08 ("Writing a TodoMVC App with Modern Vanilla JavaScript"). | https://blog.master.dev/wp-json/wp/v2/posts?order=asc | 2026-10-17 |
| M4 | "2014 Founded", "10,000+" students, "100% Bootstrapped", "from zero to 10,000+ paying customers". | https://marcgrabanski.com/ | 2026-10-17 |
| M5 | Article of Jan 2, 2025: "What started as a solo venture (with contractors)". "I still write all the copy for the Frontend Masters website, course announcements, and newsletters, reaching over 500,000 people". In 2024: integrated product designer Kirrie, launched the "Frontend to Fullstack" newsletter, and passed a year of the blog "with over 150 posts". | https://marcgrabanski.com/articles/40 | 2026-10-17 |
| M6 | WB 2011-09-25: "Frontend Masters Workshop Series, Nov 4th – Dec 16th, 2011", "6 Intense Days. 5 Incredible Teachers", with a video package, in Burnsville, MN. WB 2013-06-24: "Fall 2013 Season", 6 Fridays, "Attend in-person or online (full HD streaming with chat)". WB `/blog` 2013-01-02. | https://web.archive.org/web/20110925/http://frontendmasters.com/ ; https://web.archive.org/web/20130624/http://frontendmasters.com/workshops/ | 2026-10-17 |
| FM1 | "120+ professional projects across five difficulty levels". "Free members get one review a month; Pro gives you one on every submission". Teams and Hiring sub-sites. Discord. © 2019. | https://www.frontendmentor.io/ | 2026-10-17 |
| FM2 | 14-day "fair use" refund. "The best (and quickest) way to get help … is in our Discord server … a dedicated 'help' channel". "reply times are usually slower over the weekend". | https://www.frontendmentor.io/faqs | 2026-10-17 |
| FM3 | Podcast of 30 Apr 2021: "nearly 70 challenges", a Pro subscription, "over 130,000 people on the platform", and a Slack community. | https://stackoverflow.blog/2021/04/30/podcast-334-a-curious-journey-from-personal-trainer-to-frontend-mentor/ | 2026-10-17 |
| FM4 | WB 2018-06-04: 4 free challenges and a curated resource list. Founder Matt Studdert was then a freelancer and General Assembly lead instructor; contact was via Twitter. WB `/challenges` 2019-07-19 and `/pro` 2020-09-28. | https://web.archive.org/web/20180604/https://www.frontendmentor.io/ | 2026-10-17 |
| E1 | 8 credited roles: Instructor and Creator (Kent C. Dodds); Executive Producer and Tech Lead; Producer ("instructional design, writing, planning, project coordination, and marketing support"); Associate Producer ("QA reviews to identify fixes needed ahead of launch", events); Product Designer and Developer; Illustrator; Video Editor; Developer. Content was "rigorously tested … in a series of live workshops and revised … based on feedback". | https://www.epicweb.dev/credits | 2026-10-17 |
| E2 | "Join 40,000+ developers in the Epic Web community" (newsletter). Email support via `mailto:team@epicweb.dev`. | https://www.epicweb.dev/ | 2026-10-17 |
| E3 | Epic Stack repo created 2023-05-04. `docs/decisions` has 50 entries: `000-template.md`, 001–048 and README. CONTRIBUTING: "check with me before doing a bunch of work". PR template: Summary, Test Plan, Checklist (Tests updated, Docs updated), Screenshots. 13 labels. 14 releases with date tags, 2024-05-29 to 2026-01-20. Last 50 issues: all 50 got a response; median first response 6.5 h; median close 12.1 h. | https://github.com/epicweb-dev/epic-stack ; https://api.github.com/repos/epicweb-dev/epic-stack/releases | 2026-10-17 |
| E4 | `epicshop` has 864 releases, from v1.0.0 (2023-02-10) to v6.90.35 (2026-10-13). | https://api.github.com/graphql (repository epicweb-dev/epicshop) | 2026-10-17 |
| E5 | The kentcdodds.com repo was created 2020-12-10. `AGENTS.md` is 30 lines ("Keep it tiny and stable"; it only links to `docs/agents/*`, 7 files). `skills-lock.json` pins `ship-pr` with `computedHash`. Last 50 PRs: 48 from kentcdodds and 1 from devin-ai-integration. Last 50 issues: median first response 5.3 h. CONTRIBUTING sends content edits through the GitHub UI. | https://github.com/kentcdodds/kentcdodds.com | 2026-10-17 |
| E6 | WB: `epicweb.dev` 2022-09-07 (pre-launch: "That's why I'm creating Epic Web Dev"); `/tips` 2023-04-01; `/credits` 2023-10-27; `/workshops` 2023-10-29; `/events` 2023-12-10; `/conf` 2024-02-04; `/full-stack` 2024-11-08; `/principles` 2024-12-04. `epicshop` repo created 2023-01-25. | https://web.archive.org/web/20220907/https://www.epicweb.dev/ ; https://web.archive.org/cdx/search/cdx?url=www.epicweb.dev/workshops | 2026-10-17 |
| S1 | Interview dated 17.4.2017: "an Oslo-based startup consisting of three co-founders". Scrimba was built to document the Imba language. | https://survivejs.com/blog/scrimba-interview/ | 2026-10-17 |
| S2 | WB: 2016-10-06 parked domain. 2017-03-09 live, with user screencasts ("CSS Flexbox basics … 3 months ago"). 2018-12-01 free courses (React, Angular, Vue, TypeScript) plus freeCodeCamp content. `/learn/frontend` 2020-09-20; `/articles` 2021-01-20; `/pricing` 2021-07-25; `/podcast` 2021-09-22. | https://web.archive.org/web/20170309/https://scrimba.com/ ; https://web.archive.org/web/20181201/https://scrimba.com/ | 2026-10-17 |
| S3 | The `scrimba/community` repo was created 2016-12-20. | https://api.github.com/users/scrimba/repos | 2026-10-17 |
| J1 | "These days, I'm a solo indie hacker focused on empowering up-and-coming software developers." | https://www.joshwcomeau.com/about-josh/ | 2026-10-17 |
| J2 | Support at `support@joshwcomeau.com`. A Discord community. Refund "in the first 30 days … unconditionally". "The most recent significant update was in December 2025". "careful not to make any hard promises around future updates". | https://css-for-js.dev/ | 2026-10-17 |
| J3 | WB: `joshwcomeau.com` 2019-02-03; `/subscribe` 2020-03-16; `css-for-js.dev` 2020-11-01 ("subscribe to receive periodic updates … early-bird coupons"); `courses.joshwcomeau.com` 2021-02-27; `joyofreact.com` 2022-06-07 (waitlist, "will be released later in 2022"); `whimsy.joshwcomeau.com` 2025-02-24. | https://web.archive.org/web/20201101/https://css-for-js.dev/ ; https://web.archive.org/web/20220607/https://www.joyofreact.com/ | 2026-10-17 |
| P1 | 7 credited people: Lydia Hallie and Addy Osmani (Co-creator and Writer), Josh W. Comeau (Whimsical UX), 2 software engineers (one also a writer), Writer and Editing, Illustrator. License CC BY-NC 4.0. | https://www.patterns.dev/about | 2026-10-17 |
| P2 | `PatternsDev/skills` was created 2026-03-24 and holds 58 `SKILL.md` files ("58 individual skills", installed with `npx skills add PatternsDev/skills/...`). 3 open issues, and 5 of 7 PRs merged. | https://github.com/PatternsDev/skills | 2026-10-17 |
| P3 | WB: `patterns.dev` 2021-05-31 ("free book on design patterns"); `/posts` 2021-12-20. | https://web.archive.org/web/20210531/https://www.patterns.dev/ | 2026-10-17 |
| B1 | WB 2026-10-10: "More than 600 Front-End questions", "Premium contents - companies & solutions". The only contact links are Discord and twitter.com/BFEdev. | https://web.archive.org/web/20261010214049/https://bigfrontend.dev/ | 2026-10-17 |
| B2 | WB: 2020-08-20 initial page ("Follow @BFEdev for updates or inquiries"); `/problem` 2020-10-06; `/premium` 2024-10-07. | https://web.archive.org/web/20200820/https://bigfrontend.dev/ | 2026-10-17 |
| B3 | Direct fetches of `bigfrontend.dev/about` and `flaviocopes.com/about/` return HTTP 403, so the archive was used instead. | https://bigfrontend.dev/about ; https://flaviocopes.com/about/ | 2026-10-17 |
| F1 | WB 2026-10-15: "20+ programming ebooks", "2,100+ posts and tutorials", and a cohort that is "A three-week intensive … starting October 28th. The waiting list is open." | https://web.archive.org/web/20261015191354/https://flaviocopes.com/about/ | 2026-10-17 |
| F2 | WB 2026-10-06: "This is not a list of commits … The record starts on May 31, 2026". 68 distinct dated entries up to October 6, 2026. | https://web.archive.org/web/20261006202438/https://flaviocopes.com/changelog/ | 2026-10-17 |
| F3 | WB 2026-09-14: "In 2017 I started writing again. In 2018 I focused the site on JavaScript … I published an ebook, then a course, then another." Bootcamp cohort sites in 2020, 2021, 2022 and 2023. "The Bootcamp platforms unlocked new modules every week". A drip course opened lessons "Monday to Thursday", with "Friday … solutions". | https://web.archive.org/web/20260914134147/https://flaviocopes.com/built/ | 2026-10-17 |
| F4 | WB: `flaviocopes.com` 2013-01-04 (posts from Dec 2012; email signup for a "free Javascript Web App development handbook"); `thevalleyofcode.com` 2020-09-24; `/books` 2021-10-22; `bootcamp.dev` 2021-11-19. | https://web.archive.org/web/20130104/http://flaviocopes.com/ | 2026-10-17 |
| O1 | Our repo today: 2 git tags (`v0.0.1`, `v0.0.2`); `release.yml` publishes on `v*` tags. No `CHANGELOG.md`, `ROADMAP.md`, `CONTRIBUTING.md`, `SUPPORT.md`, `.github/ISSUE_TEMPLATE/` or `docs/decisions/`. `AGENTS.md` is 121 lines. `docs/blog`: 103 posts dated 2026-06-14 to 2026-09-22, 4 of them in the trailing 28 days. | local: /home/gaurav/Documents/Projects/elegant-harness/elegant | 2026-10-17 |

## The sequence

Month counts start at each competitor's first verifiable public artifact.

**GreatFrontEnd: paid first, feedback tracker 52 days later**
1. 2022-01-09: domain parked [G7].
2. 2022-08-06: GitHub org [G7].
3. 2022-10-02: the paid product is live. Prices are $39/mo, $79/yr and $99 lifetime, and it has 130+ questions and 1-week, 1-month and 3-month plans. The team page lists 2 engineers [G7].
4. 2022-11-23: public feedback repo [G5].
5. 2023-01: guidebook page and an open-source "awesome" list (a marketing asset on GitHub) [G7].
6. 2023-06-17: earliest blog post date [G6].
7. 2024-05-30: second product (Projects) [G7].
8. 2024-07-14: public roadmap page, 651 days after the paid launch [G7].
9. Today: 19 people listed [G1].

**Epic Web: 417 days of pre-launch before paid**
1. 2022-09-07: pre-launch page by an instructor who already had two courses (Epic React, Testing JavaScript) [E6].
2. 2023-01-25 / 2023-02-10: the workshop app repo, then v1.0.0 [E6][E4].
3. 2023-04-01: free tips [E6].
4. 2023-05-04: open-source Epic Stack, with decision records [E3].
5. 2023-10-27 / 2023-10-29: credits page with 8 roles and paid workshops [E6][E1].
6. 2023-12-10: events [E6].
7. 2024-02-04: conference page [E6].

**Frontend Masters: paid live workshops were the first product**
1. 2011-09-25: page for the Nov 4 – Dec 16, 2011 in-person series, with a video package [M6].
2. 2013-01-02: `/blog` [M6].
3. 2013-06-24: Fall 2013 season adds online HD streaming [M6].
4. 2014: "Founded" as a company [M4].
5. Team: solo with contractors, then hires. A product designer was integrated in 2024 [M5].

**Frontend Mentor: free first, community, then Pro**
1. 2018-06-04: 4 free challenges, a resource list, one founder, contact via Twitter [FM4].
2. 2019-07-19: `/challenges` [FM4].
3. 2020-09-28: `/pro` first captured, 27 months in [FM4].
4. 2021-04-30: nearly 70 challenges, Pro, 130,000+ people, Slack [FM3].

**roadmap.sh: GitHub artifact first, product 26 months later, changelog after 5 years**
1. 2017-03-15: GitHub repo of visual charts [R3][R1].
2. 2019-05-09: site with 3 roadmaps, an email "updates" signup and a sponsor call [R6].
3. 2019-11-21: guides and signup [R6].
4. 2023-10-10: `/teams` [R6].
5. 2024-09-26: `/changelog`, 1,967 days after the site's first capture [R6].
6. 2025-07-23: `/premium` [R6].

**Scrimba: free user-made content, then free courses, then career path and pricing**
1. 2016-12-20: community repo [S3].
2. 2017-03-09: site live with user screencasts [S2].
3. 2017-04-17: three co-founders [S1].
4. 2018-12-01: free framework courses plus freeCodeCamp content [S2].
5. 2020-09-20: career path [S2].
6. 2021-07-25: `/pricing` [S2].

**Josh W. Comeau: blog, newsletter, waitlist, then course**
1. 2019-02-03: blog [J3].
2. 2020-03-16: `/subscribe` [J3].
3. 2020-11-01: waitlist for the first course [J3].
4. 2021-02-27: course platform, 118 days after the waitlist [J3].
5. 2022-06-07: next course waitlist [J3].
6. Solo throughout [J1].

**patterns.dev: free book, then posts, then skills**
1. 2021-05-31: free book [P3].
2. 2021-12-20: posts [P3].
3. 2026-03-24: Agent Skills, 58 of them [P2].

**BigFrontEnd.dev: practice problems first, premium four years later**
1. 2020-08-20: placeholder page with X for "updates or inquiries" [B2].
2. 2020-10-06: problems [B2].
3. 2024-10-07: `/premium` first captured [B2].

**Flavio Copes: blog with email capture, then ebook, course and cohorts**
1. 2012–13: blog with handbook email capture [F4].
2. 2017–2018: restart, then "an ebook, then a course, then another" [F3].
3. 2020: first Bootcamp cohort [F3].
4. 2026-05-31: changelog [F2].

**Patterns across the set, which our order follows:**
1. **Email capture ships first, before or with the first public artifact.** roadmap.sh (2019 site), Josh (2020 waitlist), Epic Web (2022 pre-launch) and Flavio (2012 handbook signup) all did this [R6][J3][E6][F4].
2. **Free content or open source comes before or alongside paid.** Examples: Frontend Mentor, roadmap.sh, Scrimba, patterns.dev, BFE.dev, Epic Web's tips and Epic Stack [FM4][R6][S2][P3][B2][E6].
   - Only GreatFrontEnd charged at launch [G7].
   - Only Frontend Masters' first product was a paid live event [M6].
3. **A public feedback channel follows the first product within months.** GreatFrontEnd opened its repo 52 days after pricing went live [G5][G7]. Frontend Mentor had a Slack by 2021 [FM3].
4. **Public roadmaps and changelogs came late.** GreatFrontEnd took 651 days and roadmap.sh 1,967 days [G7][R6]. Linear's method says to publish a changelog from the start, "when you don't have many users" [L7]. We do that from cycle 1.
5. **Team pages list roles, not titles alone.** Epic Web published 8 role descriptions at launch [E1], and GreatFrontEnd sorts people into Team, Expert, Community and Alumni [G1]. Our equivalent is a page that lists each of the 6 offices and what it owns.
6. **Production is live-first in two of the largest catalogues.** Frontend Masters schedules live workshops months ahead [M1], and Epic Web "rigorously tested" its material in live workshops [E1].

## The bar for our product

Every standard below has a measurable target, the competitors (or Linear) who set it, and a check a small script can run on the repository at `/home/gaurav/Documents/Projects/elegant-harness/elegant`. The baseline is O1. File names are proposals; the scripts assume them.

**Planning and sprints (Linear-grounded)**

1. **One cycle file per cycle, 14 days long, contiguous.**
   - Target: `.benzene/sprints/cycle-NNN.md` has YAML front matter with `start`, `end`, `cooldown_days` and `linear_cycle_url`.
   - Each cycle is 14 days, and the next `start` is the previous `end` plus `cooldown_days`, plus 1.
   - At least 3 future cycles exist at all times, and never more than 15.
   - Set by: Linear (1–8 weeks allowed, 2 weeks "most common", up to 15 future cycles) [L1][L5].
   - Check: parse every cycle file, sort by `start`, and assert the duration is 14 days, there are no gaps or overlaps, and 3 ≤ future count ≤ 15.

2. **Capacity per office, from velocity, never exceeded.**
   - Target: each cycle file lists all 6 offices (`CTO`, `COO`, `CMO`, `CXO`, `CFO`, `CIO`), each with `agents`, `capacity_points`, `planned_points` and `completed_points`.
   - `capacity_points` = the mean of `completed_points` over that office's previous 3 closed cycles.
   - In the first 3 cycles it is seeded from the agent count, and the cycle file states the seed rule.
   - `planned_points ≤ capacity_points` for every office.
   - Set by: Linear (capacity from the previous three completed cycles, or member count with no history; "Don't overload cycles") [L3][L5].
   - Check: recompute the capacity from earlier files and compare. Assert 6 offices, and `planned ≤ capacity` for each.

3. **Estimates on one Fibonacci scale; nothing larger than 8.**
   - Target: every sprint item has `estimate ∈ {1,2,3,5,8}`. A missing estimate counts as 1, and items with estimates of 13 or more are split before planning.
   - Set by: Linear's Fibonacci scale, the default of 1 point for unestimated items, and "When estimates are too large, refine issue scope" [L9].
   - Check: assert every `estimate` value is in the set, and count missing estimates as 1 when summing `planned_points`.

4. **Rollover is explicit; a closed cycle holds no open work.**
   - Target: when a cycle closes, every item not `done` or `canceled` carries `rolled_to: cycle-NNN+1` and appears in the next file.
   - Set by: Linear ("Open issues generally roll over automatically … no way to keep unfinished issues in a closed cycle") [L2].
   - Check: for each closed cycle, find the open items and assert each has a matching `rolled_to` entry in the next file.

5. **Cycle success is recorded with Linear's formula.**
   - Target: `success = (completed + 0.25 × started) / total` is recorded in 100% of closed cycle files, overall and per office.
   - No source sets a minimum. The COO sets the threshold after 3 closed cycles, which is Linear's capacity window.
   - Set by: Linear's cycle-success definition [L16].
   - Check: recompute from item states and assert it equals the stored value to ±0.01.

6. **Exactly one owner per item, project and roadmap entry.**
   - Target: every sprint item, project and roadmap row has exactly one `owner` office, plus an optional `delegate` agent.
   - Set by: Linear (one named owner; a single lead field; delegating to an agent keeps the human or owner assignee responsible) [L5][L14][L17].
   - Check: assert `owner` is a single value from the 6 offices.

7. **Projects scoped to 3 weeks and 3 offices.**
   - Target: `.benzene/projects/<slug>.md` has `target − start ≤ 21 days` and at most 3 offices contributing. Larger work is split into stages.
   - Set by: the Linear Method ("1–3 weeks with a team of 1–3 people") [L6].
   - Check: compute the date difference and count the distinct `offices`.

8. **Weekly project updates with a health value.**
   - Target: every project with `status: in-progress` has an update dated ≤ 7 days ago, with `health ∈ {on-track, at-risk, off-track}`.
   - A project is flagged `update-missing` at more than 10 days (one reminder cycle plus 3 days).
   - Set by: Linear (a weekly update by the lead, its three health values, and its "one reminder cycle + 3 days" rule) [L15].
   - Check: read the newest `## YYYY-MM-DD` update heading in each project file and compare it with today.

9. **A triage captain each cycle, rotating, with Linear's default SLAs.**
   - Target: every cycle file has `triage_captain`, and no office holds it in two consecutive cycles.
   - Urgent intake is accepted or declined within 24 h, and High within 1 week.
   - Set by: Linear (captain rotation, "e.g., weekly"; default SLAs of Urgent 24 hours and High 1 week) [L13][L11].
   - Check: compare `triage_captain` across consecutive files. For issues labelled `priority:urgent` or `priority:high`, compare `createdAt` with the first label or state change via the GitHub API.

**Releases, roadmap and changelog**

10. **A dated public changelog, at least monthly.**
    - Target: `CHANGELOG.md`, mirrored on the site, has `## YYYY-MM-DD` entries. The median gap between entries is ≤ 31 days, no gap exceeds 31 days, and the newest entry is ≤ 31 days old.
    - Stretch: a median gap ≤ 14 days, against Linear's 11.
    - Set by: roadmap.sh (median 31 days) [R2]; Linear (median 11 days, "every week") [L18][L7]; Flavio (68 entries in about 4 months) [F2].
    - Check: parse the headings and compute the gaps and the age of the newest entry.

11. **Changelog entries are curated, learner-facing and mixed.**
    - Target: every entry links at least 1 shipped site path (`/ui/…`, `/practice/…`, `/blog/…`, `/skills/…`) and contains no raw commit SHAs.
    - At least 80% of entries have items in 2 or more of these sections: `### Content`, `### Product`, `### Community`.
    - Set by: Flavio ("This is not a list of commits") [F2]; roadmap.sh (entries mix roadmaps, product features and newsletters) [R2].
    - Check: run the regex `\b[0-9a-f]{7,40}\b` (must find 0 matches), find the path links (≥ 1 each), and count the section types.

12. **One tagged release per closed cycle, each with a changelog entry.**
    - Target: at least 1 `vX.Y.Z` git tag per closed cycle, and each tag's date matches a `CHANGELOG.md` entry within ±2 days.
    - Today there are 2 tags [O1].
    - Set by: Epic Stack (14 date-named releases with titled notes) [E3]; epicshop (864 releases) [E4].
    - Check: run `git tag --format='%(refname:short) %(creatordate:short)'`, then bucket the tags by cycle window and match them to the changelog dates.

13. **A public roadmap with a 90-day horizon.**
    - Target: `ROADMAP.md`, mirrored on the site, has a table with `item | status ∈ {planned, in-progress, shipped} | owner | target (YYYY-MM)`.
    - At least 6 items are not yet shipped, and the furthest `target` is at least 90 days out.
    - Shipped rows link their changelog entry.
    - Set by: GreatFrontEnd (roadmap page with upcoming items and releases) [G3]; Master.dev (8 live workshops scheduled up to 173 days ahead) [M1].
    - Check: parse the table, count the unshipped rows, compare the maximum `target` with today plus 90 days, and resolve every shipped row's changelog anchor.

14. **Waitlist before a major launch.**
    - Target: every roadmap row of type `launch` (a new track, course or paid tier) has a `waitlist:` page live at least 30 days before its `target`.
    - Set by: Josh (waitlist 118 days before the course platform; next course waitlist months ahead) [J3]; Epic Web (pre-launch page 417 days ahead) [E6]; Flavio (cohort waiting list) [F1].
    - Check: for each launch row, assert the waitlist path exists under `docs/`, and use `git log --diff-filter=A` to confirm it was added ≥ 30 days before `target`.

**Governance and contribution**

15. **Decision records for structural changes.**
    - Target: `docs/decisions/000-template.md` exists. Files are numbered `NNN-slug.md` with no gaps.
    - Each record has the sections `Status`, `Context`, `Decision` and `Consequences`.
    - At least 1 new record per 30 days on a trailing 90-day average.
    - Set by: Epic Stack (48 numbered decisions plus a template, about 1.2 a month) [E3].
    - Check: list the directory, assert the numbering is contiguous, grep the 4 headings, and count first-commit dates in the window.

16. **CONTRIBUTING with content and code paths and a "check first" rule.**
    - Target: `CONTRIBUTING.md` has sections for content changes (through the GitHub UI edit), code changes, and what is not accepted (for example self-promotion).
    - It has a "check with the owning office before large work" rule.
    - Set by: roadmap.sh's 148-line contributing guide with content rules [R3]; Epic Stack ("check with me before doing a bunch of work") [E3]; kentcdodds.com (content edits via the GitHub UI) [E5].
    - Check: grep for the 3 section headings and the phrase.

17. **Issue forms, with blank issues off.**
    - Target: `.github/ISSUE_TEMPLATE/` has at least 3 YAML forms, each auto-applying a label: `bug`, `content-correction`, and `skill-or-question-request`.
    - `config.yml` sets `blank_issues_enabled: false`, with `contact_links` sending questions to the community channel.
    - Set by: roadmap.sh (5 forms, blank issues disabled, requests routed to Discord) [R3]; GreatFrontEnd (question and article report templates) [G5].
    - Check: parse the YAML; assert ≥ 3 forms with non-empty `labels`, and `blank_issues_enabled == false`.

18. **A PR template with a test plan.**
    - Target: `.github/PULL_REQUEST_TEMPLATE.md` has `## Test Plan` and a checklist with "Tests updated" and "Docs updated".
    - Set by: Epic Stack [E3].
    - Check: grep for the heading and both checklist lines.

19. **Triage labels keyed to our content and our offices.**
    - Target: `.github/labels.yml` has:
      - a layer label each for `ui`, `server` and `state`;
      - a label for each practice `format`;
      - one `office:<name>` label per office (6);
      - at least 5 status labels (`triage`, `accepted`, `feedback-left`, `duplicate`, `wontfix`).
    - It is synced to GitHub.
    - Set by: GreatFrontEnd (labels per question and guide type) [G5]; roadmap.sh (a label per roadmap, plus status labels) [R3]; Epic Stack (`accepted`, `needs investigation`) [E3].
    - Check: parse `labels.yml`, compare it with `gh api repos/<owner>/<repo>/labels`, and assert the required names.

20. **Stale-PR and malformed-issue automation.**
    - Target: a scheduled workflow closes PRs labelled `feedback-left` after 7 or fewer days without activity, with a comment.
    - Issue forms missing a required field are labelled or closed automatically.
    - Set by: roadmap.sh (daily cron, 7 days; auto-close without a roadmap URL) [R4].
    - Check: grep `.github/workflows/*.yml` for `schedule:` with `cron`, the label name, and a numeric threshold ≤ 7.

21. **First response within 24 hours, with no silent issues.**
    - Target: over the last 50 issues, the median time to first response (a comment by a non-author, or closure) is ≤ 24 h.
    - Zero issues are open for more than 7 days with no response.
    - Set by: roadmap.sh 20.7 h [R5]; Epic Stack 6.5 h [E3]; kentcdodds.com 5.3 h [E5].
    - The anti-example is GreatFrontEnd: it states "1-2 days", but measured 355.3 h, with 9 of 50 issues unanswered [G4][G5].
    - Check: run the GitHub GraphQL query `issues(last:50){createdAt author comments(first:10){createdAt author} closedAt}` and compute the median and the count of unanswered issues.

**Support and roles**

22. **A support page with a response window.**
    - Target: `SUPPORT.md`, mirrored on the site's contact page, names an email address and a community help channel.
    - It states a response window of ≤ 2 days and says whether weekends are slower.
    - Set by: GreatFrontEnd ("1-2 days") [G4]; Frontend Mentor (Discord help channel; "slower over the weekend") [FM2]; Master.dev, Epic Web and Josh (support email) [M1][E2][J2].
    - Check: grep for an email address, a community URL and the regex `\b[12]\s*(business )?days?\b`.

23. **A public offices page: who owns what.**
    - Target: a site page lists all 6 offices. Each entry gives its agent(s), a one-sentence remit, and its human owner. The 6 names match the cycle file.
    - Set by: Epic Web credits (8 role descriptions) [E1]; GreatFrontEnd team categories [G1]; patterns.dev credits (7 people) [P1].
    - Check: parse the page, assert 6 office headings, and compare them with the `offices` keys in the latest cycle file.

24. **A thin agent index.**
    - Target: `AGENTS.md` is ≤ 40 lines (121 today) [O1]. Every path it links exists, and operational detail lives in linked docs.
    - Any third-party skill is pinned by hash in a lock file.
    - Set by: kentcdodds.com (30-line `AGENTS.md` linking `docs/agents/*`; `skills-lock.json` with `computedHash`) [E5].
    - Check: run `wc -l`, resolve every relative link, and assert each lock entry has a 64-hex `computedHash`.

**Content cadence (COO tracks it; CMO owns it)**

25. **At least one post a week, every week.**
    - Target: at least 4 posts in every trailing 28-day window, by the `date:` front matter in `docs/blog/*.md`, and no gap between posts over 14 days.
    - Today: 4 posts in the trailing 28 days, the newest on 2026-09-22, which is a 25-day gap [O1].
    - Set by: GreatFrontEnd (about 1.58 posting days a week in 2026) [G6]; Master.dev (745 posts; posts on consecutive days) [M3][M1].
    - Check: parse the dates, slide a 28-day window, and compute the maximum gap.

## Channels

**Where competitors run their operations in public**

| Channel | Who uses it, with measured size | Operational role |
|---|---|---|
| Public changelog page | roadmap.sh (21 entries, about monthly) [R2]; Flavio (68 entries since May 2026) [F2]; Linear (about every 11 days) [L18] | Release notes for learners. The cadence is measurable. |
| Public roadmap page | GreatFrontEnd `/interviews/roadmap` [G3]; Master.dev's live-workshop calendar up to 173 days out [M1] | Shows planned work and dates. |
| GitHub issues and PRs | roadmap.sh (3,217 issues, 3 open) [R5]; GreatFrontEnd feedback repo (409 issues) [G5]; Epic Stack and kentcdodds.com [E3][E5]; patterns.dev skills [P2] | Intake, triage labels, contribution, response-time evidence. |
| GitHub releases and tags | Epic Stack (14 date-tagged) [E3]; epicshop (864) [E4] | Versioned release notes. |
| Discord | roadmap.sh (52K members; requests are routed here) [R1][R3]; Frontend Mentor ("help" channel) [FM2]; GreatFrontEnd [G4]; Josh [J2]; BFE.dev [B1] | Peer support and feature requests, kept out of the issue tracker. |
| Slack | Frontend Mentor in 2021 [FM3]; Linear sends project updates to `#project-updates` and `#initiative-updates` [L15] | Community (Frontend Mentor 2021); internal update feed (Linear). |
| Email support | Master.dev `support@` [M1]; Epic Web `team@` [E2]; Josh `support@` [J2]; Frontend Mentor [FM2]; roadmap.sh founder inbox [R1] | Billing and account issues, with a stated response window. |
| Newsletter | Master.dev 500,000+ [M5]; roadmap.sh 150,000+ [R1]; Epic Web 40,000+ [E2]; Josh [J3]; Flavio [F4] | Launches, waitlists, cadence reminders. |
| X / Twitter | BFE.dev (the only channel besides Discord) [B1][B2]; roadmap.sh founder [R1]; Frontend Mentor in 2018 [FM4] | Announcements and inquiries for small teams. |
| Live workshops and cohorts | Master.dev (8 scheduled) [M1]; Epic Web (content tested live) [E1]; Flavio (three-week cohorts) [F1] | A production pipeline: live, then recorded, then self-paced. |

**Channels the COO runs for us, and what each is for**
- **Linear:** the system of record for cycles, projects, triage and agent delegation [L1][L12][L17]. Each office is a sub-team, so all offices share the parent's cycle dates [L4].
- **Repo mirror (`.benzene/sprints/`, `.benzene/projects/`):** what the bar's scripts check.
- **GitHub:** issue forms, labels, PR template, stale automation and response-time measurement (bars 17–21).
- **Site pages (`CHANGELOG`, `ROADMAP`, offices, support):** the learner-facing record (bars 10–14, 22–23).
- **Community channel (Discord, matching roadmap.sh, Frontend Mentor and GreatFrontEnd):** support and requests, routed from `config.yml` (bar 17).
- **Newsletter:** a waitlist for every launch (bar 14).

## Unverified

None of the following is used in any bar.

- **Headcounts:** current team sizes for Frontend Masters / Master.dev, Frontend Mentor, roadmap.sh, Scrimba and BigFrontEnd.dev. None publishes one on a page I could fetch. "Team" for roadmap.sh comes only from changelog wording [R2].
- **Launch dates:** Wayback first-capture dates are upper bounds on existence, not launch dates. This applies to Frontend Mentor `/pro` (2020-09-28; Pro may have existed earlier under another URL), BFE `/premium` (2024-10-07), Scrimba `/pricing` (2021-07-25), roadmap.sh `/premium` and every other WB-dated item.
- **Frontend Masters' founding year:** marcgrabanski.com says "2014 Founded" [M4], but the archive shows a "Frontend Masters Workshop Series" in Nov 2011 [M6]. A web-search snippet citing a Medium article said 2008. I did not fetch that article, and I do not use it.
- **GreatFrontEnd roadmap items:** the item content and statuses on `/interviews/roadmap` render client-side and could not be read [G3]. The page's existence is verified; its contents are not.
- **GreatFrontEnd's 2022 stated founder role:** the October 2022 team page listed 2 engineers and not the founder [G7]. Who ran the company in 2022 is not verified from fetched pages.
- **GreatFrontEnd's "2M+ engineers helped":** this appeared only in a search-result summary of the homepage. I did not fetch it.
- **Epic Web FAQ answers:** support response times, update policy and the release schedule for future volumes are collapsed client-side. The questions are visible but the answers are not.
- **Scrimba:** no support model, community size or current team could be fetched (the about and contact pages are client-rendered or 404). Funding figures from directory sites (Seedtable, Latka) disagree with each other, and I did not fetch them.
- **Joy of React:** the actual release date. The archive shows only the June 2022 waitlist saying "later in 2022" [J3].
- **roadmap.sh's star rank:** the about page says both "the most starred opensource project on GitHub" and "6th most starred project on GitHub" [R1]. The page contradicts itself, so neither is used.
- **Response-time method:** my first-response metric counts a comment by a non-author, or a closure, as the response. Bot comments are included. roadmap.sh's PR-merge median (0.1 h) is dominated by `github-actions` PRs [R5], so I did not use PR-merge time.
- **Linear plan:** I did not check which Linear plan this organisation is on. Triage Rules, Responsibility and Intelligence, and SLAs, need Business or Enterprise [L11][L12]. If the plan is lower, bars 9 and 21 rely on the repo scripts, not Linear features.
- **Linear sub-teams:** I infer that each office (sub-team) gets its own capacity dial while sharing the parent cycle dates. The docs state the shared schedule [L4] and a per-cycle capacity dial [L3], but do not explicitly state per-sub-team capacity.
- **Linear's estimates doc:** `linear.app/docs/estimates` returned 404. The estimate facts come from `/docs/issue-property` [L9].
