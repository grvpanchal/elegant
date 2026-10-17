# CIO: how the competition got seeded

Scope: how frontend-education competitors got their first money and first audience. For each one: the pitch they made, what they asked for, the leverage they had before asking, and the market need they met. Written for elegantfrontend.training, which teaches frontend terminology and AI-harness Agent Skills to frontend developers displaced by AI and is run by an AI organisation.

Rules followed: every number below carries an evidence ID `[E#]`. Each ID maps to a URL in `## Evidence`. Every page there was fetched on **2026-10-17**. If a claim could not be fetched, it sits in `## Unverified` and is never used in `## The bar for our product`.

---

## Cases

### 1. GreatFrontEnd (Yangshun Tay, Codeney Pte Ltd, Singapore)
- **Pitch.** Problem: "Preparing for Front End interviews is tough". There is no standard way to assess frontend candidates, and companies range from algorithm questions to component builds to system design [E3]. For whom: frontend engineers interviewing at big tech. The site lists question counts per company: OpenAI 29, Anthropic 18, Google 37, Meta 29, Amazon 65 [E1]. Why now: no explicit argument. The implied one is hiring at named AI labs and FAANG [E1].
- **Ask.** Paid access. Lifetime $180 (list price $500), Monthly $39, Quarterly $85, Annual $120 [E2]. Discounts: student 40%, seasonal 10%, social 20%, and 100% cashback for a submitted review. The page says many users get reimbursed from company learning budgets, and that "Prices will be increased as more content is being added" [E2]. The founder also has a GitHub Sponsors page (tiers $2/$3/$5) [E8] and an Open Collective for the older Tech Interview Handbook (tiers $2–$100) [E9].
- **Outcome.** "2M+ engineers helped", labelled "Verifiable by Google Analytics" [E1]. Open Collective has raised only $3,262.92 total from 83 contributors [E9]. GitHub Sponsors: 2 current, 17 past [E8]. No funding round is disclosed on any fetched page [E3][E4].
- **Leverage before asking.** tech-interview-handbook: 143,047 stars, created 2016-07-05 [E5]. front-end-interview-handbook: 44,005 stars, created 2018-01-13 [E6]. 13,539 GitHub followers. Bio: "Authored Blind 75 and Grind 75", ex-Facebook, Docusaurus, Flux [E7]. Ex-Meta Staff Engineer [E1]. The free handbook README now opens with "By GreatFrontEnd" and says "try out GreatFrontEnd, a platform built by me!", with a 20%-off lifetime promotion [E6]. A newer funnel repo, top-javascript-interview-questions, has 10,092 stars (created 2024-06-10) [E10].
- **Necessity satisfied.** Structured, company-specific frontend interview prep, written by ex-interviewers ("we have interviewed hundreds of candidates") [E3].
- **Timing.** The free OSS audience came first: 2016 and 2018 [E5][E6]. The GitHub org was created 2022-08-06 [E10]. The paid product then turned the existing free repos into a funnel. The audience was 6 years old before the paid product appeared.

### 2. Frontend Masters, now Master.dev (Marc Grabanski)
- **Pitch.** "An advanced learning platform helping developers go deep and stay sharp ... in-depth courses, not quick tutorials" [E11]. For whom: "Primarily, it's developers that are subscribing out of their own pocket", plus "maybe a thousand teams" (2020) [E12]. Why now (2026): "Master Full Stack. Build with AI." and "Learn the Dev Skills to Thrive in the Age of AI" [E15].
- **Ask.** Subscription. Teams "Save 37% over individual plans with 10 team members or more" [E15]. Early growth used a sponsored post on davidwalsh.name (2015-08-04) that gave away three yearly passes and offered free previews, including part of Kyle Simpson's Advanced JavaScript course [E13].
- **Outcome.** "bootstrapped Frontend Masters from zero to 10,000+ paying customers". Founded 2014, "100% bootstrapped", 500k+ newsletter subscribers [E11]. "Building a real business. No VC." [E12]. On 2026-06-15 it rebranded to Master.dev: 300+ courses, 24 learning paths. Four of the ten most-watched courses are AI courses (Claude Code, AI Engineering Fundamentals, AI Agents Fundamentals, Practical Prompt Engineering). Courses on **agent harness engineering** and OpenAI Codex are in progress [E14].
- **Leverage before asking.** The founder created the jQuery UI Datepicker, has spoken at 60+ events, and has 20+ years on the web [E11]. He moved from conference talks to workshops to video [E12].
- **Necessity satisfied.** Depth for working developers who pay for themselves. Since 2026, it also sells AI-era reskilling under a broader name [E14][E15].
- **Timing.** Workshops came before video [E12]. A sponsored-post launch push followed in 2015 [E13]. The AI pivot and rebrand came 12 years after founding [E11][E14]. **This is the most direct competitive signal: an incumbent with 500k+ subscribers is recording "agent harness engineering" now** [E11][E14].

### 3. Scrimba (Per Harald Borgen, Sindre Aarsaether; Oslo) — the only VC-seeded case
- **Pitch (angel round).** Problem: "Creating high-quality video tutorials is hard". The solution was "a new video format for conveying code", screencasts you can pause and edit [E16]. YC one-liner: "We turn people into hireable devs for 1% of the price of code…" and "the quality of Stanford but the price of a gym membership" [E17]. Why now (2023, Schibsted): technology is changing work faster than expected, so upskilling matters. Schibsted's investor quote: "The future of work is being challenged through the development of new technology, faster than many have imagined" [E18].
- **Ask and outcome.** $200K angel round from StartupLab FoundersFund plus founders and CEOs (Zendesk, Unity, Just Eat and others) organised by Nordic Makers. The deal was agreed by the end of January 2017 [E16]. Y Combinator Summer 2020 [E17]. CB Insights lists $1.01M over 7 rounds, with dated rounds on 2017-07-03, 2020-08-25, 2020-10-14, 2023-10-09 and 2024-09-30 (the last $0.1M, from Alliance Venture and Nordic Makers) [E19]. On 2023-10-09, Schibsted Ventures bought a 4.5% stake directly from the owners, a secondary sale. Traction at that point: >1M unique users, >10k paying customers, a team of 13, 2022 revenue NOK 18.7M with an operating result of NOK −0.3M, and "purely organic" growth with "no salespeople or marketers" [E18].
- **Leverage before asking.** A launched beta (early December 2016). A public side project (BugRex) written up on Medium. A tweet from Emil Wallnér that led to Nordic Makers, three other potential investors and likely a first customer. A warm intro (Joel Larsson to Hampus Jakobsson) [E16]. Later, about 120K monthly active students at YC [E17] and an MDN partnership on its React, JavaScript and Frontend paths [E20].
- **Necessity satisfied.** Cheap, interactive, job-oriented training for career changers [E17]. Today it also offers a free **"Learn Agentic Coding"** course (35 lessons covering prompting, planning, testing, Git, permissions, MCP, **skills** and secrets) and a Pro "Learn AI Agents" course (32 lessons) [E20].
- **Timing.** Angels committed about 2 months after the beta [E16]. YC came 3.5 years later [E17]. The strategic secondary came after revenue was proven [E18]. The AI Engineering Path with Hugging Face and LangChain was planned for Q4 2023 [E18].

