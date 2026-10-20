# Projection: the first twelve months (initial, 2026-10-17)

**Every number in this file is SIMULATED** unless it carries a source. No sale has been recorded: `ledger.jsonl` is empty
and no sandbox capture has been verified yet. The prices are the **target** proposal in `pricing.md`, which waits for the
CEO's approval. The CFO office replaces each SIMULATED row with the real one from `ledger.jsonl` and `metrics.jsonl` as
months close.

## Assumptions

| # | Assumption | Value | Label | Basis |
|---|---|---|---|---|
| A1 | Window | M1 = 2026-11 to M12 = 2027-10 | SIMULATED | starts the month after this proposal |
| A2 | Live payments | from M3 (2027-01). M1 and M2 are sandbox only and earn nothing | SIMULATED | needs the go-live checklist in `payments.md`, including at least 3 shipped gates per paid tier |
| A3 | New registered accounts | 100 in M1, then +20% each month | SIMULATED | the site's account count is not on the record. The audience on the record is 2,637 combined followers (source `experience/analytics.md`, 2026-W42) |
| A4 | Paying share of registered | 0.4% in M3, 0.6% in M4, 0.8% in M5, 1.0% from M6 | target, after Scrimba ≈1% (source [E25]) and Frontend Mentor "fewer than one percent" (source [E23]) | cfo.md bar 15: paying/registered ≥ 1% from month 6 |
| A5 | Who the paying users are | 40% hold a Monthly pass in a given month. 60% hold Annual or Lifetime, split 2:1 | SIMULATED | no record. Lifetime fits buyers who fear a recurring bill (cfo.md Channels) |
| A6 | Monthly price | $12 per pass, no discount applies | target (`pricing.md`) | |
| A7 | Realised Annual and Lifetime price | 75% of list: $74.25 Annual, $104.25 Lifetime | SIMULATED | assumed mix: 45% at list, 40% between jobs (× 0.60), 7.5% band A (× 0.50), 7.5% band A + between jobs (× 0.30) |
| A8 | Churn | Annual and Lifetime holders stay for the whole window. Annual renewals fall in M15 or later, outside it. Monthly passes are counted as bought in each month they are held | SIMULATED | |
| A9 | PayPal fees | 3.49% + $0.49 per capture, plus 1.50% on half of captures, so 4.24% + $0.49 | source [E74] for the rates, SIMULATED for the half-international mix | |
| A10 | Refunds | 3.5% of gross. PayPal is assumed to keep its fee on a refunded sale | SIMULATED, after Frontend Mentor's launch rate (source [E20]) | target cap ≤ 5% (cfo.md bar 8) |
| A11 | Fixed costs | $110 a month: $100 model spend plus $10 domain, email and other costs | SIMULATED (`business-model.md`, Costs) | GitHub Pages and the Supabase free plan are assumed to cost $0 (assumption) |
| A12 | Not modelled | coder CLI runs, sales tax or VAT, chargebacks, team sales, sponsorship, affiliates | not on the record | |

Revenue is counted on a cash basis, in the month of capture. "Paying" is the number of active paying users at the end of
the month: Monthly pass holders plus every Annual and Lifetime holder so far. Counts are rounded to whole people.

## Twelve months

All amounts in USD. **Every row is SIMULATED.**

