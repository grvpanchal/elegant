# Heartbeat — finance material review

Files reviewed and compared against the competition bars; all pass, no changes needed.

## pricing.md
- free $0, monthly $15 (≤ $15), annual $120 (≤ $120 and ≤ 10×$15=$150), lifetime $180 (≤ 1.5×$120=$180).
- between_jobs 40% (≥ 40%) on annual→$72 and lifetime→$108, both ≥ $10 PayPal fee floor.
- refund_days 30 (≥ 30). PPPP bands present, region_locked true.
- Body matches front matter.

## business-model.md
- Sections Who Pays / For What / Billing Unit / Costs all present; every dollar figure labelled SIMULATED or target or assumption. 7/7 sections, 0 unlabelled money figures.

## projection.md
- Sections Assumptions / Twelve Months / Break-Even present; every dollar figure labelled SIMULATED or target or assumption.

## payments.md + ledger.jsonl
- Sandbox flow documented: OAuth token from env, USD 1.00 CAPTURE order, status asserted CREATED.
- ledger.jsonl contains one sandbox capture row (monthly sku, gross 1.00, net 1.00, fee 0.00). Consistent with the documented flow.

Conclusion: all bars confirmed; no price change, no ledger update, no doc edit required. No product work triggered.
