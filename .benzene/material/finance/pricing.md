---
tiers:
  - id: free
    price_usd: 0
    billing: none
    licence: individual
    includes:
      - "Every course and every lesson"
      - "The whole question bank (47 questions today), with the in-browser workspace and its tests"
      - "The four study plans, the curated lists, the playbooks and the printable certificate"
      - "The dashboard, with progress synced to your account across browsers"
      - "Every Agent Skill, to install or download"
      - "The Elegant Frontend book: the whole glossary as one PDF (354 pages)"
  - id: monthly
    price_usd: 12
    billing: monthly
    licence: individual
    gates:
      - {text: "Graded harness questions: a grader scores the Agent Skill, gate or eval you write (0 of 6 harness questions are graded today)", planned: true, entitlement: harness-graders}
      - {text: "The one-month and three-month study plans, each ending in a certificate", planned: true, entitlement: long-plans}
      - {text: "A verifiable certificate for every plan you finish, with a unique ID and a public verify URL an employer can open", planned: true, entitlement: verified-certificate}
      - {text: "A reimbursable receipt with a unique invoice number, for an employer training budget or a reskilling grant", planned: true, entitlement: invoice-receipt}
  - id: annual
    price_usd: 99
    billing: yearly
    licence: individual
    gates:
      - {text: "Graded harness questions: a grader scores the Agent Skill, gate or eval you write (0 of 6 harness questions are graded today)", planned: true, entitlement: harness-graders}
      - {text: "The one-month and three-month study plans, each ending in a certificate", planned: true, entitlement: long-plans}
      - {text: "A verifiable certificate for every plan you finish, with a unique ID and a public verify URL an employer can open", planned: true, entitlement: verified-certificate}
      - {text: "A reimbursable receipt with a unique invoice number, for an employer training budget or a reskilling grant", planned: true, entitlement: invoice-receipt}
  - id: lifetime
    price_usd: 139
    billing: once
    licence: individual
    gates:
      - {text: "Graded harness questions: a grader scores the Agent Skill, gate or eval you write (0 of 6 harness questions are graded today)", planned: true, entitlement: harness-graders}
      - {text: "The one-month and three-month study plans, each ending in a certificate", planned: true, entitlement: long-plans}
      - {text: "A verifiable certificate for every plan you finish, with a unique ID and a public verify URL an employer can open", planned: true, entitlement: verified-certificate}
      - {text: "A reimbursable receipt with a unique invoice number, for an employer training budget or a reskilling grant", planned: true, entitlement: invoice-receipt}
      - {text: "Every paid feature added later, with no renewal", planned: true, entitlement: future-paid}
discounts:
  between_jobs: {percent: 40, applies_to: [annual, lifetime], how: self-declared}
ppp:
  bands:
    - id: band-a
      percent: 50
      countries: [IN, NP, LK, PH, VN, KH, LA, MN, KG, TJ, EG, MA, TN, NG, GH, KE, UG, TZ, RW, ET, SN, CM, ZM, ZW, MZ, BO, HN, NI]
    - id: band-b
      percent: 30
      countries: [ID, MY, TH, TR, UA, GE, AM, AZ, KZ, RS, BA, MK, AL, MD, DZ, JO, ZA, BR, MX, CO, PE, AR, EC, DO, GT, PY]
  applies_to: [annual, lifetime]
  region_locked: true
refund_days: 30
---

# Pricing: the initial proposal (2026-10-17)

**These prices are proposals for the CEO's approval.** Nothing here is live. The site still shows "Price to be set",
checkout runs only in PayPal's sandbox, and no price changes until the CEO approves it. After approval, the CTO mirrors
this front matter into `docs/_data/pricing.yml`. Any later change is filed as a COO ticket and dated in
`pricing-history.md`. Every figure below is a **target** price. None is a recorded sale.

## Free: $0, for as long as the site exists

If you have just lost your job, start here and you may never need to pay. Free is the whole site as it stands today:
every course and lesson, all 47 questions with the in-browser workspace and their tests, the four study plans and the
printable certificate, the dashboard with progress synced across browsers, every Agent Skill and the full book as a PDF.
None of it moves behind a paywall. The paid tiers below unlock new things the roadmap commits to. Nothing is taken out of
Free to create them. That rule comes from `docs/_data/pricing.yml` ("they must never take anything away from Free"), and
it is why the book stays free even though a downloadable book could have been a paid gate.

## Monthly: $12 for 30 days

Monthly is for the developer who has a few weeks of focus before interviews and wants to spend as little as possible
before knowing whether the site works for them. It unlocks the parts of the site that prove what you can do, not just
what you have read: graded harness questions that score the Agent Skill or eval you write, the longer one-month and
three-month study plans, and a certificate an employer can check with a verify URL. You also get a receipt you can claim
back. At go-live, a month is a single 30-day pass bought with PayPal. It does not renew, so no second charge arrives
while you are not looking. Automatic renewal comes later, only as an option. The between-jobs and regional discounts do
not apply to Monthly. At $12, PayPal's fixed fee is already 9.1% of the price, so any discount would put the sale under
the fee floor.

## Annual: $99 per year, or $59.40 between jobs

Annual is the plan we expect a developer who is between jobs to choose. It unlocks the same things as Monthly for
twelve months. The list price works out to $8.25 a month, which is $45 less than twelve monthly passes. Tick "I'm between
jobs" at checkout and it costs $59.40, about $4.95 a month. No proof is asked for. You declare it yourself, and we trust
you. If you live in one of the regional-price countries below, the regional price applies as well.

## Lifetime: $139 once, or $83.40 between jobs

