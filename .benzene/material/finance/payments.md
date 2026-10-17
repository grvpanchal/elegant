# Payments: the PayPal sandbox flow and the go-live gate (initial, 2026-10-17)

**Sandbox only.** No live PayPal host appears anywhere in this office's files. The client ID is public by design. The
secret (`PAYPAL_SECRET`) lives only in the daemon's environment and never in a file. `finance/go-live.md` is written
only by a person, and only with dated sandbox evidence (see the checklist at the end).

## How the flow works today

The CTO owns the page; the CFO office owns verification and the ledger.

1. **The page.** `docs/pricing/index.html` renders the tiers from `docs/_data/pricing.yml`, and the PayPal settings from
   `paypal:` in `docs/_config.yml` (`env: sandbox`, a sandbox `client_id`, `currency: USD`). Today's tiers are Free,
   Pro (yearly) and Lifetime, with every paid price `0` ("Price to be set"). The tiers proposed in `pricing.md` are not
   mirrored yet.
2. **The SDK, loaded only when a paid tier is chosen.** `docs/assets/js/pricing.js` injects the **v5 JS SDK** from
   `https://www.paypal.com/sdk/js?client-id=<sandbox client id>&currency=USD&intent=capture&components=buttons`.
   PayPal documents this URL for v5, and the sandbox client ID is what makes it the sandbox (cfo.md [E63]). The SDK is
   not vendored. `pricing.js` refuses to start checkout unless `env` is `sandbox`. PayPal still supports v5 but
   recommends v6 for new work (cfo.md [E60]); the move to v6 belongs with the server-side work below.
3. **The order is created in the browser.** `createOrder` calls `actions.order.create` with `intent: "CAPTURE"` and one
   purchase unit:
   - `reference_id` is the tier slug;
   - `amount` is the tier's `sandbox_amount_usd`, a test amount (`1.00` and `2.00`), not a price;
   - `custom_id` is the Supabase user ID when the learner is signed in with a verified account. A device profile's ID is
     not sent.
4. **Capture also happens in the browser.** `onApprove` calls `actions.order.capture()`. The receipt is written to
   `localStorage` under `elegant.purchases.v1<namespace>` with `verified: false`, and it holds the order ID, capture
   ID, status, amount and payer name. It unlocks nothing, and nothing is gated today.
5. **The server side is the CFO office's**, through `.benzene/scripts/paypal_sandbox.py`. It talks only to
   `https://api-m.sandbox.paypal.com` and takes `PAYPAL_CLIENT_ID` and `PAYPAL_SECRET` from the daemon's environment:
   - `check` gets an OAuth token (`grant_type=client_credentials`), creates a USD 1.00 `CAPTURE` order and passes if
     PayPal answers `CREATED`. This proves the credentials work. The order is left uncaptured.
   - `verify <order id>` reads the order as PayPal records it and prints `id`, `status`, `amount`, `currency` and
     `description`.
6. **Recording a sandbox capture.** A CFO cell does the following:
   1. Take the order ID from a receipt.
   2. Run `verify`.
   3. Record a row only if `status` is `COMPLETED` **and** the amount and currency equal what the SKU should have cost.
      `verify` also exits 0 for `CREATED` and `APPROVED`, so the exit code is not enough: read the status.
   4. Append one line to `ledger.jsonl` (see Ledger).

### What is wrong with today's flow (acceptable in the sandbox, not for money)

- **The browser chooses the price.** Any learner can edit the amount before PayPal sees it. cfo.md bar 11 forbids
  `actions.order.create` and `purchase_units` under `docs/` for go-live. The report could not find browser-only order
  creation on any current PayPal page (cfo.md, Unverified), and PayPal's own guidance is "Set up your server to call the
  Orders v2 API instead of making calls directly from the browser" ([E66]).
