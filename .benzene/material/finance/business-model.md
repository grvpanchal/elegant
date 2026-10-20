# Business model (initial, 2026-10-17)

How elegantfrontend.training earns. Every figure carries one of three labels. **source** means it is on the record, with
an evidence ID from `.benzene/standards/cfo.md` or a repository file. **target** means it is a proposed price or bar.
**SIMULATED** means it is a modelled assumption that no record supports yet. The prices are proposals for the CEO's
approval (see `pricing.md`).

## Who pays

- **The developer between jobs.** This is the audience the site is for: frontend developers who lost their jobs to AI.
  They are anxious about spending. Josh Comeau's account of 2026 sales is that "Many people are wondering whether
  developer jobs will even exist in a few months, so they're reluctant to spend time/money learning new dev skills"
  (source [E47]). They buy Annual or Lifetime at the self-declared between-jobs price, or a single Monthly pass.
- **The developer still employed who is reskilling for AI-harness work.** They pay list price. Some get reimbursed:
  GreatFrontEnd notes that many users claim from company learning budgets (source [E1]), and roadmap.sh says "Ask your
  manager" (source [E48]).
- **Learners in lower-income countries.** They pay the band A or band B regional price on Annual and Lifetime, locked to
  their PayPal account's country. Six of the ten competitors price regionally (source: cfo.md Pricing table).
- **Who does not pay.** Most people. The paying share in the record is about 1%: Scrimba has more than 10k paying out of
  more than 1M unique users (source [E25]), and Frontend Mentor reports "fewer than one percent" (source [E23]). The free
  tier is the funnel, as it is at roadmap.sh, Flavio Copes and patterns.dev (source [E34][E49][E56]).
- **On the record today:** no sale. The combined audience is 2,637 followers, 2,626 of them on the founder's personal
  LinkedIn (source `experience/analytics.md`, 2026-W42). The site's registered-account count is not in any material
  file.

## For what

People pay for the parts of the site that **prove** skill, plus the comfort of funding the site they learn from. Every
gate is planned and none is built yet (see `pricing.md`, "What is not built yet"):

1. **Graded harness questions.** A grader scores the learner's Agent Skill, gate or eval. No competitor has a graded
   agent-harness format (source: cto.md bar 16). This is the one unlock nobody else sells.
2. **One-month and three-month study plans, each ending in a certificate** (source: cto.md bar 8; GreatFrontEnd badges
   every plan with a certificate, [E1]).
3. **A verifiable certificate** with a unique ID and a public verify URL (source: cto.md bar 17; Josh Comeau: "each one
   has a unique URL").
4. **A reimbursable receipt** with a unique `invoice_id` (source: cfo.md bar 17).

The repository is public, so payment cannot buy secret content. Anything shipped under `docs/` can be read on GitHub.
What a payment buys is a **service backed by a verified account**: grading recorded against the learner, a certificate
the site will vouch for, longer plans tracked on the dashboard, and a receipt. Every course, question, plan, skill and
the book stay free.

## Billing unit

- **Licence:** one person, meaning one verified Supabase account (`licence: individual`). There is no team tier yet.
  Teams are low-fit for the unemployed (source: cfo.md Channels).
- **SKUs:** each price is one Orders v2 one-time purchase. The SKUs are `monthly`, `annual` and `lifetime`, plus the
  discounted variants `+between_jobs`, `+ppp:band-a` and `+ppp:band-b` (13 SKUs, listed with their prices in `pricing.md`).
  The report recommends starting with one-time Orders v2 SKUs (source: cfo.md "Reference flow").
- **Monthly** is a 30-day pass that does not renew automatically at go-live. PayPal Subscriptions (`intent=subscription`,
  `vault=true`, source [E63]) are a later option.
- **Annual** is 12 months from capture. **Lifetime** has no expiry. An entitlement row is written only after a verified
  capture.
- **Price per sale (target):** $12 / $99 / $139 list. The lowest stacked price is $29.70 (target, Annual band A between
  jobs), above the $10 floor (target, cfo.md bar 4).
- **Refund:** 30 days on the first purchase, unconditional (target `refund_days: 30`; Josh Comeau and Epic, source
  [E46][E39]).

## Costs

| Cost | Figure | Label | Notes |
|---|---|---|---|
| PayPal domestic | 3.49% + $0.49 per capture | source [E74] | PayPal Checkout, fees page updated 2026-10-01 |
| PayPal international | +1.50%, so 4.99% + $0.49 | source [E74] | the fee floor in `pricing.md` uses this rate |
| PayPal currency conversion | 3.00% | source [E74] | only if a buyer pays in a currency other than USD; we price in USD |
| Fee on a $12 Monthly pass | $1.09 (9.1%) | target price, fee derived from source [E74] | the worst ratio of any SKU |
| Fee on a $99 Annual | $5.43 (5.5%) | target price, fee derived from source [E74] | international rate |
| Fee on a $29.70 lowest SKU | $1.97 (6.6%) | target price, fee derived from source [E74] | band A between jobs |
| Blended fee used in the projection | 4.24% + $0.49 | SIMULATED | half of buyers assumed international |
| Refunds | 3.5% of gross | SIMULATED, from Frontend Mentor's launch (source [E20]: 10 of 284) | target cap ≤ 5% over 90 days (cfo.md bar 8) |
| Model spend, sub-agents | about $92 to $110.50 a month ceiling | SIMULATED, derived from config caps | 17 cells × 5 tasks per two-week sprint ≈ 184 tasks a month × the guardrail `max_cost_usd` 0.50 (org) to 0.60 (CTO) in `.benzene/benzene-org.yaml` and `benzene.yaml`. Actual spend is not on the record |
| Model spend used in the projection | $100 a month | SIMULATED | the midpoint of the ceiling |
| Coder runs (`coder.cli: claude`, at most one per beat) | unknown | not on the record | not in the projection; the CEO should add it once known |
| GitHub Pages hosting | $0 | assumption, not fetched | the site is a public repo on Pages (source: cfo.md) |
| Supabase | $0 on the free plan | assumption, not fetched | custom SMTP is needed before real learners sign up (`supabase/README.md`) |
| Domain, email and other costs | $10 a month | SIMULATED | the `.training` renewal price is not on the record |
| **Fixed monthly total used** | **$110** | **SIMULATED** | model spend $100 plus other costs $10 (SIMULATED) |
| Sales tax or VAT on digital sales | unknown | not on the record | PayPal is not a merchant of record (Paddle is, source [E76]). See `legal.md` |

**Net per sale after fees and refunds** (*derived*: target price, fee from source [E74], 3.5% refunds SIMULATED):

| Sale | Net |
|---|---|
| Monthly at $12 | $10.58 (SIMULATED) |
| Annual at $99 list | $90.85 (SIMULATED) |
| Annual at $59.40 between jobs | $54.31 (SIMULATED) |
| Annual at the $74.25 blended average | $68.01 (SIMULATED) |
| Lifetime at the $104.25 blended average | $95.69 (SIMULATED) |

Covering the $110 fixed month (SIMULATED) takes about 11 Monthly passes, or 2 blended Annual sales, or 2 blended Lifetime
sales (SIMULATED). `projection.md` turns this into twelve months.