### 4. Frontend Mentor (Matt Studdert, London)
- **Pitch.** "Instead of tutorials, we provide our community with professionally designed projects to build" [E22]. Today: "Learn to code for free by building real-world projects" [E24]. For whom: juniors who need portfolio-grade work. Why now: none stated. The PRO pitch today is "Fast-track your developer career with Pro" and "Get an AI code review on every solution" [E25].
- **Ask (staged).** (1) Community sponsorships from ZEIT, PixelSnap and Triplebyte, live 2020-02-01, won by cold email. He published his outreach template [E21]. (2) The first one-off premium challenge (2020-02-14) earned over $150 in 24 hours [E21]. (3) February 2020 revenue was $1,011, at 10,000 registered users [E21]. (4) The PRO subscription launched with a numbers-based discount: Super Early Bird for the first 250, Early Bird for the next 250 [E21].
- **Outcome.** Two weeks after PRO launched: $1.6k MRR on $12.3k of sales from 284 subscribers, with 10 refund requests [E21]. In 2021: >$17K MRR, 150,000+ members, 60,000+ Slack members [E22]. In 2023: 500,000+ users and about $30k MRR [E23]. Today: 1,202,288 developers, 120+ challenges, plus Teams and Hiring products [E24]. Funding: bootstrapped. The team "turned down investment in favor of trying to build the company sustainably" [E22].
- **Leverage before asking.** The Slack community, created October 2018, had 3,000 members by 2020-01-31 [E21]. A bi-weekly newsletter reached 7k+ at the PRO launch [E21]. He had General Assembly students, a CSS-Tricks article by Chris Coyier, and a Product Hunt launch that placed 3rd [E22].
- **Necessity satisfied.** Realistic design-to-code practice that produces portfolio proof [E22]. Hiring by skills, not resumes [E24].
- **Timing.** Two years of community work came first, with "contract work ... paying the bills". He went full-time on 2020-12-09 [E21]. His own lesson: he should have run a presale with a time-based discount rather than a numbers-based one [E21].

### 5. BigFrontEnd.dev (BFE.dev)
- **Pitch.** "Practice + Prepare = Offer". The site calls itself "like LeetCode for Front-End", with "More than 600 Front-End questions" [E26]. For whom: frontend interview candidates. Why now: none stated. It offers "AI solutions from ChatGPT ... for free" [E26].
- **Ask.** "Get access to premium features & Support our work." $6/month, or $48/year ($4/month). The first premium perk listed is ad-free use. "As a small team, we don't offer refund" [E27].
- **Outcome.** "FRIENDS 50k+" on Discord [E26]. No revenue or funding was found on fetched pages.
- **Leverage.** Not documented on fetched pages (see Unverified).
- **Necessity satisfied.** Cheap, high-volume frontend drill practice.
- **Timing.** Free question bank first, then premium extras and ads [E26][E27].

### 6. Kent C. Dodds: TestingJavaScript, then Epic React, then Epic Web, then Epic AI
- **Pitch.** Epic React: a "hands-on, code-first ... cheat code" for professional React developers [E30]. Epic Web: "Full Stack Workshop Training for Professional Web Developers" [E31]. Epic AI (2026) why now: "The standard application architecture, focused on direct manipulation and predefined flows, is becoming insufficient" [E33].
- **Ask.** TestingJavaScript.com launched with a 40% Early Bird. The "last call" email went out on 2018-10-26 (prices not shown). PPP and team licenses were announced as in progress [E29]. Current products offer a 30-day money-back guarantee [E30][E33].
- **Outcome.** He went full-time as an educator on 2019-02-17 and planned "more sites like TestingJavaScript.com" [E28]. "Taught React to over 30,000 people" [E30]. "Join 40,000+ developers in the Epic Web community" [E31]. Revenue figures were not found on any fetched first-party page (see Unverified).
- **Leverage before asking.** egghead.io and Frontend Masters courses [E28]. Bio: "taught hundreds of thousands of people" [E28]. Blog: "214 blog posts ... read 965,813 times by 766,924 people" [E32]. A production partner: Badass Courses lists "Launching Epic React, with Kent C. Dodds" as a case study [E34].
- **Necessity satisfied.** Production-grade skills for employed professionals, and now AI and MCP application design [E33].
- **Timing.** Platform courses came first (egghead, Frontend Masters), then his own early-bird launch, then full-time 4 months later [E28][E29]. Epic AI shows "under construction" with "updates through August 2026" [E33].

### 7. Josh W. Comeau: CSS for JavaScript Developers, then The Joy of React
- **Pitch.** For "intermediate JavaScript framework developers (React, Vue, Angular)" [E35]. Problem: CSS is "the most frustrating part of their work" and an "implicit language" [E39].
- **Ask.** An "Early Access" preorder with a one-week window, 2021-03-10 to 2021-03-16. Price $129, against a planned full price of $349, with PPP and tiers planned [E35]. Target: "I had hoped to sell about 380 copies, for ~50k USD" [E35]. A $20-off coupon limited to 50 uses ran out in 90 seconds [E36].
- **Outcome.** The Paddle dashboard showed $577k revenue, 4,773 orders and a $120 average transaction [E35]. Other sources say the $50k target was hit in about 10 minutes and almost 5,000 copies sold [E36]. A podcast put first-week sales at "almost $600k" [E38]. By 2025, "a little over 15k people had purchased", at prices from $149 to $599 with regional discounts of up to 75% [E37]. Today the course page offers Basic/Pro/Ultimate tiers, a 30-day unconditional refund, team discounts of 10–20% for 4+ licenses, 200 lessons, 40 hours, and use by "hundreds of organizations" [E39].
- **Leverage before asking.** 31k Twitter followers and ~28k email subscribers at launch, up from ~10k and ~1k in January 2020 [E35]. Email breakdown: ~20k blog opt-ins, ~12k free-book downloads, ~11k course waitlist. The blog had ~60 posts and 60–90k unique visits per month. "Email has been the most significant lever". Twitter drove ~14% of sales [E36]. He had left a Staff Software Engineer role at Gatsby that paid $165k [E35].
- **Necessity satisfied.** Mental-model depth for developers who already ship code [E39].
- **Timing.** He started the course in August 2020 and presold at about 50% complete, 7–8 months in [E35]. Joy of React followed the same pattern: Early Access on Jan 23 (2023) with ~2/3 of the content, 150+ lessons and ~80 beta testers [E40].

### 8. roadmap.sh (Kamran Ahmed, GitHub user `nilbuild`)
- **Pitch.** "I created roadmap.sh to help developers find their path if they are confused". It "started as a set of visual charts on GitHub" [E43]. Pro tier today: "Learn faster with AI", an AI tutor and course generator [E45].
- **Ask.** (a) GitHub Sponsors: "A considerable amount of my time is spent doing unpaid community work". Goal: "100 monthly sponsors". Tiers from $5 to $1,000/month, with perks ranging from a badge up to joining the sponsor's company chat [E46]. (b) Advertising: "The best way to reach developers", contact form only, no prices [E44]. (c) Pro at $10/month, and Team at $10/seat/month billed annually with a 3-seat minimum [E45].
- **Outcome.** Sponsors: 7 current, 166 past, 7% of the goal [E46]. Audience: 370K stars, +3.2M registered users, 52K Discord, 150,000+ newsletter [E43]. Pro page claims: 160K+ roadmaps created, 150K+ courses generated, 1M+ AI conversations [E45].
- **Leverage before asking.** developer-roadmap has 369,690 stars and 45,097 forks, created 2017-03-15 [E42]. 41,283 followers, account since 2013 [E47]. Other repos: design-patterns-for-humans (48.9k stars) and driver.js (26.9k stars) [E47].
- **Necessity satisfied.** Direction: what to learn next, in what order [E43].
- **Timing.** Free charts came first, then the site, then ads, then the paid AI tier [E43][E44][E45]. **Lesson: about 370k stars produced only 7 current sponsors [E42][E46]. Stars become money through ads and subscriptions, not donations.**

