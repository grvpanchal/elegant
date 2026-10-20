---
updated: 2026-10-17
sources:
  - .benzene/standards/cxo.md
  - docs/index.md, docs/_includes/landing-hero.html, docs/_includes/landing-surfaces.html
  - docs/practice/, docs/_layouts/question.html, docs/assets/js/playground.js, docs/assets/js/progress.js
  - docs/courses/, docs/_data/courses.yml, docs/_layouts/lesson.html
  - docs/dashboard/index.html, docs/account/index.md, docs/pricing/index.html, docs/_data/pricing.yml, docs/plans/certificate.md
---

# UX model

Who elegantfrontend.training is for, what they hire it to do, the path they walk from landing to paying, and where
that path breaks today. The beta-test cell picks its persona from `## Who the users are` by id (P1 to P4). Counts of
site content below were read from `docs/_data` on 2026-10-17; competitor figures come from
`.benzene/standards/cxo.md` (fetched 2026-10-17, URLs there). Nothing here is user feedback: there is none yet
(see `feedback-log.md`).

## Who the users are

All four are frontend developers whose work AI has taken or is taking. Front-end postings fell 25% globally from
Jan 2024 to Jan 2025 while full-stack postings rose 9% (LeadDev, TalentNeuron data, cited in cxo.md). The people in
the report's Reddit threads describe fear about the role, not knowing what to spend learning time on, and many
applications with few callbacks.