- **`verify` does not check ownership or price.** It does not compare `custom_id` with a user, it does not compare the
  amount with a SKU, and it does not print the capture ID or the fee. Proposed change to the script: print
  `purchase_units[0].custom_id`, `payments.captures[0].id`, and `seller_receivable_breakdown.paypal_fee` and `net_amount`
  (Orders v2 schema, [E67]; confirm the field names on the first sandbox capture). Until it prints them, the ledger's
  `fee` and `net` are left `null` rather than estimated.
- **There are no webhooks yet**, so a refund or dispute made in the PayPal dashboard is invisible to the site.

## What moves server-side before go-live

These steps follow cfo.md "The PayPal integration standard for a static site" and bars 10 to 15. GitHub Pages cannot
hold a secret, so the server is a set of **Supabase Edge Functions**.

1. **`supabase/functions/paypal-orders`: create.**
   - The browser POSTs `{sku}` with its Supabase session. The function verifies the session, then looks up the price
     **server-side** from the proposal in `pricing.md`: `round(list × (1 − band) × (1 − between_jobs), 2)`.
   - It calls `POST /v2/checkout/orders` with `intent: "CAPTURE"`, `custom_id = user.id`, a unique `invoice_id` (the
     receipt number) and a `PayPal-Request-Id` for idempotency ([E67]).
2. **`paypal-orders`: capture.**
   - The browser POSTs the order ID. Before capturing, the function reads the approved order and checks:
     - the order's `custom_id` equals the caller;
     - for a `+ppp:` SKU, the payer's country is in that band. If it is not, the function does not capture and offers
       the list price (`region_locked: true`).
   - It then calls `POST /v2/checkout/orders/{id}/capture` and asserts, before any write:
     - `status === "COMPLETED"`;
     - an exact `amount.value` and `currency_code` match for the SKU;
     - `custom_id === user.id`.
   - Only then does it insert the entitlement rows (one per gate the SKU unlocks) and a private ledger row.
   - The tests must include at least 3 named `tamper*`: wrong amount, wrong currency, and another user's order
     (bar 12).
3. **`supabase/functions/paypal-webhook`.**
   - Verify every event, either with `POST /v1/notifications/verify-webhook-signature` or with CRC32 self-verification.
     Both use the `paypal-transmission-id`, `-time` and `-sig` headers and `paypal-cert-url` ([E72]).
   - De-duplicate on the event `id`. PayPal retries up to 25 times over 3 days ([E71]).
   - Handle:
     - `PAYMENT.CAPTURE.COMPLETED` (reconcile);
     - `PAYMENT.CAPTURE.PENDING` and `DENIED`;
     - `PAYMENT.CAPTURE.REFUNDED` and `REVERSED` (revoke the entitlement);
     - `CUSTOMER.DISPUTE.CREATED` (flag).
   - Add `BILLING.SUBSCRIPTION.*` only when Monthly gains auto-renewal ([E73]).
4. **Secrets.**
   - Set `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` and `PAYPAL_WEBHOOK_ID` with `supabase secrets set` and read them
     with `Deno.env.get(...)`.
   - Local values go in `supabase/functions/.env`, never committed ([E77]).
   - The root `.gitignore` has `.env` today. cfo.md bar 10 also wants the exact line `supabase/functions/.env`.
5. **Tables, with RLS.**
   - `entitlements (user_id, entitlement, sku, order_id, invoice_id, granted_at, revoked_at)`: the owner may select, and
     no browser may insert or update.
   - A private `ledger` table holds live money rows. Live rows never go into the public repo's `ledger.jsonl` (see
     `legal.md`).
6. **The site, a CTO change.**
   - `pricing.js` calls the function for create and capture. `actions.order.create`, `purchase_units` and
     `/v2/checkout/orders` disappear from `docs/`.
   - The page reads entitlements from a verified session, not from localStorage.
   - `pricing.yml` mirrors `pricing.md` (`material.py pricing-sync`).
7. **Monthly.** At first, Monthly is a one-time Orders v2 SKU: a 30-day pass with no renewal. PayPal Subscriptions
   (`intent=subscription`, `vault=true`, [E63]) come later and need their own webhook events.