### 9. Flavio Copes
- **Pitch.** Bootcamp: "Build seven guided projects, then choose, build, test, and ship your own product with AI by your side" [E50]. Cohorts for 2026–27: Internet Business Lab (Oct 28 – Nov 17), AI Workshop on directing coding agents (Dec 2–22), Ship Factory (Jan 5–25), and the Bootcamp (March 2027) [E51].
- **Ask.** Cohort enrolment with waitlists [E51]. A 10-week bootcamp at 1–2 hours a day with a 14-day full refund [E50]. A newsletter gate: "17 programming books and 87 courses in PDF and EPUB" for an email address [E49].
- **Outcome.** "Every project here was bootstrapped. No venture capital." He has published 2,100+ tutorials, 20+ books and 15+ courses, taught "tens of thousands of students", and the blog has had "tens of millions of visitors" [E48]. The library shows "Readers 150,000+" [E49].
- **Leverage before asking.** The SEO blog library [E48]. Demand testing before building: the Prototyped landing page drew 1,935 visits, 130 waitlist signups and 12 detailed replies in two weeks [E48]. GitHub: 2.4k followers and no sponsor button. A recent repo, skill-cabinet (66 stars), "finds the skills coding agents load" [E52].
- **Necessity satisfied.** Structured cohort accountability. One testimonial: "I took Flavio's bootcamp in 2021 while I was unemployed" [E50].
- **Timing.** Writing started in 2017, ebooks and courses followed, the bootcamp has run every year since 2020, and the AI-agent cohorts launched in 2026 [E48][E50][E51].

### 10. patterns.dev (Lydia Hallie, Addy Osmani)
- **Pitch.** "A free online resource on design, rendering, and performance patterns" [E56]. "Learning Patterns" is a 435-page free book [E54].
- **Ask.** None for money on the fetched pages. A newsletter: "Join 12,000+ developers getting practical guides, tutorials, weekly AI briefings, and workshop updates" [E55].
- **Outcome.** The book is distributed on Google Play, Apple Books, LeanPub, Archive.org and SpeakerDeck [E54]. Content is licensed CC BY-NC 4.0 [E53].
- **Leverage.** Addy Osmani is an engineering manager on Google Chrome (Lighthouse, PageSpeed Insights). Contributors include Josh W. Comeau [E53].
- **Necessity satisfied.** A vocabulary of patterns, "a catalog of patterns ... rather than a checklist" [E56]. This is the closest analogue to our "frontend terminologies" goal.
- **Timing.** The free book came first. The newsletter now mentions workshops and AI weekly briefings, which suggests a move toward paid workshops (inferred, not confirmed) [E55].

### 11. Kickstarter precedent: "You Don't Know JS" (Kyle Simpson)
- **Pitch.** "If you write JavaScript for your primary job ... how well do you *really know* the language?" On why Kickstarter: "to establish audience demand for these book topics before spending time writing them" [E57].
- **Ask.** A $10,000 goal over 33 days (2013-05-01 to 2013-06-04). The page says what the minimum buys ("For sure one book will launch, and likely at least #2") and what the stretch buys (book 3 and beyond). O'Reilly handled publishing [E57].
- **Outcome.** $16,400 pledged from 500 backers [E57].
- **Leverage.** Content already existed in his "Advanced JS" workshop, taught for 6+ months, plus blog posts. Five attendee quotes appeared as social proof [E57]. The same Advanced JavaScript course was later promoted by Frontend Masters [E13].
- **Timing.** He crowdfunded before writing, using material he had already taught live [E57].

### 12. Edtech funding signals for reskilling people displaced by AI (2025–2026)
- **RAISE US** (2026-06-25): over $500M committed for education and workforce training for Americans displaced by AI. Anchor partners: Amazon, Microsoft, Anthropic, the OpenAI Foundation and Bank of America. Pilots in AR, CT, MD and UT, tied to employer hiring. The article cites a BCG estimate of up to 25M US jobs eliminated over five years [E60].
- **North Carolina SB 988** ("Protecting Workers in the Age of AI Act"): a $50,000,000 AI Workforce Transition Fund for "workers displaced due to artificial intelligence or automation". Priority goes to health care, advanced manufacturing, infrastructure and skilled trades, *not software*. Referred to committee on 2026-05-04 [E61].
- **Multiverse** (2026-05-15): $70M at a $2.1B valuation, led by Schroders Capital. Revenue grew 50% year-over-year, and Jan–Mar 2026 was its first cash-positive quarter. Positioning: "AI adoption layer" [E62].
- **NextWork** (2026-03-04): $4.45M seed led by Shakti VC. 190,000+ learners in 190+ countries since its 2024 launch. US learners are typically 25–35 and often switching careers. Pitch: "AI is reshaping the workforce faster than people can adapt", and learning becomes "verifiable proof of work" [E63].
- **Imagi** (2026-07-23): $4.5M seed for K-12 AI and "vibe coding" through Lovable, with 700,000+ students in 140 countries [E64].
- **Supply-side collapse:** 2U shut its bootcamps in December 2024. SNHU (2023) cited "the broad adoption of AI tools". Epicodus closed in early 2024 and Momentum in August 2024 [E65]. US software developer listings fell "over 70 per cent" from Q1 2023 to Q1 2025, a figure attributed to unnamed analytics firms. A Stanford study found a 13% decline in entry-level coding listings over three years [E66].
- **Read:** No fetched source shows a funded program aimed specifically at *frontend* developers displaced by AI. Public money goes to trades [E61] and to broad workforce coalitions [E60]. Venture money goes to enterprise AI adoption [E62] and proof-of-work portfolios [E63]. Meanwhile incumbents are moving into the space themselves: Master.dev [E14], Scrimba [E20], Epic AI [E33], Flavio [E51], roadmap.sh [E45].

### Our baseline (same rules)
- grvpanchal/elegant: 1 star, 3 forks, created 2023-09-04 [E67]. npm `elegant`: 257 downloads from 2026-09-13 to 2026-10-12 [E67]. Repo contents: 45 Agent Skills (per README) and 49 files under `docs/practice/` [E67].

---

## Evidence

All fetched 2026-10-17. Method codes: **WF** = WebFetch. **CURL** = curl with a browser user agent. **RJ** = fetched through the `r.jina.ai` reader because the direct fetch returned 403 or a Cloudflare challenge. **API** = GitHub or npm JSON API.

