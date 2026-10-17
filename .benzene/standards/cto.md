# CTO: the technical standard the competition sets

Scope: the technical bar for elegantfrontend.training ("Best Frontend AI Harness Training site": lessons built on the UI / Server / State terminology of the Universal Frontend Architecture, plus AI-harness Agent Skills, for frontend developers who lost their jobs to AI, funded by paid tiers). Ten competitors measured; every value below comes from a page fetched on **2026-10-17**.

How the numbers were taken:
- **Page weight.** `wire` is the bytes sent with `Accept-Encoding: gzip` (brotli where the server forced it). `raw` is the decoded bytes. `JS` is the sum of every `<script src>` on that page, each fetched separately. `modulepreload` links and dynamic imports are **not** counted, so JS for SPA-style sites is a floor.
- **Accessibility markup.** These checks read the server HTML only, with no JavaScript run.
- **Tools.** Python `urllib`, `curl`, WebFetch, the GitHub API and the public JSON endpoints the sites call themselves. Pages behind Cloudflare challenges were read in headless Chrome. Each row says which.
- **Our repo was changing during the research.** Other offices added `docs/courses/`, `docs/dashboard/`, `docs/pricing/` and magic-link sign-in during the day. "Ours" rows are the repo as of **2026-10-17 16:53 local**. The live site (last deploy) still returns 404 for `/dashboard/`, `/pricing/` and `/changelog/`.

## Competitors

| Name | Behind it | Since | What it is | Source |
|---|---|---|---|---|
| GreatFrontEnd | Yangshun Tay ("Founder, CEO … Ex-Staff Engineer, Meta. Author of Blind 75 and Docusaurus 2"); Codeney Pte Ltd | Not stated on site. GitHub org created 2022-08-06; oldest question metadata 2021-09-05 | Front-end interview prep: 659 questions in 5 formats, a dashboard, study plans, 37 company guides, plus "Projects" (76 build challenges) | https://www.greatfrontend.com/ , https://www.greatfrontend.com/team , https://api.github.com/orgs/greatfrontend |
| Frontend Masters (now **Master.dev**) | Marc Grabanski, founder and CEO | 2014 per marcgrabanski.com (oldest catalog thumbnail 2013-12-20). Renamed Master.dev 2026-06-15 | Video courses, 25 learning paths, live workshops; frontendmasters.com 301-redirects to master.dev | https://master.dev/ , https://blog.master.dev/today-frontend-masters-becomes-master-dev/ , https://master.dev/teachers/marc-grabanski/ |
| BigFrontEnd.dev (BFE.dev) | jser合同会社 (JSer LLC), Shibuya, Tokyo | About mid-2020 (earliest question created 2020-07-19; inferred) | 639-question interview bank with a Monaco editor, quizzes, TypeScript puzzles, system design | https://bigfrontend.dev/ , https://bigfrontend.dev/static/html/sct.html |
| Frontend Mentor | Matt Studdert (founder), Mike Hayden (co-founder and CTO), London | "started in 2018" (footer "© Frontend Mentor 2019 - 2026") | 131 design-to-code challenges, automated axe-core / HTML reports, AI code review, learning paths | https://www.frontendmentor.io/articles/meet-the-frontend-mentor-team-iFNRGCrniB |
| Scrimba | Per Harald Borgen (co-founder, CEO), Sindre Aarsæther (CTO, creator of Imba) | Scrimba AS incorporated November 2016 | Interactive screencasts ("scrims") you pause and edit; 74 courses, 4 career paths | https://scrimba.com/articles/how-scrimba-came-to-be/ |
| Flavio Copes free courses | Flavio Copes | Bootcamp "Every year since 2020"; site changelog "starts on May 31, 2026" | 87 free text courses, "no signup", with localStorage progress and inline quizzes; paid cohorts | https://flaviocopes.com/courses/ , https://flaviocopes.com/changelog/ |
| Epic Web / Epic React / Epic AI | Kent C. Dodds | Epic React by Oct 2020 (BYU article 2020-10-26); Epic Web workshops Sep–Oct 2023 | Paid workshops whose exercises run in the local "epicshop" workshop app | https://www.epicweb.dev/ , https://www.epicreact.dev/ , https://kentcdodds.com/about , https://github.com/epicweb-dev/epicshop |
| Josh W. Comeau's courses | Josh W. Comeau (ex-Khan Academy) | Course platform "© 2020-present"; CSS for JS Devs selling by June 2021 | CSS for JS Devs, The Joy of React, Whimsical Animations, on a custom platform with "over 800 Sandpack instances" | https://css-for-js.dev/ , https://www.joyofreact.com/ , https://www.joshwcomeau.com/react/next-level-playground/ |
| patterns.dev | Lydia Hallie and Addy Osmani (co-creators) | Earliest Wayback capture 2021-05-31 | Free design, rendering and performance pattern book (53 patterns), AI field guide, 58 Agent Skills | https://www.patterns.dev/about , https://www.patterns.dev/ai/skills |
| roadmap.sh | Kamran Ahmed | GitHub repo created 2017-03-15 | 95 official roadmaps with progress tracking, AI Tutor, paid "Roadmap Pro" | https://roadmap.sh/about , https://github.com/kamranahmedse/developer-roadmap |

## Evidence

Every row was fetched 2026-10-17. "Ours" rows read the repo at `/home/gaurav/Documents/Projects/elegant-harness/elegant` at 16:53, or the live site where a URL is given.

