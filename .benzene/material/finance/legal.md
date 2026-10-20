# Legal: entity, licence, terms and privacy (initial, 2026-10-17)

This file sets out what the CFO office found in the repository, and what has to exist before the site takes a single live
payment. It is not legal advice. Every "needs advice" item below is a question for a qualified person in the seller's
country, and the CEO decides who that person is.

## Entity

- **On the record:** there is no company. `docs/_config.yml` names the author as **Gaurav Panchal**
  (`author.name`, `author.url: https://elegantfrontend.training`). The skills are published from the GitHub repo
  `grvpanchal/elegant`. `package.json` has an empty `author`. No company name, registration number or seller address
  appears in any repository file.
- **What PayPal sees today:** sandbox accounts only. The merchant is the sandbox business account
  (`sb-…@business.example.com`, cfo.md [E70]), and no real seller exists yet.
- **Before go-live, the CEO decides** whether the seller is the person or a registered entity. The live PayPal business
  account, the name on the receipt and the "sold by" line on the terms page all need to name the same seller.
- **Tax (needs advice):** PayPal processes the payment but is not a merchant of record. Paddle sells as merchant of record
  and handles tax (cfo.md [E76]); PayPal does not, so with PayPal the seller is responsible for any sales tax or VAT on
  digital services sold into each buyer's country. Josh Comeau states "Price shown in USD, excluding sales tax" (cfo.md
  [E44]). This has not been researched for our case, and it is a go-live blocker.

## Licence

- **The repository's licence is ISC**, declared in the root `package.json` (`"license": "ISC"`). There is **no `LICENSE`
  file** at the repository root, so the ISC text and its copyright line are not in the repo. Recommendation for the CTO:
  add a root `LICENSE` with the ISC text and the copyright holder the CEO names.
- **Templates:** `chota-angular-ngrx`, `chota-vue-pinia` and `chota-wc-saga` declare **MIT** in their own `package.json`.
  `templates/chota-wc-saga/LICENSE` is an MIT licence, "Copyright (c) 2024 app-shell". The React templates declare
  nothing.
- **Content:** the terminology docs, the courses, the questions and the book (`docs/assets/book/elegant-frontend.pdf`)
  have no separate content licence. Today the ISC declaration in `package.json` is the only licence statement covering
  them, and ISC is a software licence. The CEO should decide whether prose and the book stay under ISC or get a content
  licence. patterns.dev uses CC BY-NC 4.0 (cto.md).
- **What a paid tier licenses:** a **service**, not the content. The repo is public, so everything under `docs/` can be
  read and reused under its licence whether anyone pays or not. A paid tier gives one person (`licence: individual`, one
  verified Supabase account) access to the graders, the verified certificates, the long plans as tracked on the
  dashboard, and the receipt, for the term of the SKU. The terms of sale must say this plainly, so that nobody believes
  they are buying exclusive content.

## Terms and privacy

**Must exist before a live payment** (none exists today: `docs/` has no terms, privacy or refund page):

1. **Terms of sale page**, linked from `/pricing/` and from the checkout. It must cover:
   - who sells;
   - what each tier gives, as listed in `pricing.md`;
   - what is not built yet;
   - that Monthly is a 30-day pass that does **not** renew automatically;
   - that Annual runs 12 months and Lifetime has no expiry while the site runs;
   - that prices are in USD, and the tax position;
   - that the between-jobs price is self-declared;
   - that regional prices are locked to the buyer's PayPal account country;
   - the "keep your price" promise;
   - how to get a receipt for reimbursement;
   - contact.
2. **Refund policy**, on the terms page and on `/pricing/`:
   - a **30-day refund on the first purchase of any tier, unconditional**, of the full amount paid (`refund_days: 30` in
     `pricing.md`; after Josh Comeau and Epic, cfo.md [E46][E39]);
   - requested by email or from the account page, quoting the order ID;
   - paid back to the PayPal account that paid;
   - the entitlement ends when the refund is captured;
   - a renewal or a second purchase of the same tier within 30 days is refundable at the CEO's discretion.

   Every refund is recorded in the ledger as a `refund` event. The office watches a trailing 90-day refund rate, with a
   target of 5% or less (cfo.md bar 8).
3. **Privacy policy**, linked from every page footer. It must state exactly what the site stores today:

| Where | What | Who can read it |
|---|---|---|
| Browser `localStorage` | `elegant.accounts.v1` (device profiles: a typed name), `elegant.progress.v1` (progress keys with the ISO time each was marked done), `elegant.playground.v1` (workspace code), `elegant.purchases.v1<namespace>` (sandbox receipts: order ID, capture ID, status, tier, amount, and the **payer's name** as PayPal returns it) | only that browser |
| Supabase Auth | email address, the password (hashed by Supabase), session tokens | the project owner. Row-level security keeps each user to their own rows |
| Supabase `public.progress` | `user_id, slug, done, updated_at` (from `supabase/migrations/0001_progress.sql`) | the owner of each row only (RLS) |
| PayPal | the buyer's PayPal account details. The browser receives PayPal's capture response, with order ID, capture ID, status, amount and the Orders v2 `payer` object (name, and in the schema also email address and country, cfo.md [E67]). `pricing.js` keeps only the name | PayPal, and the CFO office through the sandbox script |
| Google Analytics | page views by measurement ID `G-R8YKPS191K`, loaded on every page through `_includes/head-custom.html` | Google, and the project owner |
| `.benzene/material/finance/ledger.jsonl` | `date, order_id, sku, gross, fee, net, currency, event`. Never a name or email | **anyone**, because the repository is public |

**Fixes to make before go-live:**

- **The ledger must not be public once money is real.** In a public repo, a live order ID plus a SKU such as
  `annual+between_jobs` plus a country would publish that a buyer declared they were between jobs. The live ledger
  belongs in a private Supabase table written by the Edge Function. Only monthly aggregates (`metrics.jsonl`:
  registered, paying, mrr, gross, refunds, fees) go into the repo. The sandbox ledger can stay here because sandbox
  buyers are test accounts.
- **Stop keeping the payer's name in the browser receipt.** `pricing.js` stores `payer` in localStorage. The receipt
  needs the order ID and the invoice number, not a name.
- **Analytics consent (needs advice).** Google Analytics is loaded unconditionally. Whether a consent banner is required
  depends on where visitors are and on who the seller is.
- **Email delivery.** The built-in Supabase mailer reaches only the project team and is rate-limited. Custom SMTP must be
  set up before real learners sign up (`supabase/README.md`), because purchase receipts and refund confirmations depend
  on it.
- **Deletion.** The privacy policy must say how to delete an account. `public.progress` rows cascade on user deletion
  (`on delete cascade`). Entitlement and private-ledger rows must keep the money record a tax authority may require,
  without the person: the retention period needs advice.