| ID | URL | Method | What was read |
|---|---|---|---|
| E1 | https://www.greatfrontend.com/ | WF | "2M+ engineers helped", "Verifiable by Google Analytics"; per-company question counts; founder Yangshun Tay, ex-Meta Staff Engineer |
| E2 | https://www.greatfrontend.com/interviews/pricing | WF | Lifetime $180 (list $500), $39/mo, $85/quarter, $120/yr; student 40%; review cashback 100%; learning-budget reimbursement |
| E3 | https://www.greatfrontend.com/about | WF | "Preparing for Front End interviews is tough."; "interviewed hundreds of candidates"; © 2026 Codeney Pte Ltd |
| E4 | https://www.greatfrontend.com/team | WF | Team roster; no funding or investors mentioned |
| E5 | https://api.github.com/repos/yangshun/tech-interview-handbook | API | 143,047 stars; 16,858 forks; created 2016-07-05 |
| E6 | https://api.github.com/repos/yangshun/front-end-interview-handbook and https://github.com/yangshun/front-end-interview-handbook | API+WF | 44,005 stars; 5,929 forks; created 2018-01-13; README "By GreatFrontEnd", "try out GreatFrontEnd, a platform built by me!", 20% off lifetime |
| E7 | https://api.github.com/users/yangshun | API | 13,539 followers; bio "Building @greatfrontend. Ex-@facebook, @docusaurus, Flux. Authored Blind 75 and Grind 75" |
| E8 | https://github.com/sponsors/yangshun | WF | Tiers $2/$3/$5 per month; 2 current, 17 past sponsors |
| E9 | https://opencollective.com/tech-interview-handbook | WF | Raised $3,262.92; balance $1,161.91; 83 contributors; tiers $2–$100; est. annual budget $120 |
| E10 | https://api.github.com/orgs/greatfrontend and https://api.github.com/repos/greatfrontend/top-javascript-interview-questions | API | Org created 2022-08-06, 6,996 followers; repo 10,092 stars, created 2024-06-10 |
| E11 | https://marcgrabanski.com | WF | Founded 2014; "zero to 10,000+ paying customers"; 500k+ newsletter subscribers; "100% bootstrapped"; 60+ events |
| E12 | https://shoptalkshow.com/408/ | WF | 2020-04-13; "Building a real business. No VC."; "developers ... subscribing out of their own pocket"; "maybe a thousand teams"; usage up 50% per user |
| E13 | https://davidwalsh.name/frontend-masters | WF | 2015-08-04 sponsored intro; three yearly passes given away; free preview of Kyle Simpson's Advanced JavaScript |
| E14 | https://blog.master.dev/today-frontend-masters-becomes-master-dev/ | WF | 2026-06-15 rebrand; 300+ courses; 24 paths; 4 of the top 10 courses are AI courses; "agent harness engineering" and OpenAI Codex courses in progress |
| E15 | https://master.dev/ (frontendmasters.com returns 301 to here) | WF | "Master Full Stack. Build with AI."; "Thrive in the Age of AI"; teams save 37% at 10+ seats |
| E16 | https://www.freecodecamp.org/news/how-we-convinced-founder-angels-to-invest-in-our-developer-tool-startup-f2e3bc59cbcc | WF | 2017-03-07; $200K angel round; StartupLab FoundersFund and Nordic Makers; beta early Dec 2016; deal agreed by end of January |
| E17 | https://www.ycombinator.com/companies/scrimba | WF | YC S20; founded 2017; team 6; ~120K monthly active students; "1% of the price" one-liner |
| E18 | https://vend.com/news/schibsted-ventures-invests-in-upskilling-company-scrimba | WF | 2023-10-09; 4.5% secondary stake; >1M users; >10k paying; 13 staff; 2022 revenue NOK 18.7M; operating result NOK −0.3M |
| E19 | https://www.cbinsights.com/company/scrimba/financials | WF | $1.01M over 7 rounds; dated rounds; latest $0.1M on 2024-09-30 |
| E20 | https://scrimba.com/ | RJ | "Learn Agentic Coding" (35 lessons: MCP, skills, permissions); "Learn AI Agents" (32 lessons); MDN partnership; Fullstack path 96 modules, 108.4 hrs |
| E21 | https://www.indiehackers.com/product/frontend-mentor/10-000-registered-users-1-000-monthly-revenue--M1PGcabi9D3kwwCbk4w | RJ | Milestones 2020-01-31 to 2020-12-09: 3,000 then 10,000 Slack members; sponsors; $150 in first 24h; $1,011 in Feb 2020; $12.3k sales and $1.6k MRR from 284 subscribers; 7k+ newsletter; 250/250 early bird; 10 refunds |
| E22 | https://www.failory.com/interview/frontend-mentor | WF | 2021-07-13; >$17K MRR; 150,000+ members; 60,000+ Slack; Product Hunt 3rd; "turned down investment" |
| E23 | https://indiebites.com/86 | WF | 2023-04-30; "over 500,000 users"; "hovering around $30k MRR" |
| E24 | https://www.frontendmentor.io/ | WF | "Join 1,202,288 developers"; 120+ challenges; Teams and Hiring products |
| E25 | https://www.frontendmentor.io/pro | WF | PRO features; "Get an AI code review on every solution"; monthly plan 5 Figma files and 2 premium challenges; no prices shown |
| E26 | https://bigfrontend.dev/ | RJ | "like LeetCode for Front-End"; "More than 600 Front-End questions"; "FRIENDS 50k+"; free ChatGPT solutions |
| E27 | https://bigfrontend.dev/premium | RJ | $6/mo; $48/yr; "we don't offer refund"; Ad-Free is the first perk |
| E28 | https://kentcdodds.com/blog/full-time-educator | WF | 2019-02-17 full-time educator; plans "more sites like TestingJavaScript.com"; bio "taught hundreds of thousands of people" |
| E29 | https://buttondown.com/kentcdodds/archive/last-call-for-40-off-testingjavascriptcom/ | WF | 2018-10-26; 40% Early Bird last call; PPP and team licenses in progress |
| E30 | https://www.epicreact.dev/ | WF | "taught React to over 30,000 people"; 7 workshops; 30-day money-back guarantee |
| E31 | https://www.epicweb.dev/ | WF | "Join 40,000+ developers in the Epic Web community" |
| E32 | https://kentcdodds.com/ | WF | "214 blog posts ... read 965,813 times by 766,924 people"; product lineup includes Epic AI |
| E33 | https://www.epicai.pro/ | WF | Epic MCP, four workshops; "under construction"; "updates through August 2026"; why-now text |
| E34 | https://badass.dev/ | WF | Case studies: Launching Epic React (Kent C. Dodds), Total TypeScript, Testing Accessibility, Technical Interviews; no figures |
| E35 | https://www.indiehackers.com/post/launched-my-first-course-earned-over-us-500-000-ama-4382405cd5 | RJ | 2021-03-17; Paddle $577k, 4,773 orders, $120 average; window Mar 10–16; $129 (planned $349); 31k Twitter; ~28k email; target ~380 copies / ~$50k; Gatsby $165k |
| E36 | https://www.failory.com/interview/css-for-js-developers | WF | 2021-08-31; $50k in ~10 min; ~5,000 copies; coupon gone in 90s; 20k/12k/11k list breakdown; 60–90k visits/mo; Twitter 14% of sales |
| E37 | https://www.indiehustle.co/p/this-solo-founders-course-makes-550000 | WF | 2025-02-04; ~US$550k Early Access; "a little over 15k" buyers; $149–$599; regional up to 75% off |
| E38 | https://ecpodcast.transistor.fm/episodes/46-josh-comeau-how-to-have-an-amazing-course-launch | WF | 2021-06-02; "sold almost $600k in the first week" |
| E39 | https://css-for-js.dev/ | WF | Basic/Pro/Ultimate; PPP; 30-day unconditional refund; 10–20% team discount at 4+ licenses; 200 lessons / 40 hrs; 9 block-quote testimonials |
| E40 | https://www.joshwcomeau.com/email/jor-updates-006-launch-date | WF | Sent 2022-12-28; Early Access Jan 23; ~2/3 of content; 150+ lessons; ~80 testers |
| E41 | https://www.joshwcomeau.com/about-josh/ | WF | "32,007 developers" (unlabelled); npm packages ~600,000 downloads/month |
| E42 | https://api.github.com/repos/nilbuild/developer-roadmap (github.com/kamranahmedse/developer-roadmap returns 301 to here) | API | 369,690 stars; 45,097 forks; created 2017-03-15 |
| E43 | https://roadmap.sh/about | WF | 370K stars; +3.2M registered; 52K Discord; 150,000+ newsletter; "started as a set of visual charts on GitHub" |
| E44 | https://roadmap.sh/advertise | WF | "over 1 million registered users" in the body vs "+3.2M" in the sidebar; no prices; contact form |
| E45 | https://roadmap.sh/premium | WF | Pro $10/mo; Team $10/seat/mo, 3-seat minimum; 160K+ roadmaps; 150K+ courses; 1M+ AI chats; "Joined by 18K+ developers" |
| E46 | https://github.com/sponsors/nilbuild | WF | Goal 100 monthly sponsors, 7% reached; 7 current, 166 past; tiers $5–$1,000 |
| E47 | https://api.github.com/users/nilbuild and https://github.com/nilbuild | API+WF | Kamran Ahmed; 41,283 followers; account created 2013-07-02; design-patterns-for-humans 48.9k stars; driver.js 26.9k |
| E48 | https://flaviocopes.com/built/ | RJ | "bootstrapped. No venture capital."; 2,100+ tutorials; 20+ books; 15+ courses; Prototyped test: 1,935 visits / 130 signups / 12 replies |
| E49 | https://flaviocopes.com/access/ | RJ | 17 books; 87 courses; "Readers 150,000+"; one email a week on building software with AI |
| E50 | https://flaviocopes.com/bought-bootcamp-dev/ (resolves to the bootcamp page) | RJ | Runs yearly since 2020; 10 weeks; 7 guided projects; 14-day refund; next edition March 2027; "while I was unemployed" testimonial |
| E51 | https://flaviocopes.com/cohorts/ | RJ | Internet Business Lab, AI Workshop, Ship Factory, Bootcamp: 2026–27 dates |
| E52 | https://github.com/flaviocopes | WF | 2.4k followers; no sponsor button; skill-cabinet 66 stars |
| E53 | https://www.patterns.dev/about | CURL | Lydia Hallie, Addy Osmani (Google Chrome); CC BY-NC 4.0; Josh W. Comeau among contributors |
| E54 | https://www.patterns.dev/book | CURL | "Learning Patterns", 435 pages; 5 storefronts |
| E55 | https://www.patterns.dev/newsletter | CURL | "Join 12,000+ developers"; weekly AI briefings; workshop updates |
| E56 | https://www.patterns.dev/ | CURL | "free online resource"; "catalog of patterns ... rather than a checklist" |
| E57 | https://www.kickstarter.com/projects/getify/you-dont-know-js-book-series | RJ | $16,400 of $10,000 goal; 500 backers; 2013-05-01 to 2013-06-04 (33 days); minimum vs stretch scope; 5 attendee quotes |
| E58 | https://opencollective.com/theodinproject | WF | Raised $18,860.73; 710 contributors; recurring tiers $3/$5/$15/$50; est. annual budget $5,117.50 |
| E59 | https://www.patreon.com/kevinpowell | WF | Pitch: "My channel is free and will always be free"; "raise the quality of my videos"; tier and member counts did not render |
| E60 | https://letsdatascience.com/news/ai-disrupts-workplaces-new-nonprofit-hopes-to-aid-workers-a9150b05 | WF | 2026-06-25; RAISE US >$500M; anchor partners; 4 pilot states; BCG estimate of up to 25M jobs |
| E61 | https://www.ncleg.gov/Sessions/2025/Bills/Senate/HTML/S988v1.html | WF | SB 988; $50,000,000 fund; AI-displaced workers; trades priority; referred 2026-05-04 |
| E62 | https://pulse2.com/multiverse-70-million-raised-at-2-1-billion-valuation-to-expand-ai-upskilling-platform-across-europe/ | WF | 2026-05-15; $70M at $2.1B; Schroders lead; +50% YoY revenue; first cash-positive quarter |
| E63 | https://www.vcaonline.com/news/2026030403/nextwork-raises-4-45m-seed-round-to-accelerate-ai-skill-verification-for-the-workforce/ | WF | 2026-03-04; $4.45M seed; 190,000+ learners; ages 25–35, career switchers; "verifiable proof of work" |
| E64 | https://techcrunch.com/2026/07/23/edtech-platform-raises-4-5m-to-help-teach-students-how-to-vibe-code/ | WF | Imagi $4.5M seed; 700,000+ students; 140 countries |
| E65 | https://www.insidehighered.com/news/tech-innovation/teaching-learning/2025/01/09/changes-boot-camp-marks-signal-shifts-workforce | WF | 2025-01-09; 2U, SNHU, Epicodus and Momentum closures; AI cited |
| E66 | https://itbrief.co.uk/story/coding-jobs-squeezed-as-ai-reshapes-developer-roles | WF | 2026-01-19; US developer listings down >70% Q1 2023 to Q1 2025; Stanford 13% decline in entry-level listings |
| E67 | https://api.github.com/repos/grvpanchal/elegant ; https://api.npmjs.org/downloads/point/last-month/elegant ; local `ls docs/practice`, README.md | API+local | 1 star; 3 forks; created 2023-09-04; 257 downloads (2026-09-13 to 2026-10-12); 49 practice files; "ships 45 Agent Skills" |

