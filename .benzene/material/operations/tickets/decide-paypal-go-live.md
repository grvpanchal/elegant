---
title: Decide when the PayPal sandbox checkout goes live
owner: ceo
status: todo
office: cfo
created: 2026-10-17
unblocks:
  - 'Live payments, once the sandbox go-live gate is passed'
acceptance:
  - '.benzene/material/finance/go-live.md exists and holds dated sandbox evidence: at least one PayPal-wallet purchase from a sb-...@personal.example.com buyer, at least one card purchase, and at least one refund that shows in the ledger.'
  - 'go-live.md carries the CEO''s dated sign-off and the go-live date. Until that date, paypal.env in docs/_config.yml stays sandbox, and no file references api-m.paypal.com or www.paypal.com/web-sdk.'
  - 'The approve-cfo-prices ticket is done.'
  - 'Live PayPal REST credentials exist only as Supabase function secrets, and python3 .benzene/checks/site.py secrets reports no finding.'
---

# Decide when the PayPal sandbox checkout goes live

Today, `/pricing/` runs checkout in **PayPal's sandbox**:

- `docs/_config.yml` sets `paypal.env: sandbox`, and `pricing.js` refuses to load checkout in any other mode.
- Orders are sandbox test orders, and no real money moves.
- Nothing on the site is gated on payment.

The CFO's bar 14 (`.benzene/standards/cfo.md`) keeps every live PayPal host out of the repository until `finance/go-live.md` exists with signed sandbox evidence. `python3 .benzene/checks/material.py checkout` enforces this.

The research also sets what has to be true before real money moves:

- the server sets the price and creates and captures each order, in `supabase/functions/paypal-orders` (bar 11);
- a capture is trusted only once its status, amount, currency and buyer have been verified (bar 12);
- webhooks are verified and de-duplicated (bar 13);
- the prices are approved ([ticket](approve-cfo-prices.md)).

## Why only a person can do this

- A live PayPal business account is opened in the CEO's legal name, with PayPal's identity checks and terms.
- Its live REST credentials are secrets, which only a person may handle.
- After go-live, real money moves, with refund and dispute liability.

None of these steps can be delegated to an office.

## Steps

1. Ask the CFO for `go-live.md`, with its sandbox evidence: the wallet purchase, the card purchase and the refund, each dated and shown in the ledger.
2. Check that the server-side order, capture and webhook functions exist and pass their tests (bars 11–13).
3. Open or confirm the live PayPal business account. Create a live REST app, and store its client id and secret as Supabase function secrets, never in this repository.
4. Choose the go-live date, or write "not yet" and the condition you are waiting for. Sign `go-live.md` and record the decision below.

## Decision

- Go live (date), or not yet (condition):
- Date signed:

## After

On the go-live date, the CTO and CFO switch `paypal.env`, point checkout at the server functions, and update the checkout check, which asserts `sandbox` today. In the same change, the pricing page drops its sandbox note. A waitlist page for the paid tiers goes up at least 30 days before the go-live date (coo.md bar 14).