| Competitor | Aspect | Value | How measured | Source URL | Fetched |
|---|---|---|---|---|---|
| Ours | Question bank | 47 questions: coding 13, quiz 12, ui-coding 10, system-design 6, harness 6. Easy 14 / medium 22 / hard 11. Layers: ui 21, state 14, server 12 | Parsed `docs/_data/questions.yml` | docs/_data/questions.yml | 2026-10-17 |
| Ours | In-browser runner | 13 of 13 coding questions include `code-playground.html`: a textarea with highlight overlay, `tests.js` run in the browser and under Node, a console pane, Ctrl/Cmd+Enter. **0 of 10** ui-coding questions have a runner (starter folders only: react 9, vue 7, angular 3, wc 1). One component question runs on vendored Preact | grep over `docs/practice/*.md` and `docs/practice/workspace/` | docs/practice/ | 2026-10-17 |
| Ours | UI framework coverage | Every ui-coding question ships 2 frameworks. 0 of 10 ship all four harness families (react, vue, angular, wc). 0 TypeScript starters | Front matter `frameworks:` plus folder check | docs/practice/workspace/ | 2026-10-17 |
| Ours | Page weight, question page | HTML 3,843 B wire / 14,166 B raw. 8 `<script src>`: first-party 7 files, 19,568 B wire / 56,724 B raw; third-party GTM 194,985 B wire (91% of JS bytes) | Python urllib, each script fetched | https://elegantfrontend.training/practice/action-creators.html | 2026-10-17 |
| Ours | Page weight, home and bank | Home HTML 7,453 B wire / 34,669 B raw. /practice/ 9,408 B / 54,176 B ("47 questions") | Python urllib | https://elegantfrontend.training/ , https://elegantfrontend.training/practice/ | 2026-10-17 |
| Ours | First-party JS in repo (question layout) | 27,419 B at gzip -9 across `account*.js`, `main.js`, `playground.js`, `progress*.js` and `runtime-preact.mjs` | Python gzip of the files referenced by `_layouts/question.html` and `_includes/identity-scripts.html` | docs/assets/js/ | 2026-10-17 |
| Ours | Dashboard | Live `/dashboard/` returns 404. The repo `docs/dashboard/index.html` (added today) has stats (questions solved, lessons, terms, day streak), a heatmap, bars by layer / format / difficulty, recommend-next with a reason, continue, plans and courses. **No topic bars, no company-guide progress** | curl; grep for `data-dash-*` | https://elegantfrontend.training/dashboard/ ; docs/dashboard/index.html | 2026-10-17 |
| Ours | Free courses | 4 courses (ui-layer, server-layer, state-layer, agent-skills) × 3 modules × 7 lessons = **28 lessons**. Course page: "N modules · M lessons · about X min of reading · no signup", progress, Start course. Lesson: "Mark lesson complete", Previous / Next, reading time at 200 wpm. 28 of 28 lessons link a bank question; **0 of 28 have an inline quiz**. Lessons cover 23 of 45 terms | Parsed `docs/_data/courses.yml` and `docs/courses/*/*.md`; read `_layouts/course.html` and `lesson.html` | docs/courses/ | 2026-10-17 |
| Ours | Concept docs | 45 term docs (ui 17, server 19, state 9), median 1,299 words. `layout: doc` has no completion toggle and no reading time | Word count, code fences stripped | docs/ui, docs/server, docs/state | 2026-10-17 |
| Ours | Study plans | 4 plans: one-week 345 min / 23 steps, ui-foundations 330, state-essentials 315, interview-sprint 210. No one-month or three-month plan. Printable certificate with no unique ID or verify URL | Parsed `docs/_data/plans.yml`; grep of `certificate.js` | docs/_data/plans.yml | 2026-10-17 |
| Ours | Company guides | 4 (Amazon, Google, Meta, Stripe), each with the "commonly reported" provenance note and 13–17 /practice/ links | ls plus grep | docs/guides/ | 2026-10-17 |
| Ours | Sign-in | Device profile; Supabase email + password; **magic link** (`POST /otp`, added today); generic OIDC. Code comment: "Only the email provider is enabled on the project". **No GitHub, no Google** | grep of `account-supabase.js` and `account/index.md` | docs/assets/js/account-supabase.js | 2026-10-17 |
| Ours | Paid tiers | Live `/pricing/` returns 404. Repo: Free / Pro (per year) / Lifetime. All `price_usd: 0` ("Price to be set"), PayPal sandbox only. Each paid tier has one feature, `planned: true`. No monthly tier, no regional or student pricing, 0 of 47 questions carry an `access` field | Parsed `docs/_data/pricing.yml`; curl | docs/_data/pricing.yml ; https://elegantfrontend.training/pricing/ | 2026-10-17 |
| Ours | Accessibility | Skip link, `<main>` and `lang` on every base layout (course, lesson and list inherit default). No accessibility statement. No axe or pa11y step in `.github/workflows/` | grep | docs/_layouts/ , .github/workflows/ | 2026-10-17 |
| Ours | Changelog, AI readability | `/changelog/` 404, `/feed.xml` 404, `/llms.txt` 404. `robots.txt` 200 with 0 AI-crawler lines. `sitemap.xml` 258 URLs | curl | https://elegantfrontend.training/sitemap.xml | 2026-10-17 |
| Ours | Agent Skills | 45 SKILL.md, **45 of 45 pass** the agentskills.io frontmatter rules (longest 218 lines). 29 of 45 skills are exercised by at least one question. skills.sh lists "13 skills 15 total installs" | Python validator; WebFetch / curl | skills/ ; https://www.skills.sh/grvpanchal/elegant | 2026-10-17 |
| Ours | Cadence | 289 git commits in bursts (e.g. 41 on 2026-09-20, 45 on 2026-10-11). Blog: 101 posts from 2026-06-14 to 2026-09-22 (17 / 31 / 31 / 22 a month). npm `elegant` 0.0.3, last published 2025-04-14. GitHub repo: 1 star | git log; front matter; npm registry; GitHub API | https://registry.npmjs.org/elegant , https://api.github.com/repos/grvpanchal/elegant | 2026-10-17 |
| GreatFrontEnd | Dashboard access | Logged out, `/interviews/dashboard` returns 307 to `/interviews/get-started` ("Create a free account to track your progress"). Title fetched: "Get Started - One-stop to prepare for your Front End Interviews" | curl -I; Python urllib | https://www.greatfrontend.com/interviews/dashboard | 2026-10-17 |
| GreatFrontEnd | Dashboard features | Roadmap entry 2024-12-14: "Redesigned dashboard with completion heatmap and statistics". Shipped strings include "current streak", "'Max streak' is the number of continuous active days", "Solved by question type", "easy-level / medium-level problems" | Public roadmap data endpoint; strings in page HTML | https://www.greatfrontend.com/interviews/roadmap | 2026-10-17 |
| GreatFrontEnd | Progress by format and framework | UI Coding 0/59, JavaScript Functions 0/205, System Design 0/20, Quiz 0/283, DSA 0/92, Behavioral 0/10. React 92, Angular 59, Vue 59, Svelte 59, CSS 75, HTML 101, TypeScript 297 | curl plus text extraction (I re-confirmed "JavaScript Functions 0 /205") | https://www.greatfrontend.com/interviews/get-started | 2026-10-17 |
| GreatFrontEnd | Study plans | 1 Week: 51 questions, "2 hours daily". 1 Month: 107, "6 hours weekly". 3 Months: 280, "3 hours weekly" (copy also says "over 140"). Each badged "Certificate" | curl (I re-confirmed "1 Week Certificate … 51 questi[ons]") | https://www.greatfrontend.com/interviews/get-started | 2026-10-17 |
| GreatFrontEnd | Recommended next | 1. Front End Interview Playbook, 2. GFE 75 ("22 hours total"; 73 items in the HTML), 3. Blind 75, 4. Front End System Design Playbook | curl | https://www.greatfrontend.com/interviews/gfe75 | 2026-10-17 |
| GreatFrontEnd | Company guides and focus areas | 37 company guides (e.g. Amazon 65, Google 37, OpenAI 29, Meta 29, Anthropic 18, Stripe 14). 10 focus areas (Accessibility 20, Async Operations 38, React Hooks 28, State Management 35 …). On a question page, "which companies ask this" is Premium | curl | https://www.greatfrontend.com/interviews/get-started | 2026-10-17 |
| GreatFrontEnd | Formats and counts | UI 59 (25 h), JS functions 205 (72 h), algorithmic 92 (48 h), quiz 283 (24 h), system design 20 (12 h): 659 total; marketing says "500+" | Format page headers plus embedded data | https://www.greatfrontend.com/questions | 2026-10-17 |
| GreatFrontEnd | Workspace | Monaco ("the same code editor used in … VS Code") plus Sandpack (`<iframe title="Sandpack Tests">`). Separate Run and Submit; run tests editable, submission tests locked; console; Vim mode (2026-02-21). "Running automated test cases and submission is not supported on mobile devices." | curl, grep of HTML and strings | https://www.greatfrontend.com/questions/javascript/debounce | 2026-10-17 |
| GreatFrontEnd | UI frameworks | All 59 UI questions in 5 variants: React, Vanilla, Angular, Vue, Svelte. 273 JS / algo questions tagged js and ts | Embedded question data | https://www.greatfrontend.com/questions | 2026-10-17 |
| GreatFrontEnd | Free versus paid content | Access levels: `free` (question + solution), `standard` (attempt free, solution Premium), `premium` (prompt locked). 311 with free solutions, 441 attemptable free. All 283 quiz free; 2 of 20 system design free | Parsed `access` field | https://www.greatfrontend.com/questions | 2026-10-17 |
| GreatFrontEnd | Shows itself | "Get started now — No signup required" plus an embedded question demo; progress saved locally until sign-in | curl | https://www.greatfrontend.com/ | 2026-10-17 |
| GreatFrontEnd | Sign-in | "Continue with Google", "Continue with GitHub", "Continue with Email" (Supabase `signInWithOAuth` google/github; email + password) | curl (I re-confirmed the three button strings); JS bundle read | https://www.greatfrontend.com/login | 2026-10-17 |
| GreatFrontEnd | Pricing | Monthly $39; Quarterly $85 ($29/mo); Annual $120 ($10/mo); Lifetime $180 (was $500). Purchasing-power-parity (PPP) pricing; student 40% off annual | Rendered markup (I re-confirmed $180 / $39 / $29 / $10) | https://www.greatfrontend.com/interviews/pricing | 2026-10-17 |
| GreatFrontEnd | Accessibility | No statement (`/accessibility` 404). SSR HTML of /questions has no skip link and no `<main>`; `lang="en"` set | curl; strict skip-link regex | https://www.greatfrontend.com/questions | 2026-10-17 |
| GreatFrontEnd | Stack | Next.js 15.5.18 App Router, React 19.2 canary, Vercel, tRPC, Supabase auth, Sentry. Locales en-US, pt-BR, zh-CN. `/llms.txt` 404 | curl headers, HTML, JS | https://www.greatfrontend.com/interviews/roadmap | 2026-10-17 |
| GreatFrontEnd | Release cadence | No `/changelog` (404). The public roadmap lists 74 shipped items (2023: 8, 2024: 20, 2025: 6, **2026: 40**), latest 2026-10-11. Upcoming JS batches every 2 weeks to 2027-04-25. Blog: 142 articles, latest Oct 14–16, 2026 | Roadmap data endpoint; curl of blog | https://www.greatfrontend.com/interviews/roadmap , https://www.greatfrontend.com/blog | 2026-10-17 |
| GreatFrontEnd | AI-era content | No AI feature in the product. Review-cashback rule: "Article must not be written with the assistance of AI." Blog 2026-08-24: Meta "rolled out an AI-assisted coding round starting October 2025"; "Google is piloting an AI-assisted coding round" | String search; WebFetch | https://www.greatfrontend.com/blog/frontend-interview-process-at-google-amazon-and-meta-what-to-expect | 2026-10-17 |
| GreatFrontEnd | Page weight | Question page: HTML 171,833 B wire / 1,063,841 B raw; **92** `<script src>`; JS 1,327,237 B wire / 4,233,218 B raw. Get-started (dashboard) page: HTML 477,732 / 4,035,398; 64 scripts; JS 1,085,181 B wire | Python urllib, each script fetched | https://www.greatfrontend.com/questions/javascript/debounce , https://www.greatfrontend.com/interviews/dashboard | 2026-10-17 |
| GreatFrontEnd | Projects | 76 challenges (4 free / 48 standard / 24 premium); $15/mo or $108/yr | curl | https://www.greatfrontend.com/projects/pricing | 2026-10-17 |
| Master.dev (Frontend Masters) | Dashboard | Advertises a "Personalized Dashboard", learning paths "with … progress tracking", completion certificates, a leaderboard by "Active Days". `/dashboard/` returns 302 to login. No streaks found | curl plus WebFetch of marketing pages | https://master.dev/join/ , https://master.dev/leaderboard/ | 2026-10-17 |
| Master.dev | Formats, editor | Video courses; "quizzes and flashcards after every lesson"; live workshops. No in-browser code editor found | curl, grep | https://master.dev/courses/claude-code/ | 2026-10-17 |
| Master.dev | Catalog | 231 dated courses counted ("300+" claimed); 25 learning paths counted ("24" claimed). Coding with AI path "21 hours, 33 minutes"; AI Engineering "28 hours, 56 minutes" | Parsed the date-sorted course list | https://master.dev/courses/?dg=1&c=courses&so=date , https://master.dev/learn/ | 2026-10-17 |
| Master.dev | Sign-in | "Log in with GitHub" plus username / email + password; no Google; SSO on Enterprise | curl of login form | https://master.dev/login/ | 2026-10-17 |
| Master.dev | Pricing, free tier | $39/mo or $390/yr; Team $24.50/seat/mo (10+ seats); "Free trials are not available". Free account: 5 full courses plus a free bootcamp ("21 hours, 6 minutes"); Claude Code course free | WebFetch plus curl | https://master.dev/join/ , https://master.dev/free/ | 2026-10-17 |
| Master.dev | AI-era content | Courses: Claude Code (Lydia Hallie, 2026-05-20, free); Harness Engineering & Agent Orchestration (2026-07-01); Agentic Frontend Development with Codex (2026-08-26); Complete Intro to MCP (2025-09-05); Practical Prompt Engineering (2025-10-24) | Course pages and list | https://master.dev/learn/ai/ | 2026-10-17 |
| Master.dev | Cadence | 10 courses released 2026-07-17 → 10-17; 28 so far in 2026 | Dates in thumbnail paths | https://master.dev/courses/?dg=1&c=courses&so=date | 2026-10-17 |
| Master.dev | Accessibility | No statement (`/accessibility/` 404); transcripts in player; 6 a11y courses (newest 2025-03-21). /courses/ HTML has no `lang` attribute; 77 of 1,337 `<img>` lack `alt` | curl; my markup check | https://master.dev/courses/ | 2026-10-17 |
| Master.dev | Page weight, stack | /courses/: HTML 109,752 B wire / 1,044,919 B raw; 1 `<script src>` (GTM, 198,880 B wire). nginx, custom server rendering; blog on WordPress | Python urllib; headers | https://frontendmasters.com/courses/ → https://master.dev/courses/ | 2026-10-17 |
| BFE.dev | Profile / dashboard | Public profile shows a progress % for 8 categories (JS Coding, React Coding, JS Quiz, React Quiz, TS Puzzle, CSS Coding, Interview Question, System Design). No streak, heatmap, ranking or badges | Headless Chrome (curl / WebFetch got the Cloudflare challenge) | https://bigfrontend.dev/user/eiQV4lc | 2026-10-17 |
| BFE.dev | Counts | 639 total: /problem 179, /react 16, /quiz 135, /react-quiz 30, /typescript 62, /css 24, /question 173, /design 20 | Chrome, parsed `__NEXT_DATA__` | https://bigfrontend.dev/problem | 2026-10-17 |
| BFE.dev | Lists, companies | 13 curated lists; no study plans (`/learn` shows "TODO"); 25 companies tagged | Chrome | https://bigfrontend.dev/list , https://bigfrontend.dev/company | 2026-10-17 |
| BFE.dev | Workspace | Self-hosted Monaco; JS or TS starter; React problems in a sandboxed iframe with console. Logged out, "submit" and "just run above code" both open "Sign in / up with github" | Chrome, buttons clicked | https://bigfrontend.dev/problem/implement-curry | 2026-10-17 |
| BFE.dev | Sign-in, pricing | GitHub only (OAuth `scope=user:email`). "$6 USD /mo"; yearly "$48 USD billed yearly" | Chrome | https://bigfrontend.dev/premium | 2026-10-17 |
| BFE.dev | AI, cadence | "AI solutions from ChatGPT … for all questions"; each says "correctness is not guaranteed". Questions added: 2020 354, 2021 116, 2022 127, 2023 24, 2024 15, 2025 3, **2026 0**. No changelog | Chrome plus question timestamps | https://bigfrontend.dev/problem/implement-curry/aisolution | 2026-10-17 |
| BFE.dev | Page weight, a11y | Problem page: HTML 15,657 B wire / 70,793 B raw; 21 scripts; JS 291,035 B wire (first-party 263,819). Home: 8 of 8 `<img>` lack `alt`; no skip link | Python urllib (got 200, no challenge) | https://bigfrontend.dev/problem/implement-basic-debounce , https://bigfrontend.dev/ | 2026-10-17 |
| Frontend Mentor | Dashboard (their guide) | My Challenges stats: "Total challenges completed, Challenges by difficulty level, Most recent submissions, Completion streaks"; learning path progress and recommendations | curl of guide | https://www.frontendmentor.io/guides/your-dashboard-explained | 2026-10-17 |
| Frontend Mentor | Challenges | "Showing 131 of 131 challenges" (free 69 / premium 61); 5 levels (newbie 23, junior 42, intermediate 37, advanced 18, guru 8); "a new challenge every two weeks" | Chrome, cards parsed | https://www.frontendmentor.io/challenges | 2026-10-17 |
| Frontend Mentor | Automated quality reports | Every submission: "Accessibility, using axe-core", "HTML, using html-validate", stylelint, eslint. AI code review on 7 dimensions with an overall score out of 10; free 1 a month, Pro every submission | curl of guides | https://www.frontendmentor.io/guides/solution-reports-overview | 2026-10-17 |
| Frontend Mentor | Workspace | No in-browser editor; build locally, submit repo plus live URL; screenshots from headless Chromium | Chrome plus FAQ | https://www.frontendmentor.io/faqs | 2026-10-17 |
| Frontend Mentor | Sign-in, pricing | "It's just GitHub at the moment." $15/mo; $120/yr; regional discounts | Chrome | https://www.frontendmentor.io/pro | 2026-10-17 |
| Frontend Mentor | AI-era content | AI code review launched 2026-04-29; Product Challenges (2026-03-25) ship "AI context files" for Claude Code, Cursor and Copilot | curl / WebFetch | https://www.frontendmentor.io/articles/product-challenges | 2026-10-17 |
| Frontend Mentor | Page weight, a11y | /challenges: HTML 27,029 B wire / 123,602 B raw; 25 scripts; JS 422,251 B wire. Skip link "Skip to content" and `<main>` present; no accessibility statement (404) | Python urllib; markup check | https://www.frontendmentor.io/challenges | 2026-10-17 |
| Scrimba | Progress | "Discover 74 / Started 0 / Completed 0"; module counters; certificate step. The word "streak" is absent from the main app script | Chrome plus curl of `app.CW7EZPVZ.js` | https://scrimba.com/ | 2026-10-17 |
| Scrimba | Paths | Frontend path: 70 modules, 81.6 h, 13 sections, 947 lessons, "In partnership with MDN". AI Engineer path 13.4 h | Chrome | https://scrimba.com/frontend-path-c0j , https://scrimba.com/paths | 2026-10-17 |
| Scrimba | Workspace | Scrims: "stop a lesson at any point and directly edit the code". Monaco; code runs in an iframe; IDE boots a WebContainer with esbuild / Babel workers | Chrome DOM plus IDE chunk | https://scrimba.com/learn-javascript-c0v/~017 | 2026-10-17 |
| Scrimba | Sign-in, pricing | GitHub, Google, Email (magic link: "passwordless login"). Pro base $49/mo; Freemium "Up to 10 challenges"; PPP | Chrome | https://scrimba.com/our-pricing | 2026-10-17 |
| Scrimba | Accessibility | Published statement: "has not yet started formal accessibility testing for v2 … aiming to conform to WCAG 2.1 AA" | Chrome | https://scrimba.com/accessibility-statement | 2026-10-17 |
| Scrimba | AI-era content, cadence | Learn Agentic Coding (free, 2026-10-08, 35 lessons); Intro to MCP; Learn Context Engineering; "Scrimba Explain" AI explainers. Community digest posted 8 times 2026-09-30 → 10-17 | curl plus Chrome | https://scrimba.com/t/t0ai , https://community-digest.scrimba.com/ | 2026-10-17 |
| Scrimba | Page weight | Home HTML 3,223 B wire / 8,244 B raw (SPA shell); 1 module script of 2,662,688 B raw / 538,989 B brotli | Python urllib; curl `-H 'Accept-Encoding: gzip, br'` | https://scrimba.com/ | 2026-10-17 |
| Flavio Copes | Course index | "87 free programming courses by Flavio Copes, no signup"; 10 groups, AI group of 6 (AI Fundamentals, Local AI Models, AI Agent Skills, Build a Language Model on Your Mac, MCP, Build with MCP) | Python urllib, live (200) | https://flaviocopes.com/courses/ | 2026-10-17 |
| Flavio Copes | Course structure | JavaScript "9 modules · 65 lessons · No signup"; Git "5 modules · 42 lessons"; HTML "8 modules · 52 lessons"; AI Fundamentals "6 modules · 31 lessons"; AI Agent Skills "5 modules · 25 lessons"; MCP "2 modules · 12 lessons" | Python urllib, live | https://flaviocopes.com/courses/javascript/ , https://flaviocopes.com/courses/ai-agent-skills/ | 2026-10-17 |
| Flavio Copes | Course page and lesson | Course page: "Your progress", "lessons completed", "Start course" / "Continue course", "Reset progress"; JSON-LD `isAccessibleForFree`, `"price":0`. Lesson: "Mark lesson complete", "Next lesson" only (no Previous), "Check your understanding" quiz; no reading time; no in-browser code | Python urllib, live; 2 lessons checked | https://flaviocopes.com/courses/javascript/arrow-functions/ | 2026-10-17 |
| Flavio Copes | Progress model | "Free courses save progress and preferences in your browser" (localStorage). Changelog: "I added quizzes, saved progress, review questions, streaks, achievements, and certificates"; "All 87 free courses rewritten … about 2,000 [lessons]" | Python urllib, live | https://flaviocopes.com/privacy/ , https://flaviocopes.com/changelog/ | 2026-10-17 |
| Flavio Copes | AI readability | `/llms.txt` 200, 16,103 B ("Every blog post is also available as clean Markdown: append `.md`"); `robots.txt` names GPTBot, OAI-SearchBot, ClaudeBot, anthropic-ai with `Allow: /`. RSS: 30 items 2026-10-05 → 10-17 | curl | https://flaviocopes.com/llms.txt , https://flaviocopes.com/robots.txt , https://flaviocopes.com/rss.xml | 2026-10-17 |
| Flavio Copes | Paid, sign-in | No prices published for cohorts (waiting lists). AI Workshop at aiworkshop.sh uses a **magic link** ("no password needed … expires in 30 minutes"); "494 members" | curl | https://aiworkshop.sh/login | 2026-10-17 |
| Flavio Copes | Page weight, stack | /courses/: HTML 8,765 B wire / 53,319 B raw; 4 scripts (first-party 6,853 B wire). Lesson: HTML 12,600 / 72,263; 5 scripts. Skip link "Skip to content" plus `<main>`. Astro, Alpine.js, Pagefind, Plausible | Python urllib; markup check | https://flaviocopes.com/courses/ | 2026-10-17 |
| Epic Web / React | Progress | Product pages list "Progress Tracking" and "Completion Certificate". Page data carries `percentCompleted`, `nextResource`, `completedLessonsCount` | curl of page data | https://www.epicai.pro/workshops/epic-mcp-from-scratch-to-production | 2026-10-17 |
| Epic Web / React | Workspace (epicshop) | Local React Router v7 app: problem / solution folders, Diff tab, Test tab, "Set to Playground", an MCP server (`@epic-web/workshop-mcp`). v6.90.35 on 2026-10-13; 183 npm versions since 2025-07-03; 247 stars. Browser use is a read-only StackBlitz preview | GitHub API, raw docs, npm registry | https://github.com/epicweb-dev/epicshop , https://registry.npmjs.org/epicshop | 2026-10-17 |
| Epic Web / React | Exercises | Full Stack Vol 1 "166" exercises; Epic React "243"; Epic MCP "142 videos, 47 exercises" | curl | https://www.epicweb.dev/buy | 2026-10-17 |
| Epic Web / React | Sign-in, pricing | Email magic link ("Email me a login link"), GitHub, Discord; no password, no Google. Full Stack Vol 1 $1,200; Epic React Pro $695; Epic MCP $500 (one-time) | curl of login data; pricing endpoint | https://www.epicweb.dev/login | 2026-10-17 |
| Epic Web / React | Page weight, stack | epicweb.dev home: HTML 13,006 B wire / 57,003 B raw; 15 scripts; JS 1,416,999 B wire / 4,368,404 B raw. epicreact.dev home: HTML 199,329 / 785,643; 27 scripts; JS 1,678,465 B wire. Next.js on Vercel; no skip link or `<main>` on epicweb home | Python urllib; markup check | https://www.epicweb.dev/ , https://www.epicreact.dev/ | 2026-10-17 |
| Josh W. Comeau | Workspace | Sandpack: "over 800 Sandpack instances across my two courses", with autosave to localStorage, ESLint, fullscreen | curl of post | https://www.joshwcomeau.com/react/next-level-playground/ | 2026-10-17 |
| Josh W. Comeau | Structure, certificate | CSS for JS: 10 modules, "200 Lessons", "40 Hours". Certificate is "a .pdf with their name", "each one has a unique URL" | curl | https://css-for-js.dev/ | 2026-10-17 |
| Josh W. Comeau | Sign-in, pricing | "Login with Github" plus emailed magic link. CSS for JS $149 / $279 / $399; Joy of React $249 / $399 / $599; purchase counters 21,837 / 15,279 / 5,301 | Platform JS; pricing and count endpoints | https://courses.joshwcomeau.com/ | 2026-10-17 |
| Josh W. Comeau | Accessibility | FAQ: everything "controllable through a keyboard alone", "AA-level contrast or higher", "All videos include closed-captions in English" | curl | https://css-for-js.dev/ | 2026-10-17 |
| Josh W. Comeau | AI-era, page weight | No AI course; essay "The Post-Developer Era" (2025-04-14). /courses/: HTML 20,571 B wire / 86,828 B raw; 15 scripts; JS 241,278 B wire | RSS; Python urllib | https://www.joshwcomeau.com/courses/ | 2026-10-17 |
| patterns.dev | Content | 53 patterns (vanilla 27, React 15, Vue 11); "Learning Patterns" book, 435 pages; CC BY-NC 4.0; no interactive embeds now | curl, sidebar parsed | https://www.patterns.dev/vanilla/singleton-pattern , https://www.patterns.dev/about | 2026-10-17 |
| patterns.dev | AI-era content | /ai/skills: "58 skills", "Install Patterns.dev skills into Cursor, Claude Code, and Codex", `npx skills add PatternsDev/skills/react`. AI Weekly "12,000+ readers", last issue June 29, 2026. PatternsDev/skills: 255 stars | curl; GitHub API | https://www.patterns.dev/ai/skills , https://www.patterns.dev/ai/weekly | 2026-10-17 |
| patterns.dev | Page weight, stack | Home: HTML 47,721 B wire / 171,135 B raw; 2 scripts: first-party 4,277 B wire, GTM 135,956 B. Astro v2.7.2 on Netlify. No skip link, no `<main>` | Python urllib; markup check | https://www.patterns.dev/ | 2026-10-17 |
| roadmap.sh | Progress | Done / Learning / Skip states; "% complete", "of … remaining", milestones, shareable progress link; server endpoints `/v1-update-resource-progress` | Site JS bundles | https://roadmap.sh/frontend | 2026-10-17 |
| roadmap.sh | Structure | Frontend roadmap: 120 learnable nodes (37 topics + 83 subtopics); 95 official roadmaps; 30 frontend projects; "Top 30" frontend question flashcards | Roadmap JSON; API | https://roadmap.sh/frontend.json , https://api.roadmap.sh/v1-list-official-roadmaps | 2026-10-17 |
| roadmap.sh | Sign-in | GitHub, Google, LinkedIn, Apple, email | curl | https://roadmap.sh/login | 2026-10-17 |
| roadmap.sh | AI-era content | AI Tutor generates Roadmap / Course / Guide / Quiz; per-topic "Quiz me". Claude Code roadmap (2026-02-10, 19 topics + 94 subtopics), Vibe Coding, AI Agents, Prompt Engineering, AI Engineer | curl; API | https://roadmap.sh/ai , https://roadmap.sh/claude-code | 2026-10-17 |
| roadmap.sh | Pricing | Pro $10/mo, $100/yr (pricing API, US); Team $10/seat/mo, minimum 3 seats | API plus page | https://api.roadmap.sh/v1-subscription-pricing , https://roadmap.sh/premium | 2026-10-17 |
| roadmap.sh | Changelog | 21 entries, from "13 Sep, 2024 Changelog page is launched" to "17 Sep, 2026"; about monthly | curl | https://roadmap.sh/changelog | 2026-10-17 |
| roadmap.sh | Page weight, stack | /frontend: HTML 109,914 B wire / 374,688 B raw; 3 `<script src>` (first-party 41,787 B wire, third-party 201,082 B) plus 227 modulepreload links (not counted). React Router SSR behind CloudFront. No skip link | Python urllib; markup check | https://roadmap.sh/frontend | 2026-10-17 |
| Cross-cutting | llms.txt | Of 12 domains, only flaviocopes.com serves `/llms.txt` (200). greatfrontend.com, frontendmasters.com, bigfrontend.dev, frontendmentor.io, scrimba.com, epicweb.dev, epicreact.dev, joshwcomeau.com, patterns.dev, roadmap.sh and ours return 404 | curl per domain | https://<domain>/llms.txt | 2026-10-17 |
| Cross-cutting | Agent Skills standard | Required `name` (≤64, lowercase-hyphen, must match directory) and `description` (≤1,024); "Keep your main SKILL.md under 500 lines". Showcase lists 46 clients, including Claude Code, Cursor, GitHub Copilot, VS Code, Codex and Gemini CLI | WebFetch | https://agentskills.io/specification , https://agentskills.io | 2026-10-17 |
| Cross-cutting | skills.sh directory | Frontend leaders: frontend-design 999.1K installs; vercel-react-best-practices 811.5K; web-design-guidelines 749.5K | WebFetch | https://skills.sh/ | 2026-10-17 |

