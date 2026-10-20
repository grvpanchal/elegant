---
name: pricing
description: 'The CFO''s pricing and business model: four tiers inside the market band, a between-jobs discount, a 30-day
  refund, and the model and projection behind them.'
triggers:
- pricing
- price
- tier
- discount
- refund
- business model
- projection
- material.pricing
- material.finance-docs
tools:
- list_workspace_files
- read_workspace_file
- write_workspace_file
stages:
- name: model
  role: primary
  writes: true
  instruction: Write the pricing, business model or projection file the instruction names.
---

# Pricing and the business model

`.benzene/material/finance/pricing.md` front matter is what the site renders (the CTO mirrors it into
docs/_data/pricing.yml):

```yaml
tiers:
  - {id: free, price_usd: 0, billing: none, licence: individual, includes: [...]}      # at least 3 includes
  - {id: monthly, price_usd: <= 15, billing: monthly, licence: individual, gates: [...]}   # at least 3 gates
  - {id: annual, price_usd: <= 120 and <= 10 x monthly, billing: yearly, licence: individual, gates: [...]}
  - {id: lifetime, price_usd: <= 1.5 x annual, billing: once, licence: individual, gates: [...]}
discounts:
  between_jobs: {percent: >= 40, applies_to: [annual, lifetime], how: self-declared}
ppp: {bands: [...], applies_to: [annual, lifetime], region_locked: true}
refund_days: 30
```

Every payable price stays at or above $10 after the discount (PayPal's fee floor). The body explains each tier for a
developer who just lost their job. `business-model.md` (`## Who pays`, `## For what`, `## Billing unit`, `## Costs`)
and `projection.md` (`## Assumptions`, `## Twelve months`, `## Break-even`) label every figure that is not on the record
SIMULATED or target. Prices are a decision for the CEO: file it as a COO ticket when the instruction asks to change them.