---

## Pitch anatomy

The components that recur in the pitches that worked, with the strongest fetched example of each:

| Component | What the winners wrote | Source |
|---|---|---|
| **Problem, in the learner's words** | "Preparing for Front End interviews is tough." / CSS is "the most frustrating part of their work" / "how well do you *really know* the language?" | [E3] [E39] [E57] |
| **For whom (narrow)** | "intermediate JavaScript framework developers (React, Vue, Angular)"; "developers ... subscribing out of their own pocket" | [E35] [E12] |
| **Why now** | "technology ... faster than many have imagined" (Scrimba, 2023); "AI is reshaping the workforce faster than people can adapt" (NextWork, 2026); "Thrive in the Age of AI" (Master.dev, 2026) | [E18] [E63] [E15] |
| **Traction tied to a record** | A Paddle dashboard screenshot; "Verifiable by Google Analytics"; dated public milestones with revenue graphs | [E35] [E1] [E21] |
| **One-line positioning** | "hireable devs for 1% of the price"; "like LeetCode for Front-End" | [E17] [E26] |
| **The ask in units, not just dollars** | "about 380 copies, for ~50k USD"; "$10,000 goal"; "100 monthly sponsors" | [E35] [E57] [E46] |
| **Use of funds and scope ladder** | Minimum funds book 1 (likely 2); more funds bring book 3 sooner; server costs and content production; US HQ and hiring | [E57] [E46] [E63] |
| **Time box / scarcity** | Preorder open one week; 33-day campaign; early-bird "ends tonight"; 250/250 seat-based early birds | [E35] [E57] [E29] [E21] |
| **Risk reversal** | 30-day unconditional refund; 14-day full refund. Counterexample: BFE offers no refunds | [E39] [E50] [E27] |
| **Access for low-income learners** | PPP / regional pricing of up to 75% off; student 40% off; free core curriculum | [E37] [E2] [E24] |
| **Proof the content already exists** | "almost all the content ... already prepared ... in my 'Advanced JS' training workshop"; ~2/3 of the course available on day 1 | [E57] [E40] |
| **Social proof before launch** | 5 workshop-attendee quotes on the Kickstarter page; 9 block-quote testimonials on the course page | [E57] [E39] |