| Month | Label | New sign-ups | Registered | Paying share | Paying | Monthly passes | New Annual | New Lifetime | Gross USD | Fees USD | Refunds USD | Net USD | Fixed USD | Result USD | Cumulative USD |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M1 2026-11 | SIMULATED | 100 | 100 | sandbox only | 0 | 0 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | 110 | -110.00 | -110.00 |
| M2 2026-12 | SIMULATED | 120 | 220 | sandbox only | 0 | 0 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | 110 | -110.00 | -220.00 |
| M3 2027-01 | SIMULATED | 144 | 364 | 0.4% | 1 | 0 | 1 | 0 | 74.25 | 3.64 | 2.60 | 68.01 | 110 | -41.99 | -261.99 |
| M4 2027-02 | SIMULATED | 173 | 537 | 0.6% | 3 | 1 | 1 | 0 | 86.25 | 4.64 | 3.02 | 78.59 | 110 | -31.41 | -293.39 |
| M5 2027-03 | SIMULATED | 207 | 744 | 0.8% | 6 | 2 | 1 | 1 | 202.50 | 10.55 | 7.09 | 184.87 | 110 | 74.87 | -218.53 |
| M6 2027-04 | SIMULATED | 249 | 993 | 1.0% | 10 | 4 | 1 | 1 | 226.50 | 12.54 | 7.93 | 206.03 | 110 | 96.03 | -122.50 |
| M7 2027-05 | SIMULATED | 299 | 1,292 | 1.0% | 13 | 5 | 1 | 1 | 238.50 | 13.54 | 8.35 | 216.61 | 110 | 106.61 | -15.89 |
| M8 2027-06 | SIMULATED | 358 | 1,650 | 1.0% | 16 | 6 | 1 | 1 | 250.50 | 14.54 | 8.77 | 227.19 | 110 | 117.19 | 101.30 |
| M9 2027-07 | SIMULATED | 430 | 2,080 | 1.0% | 21 | 8 | 2 | 1 | 348.75 | 20.18 | 12.21 | 316.37 | 110 | 206.37 | 307.67 |
| M10 2027-08 | SIMULATED | 516 | 2,596 | 1.0% | 26 | 10 | 2 | 1 | 372.75 | 22.17 | 13.05 | 337.53 | 110 | 227.53 | 535.20 |
| M11 2027-09 | SIMULATED | 619 | 3,215 | 1.0% | 32 | 13 | 2 | 1 | 408.75 | 25.17 | 14.31 | 369.27 | 110 | 259.27 | 794.47 |
| M12 2027-10 | SIMULATED | 743 | 3,958 | 1.0% | 40 | 16 | 3 | 2 | 623.25 | 36.72 | 21.81 | 564.72 | 110 | 454.72 | 1,249.19 |
| **Total** | SIMULATED | 3,958 | | | 40 at M12 | | 14 | 8 | 2,832.00 | 163.69 | 99.12 | 2,569.19 | 1,320 | 1,249.19 | |

Fees come to 5.8% of gross over the year (SIMULATED), under the 6% target of cfo.md bar 15. That holds only because
Annual and Lifetime carry most of the revenue. A year made only of $12 passes would pay 8.3% in fees (SIMULATED, at the
blended rate).

## Break-even

- **Monthly break-even, M5 (2027-03), SIMULATED.** This is the first month in which net revenue ($184.87, SIMULATED)
  covers the $110 fixed month (SIMULATED). It needs 6 paying users out of 744 registered.
- **Cumulative break-even, M8 (2027-06), SIMULATED.** By this month the $293.39 dug by M4 (SIMULATED) is paid back,
  and the cumulative result reaches +$101.30 (SIMULATED). The year ends at +$1,249.19 (SIMULATED).
- **The break-even rule.** One fixed month of $110 (SIMULATED) is covered by about 11 Monthly passes, 2 Annual sales at
  the blended price, or 2 Lifetime sales (SIMULATED; net per sale is in `business-model.md`).
- **Sensitivity, half the paying share** (0.5% from M6, SIMULATED). Monthly break-even moves to M9, and the cumulative
  result is still -$82.21 at M12 (SIMULATED): no cumulative break-even inside the year. Conversion is the variable that
  decides the year. Price matters much less, because every SKU already sits at or above the $10 fee floor (target).
- **What would break it.** A go-live later than M3 shifts every paying row by the same number of months. Model spend
  above the config ceiling (SIMULATED $92 to $110.50) raises the bar one-for-one. A refund rate above 5% (target cap)
  needs a look at what buyers expected the gates to be.
- **What is real today.** $0 revenue (source: the empty `ledger.jsonl`), no capture, no registered-account count on the record. The first real row will
  come from `ledger.jsonl` once a sandbox capture is verified. Real money arrives only after `finance/go-live.md` exists.