## The bar for our product

**Where we already meet or beat the field:**
- **Lightest question page measured.** 3,843 B HTML wire versus GreatFrontEnd's 171,833 B.
- **Fully free and runnable without signup.** GreatFrontEnd and Flavio do the same.
- **Spec-valid Agent Skills.** 45 of 45 pass.
- **Skip links.** Only Frontend Mentor and Flavio also have them.
- **Plans with honest budgets.**
- **Course and lesson shells at Flavio's standard,** plus Previous links and reading time, which Flavio lacks.

**What we lack:**
- **No UI question runs in the browser** (0 of 10).
- **No question is in every harness framework.**
- **Sign-in:** no GitHub or Google.
- **Paid tiers:** no price, no monthly tier, and no shipped paid benefit.
- **Plans:** none longer than 345 minutes.
- **Company guides:** 4, against 25–37 elsewhere.
- **Lessons:** no inline quizzes.
- **Accessibility:** no statement and no automated check.
- **Release notes:** no changelog and no RSS.
- **AI readability:** no `llms.txt`.
- **Harness questions** cannot be machine-graded (0 of 6).
- **Skills reach:** only 13 of 45 skills are listed on skills.sh.

Every check below runs from the repo root `/home/gaurav/Documents/Projects/elegant-harness/elegant`. Each was run once today to get its "Today" value.