**Pattern across every case:** they gave value away first, then sold. Free repos [E5][E6][E42], a free blog or library [E36][E48][E49], free challenges [E24], a free book [E54], or live workshops [E57][E12] came first. The paid ask followed only after a measured audience existed. None of the ten frontend competitors led with venture money. Scrimba, the one VC-seeded case, raised its first $200K about two months after a public beta, on a warm intro [E16].

**Implication for an AI-run organisation (inference, not a fetched fact):** every case above had a human face behind it: Josh, Kent, Kamran, Yangshun, Matt, Flavio, Marc. An AI organisation cannot borrow that trust. It has to replace it with records anyone can check: commits, public API-checkable star and download counts, dated outcome logs, and refund guarantees. That is why the bar below is mostly about verifiability.

---

## Market necessities satisfied

| # | Necessity | Who satisfied it | Evidence |
|---|---|---|---|
| 1 | Pass a frontend interview when hiring is tight | GreatFrontEnd, BFE.dev, Tech Interview Handbook | [E1][E3][E26][E5] |
| 2 | Proof you can build: portfolio artifacts employers believe | Frontend Mentor (professional designs, Hiring product); NextWork (proof-of-work); Flavio (ship your own product) | [E22][E24][E63][E50] |
| 3 | Depth and mental models, not tutorials | Josh Comeau, Frontend Masters, YDKJS, patterns.dev | [E39][E11][E57][E56] |
| 4 | Direction: what to learn next | roadmap.sh | [E43] |
| 5 | Affordability for self-funded or unemployed learners | Scrimba ("1% of the price"), BFE ($4/mo), PPP/regional pricing, free tiers | [E17][E27][E37][E24] |
| 6 | Employer-funded paths | Team licenses (Master.dev 37%, css-for-js 4+ seats, roadmap.sh $10/seat); learning-budget reimbursement | [E15][E39][E45][E2] |
| 7 | Staying relevant as AI changes the job | Scrimba Agentic Coding (MCP, skills), Master.dev AI courses and harness course, Epic AI, Flavio AI Workshop, roadmap.sh AI tutor | [E20][E14][E33][E51][E45] |
| 8 | Community and accountability | Frontend Mentor Slack 60,000+, BFE 50k+, roadmap.sh 52K Discord, Flavio cohorts | [E22][E26][E43][E51] |
| 9 | Re-employment pipeline | Frontend Mentor Hiring; RAISE US ties reskilling to employer hiring | [E24][E60] |

