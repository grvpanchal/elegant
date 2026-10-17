# Roadmap

What we are building next for [elegantfrontend.training](https://elegantfrontend.training), and what has already shipped. The site is a free Frontend AI Harness training site for frontend developers who lost their jobs to AI.

- **status:** `planned`, `in-progress` or `shipped`.
- **owner:** the one office accountable for the item. The offices are `cto` (site, templates, docs), `coo` (planning, triage, this file), `cmo` (blog, newsletter, social), `cxo` (analytics, feedback, beta tests), `cfo` (pricing, payments) and `cio` (pitch, traction).
- **target:** the month we aim to ship in. When a target moves, we change it here.

The COO plans this work in Linear in two-week cycles and updates this file at the end of each cycle. Shipped rows link to their [changelog](CHANGELOG.md) entry.

| item | status | owner | target |
|---|---|---|---|
| Progress synced to your account across browsers (the code is on the site; the database table is not created yet) | in-progress | cto | 2026-10 |
| A weekly audience snapshot, and the CXO's written reading of it | in-progress | cxo | 2026-10 |
| Two-week cycles planned in Linear, with capacity per office and a rotating triage captain | in-progress | coo | 2026-11 |
| Every UI-coding question runs its tests in the browser (0 of 10 today) | planned | cto | 2026-11 |
| Sign in with GitHub on the account page | planned | cto | 2026-11 |
| Sign-up, sign-in-link and password-reset emails reach every learner, not only the project team | planned | cto | 2026-11 |
| Every template ships an AGENTS.md that wires the elegant skills, so "build a todo app" comes out the same in all seven (0 of 7 today) | planned | cto | 2026-11 |
| Prices for Monthly, Annual and Lifetime inside the market band, with a between-jobs discount of at least 40% | planned | cfo | 2026-11 |
| A weekly LinkedIn newsletter, with one edition every week | planned | cmo | 2026-11 |
| All five brand accounts linked from every page | planned | cmo | 2026-11 |
| A "Check your understanding" quiz in every lesson (0 of 28 today) | planned | cto | 2026-12 |
| Every terminology doc reviewed against current practice, citing a source from 2025 or later (0 of 45 today) | planned | cto | 2026-12 |
| A support page with a response window, plus issue labels per layer and per office | planned | coo | 2026-12 |
| A pitch and traction record in which every number is checked against a live API | planned | cio | 2026-12 |
| Every UI-coding question in all four harness frameworks: React, Vue, Angular and Web Components (0 of 10 today) | planned | cto | 2027-01 |
| Live payments, once the sandbox go-live gate is passed (a wallet purchase, a card purchase and a refund on record) | planned | cfo | 2027-02 |
| Public roadmap, changelog, contribution guide and issue forms ([2026-10-17](CHANGELOG.md#2026-10-17)) | shipped | coo | 2026-10 |
| [Dashboard](https://elegantfrontend.training/dashboard/): progress by format, difficulty and layer, a streak, a heatmap and what to do next ([2026-10-17](CHANGELOG.md#2026-10-17)) | shipped | cto | 2026-10 |
| Four free [courses](https://elegantfrontend.training/courses/) with 28 lessons, no signup ([2026-10-17](CHANGELOG.md#2026-10-17)) | shipped | cto | 2026-10 |
| [Pricing](https://elegantfrontend.training/pricing/) page with PayPal sandbox checkout ([2026-10-17](CHANGELOG.md#2026-10-17)) | shipped | cto | 2026-10 |
| *Elegant Frontend*, the glossary as a free PDF [book](https://elegantfrontend.training/book/) ([2026-10-11](CHANGELOG.md#2026-10-11)) | shipped | cto | 2026-10 |
| A 47-question [practice bank](https://elegantfrontend.training/practice/), with coding questions tested in the browser ([2026-09-20](CHANGELOG.md#2026-09-20)) | shipped | cto | 2026-09 |
| Study plans, curated lists and four company interview-loop guides ([2026-09-20](CHANGELOG.md#2026-09-20)) | shipped | cto | 2026-09 |
| [Account page](https://elegantfrontend.training/account/): device profiles with a JSON export, plus email accounts verified by Supabase ([2026-09-20](CHANGELOG.md#2026-09-20)) | shipped | cto | 2026-09 |
| The [blog](https://elegantfrontend.training/blog/): 101 posts, each with code, a diagram and a practice question ([2026-09-20](CHANGELOG.md#2026-09-20)) | shipped | cmo | 2026-09 |

## Waiting on a decision

Some items cannot move until the CEO acts. Each of these decisions has a ticket in [`.benzene/material/operations/tickets/`](.benzene/material/operations/tickets/README.md):

- **Dashboard, courses and pricing live on the site** wait on [merging and deploying the working tree](.benzene/material/operations/tickets/deploy-dashboard-courses-pricing.md).
- **Progress synced across browsers** waits on [running the progress migration in Supabase](.benzene/material/operations/tickets/run-progress-migration.md).
- **Sign in with GitHub** waits on [enabling GitHub sign-in in Supabase](.benzene/material/operations/tickets/enable-github-sign-in.md).
- **Emails that reach every learner** wait on [setting up custom SMTP for auth emails](.benzene/material/operations/tickets/configure-auth-email-smtp.md).
- **Prices inside the market band** wait on [approving the CFO's proposed prices](.benzene/material/operations/tickets/approve-cfo-prices.md).
- **The weekly LinkedIn newsletter** waits on [creating the LinkedIn newsletter](.benzene/material/operations/tickets/create-linkedin-newsletter.md).
- **All five brand accounts linked** wait on [confirming the Facebook and LinkedIn Page URLs](.benzene/material/operations/tickets/confirm-facebook-linkedin-pages.md).
- **Live payments** wait on [deciding when the PayPal sandbox goes live](.benzene/material/operations/tickets/decide-paypal-go-live.md).

## Rules this roadmap keeps

- **One owner per row.** Other offices can help, but only one office answers for the item.
- **A 90-day horizon.** At least six rows are planned or in progress, and the furthest target is at least 90 days away.
- **Waitlist before launch.** A new paid tier or course gets a waitlist page at least 30 days before its target.
- **Free stays free.** No row takes a course, a question or a skill away from the free tier.
