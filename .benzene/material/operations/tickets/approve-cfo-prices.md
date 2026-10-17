---
title: Approve or reject the CFO's proposed prices
owner: ceo
status: todo
office: cfo
created: 2026-10-17
unblocks:
  - 'Prices for Monthly, Annual and Lifetime inside the market band, with a between-jobs discount of at least 40%'
  - 'Live payments, once the sandbox go-live gate is passed'
acceptance:
  - '.benzene/material/finance/pricing.md exists, and python3 .benzene/checks/material.py pricing prints "ok material.pricing".'
  - 'Under ## Decision, the CEO records approved or rejected, the date, and the approved price_usd for each paid tier. A rejection includes the feedback the CFO reworks from.'
  - 'Under ## Decision, the CEO records whether existing buyers keep their price when it later changes (grandfathering).'
  - 'After the CTO mirrors the approved prices into docs/_data/pricing.yml, python3 .benzene/checks/material.py pricing-sync prints "ok material.pricing-sync", and no paid tier on /pricing/ says "Price to be set".'
---

# Approve or reject the CFO's proposed prices

Today, `docs/_data/pricing.yml` lists Pro (per year) and Lifetime at `price_usd: 0`, so `/pricing/` shows "Price to be set". The CFO office's charter says: "A price change is the CEO's decision: propose it, never apply it alone."

The CFO's proposal will be in `.benzene/material/finance/pricing.md`. It had not been written by 2026-10-17. Its YAML front matter is checked against the band that the research found (`.benzene/standards/cfo.md`, bars 1–8). The proposal must have:

- **Tiers:** exactly `free`, `monthly`, `annual` and `lifetime` (`team` is optional). Each tier has `price_usd`, `billing` and `licence`.
- **Market band:** monthly at most $15. Annual at most $120 and at most 10 × monthly. Lifetime at most 1.5 × annual. These are the band's targets, set by Frontend Mentor ($15 / $120), roadmap.sh ($10 / $100) and GreatFrontEnd ($120 annual, $180 lifetime).
- **Between-jobs discount:** at least 40%, applying to annual.
- **Fee floor:** every payable price is at least $10 after every discount, so that PayPal's fee stays at or under 10%.
- **Refund:** 30 days on the first purchase.
- **What each tier offers:** at least 3 `gates` on every paid tier, and at least 3 `includes` on the free tier.

## Why only a person can do this

Prices are a business decision with legal weight: what learners are charged, the refund promise, and whether existing buyers keep their price. The organisation's offices can propose prices, but only the CEO can set them.

## Steps

1. Wait for the CFO's proposal. It arrives in the finance room with Approve and Reject buttons.
2. From the repository root, run `python3 .benzene/checks/material.py pricing`. It must print `ok material.pricing`.
3. Read the prices, the between-jobs discount, the refund days, and each tier's gates and includes. Free must stay the whole site.
4. Decide whether existing buyers keep their price when it later changes (cfo.md bar 16).
5. Approve or reject in the room, and record the decision below.

## Decision

- Approved or rejected:
- Date:
- Monthly `price_usd`:
- Annual `price_usd`:
- Lifetime `price_usd`:
- Do existing buyers keep their price (grandfathered)?
- Feedback (if rejected):

## After

The CTO's training-site cell copies the approved prices into `docs/_data/pricing.yml`. It does not invent any price. `pricing-sync` must then print `ok`. Checkout stays in the PayPal sandbox until [the go-live decision](decide-paypal-go-live.md) is made.