**Unmet necessity (our opening):**
- Demand is real. Developer listings fell sharply [E66] and bootcamps closed [E65].
- Displacement money exists, but the fetched public programs target trades [E61] or broad workforce coalitions [E60], not frontend developers.
- Incumbents are only now adding AI-harness content: Scrimba's skills/MCP course [E20], Master.dev's in-progress harness course [E14], and Flavio's agent cohorts [E51].
- None of them combines the three things we plan to: (a) frontend terminology as a shared vocabulary (patterns.dev's job [E56]), (b) Agent Skills as shipped, testable artifacts (our 45 skills [E67]), and (c) an outcome log for displaced developers. **The window is open, but competitors are closing it in 2026.**

---

## The bar for our product

Every target below is measurable on the repository, so a script can pass or fail it. Paths are relative to the repo root `elegant/`. Each item names the competitors that set the standard and how to check it.

1. **The pitch file exists, with all seven sections.**
   - Target: `investors/pitch.md` has the H2s `Problem`, `For whom`, `Why now`, `Traction`, `Ask`, `Use of funds`, `Risks`, each with ≥40 words.
   - Set by: YDKJS (Story / Why Kickstarter / Risks and challenges) [E57]; Scrimba's angel pitch [E16]; Multiverse and NextWork use-of-funds statements [E62][E63].
   - Verify: `for h in Problem "For whom" "Why now" Traction Ask "Use of funds" Risks; do grep -q "^## $h$" investors/pitch.md || echo "FAIL $h"; done`, plus an awk word count per section.

2. **The problem statement is short, in the learner's words, and names its audience.**
   - Target: the first sentence under `## Problem` is ≤25 words. `## For whom` names a role ("frontend developer") and a qualifier (for example "displaced by AI" or "intermediate").
   - Set by: GreatFrontEnd [E3]; Josh Comeau [E35][E39]; Scrimba's YC one-liner [E17].
   - Verify: awk extracts the first sentence and counts words ≤25; `grep -iE 'frontend|front-end'` on the For-whom section.

3. **Every traction number cites a record.**
   - Target: 100% of lines in `## Traction` that contain a digit also contain a URL or repo path *and* an ISO date.
   - Set by: GreatFrontEnd "Verifiable by Google Analytics" [E1]; Josh's Paddle screenshot [E35]; Frontend Mentor's dated milestone graphs [E21].
   - Verify: `awk '/^## Traction/{f=1;next}/^## /{f=0}f&&/[0-9]/&&!(/https?:\/\/|\.\//&&/[0-9]{4}-[0-9]{2}-[0-9]{2}/){print "FAIL: "$0}' investors/pitch.md`

4. **Traction is checked against live APIs.**
   - Target: `investors/traction.json` holds `github_stars`, `npm_downloads_last_month` and `newsletter_subscribers`, each as `{value, source, date}`. The stars and npm values must be within ±5% of the live API. Baseline today: 1 star and 257 downloads/month [E67].
   - Set by: roadmap.sh publishing stars, users and Discord counts on its own pages [E43][E44].
   - Verify: a Node script fetches `https://api.github.com/repos/grvpanchal/elegant` and `https://api.npmjs.org/downloads/point/last-month/elegant` and compares the values.

5. **An audience floor is met before any paid ask.**
   - Target: `newsletter_subscribers.value ≥ 7000` before `investors/pitch.md` front-matter `status: live`.
   - Set by: Frontend Mentor had 7k+ subscribers at its PRO launch, which made $12.3k in two weeks [E21]. Josh had ~28k email and 31k Twitter for $577k [E35]. patterns.dev has 12,000+ [E55].
   - Verify: `jq -e '.newsletter_subscribers.value >= 7000' investors/traction.json` whenever `grep -q '^status: live' investors/pitch.md`.

6. **The ask is stated in money, in units, and in a time window.**
   - Target: `## Ask` contains one primary `$` amount, one `N <unit>` count (seats, backers, sponsors or copies), and two ISO dates no more than 35 days apart.
   - Set by: Josh's "~380 copies, for ~50k USD" over one week [E35]; YDKJS's $10,000 over 33 days [E57]; roadmap.sh's goal of "100 monthly sponsors" [E46].
   - Verify: grep for `\$[0-9][0-9,]*` (≥1), `[0-9]+ (seats|backers|sponsors|copies)` (≥1), and two dates; a script computes the day difference.

7. **Use of funds is itemised, sums to the ask, and separates minimum from stretch scope.**
   - Target: bullets with `$` amounts that sum to the ask within ±1%. The words `Minimum` and `Stretch` each appear.
   - Set by: YDKJS (minimum funds books 1–2, stretch funds book 3+) [E57]; roadmap.sh (server costs, content) [E46]; NextWork (HQ, hiring) [E63].
   - Verify: a script sums the `\$[0-9,]+` figures in the section and compares them with the Ask amount.

8. **"Why now" cites at least three dated outside signals from 2025–2026.**
   - Target: ≥3 URLs in `## Why now`, each with a date ≥ 2025-01-01.
   - Set by: Scrimba's why-now argument via Schibsted [E18]; Multiverse [E62]; NextWork [E63]. Candidate signals for us: [E60], [E65], [E66], [E14].
   - Verify: `awk` the section, then `grep -cE 'https?://.*20(2[5-9])-[0-9]{2}-[0-9]{2}|20(2[5-9])-[0-9]{2}-[0-9]{2}.*https?://'` must be ≥3.

9. **A sponsor channel is live, with priced tiers and a public goal.**
   - Target: `.github/FUNDING.yml` has ≥1 of `github:`, `open_collective:` or `patreon:`. `docs/sponsors.md` lists ≥3 tiers, each with a `$` amount and a concrete perk, plus a numeric goal (for example "N monthly sponsors").
   - Set by: roadmap.sh (7 tiers, $5–$1,000, 100-sponsor goal) [E46]; Yangshun (3 tiers) [E8]; Tech Interview Handbook on Open Collective (6 tiers) [E9]; The Odin Project (4 recurring tiers, $18,860.73 raised) [E58].
   - Calibration: a ~370k-star repo has 7 current sponsors [E42][E46], so sponsors are a signal, not a source of runway.
   - Verify: `test -f .github/FUNDING.yml && grep -qE '^(github|open_collective|patreon):' .github/FUNDING.yml`; `grep -cE '\$[0-9]+' docs/sponsors.md` ≥3; `grep -qiE 'goal.*[0-9]+' docs/sponsors.md`.

10. **A sponsor and advertiser prospectus with dated audience numbers, plus an outreach template.**
    - Target: a `## Audience` block in `docs/sponsors.md` with ≥3 metrics, each with a date and source. `investors/outreach.md` holds a cold-email template with placeholders.
    - Set by: roadmap.sh/advertise (stars, users, Discord) [E44]; Frontend Mentor's published sponsor email, which landed its first 3 sponsors at 3,000 Slack members [E21].
    - Verify: in that section, count lines matching both `[0-9]` and `[0-9]{4}-[0-9]{2}-[0-9]{2}` (≥3); `grep -q '\[' investors/outreach.md`.

11. **Pricing fits displaced learners.**
    - Target: `docs/pricing.md` states all of the following: (a) a free tier, (b) a regional or hardship discount ≥40%, (c) a team or employer license, (d) a refund window ≥14 days, (e) employer learning-budget reimbursement.
    - Set by: css-for-js (PPP, 30-day refund, teams of 4+) [E39]; Josh's regional pricing of up to 75% off [E37]; GreatFrontEnd (student 40% off, reimbursement) [E2]; Flavio (14-day refund) [E50]. Counterexample: BFE's no-refund policy [E27].
    - Verify: grep for `free`, `(PPP|regional|hardship)` with a `[4-9][0-9]%` figure, `(team|seat)`, `refund` with a `([1-9][4-9]|[2-9][0-9])-day` figure, and `(reimburs|learning budget)`.

12. **Early access is time-boxed, with a stated content-complete level and beta cohort.**
    - Target: `investors/launch.md` has `window_start` and `window_end` ≤14 days apart, `content_complete ≥ 50%`, `beta_testers ≥ 80`, and a pre-committed `go_threshold`.
    - Set by: Josh (one week, ~50% complete) [E35]; Joy of React (~2/3 of content, ~80 testers) [E40]. Frontend Mentor's own regret about having no presale [E21].
    - Verify: parse the YAML front-matter, compute the date difference, and compare the values.

13. **Demand is tested before a paid module is built.**
    - Target: `investors/traction.json.waitlist` records `{visits, signups, replies, date}`, with signups/visits ≥ 6.7% before building a paid module.
    - Set by: Flavio's Prototyped test: 130 / 1,935 = 6.7%, with 12 replies [E48].
    - Verify: `jq -e '.waitlist.signups / .waitlist.visits >= 0.067' investors/traction.json`.

14. **The open-source repo works as a funnel to the site.**
    - Target: the first 10 lines of `README.md` link to `https://elegantfrontend.training` with a call to action.
    - Set by: front-end-interview-handbook ("By GreatFrontEnd" and its CTA, 44,005 stars) [E6]; top-javascript-interview-questions (10,092 stars) [E10]; roadmap.sh "started as a set of visual charts on GitHub" [E43].
    - Verify: `head -10 README.md | grep -q 'elegantfrontend.training'`.

15. **The core stays free; deeper material sits behind an email.**
    - Target: ≥49 public practice pages, never fewer than today's 49 [E67]. A downloadable book (`npm run build-book`) is offered for a newsletter signup, and the page states counts of books and lessons.
    - Set by: Flavio (17 books and 87 courses for an email; 150,000+ readers) [E49]; patterns.dev's free 435-page book on 5 storefronts [E54]; Frontend Mentor's free challenges with PRO on top [E24].
    - Verify: `[ $(ls docs/practice | wc -l) -ge 49 ]`; `grep -qiE 'newsletter|subscribe' docs/book/index.md`; `grep -qE '[0-9]+ (lessons|skills|chapters)' docs/book/index.md`.

16. **Social proof exists before the ask.**
    - Target: `docs/testimonials.md` has ≥5 attributed quotes before the first ask and ≥9 at launch. Each quote has a name and a source link.
    - Set by: YDKJS showed 5 attendee quotes before writing anything [E57]; css-for-js shows 9 block quotes [E39].
    - Verify: `grep -c '^> ' docs/testimonials.md` ≥ 5 or 9; every quote block is followed by a line with `—` and `http`.

17. **Outcomes for displaced developers are logged with consent.**
    - Target: `investors/outcomes.json` has ≥10 entries `{date, outcome: offer|job|promotion, consent_url}` before any outcome claim appears in the pitch.
    - Set by: GreatFrontEnd's "3 offers" testimonial [E1]; Flavio's "while I was unemployed" testimonial [E50]; NextWork's career-switch portfolios [E63]; RAISE US's tie to employer hiring [E60].
    - Verify: `jq -e 'length >= 10 and all(.[]; .consent_url and .date and .outcome)' investors/outcomes.json`.

18. **A competition table shows the AI-harness gap.**
    - Target: `## Competition` in `investors/pitch.md` is a table with ≥6 competitor rows. Each row has a price, an "AI-harness coverage" column, and a cited URL.
    - Set by: the convergence evidence. Master.dev's harness course is in progress [E14]; Scrimba's Agentic Coding course covers MCP and skills [E20]; Epic AI teaches MCP [E33]; roadmap.sh has an AI tutor [E45].
    - Verify: count lines in the section matching `^\|.*\$.*https?://`; there must be ≥6.

---

## Channels

How the competitors got their money, ranked by how often the channel appears and what it produced:

| Channel | Who used it | Fetched result | Fit for us |
|---|---|---|---|
| **Presale / Early Access** | Josh (CSS, Joy of React); Kent (TestingJavaScript Early Bird) | $577k from 4,773 orders in one week [E35]; 40% Early Bird [E29] | **High.** Needs audience floor #5 first |
| **Subscription (B2C)** | Frontend Masters, Frontend Mentor PRO, GreatFrontEnd, BFE, roadmap.sh Pro, Scrimba Pro | 10,000+ paying [E11]; ~$30k MRR [E23]; $6/$48 [E27]; $10/mo [E45]; >10k paying [E18] | High once the content library is deep |
| **Team / employer licenses** | Master.dev, css-for-js, roadmap.sh Team, Frontend Mentor Teams | 37% team saving [E15]; 4+ seats [E39]; $10/seat [E45]; Teams product [E24] | Medium. Displaced devs have no employer, but reskilling partners might |
| **Kickstarter** | YDKJS | $16,400 of $10,000 from 500 backers in 33 days [E57] | **Medium-high.** Proves demand before writing, the closest analogue to a skills book |
| **GitHub Sponsors** | roadmap.sh (nilbuild), Yangshun | 7 current / 166 past [E46]; 2 / 17 [E8] | Low revenue; useful as a public signal (bar #9) |
| **Open Collective** | Tech Interview Handbook, The Odin Project | $3,262.92 from 83 contributors [E9]; $18,860.73 from 710 [E58] | Low revenue; transparent ledger fits an AI org |
| **Patreon** | Kevin Powell | Pitch only; counts not rendered [E59] | Low (no measured outcome found) |
| **Sponsorships / ads** | Frontend Mentor, roadmap.sh, BFE | First 3 sponsors at 3k Slack members [E21]; ads by contact form [E44]; ad-free as a paid perk [E27] | Medium after audience exists |
| **Angels via warm intro** | Scrimba | $200K, ~2 months after beta [E16] | Medium. Requires a public beta and warm intros |
| **Accelerator** | Scrimba (YC S20) | Listed [E17]; round dates in 2020 [E19] | Medium |
| **Strategic secondary** | Scrimba / Schibsted | 4.5% stake after NOK 18.7M revenue [E18] | Later stage only |
| **Cohorts** | Flavio | 4 programs, 3–10 weeks each [E51] | **High.** Accountability for unemployed learners [E50] |
| **Production partner** | Kent with Badass Courses / egghead | Case study listed [E34] | Optional |
| **Platform partnership** | Scrimba with MDN | "In partnership with MDN" [E20] | Medium. Borrowed credibility for an AI org |
| **Sponsored post + giveaway** | Frontend Masters on davidwalsh.name | 3 yearly passes given away [E13] | Low cost, worth trying |
| **Product Hunt / Show HN** | Frontend Mentor | Placed 3rd [E22] | Worth one launch day |
| **Philanthropy / public money** | RAISE US; NC SB 988 | >$500M [E60]; $50M (trades priority) [E61] | **Watch.** Apply as a training partner once outcomes are logged (bar #17) |
| **VC for AI workforce** | Multiverse, NextWork, Imagi | $70M [E62]; $4.45M [E63]; $4.5M [E64] | Possible only with proof-of-work outcomes (the NextWork pattern) |

---

## Unverified

These could not be confirmed from a page fetched today. **None of them are used in the bar.**

- **Epic React revenue.** "Generating millions in revenue" (2020) appears on yespress.io, which returned 403. No first-party revenue figure was found for Epic React, Epic Web or TestingJavaScript.
- **Kent's first egghead royalty.** "$2,000" appeared only in a search snippet; the page was not fetched.
- **Frontend Masters revenue and founding year.** The ~$7.87M/year revenue estimate and the 2008 founding year come from Prospeo, not fetched. These conflict with "Founded 2014" on marcgrabanski.com [E11].
- **"A Decade of Frontend Masters" article.** Referenced but not found or fetched.
- **The "$966,000" figure on the Master.dev blog post.** It sits in a sidebar with no label explaining what it measures [E14 page].
- **Scrimba round amounts.** Seedtable's $150k (Aug 2020) and $540k (Oct 2020) returned 403. The Company Check's "$400K over 3 rounds" was not fetched. CB Insights hides every amount except the $0.1M round [E19]. YC's own investment amount is not shown.
- **Scrimba's current pricing** ($49/month or $294/year) comes from a third-party directory, not fetched.
- **Scrimba's Coursera presence** was seen in search results only.
- **TinySeed as a Frontend Mentor investor.** A CB Insights snippet only, and it conflicts with "turned down investment" [E22].
- **Frontend Mentor's ~$26K MRR and $360K/year** figures from Starter Story were not fetched.
- **GreatFrontEnd's funding status, revenue and launch date.** The GitHub org creation date (2022-08-06) is only a proxy [E10]. No Product Hunt or launch post was found.
- **BigFrontEnd.dev's founder identity, launch date and revenue.** `/about` returns "couldn't find the page".
- **Josh Comeau's newsletter at launch.** "30–40k" is his later recollection [E37]. The contemporaneous figure is ~28k [E35], so the bar uses neither, only the 7k floor from [E21]. "32,007 developers" on his about page has no label [E41].
- **roadmap.sh registered users.** The advertise page states both "over 1 million" and "+3.2M" [E44]. Its "+90k every month" stars-growth label is ambiguous. The Pro page's "18K+ developers" conflicts with "3.2M" [E45].
- **Kevin Powell's Patreon member count and tiers** did not render [E59].
- **Other AI edtech rounds.** AcademyAI ($2.23M, Sep 2026), Guidde ($50M Series B), Gizmo ($22M) and Entire ($60M seed, a tooling company rather than edtech) appeared only in search snippets and were not fetched.
- **US Department of Labor "Rapid Reskill" dislocated-worker grants (~$50M).** Search snippet only; the PDFs were not fetched.
- **Job-market figures.** The "67% drop in entry-level tech postings 2023–2024" (attributed to Stanford Digital Economy Lab) came from a secondary blog, not fetched. The SCMP article on bootcamp decline returned 403. The IT Brief ">70%" figure [E66] is attributed to unnamed analytics firms, so treat it as directional.
- **patterns.dev monetisation.** Paid workshops are inferred from the newsletter's "workshop updates" text [E55] and are not confirmed.
- **Fetch failures** (no data taken from these): bigfrontend.dev and flaviocopes.com direct fetches (403/Cloudflare, so the RJ reader was used); seedtable.com (403); yespress.io (403); github.com/kamranahmedse (404, account moved to `nilbuild`); frontendmentor.io/about (404); master.dev/about (404); web.archive.org (blocked); the JavaScript Jabber episode 178 page (404); scmp.com (403).