1. **Dashboard covers every axis the leaders show.**
   - **Target:** `docs/dashboard/index.html` has bars by format, difficulty, layer **and topic**; current streak; heatmap; recommended next; plan progress; **company-guide progress**. `https://elegantfrontend.training/dashboard/` returns 200.
   - **Set by:** GreatFrontEnd ("Solved by question type", easy / medium counts, "current streak" / "Max streak", heatmap since 2024-12-14, study plans, focus areas, 37 company guides); Frontend Mentor ("Challenges by difficulty level", "Completion streaks", path recommendations); BFE.dev (8 category %); roadmap.sh ("% complete", "of … remaining").
   - **Today:** format, difficulty and layer bars, streak, heatmap, recommend and plans are in the repo; topic and guides are missing; live returns 404.
   - **Verify:**
     ```
     python3 -c "h=open('docs/dashboard/index.html').read();n=['data-dash-bars=\"format\"','data-dash-bars=\"difficulty\"','data-dash-bars=\"layer\"','data-dash-bars=\"topic\"','data-stat=\"streak\"','data-heat-grid','data-dash-recommend','data-dash-plans','data-dash-guides'];m=[x for x in n if x not in h];print(m);exit(bool(m))"
     ```
     Then `curl -s -o /dev/null -w '%{http_code}' https://elegantfrontend.training/dashboard/` must print `200`.