Lifetime is for someone who never wants another subscription: one payment, no renewal, and every paid feature we add
later included. It costs 1.4 times Annual, so it pays for itself if you stay past roughly the seventeenth month. The
between-jobs price is $83.40, and the regional price applies on top of it. Choose this only once at least one of the
gates below has actually shipped. Until then, Lifetime pays for a promise.

## Between jobs: 40% off Annual and Lifetime, self-declared

None of the ten competitors in the report offers an unemployed or between-jobs discount (cfo.md, Pricing table). The
level matches GreatFrontEnd's 40% student discount [E2]. You declare it with a checkbox at checkout, and no document is
asked for. The only record of it is the SKU on the order (`annual+between_jobs`, for example). It never reaches the
learner's profile.

## Regional prices: Annual and Lifetime, region-locked

There are two bands. **Band A is 50% off** and covers 28 countries. **Band B is 30% off** and covers 26 countries. Both
discounts stack with the between-jobs discount. Region-locked means the band price is honoured only when the country on
the buyer's PayPal account is in the band. The server checks that country on the approved order before it captures. If
the country does not match, the order is not captured and the buyer is offered the list price. This follows Epic's
country-locked PPP [E40] and Josh Comeau's regional licence [E45]. None of the competitors publishes its own band table
(cfo.md, Unverified), so both the percentages and the country lists are **target** values for the CEO to review. Two
checks must happen before go-live, because neither was fetched: that PayPal accepts payments from each listed country,
and the band membership itself.

## Every payable price, after every discount

PayPal's international rate is 3.49% + $0.49, plus 1.50% [E74]. That is a fee of `0.0499 × p + 0.49`. The floor is
every price ≥ $10 with the fee ≤ 10% (cfo.md bar 4). No coupon is proposed. Any future coupon has to keep every row of
this table above the floor.

| SKU | Arithmetic | Price (target) | Intl fee | Fee share |
|---|---|---|---|---|
| monthly | list | $12.00 | $1.09 | 9.1% |
| annual | list | $99.00 | $5.43 | 5.5% |
| annual+between_jobs | 99 × 0.60 | $59.40 | $3.45 | 5.8% |
| annual+ppp:band-b | 99 × 0.70 | $69.30 | $3.95 | 5.7% |
| annual+ppp:band-b+between_jobs | 99 × 0.70 × 0.60 | $41.58 | $2.56 | 6.2% |
| annual+ppp:band-a | 99 × 0.50 | $49.50 | $2.96 | 6.0% |
| annual+ppp:band-a+between_jobs | 99 × 0.50 × 0.60 | $29.70 | $1.97 | 6.6% |
| lifetime | list | $139.00 | $7.43 | 5.3% |
| lifetime+between_jobs | 139 × 0.60 | $83.40 | $4.65 | 5.6% |
| lifetime+ppp:band-b | 139 × 0.70 | $97.30 | $5.35 | 5.5% |
| lifetime+ppp:band-b+between_jobs | 139 × 0.70 × 0.60 | $58.38 | $3.40 | 5.8% |
| lifetime+ppp:band-a | 139 × 0.50 | $69.50 | $3.96 | 5.7% |
| lifetime+ppp:band-a+between_jobs | 139 × 0.50 × 0.60 | $41.70 | $2.57 | 6.2% |

The lowest payable price is $29.70 (Annual, band A, between jobs), which is above the $10 floor. The band checks:
Monthly $12 ≤ $15. Annual $99 ≤ $120, and ≤ 10 × $12 = $120. Lifetime $139 ≤ 1.5 × $99 = $148.50. The server computes
each price as `round(list × (1 − band) × (1 − between_jobs), 2)` from this file and never accepts a price from the
browser.

## Refund, and keeping your price

**30-day refund, no questions asked**, on the first purchase of any tier. You get back the full amount you paid. This is
the generous end of the market: Josh Comeau [E46] and Epic [E39] give 30 days. GreatFrontEnd [E1] and BFE.dev [E13]
refund nothing. **Keep your price:** if prices rise, an existing buyer's renewal stays at the price they paid
(`grandfathered: true` in `pricing-history.md`, after Scrimba [E24]). A receipt with a unique invoice number lets an
employer training budget or a reskilling grant reimburse the purchase [E1][E15][E48].

## What is not built yet

Today **every paid gate is planned**. None ships yet. The graders, the long plans and the verify URL are CTO bars 16, 8
and 17. The invoice receipt is CFO bar 17. So the paid tiers must not take a live payment until each one has at least 3
shipped gates, each checked against a verified Supabase session rather than localStorage (CTO bar 7, and the go-live
checklist in `payments.md`). The current page says "nothing on the site is locked behind payment". That sentence stays
true for everything Free lists above. Only the new features would be gated, and changing that copy is the CEO's call.

## Why these four numbers

- **Free, $0:** the free audience comes before revenue in every growth curve in the report (roadmap.sh, Frontend Mentor,
  Josh), and our audience on the record is 2,637 combined followers (`experience/analytics.md`, 2026-W42).
- **Monthly, $12:** this sits inside the $6–$15 cluster (BFE $6, roadmap.sh $10, Frontend Mentor $15). It is $3 under
  Frontend Mentor because the buyer has no income, and it is high enough that PayPal's $0.49 fixed fee stays under 10%.
- **Annual, $99:** this is under roadmap.sh's $100 and the $120 of GreatFrontEnd and Frontend Mentor, at 8.25 × monthly
  (Frontend Mentor and BFE use 8×, Master.dev 10×). It stays at $29.70 or more after every stacked discount.
- **Lifetime, $139:** this is 1.4 × annual, under GreatFrontEnd's 1.5× ($180). It is aimed at job-seekers who fear
  another recurring bill (cfo.md Channels: "Lifetime deal").