| id | Persona | Situation | What they want from us | What makes them leave (from competitor complaints in cxo.md) |
|---|---|---|---|---|
| P1 | **Early-career developer**, bootcamp or first job, laid off or never hired | Knows HTML, CSS and some React from tutorials; little production experience; no salary, so price is the first filter | The vocabulary seniors use, a first passing exercise to prove they can do it, a credential to show | Paywalls and forms before the first lesson; video with nobody to ask when stuck; prices set for corporate budgets |
| P2 | **Mid-level React developer, about 5 years in, laid off** (the report's r/cscareerquestions voice) | Shipped features for years; now applying widely and hearing back rarely; unsure whether frontend is still a career | Interview readiness on the terms interviewers use, and the AI-harness skill that sets them apart from candidates who only prompt | Content that is breadth without depth; billing traps (renewals without reminders, no refund); no bridge from study to a job |
| P3 | **Senior or lead frontend engineer**, displaced or expecting to be | Owns architecture decisions; already uses coding agents and has seen them compress the prototype loop when directed and reviewed | A way to direct and review an agent's frontend code: Agent Skills to install, guardrails and evals, system-design rounds | Material that is "too high level" or reads as stale; being stuck in a learning tool instead of a real editor |
| P4 | **Angular, Vue or Web Components developer moving toward full-stack** | Their framework's job pool shrank faster than React's; the market rewards server and state skills | The same architecture across frameworks (the six templates), the server and state layers, harness questions | React-only examples; having to install a local toolchain before seeing anything run |

Shared constraints: money is tight (P1, P2 most), time is plentiful but anxious, many study on a laptop they may
share, some on a phone. Nobody owes us an account: they arrive from a social post or a search and decide on the
first screen.

## Their jobs

Jobs-to-be-done, written as the situation, the motivation and the outcome. Each names the surface that serves it today.

1. **Know what to learn now.** When I lose a frontend job to AI, I want a map of what still matters, so I stop
   spending study time on things agents already do. Serves it: the UI, Server and State term docs, `/lists/`, `/plans/`.
2. **Prove I can still do it.** When I doubt myself, I want to solve one real question and see tests pass, so I get my
   confidence back fast. Serves it: the in-browser workspace on the home page and on every coding question.
3. **Learn to direct and review a coding agent.** When teams hire for AI-assisted work, I want the words and the
   Agent Skills that make an agent's frontend output reviewable, so I am the person who steers the agent, not the one
   it replaced. Serves it: the four free courses (one is Agent Skills), the harness questions, the skill downloads.
4. **Pass the interview loop.** When I get a callback, I want to rehearse the rounds that company runs, so I convert
   the few interviews I get. Serves it: `/guides/` (company loops, with the provenance note), `/playbooks/`,
   `/plans/interview-sprint`.
5. **Show proof to an employer.** When I apply, I want evidence of what I finished, so my claim is more than a line on
   a CV. Serves it: the printable certificate (`/plans/certificate`), the dashboard.
6. **Get unstuck.** When a test fails and I do not see why, I want a hint or a person, so I do not quit. Serves it:
   only the written solution below each workspace.
7. **Keep my progress.** When I switch browser or device, I want my work to follow me, so starting over never
   pushes me out. Serves it: device profiles and export, or an email account that syncs.
8. **Pay only if it is fair.** When I have no salary, I want to know everything free stays free and any payment is
   affordable and reversible, so I can support the site without risk. Serves it: `/pricing/` (sandbox, prices to be set).

## The journey

The path the CXO measures, stage by stage, with what the site does today. The bar for stage 2 is cxo.md bar 5: from
the homepage, at most 2 clicks and at most 3 minutes to a passing exercise in the browser, with no account. It has
not been timed yet; Google Analytics and the Playwright timing come later.

| # | Stage | What the learner does | What the site does today |
|---|---|---|---|
| 1 | **Land** | Arrives from a LinkedIn, Instagram, X or YouTube post, or from search, on the home page | Hero: "Scaffold the architecture. Then train on it.", a CLI boilerplate picker as the art, primary button "Start practising", note "No sign-up required" |
| 2 | **First solved question** | Edits a starter and presses Run until every test passes | Two routes. Scroll to the fifth section of the home page ("Answer a question right now"), where the `action-creators` workspace runs. Or press "Start practising", pick one question out of the bank's list, then Run. Passing every test marks the question done with no account (`progress.js`) |
| 3 | **Course** | Opens a free course, reads a lesson, marks it complete, moves on | `/courses/` lists 4 courses with 28 lessons (7 each), "free and needs no signup". Each lesson names the term, the key insight, the Agent Skill and a practice card, then "Mark lesson complete" and a "Next lesson" link; the last lesson points to the dashboard |
| 4 | **Return** | Comes back, sees progress, picks the next thing | `/dashboard/`: solved by layer, format and difficulty, courses, plans, terms mastered, a twelve-week heatmap, "Recommended next". Progress sits in this browser unless the learner signs in at `/account/` |
| 5 | **Proof** | Finishes a plan and prints the certificate | `/plans/certificate`: a client-side printable card; the learner types the name on it |
| 6 | **Paid** | Chooses Pro or Lifetime to back the site | `/pricing/`: Free keeps everything; Pro and Lifetime show "Price to be set" and check out in the PayPal sandbox; no real money moves |

## Where it breaks

What a persona hits today, from reading the pages above and the competitors' complaints in cxo.md. Severity uses
the beta-test scale (blocker stops the task, major makes most give up, minor slows them).

1. **The first screen talks to a boilerplate user, not to a displaced developer (major, P1 to P4).** The headline,
   the eyebrow ("a frontend architecture harness") and the hero art all sell `npx elegant`. Losing a job to AI, and
   what this site does about it, is not named on the first screen. Competitors that convert this audience lead with
   the outcome (fundamentals, a job, interview practice).
2. **The fastest route to a first solved question is hidden (major, P1, P2).** The runnable workspace is the fifth
   section of the home page, below three sections about architecture. The primary button goes to a list of 47
   questions with five filters, so the first click is a choice, not a run. GreatFrontEnd, BigFrontEnd.dev and
   roadmap.sh put the first item one click from the home page with no signup (cxo.md onboarding table).
3. **A solved question is a dead end (major, P2, P3).** The question page ends with "Back to the question bank". It
   does not link the course lesson that teaches the same term, a next question, or the dashboard. The lesson links to
   its question; the question never links back. Stage 2 does not lead to stage 3.
4. **No way to give feedback (blocker for the CXO, every persona).** No lesson, question or page has a "give
   feedback" link, an issues link or a community. Scrimba puts "Give Feedback!" lessons in courses, GreatFrontEnd
   keeps a public feedback repo, roadmap.sh answers issues in about 1 to 2 days (cxo.md). Without a channel the
   30-people trigger in `audience.md` cannot be reached from the site.
5. **Stuck means reading the answer (minor, P1).** The only help is the written solution below each workspace: no
   hint step, no person. "Stuck with no help" is a top complaint about video courses in cxo.md.
6. **No bridge to a job (major, P2).** Company-loop guides and playbooks prepare the interview, but there is no
   job-hunting module and no outcome tracking (cxo.md bar 12). "No path to a job" is the complaint our audience
   makes about Scrimba.
7. **The certificate proves nothing to an employer (minor, P1, P2).** It is printed in the browser with a typed name
   and no verification ID or public URL (cxo.md bar 11). Competitors issue PDFs with a unique verification URL.
8. **Pricing cannot yet answer the price fear (minor today, major at launch of paid, P1, P2).** The page is honest
   that everything is free, which matches the praise "free and generous". But paid tiers show "Price to be set" and
   "planned" benefits, and no between-jobs discount, refund window or renewal reminder is stated. Billing traps and
   price-versus-unemployment are the loudest competitor complaints (cxo.md bars 7 and 8).
9. **The dashboard is not in the main menu (minor, every persona).** The nav lists UI, Server, State, Courses,
   Practice, Plans, Lists, Playbooks, Blog and Pricing. The dashboard is reached from the home page's last section,
   a lesson's final link or the account page, so a returning learner may not find their progress.
10. **Two kinds of identity to read before syncing (minor, P1).** `/account/` explains email accounts and device
    profiles at length and offers four sign-in tabs. It is correct and must keep the device-profile caveat, but a
    learner who just wants their progress on another browser reads a lot before acting.

Not yet measured (do not treat as known): time from landing to first pass, drop-off between stages, phone usability
of the workspace, and whether account sync is live (it reports "Device only" until the progress table exists).