2. **Bank breadth: at least 20 per format, at least 200 total.**
   - **Target:** each of quiz, coding, ui-coding, system-design and harness has at least 20 questions (20 is the system-design count at both GreatFrontEnd and BFE.dev); at least 200 questions overall.
   - **Set by:** GreatFrontEnd (659: UI 59, JS 205, algo 92, quiz 283, system design 20); BFE.dev (639, design 20); Frontend Mentor (131 challenges).
   - **Today:** 47 (13 / 12 / 10 / 6 / 6).
   - **Verify:**
     ```
     python3 -c "import yaml,collections;q=yaml.safe_load(open('docs/_data/questions.yml'));c=collections.Counter(x['format'] for x in q);print(len(q),dict(c));exit(not(len(q)>=200 and all(c[f]>=20 for f in ['quiz','coding','ui-coding','system-design','harness'])))"
     ```

3. **Every coding and UI-coding question runs its tests in the browser.**
   - **Target:** 100% of `format: coding` and `format: ui-coding` pages include `code-playground.html` and have at least one `tests.js` under `docs/practice/workspace/<slug>/`.
   - **Set by:** GreatFrontEnd (Monaco plus Sandpack tests on all 59 UI questions, Run / Submit, console); BFE.dev (Monaco, React iframe sandbox); Scrimba (in-browser editor on a WebContainer); Josh W. Comeau ("over 800 Sandpack instances").
   - **Today:** coding 13 of 13; **ui-coding 0 of 10**.
   - **Verify:** loop over `docs/practice/*.md`. For a coding or ui-coding format, fail when `'code-playground' not in body` or `glob('docs/practice/workspace/<slug>/**/tests.js')` is empty. Today it prints the 10 ui-coding slugs.
   - **Also:** keep it runnable on phones. GreatFrontEnd says "Running automated test cases and submission is not supported on mobile devices".

