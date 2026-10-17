---
updated: 2026-10-17
owner: cio
sources:
  - .benzene/material/investors/traction.json
  - .benzene/material/experience/analytics.md
  - .benzene/standards/cio.md
  - .benzene/benzene-org.yaml
  - .benzene/benzene.yaml
  - .benzene/material/finance/business-model.md
---

# Leverage scores

What the organisation has before it asks anyone for money, scored 0 to 10 on the four kinds of leverage: code (product
that works without us), media (an audience we can reach without paying), capital (money in hand) and labour (work done
for the organisation by others, here its AI cells). Every input is a number on the record with its date; every benchmark
is a competitor figure from `.benzene/standards/cio.md` (fetched 2026-10-17) or the CFO's record.

## Scores

| Leverage | Score | Inputs (value, record, date) | Benchmark (value, record) | Raw |
|---|---|---|---|---|
| Code | **3** | 1 GitHub star (`traction.json`, 2026-10-17); 257 npm downloads last month (`traction.json`, 2026-10-17); 47 practice questions (`./docs/_data/questions.yml`, 2026-10-17) | 44,005 stars on front-end-interview-handbook [E6]; ~600,000 npm downloads a month for Josh W. Comeau's packages [E41]; 600+ questions on BigFrontEnd.dev [E26] | 3.62 |
| Media | **3** | 2,637 combined followers (`.benzene/material/experience/analytics.md`, 2026-10-17); 0 newsletter subscribers, not measured yet (`traction.json`, 2026-10-17) | 31k Twitter followers at Josh W. Comeau's launch [E35]; the 7,000-subscriber floor set by Frontend Mentor's 7k+ list at PRO launch [E21] | 3.81 |
| Capital | **0** | $0 raised and $0 revenue: checkout is PayPal sandbox and the CFO's prices await the CEO (`./docs/_data/pricing.yml`, `.benzene/material/finance/pricing.md`, 2026-10-17) | the $10,000 You Don't Know JS goal [E57] | 0.00 |
| Labour | **3** | 17 chartered skill cells (`.benzene/benzene-org.yaml`, `.benzene/benzene.yaml`, 2026-10-17); 0 cell tasks approved by the CEO in the last 30 days, since `.benzene/rooms` does not exist yet (2026-10-17) | a team of 13 at Scrimba's 2023 secondary [E18]; 184 tasks a month, the CFO's estimate of 17 cells at 5 tasks a sprint (`.benzene/material/finance/business-model.md`) | 3.00 |

Read: the product exists (45 Agent Skills, 47 questions, 28 lessons) but almost nobody uses it yet; the reachable
audience is one person's LinkedIn following; there is no money; and the AI cells are chartered but have not shipped an
approved task. Media is the binding constraint, because the ask in `pitch.md` cannot open before the 7,000 floor.

## How they are measured

Each count is put on a log scale against its benchmark, because the competitors span five orders of magnitude:

    L(x, B) = min(1, log10(1 + x) / log10(1 + B))

- **Code** = floor(10/3 × (L(github_stars, 44,005) + L(npm_downloads_last_month, 600,000) + L(questions, 600))).
  Stars and downloads come from `traction.json`, which the traction cell refreshes from the GitHub and npm APIs; the
  question count is the number of entries in `docs/_data/questions.yml`.
- **Media** = floor(5 × L(combined_audience, 31,000) + 5 × L(newsletter_subscribers, 7,000)). The combined audience is
  `combined_audience` in the newest `.benzene/material/experience/analytics/*.json`; subscribers come from `traction.json`.
  The ConnectSafely `newsletters` field counts newsletters, not subscribers, and never feeds this score.
- **Capital** = floor(10 × L(raised_usd + revenue_usd, 10,000)). Only captured, non-sandbox money counts: a pledge, a
  sale or a grant with a record (a ledger row or a payout), never a projection or a SIMULATED figure.
- **Labour** = floor(3 × min(1, cells / 13) + 7 × min(1, approved_tasks_30d / 184)). Cells are the skills chartered in
  `.benzene/benzene-org.yaml` plus the CTO skills in `.benzene/benzene.yaml`. Approved tasks are the items the CEO
  approved in the rooms (`.benzene/rooms`) or the Linear "Release plan" in the last 30 days. Capacity is worth 3 and
  proven output 7, because a chartered cell that has shipped nothing is not leverage yet.

Rules: round down; recompute every time `traction.json` or the analytics snapshot changes; write each input with its
record and date in the table; if an input cannot be read, score that component 0 and say why. A score never rises on a
number that is not on the record.