## Ledger

`.benzene/material/finance/ledger.jsonl` holds one JSON object per line, one per sandbox **capture**, **refund** or
**dispute**:

```json
{"date": "YYYY-MM-DD", "order_id": "…", "sku": "annual+between_jobs", "gross": "59.40", "fee": null, "net": null, "currency": "USD", "event": "capture"}
```

- The required fields are `date, order_id, sku, gross, fee, net, currency, event`. `event` is one of `capture`,
  `refund` or `dispute`.
- A refund row carries a negative `gross` and `net`.
- cfo.md bars 15 and 17 add `capture_id`, `invoice_id` and `country`. Add them once `verify` prints them; none of them is
  personal data.
- **Never** a buyer's name, email or PayPal payer ID.
- Only a `COMPLETED` order verified by `paypal_sandbox.py verify` becomes a `capture` row. No `invoice_id` may appear
  twice.
- **Today the ledger is empty.** No sandbox capture has been verified and recorded yet.

## Go-live checklist

Each item must be true, with the date it became true, before `finance/go-live.md` is written by a person. Until then,
no live host is referenced anywhere in the repo (cfo.md bar 14).

1. [ ] **The prices are approved by the CEO.** `pricing-history.md` has the row marked approved, and
   `docs/_data/pricing.yml` mirrors `pricing.md` (`python3 .benzene/checks/material.py pricing-sync` prints ok).
2. [ ] **Every paid tier ships at least 3 gates.** Each has `planned` false and an entitlement checked against a
   verified Supabase session (cto.md bar 7). Today it is 0 of 4 gates shipped.
3. [ ] **`paypal-orders` creates and captures server-side.** All the strings required by bar 11 are present, and
   `deno test supabase/functions/paypal-orders/` passes at least 3 `tamper*` tests (bar 12).
4. [ ] **`paypal-webhook` is verified, handles the 4 money events and de-duplicates.** A replay test proves that one
   event makes one row (bar 13).
5. [ ] **No secret anywhere.** The bar 10 greps over `docs/`, `docs/_site/` and git history print nothing, and
   `.gitignore` has `supabase/functions/.env`.
6. [ ] **No browser order creation.** `! grep -rIE 'v2/checkout/orders|purchase_units|actions\.order\.create' docs/`
   finds nothing. No browser code writes entitlements.
7. [ ] **Dated sandbox evidence:**
   - at least 1 PayPal-wallet purchase by a `sb-…@personal.example.com` buyer;
   - at least 1 card purchase (from PayPal's card generator);
   - at least 1 refund that appears in `ledger.jsonl` as a `refund` row and revokes the entitlement through the webhook.

   Each is verified with `paypal_sandbox.py verify` and recorded in the ledger (bar 14).
8. [ ] **The PPP lock is tested in the sandbox.** A band-A SKU paid by a sandbox buyer from a non-band country is not
   captured.
9. [ ] **The pricing page states the terms.** It says `30-day` refund, "keep your price" and a reimbursement line, and
   it links the terms of sale and the privacy policy (bars 8, 16 and 17, and `legal.md`).
10. [ ] **The seller and tax position are settled.** The seller is named on the live PayPal business account and on the
    receipt, and the tax position is written down (`legal.md`, Entity).
11. [ ] **The live ledger is private.** Live money rows go to the Supabase `ledger` table. Only monthly aggregates go to
    `metrics.jsonl` in the repo.
12. [ ] **Live credentials are only in Supabase secrets.** The REST base and the SDK switch to PayPal's live hosts in
    the same reviewed change. That change is made only after `go-live.md` exists, and the live REST host is taken from
    PayPal's documentation at that time (cfo.md lists it as Unverified).
13. [ ] **The monitors are in place:**
    - trailing 90-day refunds/captures ≤ 5%;
    - fees/gross ≤ 6%;
    - no duplicate `invoice_id` (bars 8, 15 and 17).