4. **UI questions in every framework the harness ships.**
   - **Target:** every ui-coding question lists `react`, `vue`, `angular` and `wc` in `frameworks:`, and each has its own folder.
   - **Set by:** GreatFrontEnd (59 of 59 UI questions in React, Vanilla, Angular, Vue and Svelte).
   - **Today:** 0 of 10. Each question has 2 frameworks (react 9, vue 7, angular 3, wc 1).
   - **Verify:** for each ui-coding page, pass when `{'react','vue','angular','wc'} <= set(fm['frameworks'])` and `os.path.isdir(f'docs/practice/workspace/{slug}/{fw}')` holds for each framework. Count passes against the total.

5. **TypeScript starters alongside JavaScript.**
   - **Target:** at least 50% of coding questions ship `starter.ts` next to `starter.js`. Strip types in the browser with a lazy-loaded transformer, not a build step.
   - **Set by:** GreatFrontEnd (273 JS / algo questions tagged js and ts; TypeScript 297); BFE.dev (JS or TS template; 62 TypeScript puzzles).
   - **Today:** 0.
   - **Verify:** `ls docs/practice/workspace/*/starter.ts | wc -l` must be at least half the coding count in `questions.yml`.

6. **Sign-in with GitHub, Google and email magic link.**
   - **Target:** `/account/` offers GitHub OAuth, Google OAuth and the email magic link. Signup stays optional for learning.
   - **Set by:**
     - GitHub is offered by all 8 competitors that have sign-in: GreatFrontEnd, Master.dev, BFE.dev, Frontend Mentor, Scrimba, Epic, Josh, roadmap.sh.
     - Google by GreatFrontEnd, Scrimba and roadmap.sh.
     - Magic link by Scrimba, Epic, Josh and Flavio's aiworkshop.sh.
   - **Today:** magic link and password are in the repo; GitHub 0, Google 0 (code comment: "Only the email provider is enabled").
   - **Verify:** `grep -c 'provider=github' docs/assets/js/account-supabase.js` at least 1, `grep -c 'provider=google' …` at least 1, `grep -c '/otp' …` at least 1 (today: 0 / 0 / 2).

7. **Paid tiers that ship something and price the way the market does.**
   - **Target:**
     - `docs/_data/pricing.yml` offers per-month, per-year and one-payment billing.
     - Every paid tier has at least 3 features with `planned` absent or false.
     - Each paid feature carries an `entitlements:` key that the code checks against a verified Supabase session (not localStorage).
     - The pricing page states a regional (PPP) or student discount.
     - Questions carry `access:` wherever anything is gated.
   - **Set by:**
     - **Monthly billing** at all six subscription competitors: GreatFrontEnd $39, Master.dev $39, Frontend Mentor $15, BFE.dev $6, roadmap.sh $10, Scrimba $49 base.
     - **Annual billing:** GreatFrontEnd $120, Frontend Mentor $120, roadmap.sh $100, Master.dev $390, BFE.dev $48.
     - **Lifetime:** GreatFrontEnd $180.
     - **Regional pricing:** GreatFrontEnd, Frontend Mentor, Scrimba, Josh.
     - **Concrete paid unlocks:** GreatFrontEnd (premium solutions, company signals, certificates), Frontend Mentor (Figma files, AI review on every submission).
   - **Today:**
     - Billing is forever / per year / one payment; no monthly.
     - All prices are 0.
     - Each paid tier's only real benefit is `planned: true`.
     - 0 entitlements; 0 regional or student mention; 0 of 47 questions with `access:`.
     - The price itself is the CFO's call; this bar is the mechanism.
   - **Verify:** parse `pricing.yml`.
     - Assert `{'per month','per year','one payment'} <= {t['billing'] for t in tiers}`.
     - For each tier with `checkout: true`, assert `sum(not f.get('planned') for f in features) >= 3` and `len(t.get('entitlements',[])) >= 3`.
     - For each entitlement key, `grep -r key docs/assets/js docs/_layouts` must find it.
     - `grep -i -E 'regional|purchasing power|student' docs/pricing/index.html` must find a line.

8. **Study plans at 1-week, 1-month and 3-month horizons, with GreatFrontEnd-sized budgets.**
   - **Target:** `plans.yml` has `one-week` with at least 840 min (2 h daily × 7), `one-month` with at least 1,440 min (6 h weekly × 4) and `three-months` with at least 2,340 min (3 h weekly × 13). Each budget still equals the sum of its steps (the existing honesty rule) and earns the certificate.
   - **Set by:** GreatFrontEnd (51 / 107 / 280 questions, each "Certificate").
   - **Today:** one-week 345 min; one-month and three-months missing.
   - **Verify:**
     ```
     python3 -c "import yaml;p={x['slug']:x['budget_minutes'] for x in yaml.safe_load(open('docs/_data/plans.yml'))};n={'one-week':840,'one-month':1440,'three-months':2340};b={k:p.get(k) for k in n if (p.get(k) or 0)<n[k]};print(b);exit(bool(b))"
     ```

9. **Company guides: at least 25, AI labs included.**
   - **Target:** at least 25 files in `docs/guides/`, including OpenAI and Anthropic. Each keeps the "commonly reported" provenance note and links at least 5 `/practice/` questions. The dashboard shows guide progress (bar 1).
   - **Set by:** GreatFrontEnd (37 guides, including OpenAI 29 questions and Anthropic 18); BFE.dev (25 tagged companies).
   - **Today:** 4, all with the note and 13–17 links.
   - **Verify:** `len(glob('docs/guides/*.md')) >= 25`, and for each file `'commonly reported' in t and t.count('/practice/') >= 5`.

10. **Free courses at Flavio's lesson standard, plus inline quizzes and full term coverage.**
    - **Target:**
      - Every lesson in `docs/courses/*/*.md` (except `index.md`) includes at least one `{% include quiz.html %}`, the "Check your understanding" pattern.
      - Lessons cover all 45 terms in `docs/_data/topics/*.csv`.
      - The lesson layout keeps "Mark lesson complete", Previous / Next and reading time; the course page keeps the "N modules · M lessons · … no signup" line and progress.
    - **Set by:** Flavio Copes (87 courses, e.g. JavaScript "9 modules · 65 lessons", a quiz per module, "Mark lesson complete", localStorage progress, streaks and certificates); Scrimba (13-section frontend path with lesson counts and hours); Master.dev ("quizzes and flashcards after every lesson").
    - **Today:** 4 courses / 28 lessons; 0 of 28 with an inline quiz; 23 of 45 terms covered; shell features present.
    - **Verify:** for each lesson file, check `'quiz.html' in body`. Then collect every `term:` value and compare it with `{f"{l}/{r['slug']}" for l in ('ui','server','state') for r in csv.DictReader(open(f'docs/_data/topics/{l}.csv'))}`. Finally `grep -c 'Mark lesson complete' docs/_layouts/lesson.html` must be at least 1.

11. **Page-weight budget: keep the lead we have.**
    - **Target:**
      - Question page HTML at most 20,000 B gzip on the live site.
      - First-party JS referenced by `_layouts/question.html` plus `_includes/identity-scripts.html` at most 51,200 B gzip.
      - At most 1 third-party `<script src>` host.
      - Any heavier editor (Monaco or CodeMirror) loads only on first interaction.
    - **Set by:** the ceiling we stay far below is GreatFrontEnd's question page (HTML 171,833 B, 92 scripts, JS 1,327,237 B wire), BFE.dev (263,819 B first-party JS) and Frontend Mentor (422,251 B JS). The lean end is Flavio's lesson (12,600 B HTML) and patterns.dev (4,277 B first-party JS).
    - **Today:** 3,843 B HTML live; 27,419 B first-party in the repo; 1 third-party script host (GTM, 194,985 B wire, 91% of the page's JS).
    - **Verify:** Python. Collect `re.findall(r"/assets/(js|vendor)/([\w.-]+\.m?js)", layout+include)`, then `sum(len(gzip.compress(open(p,'rb').read(),9)))` must be at most 51200. Separately, `curl -s -H 'Accept-Encoding: gzip' -o /dev/null -w '%{size_download}' https://elegantfrontend.training/practice/action-creators.html` must be at most 20000. Count `<script[^>]*src="https://` hosts across `docs/_layouts` and `docs/_includes`.

12. **Accessibility: published statement plus an automated gate.**
    - **Target:**
      - `docs/accessibility/index.md` exists and names WCAG 2.2 AA plus a contact address.
      - A workflow in `.github/workflows/` runs axe-core (or pa11y) over the built `_site`, with 0 serious or critical violations.
      - Every base layout keeps the skip link, `<main>` and `lang`.
      - Every ui-coding `tests.js` asserts at least one keyboard or ARIA behaviour.
    - **Set by:** Scrimba (statement, WCAG 2.1 AA target); Josh W. Comeau (keyboard-only, AA contrast, captions); Frontend Mentor (axe-core plus html-validate on every submission). Skip links are missing at GreatFrontEnd, BFE.dev, patterns.dev, roadmap.sh, Epic and Josh, so keeping ours is a lead.
    - **Today:**
      - No statement.
      - No a11y step in CI.
      - All base layouts have the skip link and `<main>`.
    - **Verify:** `test -f docs/accessibility/index.md && grep -q 'WCAG 2.2' docs/accessibility/index.md`, then `grep -l -i -E 'axe|pa11y' .github/workflows/*.yml`. For base layouts (no `layout:` front matter), `grep -L 'skip-to-content' docs/_layouts/*.html` must list none of them.

13. **A public, dated changelog that ships at least twice a month.**
    - **Target:** `docs/_data/changelog.yml` (rendered at `/changelog/`) with dated entries. The latest is at most 14 days old, with at least 6 entries in the trailing 90 days. An RSS feed (`/feed.xml`) returns 200.
    - **Set by:** GreatFrontEnd (public roadmap, 40 shipped items in 2026, JS batches every 2 weeks); roadmap.sh (monthly changelog since 2024-09-13); Flavio (changelog "starts on May 31, 2026", near-daily; RSS); epicshop (2–14 npm releases a month in 2026).
    - **Today:** no changelog; `/feed.xml` 404; last blog post 2026-09-22.
    - **Verify:** parse the dates in `changelog.yml`. Assert `(today - max(d)).days <= 14` and `sum(d >= today - 90 days) >= 6`. Also `curl -s -o /dev/null -w '%{http_code}' https://elegantfrontend.training/feed.xml` must print `200`.

14. **AI-readable site: `llms.txt`, Markdown twins and explicit AI-crawler rules.**
    - **Target:**
      - `docs/llms.txt` lists every course, lesson, question and skill URL, so its URL count must be at least questions + lessons + skills (120 today).
      - `robots.txt` names GPTBot and ClaudeBot.
      - Each lesson has a `.md` twin.
    - **Set by:** Flavio Copes (the only one of the 12 domains checked with `llms.txt`: 16,103 B; "append `.md`"; robots allows GPTBot and ClaudeBot). agentskills.io serves `llms.txt` too.
    - **Today:** none (404).
    - **Verify:** `test -f docs/llms.txt`. Then `grep -c 'https://elegantfrontend.training/' docs/llms.txt` must be at least the sum of the `questions.yml` count, the lesson file count and the SKILL.md count. Finally `grep -c -E 'GPTBot|ClaudeBot'` on the published robots.txt must be at least 2.

15. **Agent Skills: valid, exercised, listed.**
    - **Target:**
      - 45 of 45 SKILL.md stay valid against agentskills.io (name equals folder, ≤64 chars, lowercase-hyphen; description ≤1,024 chars; ≤500 lines).
      - Every skill is the `skill:` of at least one bank question.
      - skills.sh lists all 45.
    - **Set by:** patterns.dev ("58 skills", `npx skills add PatternsDev/skills/react`); skills.sh frontend leaders (vercel-react-best-practices 811.5K installs); Frontend Mentor (AI context files for Claude Code, Cursor and Copilot); Flavio ("AI Agent Skills", 5 modules · 25 lessons); Master.dev (Claude Code course); roadmap.sh (Claude Code roadmap).
    - **Today:** 45 of 45 valid; 29 of 45 exercised; 13 listed on skills.sh.
    - **Verify:** the Python validator over `skills/*/SKILL.md` (run today: 45 of 45). Then `{q['skill'] for q in questions} >= set(skill dirs)`. Then extract "N skills" from the text of https://www.skills.sh/grvpanchal/elegant and require N to be 45.

16. **Harness questions are machine-graded and make up at least 20% of the bank.**
    - **Target:** at least 20% of questions are `format: harness`. Each has `docs/practice/workspace/<slug>/tests.js` (or a `grader` script) that scores the learner's skill, gate or eval in the browser or under Node, the same contract as coding questions.
    - **Set by:** no competitor has a graded agent-harness format, so we set this bar. Nearest: Master.dev "Harness Engineering & Agent Orchestration" (video, 2026-07-01); Frontend Mentor AI code review (7 dimensions, score out of 10); BFE.dev ChatGPT solutions; roadmap.sh "Quiz me".
    - **Today:** 6 of 47 (12.8%); 0 of 6 with a grader (rubric only).
    - **Verify:**
      ```
      python3 -c "import yaml,os;q=yaml.safe_load(open('docs/_data/questions.yml'));h=[x['slug'] for x in q if x['format']=='harness'];g=sum(os.path.isfile(f'docs/practice/workspace/{s}/tests.js') for s in h);print(len(h),len(q),g);exit(not(len(h)>=0.2*len(q) and g==len(h)))"
      ```

17. **Verifiable certificates.**
    - **Target:** each certificate carries a unique ID and a public verify URL (e.g. `/plans/verify/?id=`) that a signed-in Supabase row backs. The printed card shows the URL.
    - **Set by:** Josh W. Comeau ("each one has a unique URL"); GreatFrontEnd (certificate per study plan); Flavio (certificates, 2026-07-11); Scrimba and Master.dev (completion certificates).
    - **Today:** printable only; 0 ID or verify code.
    - **Verify:** `grep -c -i -E 'verify|certificate_id|uuid' docs/assets/js/certificate.js` at least 1, and `test -e docs/plans/verify.md -o -e docs/plans/verify/index.md`.

## Channels

Where the technical standard is set and where the product has to ship itself:
- **GitHub as a funnel.**
  - roadmap.sh's repo has 369,690 stars and a personal-use licence.
  - yangshun/front-end-interview-handbook (GreatFrontEnd's founder) has 44,005 stars, last push 2026-10-05.
  - greatfrontend/awesome-front-end-system-design has 8,552.
  - PatternsDev/skills has 255; epicweb-dev/epicshop has 247.
  - grvpanchal/elegant has **1**.
  - Source: GitHub API, 2026-10-17.
- **Agent-skill directories.**
  - skills.sh is the install surface `npx skills add` resolves against. Frontend skills there reach 400K–999K installs: frontend-design 999.1K, vercel-react-best-practices 811.5K.
  - Our listing shows 13 of our 45 skills and 15 installs.
  - agentskills.io lists 46 compatible clients, so one skill reaches Claude Code, Cursor, Copilot, Codex and Gemini CLI. (https://skills.sh/ , https://www.skills.sh/grvpanchal/elegant , https://agentskills.io)
- **npm and CLIs.** Epic ships its learning environment as an npm CLI (`npx epicshop init`, 183 versions since 2025-07-03). Our `npx elegant` is the same kind of channel, but `elegant` 0.0.3 was last published 2025-04-14. (https://registry.npmjs.org/epicshop , https://registry.npmjs.org/elegant)
- **AI answer engines.** Only Flavio publishes `llms.txt`, `llms-full.txt` (2,093 posts) and explicit `Allow` rules for GPTBot and ClaudeBot. For a site that teaches agent harnesses, being readable by agents is the cheapest channel. (https://flaviocopes.com/llms.txt)
- **Newsletters and feeds.** Flavio: weekly "building software with AI", "Readers 150,000+", RSS. patterns.dev AI Weekly: "12,000+ readers". Josh: RSS. We have 101 blog posts but no RSS (`/feed.xml` 404). (https://flaviocopes.com/access/ , https://www.patterns.dev/ai/weekly)
- **Communities.** roadmap.sh "52K Discord Members". GreatFrontEnd private Discord on Quarterly and above. aiworkshop.sh "280+ developers in Discord". Scrimba community digest about twice a week. (https://roadmap.sh/frontend , https://www.greatfrontend.com/interviews/pricing , https://aiworkshop.sh/)
- **Free courses as top of funnel.**
  - Flavio: 87, no signup.
  - Master.dev: 5 free courses, a free bootcamp and a free Claude Code course.
  - Scrimba: 25 free courses; Frontend Mentor: 69 free challenges.
  - GreatFrontEnd: 441 questions attemptable free.
  - We have 4 free courses and all 47 questions free.
- **Books and PDFs.** patterns.dev "Learning Patterns" (435 pages). Flavio: 17 books behind a newsletter signup. Ours: `docs/assets/book/elegant-frontend.pdf`, ungated, so it is not collecting addresses.
- **Search.** GreatFrontEnd's 37 company guides and 142 blog articles. Our sitemap lists 258 URLs.

## Unverified

Not used in any bar unless noted otherwise.
- **GreatFrontEnd logged-in dashboard.** Never seen rendered: 307 to get-started. Heatmap, streak and solved-by-type come from the roadmap entry (2024-12-14) and shipped UI strings only.
- **GreatFrontEnd site details.**
  - Magic-link sign-in is not confirmed: a "Login link expired" string exists, but no app call was found.
  - The founding year is not published.
  - It is unclear whether UI questions run automated tests or list manual "Test scenarios".
  - The site's own counts disagree: GFE 75 lists 73 items; the 3-month plan says "over 140" and "280"; Accessibility shows 20 versus 18.
- **Master.dev.**
  - "300+" courses versus 231 counted; "24" paths versus 25 listed.
  - Founding is 2013 or 2014 (sources disagree).
  - Captions on course videos are not stated.
  - The logged-in dashboard was not viewed (302 to login).
  - The page-weight row counts only `<script src>`. First-party bundles from cdn.master.dev were not referenced that way in the HTML fetched.
- **Epic.** Launch dates are record-creation timestamps, not announcements. epicshop's licence reads GPL-3.0-only in the README but "Other" in the GitHub API. Progress UI was seen only in page data and docs.
- **Josh W. Comeau.** Progress, bookmark and completion features were seen in platform JavaScript, not in a logged-in UI. Whimsical Animations status conflicts ("released sometime in 2026" versus "Registration is now open!"). The 2021 launch comes from a podcast, not his own page.
- **Flavio Copes.**
  - My research agent's curl and WebFetch got a Cloudflare challenge (403).
  - My own Python urllib fetches got 200, and every Flavio value above was re-read live.
  - Cohort and bootcamp prices are unpublished; the next bootcamp is February or March 2027 (pages disagree).
  - Only 2 lessons were checked for the missing "Previous" link.
  - The third-party script host `cloud.livekit.io` on /courses/ was not investigated.
- **BFE.dev.**
  - My Python urllib got 200 on the home and problem pages, but curl and WebFetch got the Cloudflare challenge, so feature rows come from headless Chrome.
  - The logged-in dashboard was not seen.
  - The AI-solution launch date is not stated; the founding year (2020) is inferred.
  - Company tags are marketed as Premium but are visible logged out.
- **Frontend Mentor.** The dashboard row comes from their guide, not a logged-in view. Start year is 2018 (article) versus 2019 (footer). The AI model is not named.
- **Scrimba.**
  - Streaks are absent from public pages and the main script, which is not conclusive.
  - Prices included a time-limited "Halloween 2026" coupon, so only the $49 base is in the evidence.
  - Many course publish dates look like a 2025-03-12 migration date.
  - The Explain launch date (13 Aug 2026) is from search results only.
- **patterns.dev.** No official launch date (first Wayback capture only). Why AI Weekly stops at June 29, 2026 is unknown.
- **roadmap.sh.**
  - Not confirmed whether progress tracking works without an account.
  - The $100/yr price comes from the pricing API, not rendered text.
  - The 227 modulepreload scripts were not weighed.
- **Our live site versus the repo.** The repo has `docs/courses/`, `docs/dashboard/`, `docs/pricing/` and magic-link sign-in. The live site (last deploy) returns 404 for `/dashboard/` and `/pricing/`. Live page weights are for the deployed build; repo JS weight (27,419 B gzip -9) is computed, not served.
- **Accessibility markup checks** (skip link, `<main>`, `alt`) read server HTML only. Client-rendered pages (Scrimba's SPA shell, parts of GreatFrontEnd) may add landmarks after JavaScript runs.
