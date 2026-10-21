# Sandbox Payment Flow

We use the PayPal Sandbox environment (`api-m.sandbox.paypal.com`) for all payment testing. No live funds are processed.

## Flow

The canonical implementation lives in `.benzene/scripts/paypal_sandbox.py`. The flow is:

1. **Authenticate** — `get_oauth_token()` reads `PAYPAL_CLIENT_ID` and `PAYPAL_SECRET` from the daemon's environment (never from a file), then POSTs to `https://api-m.sandbox.paypal.com/v1/oauth2/token` with `grant_type=client_credentials` and `Content-Type: application/x-www-form-urlencoded`. The response yields an OAuth 2.0 `access_token`.

2. **Create order** — `create_order(access_token)` POSTs to `https://api-m.sandbox.paypal.com/v2/checkout/orders` with:
   - `Authorization: Bearer <access_token>`
   - `Content-Type: application/json`
   - Body: `{"intent": "CAPTURE", "purchase_units": [{"amount": {"currency_code": "USD", "value": "1.00"}}]}`

3. **Assert status** — the script asserts `order["status"] == "CREATED"` before returning. If the status is anything else, the script raises an `AssertionError`.

4. **Output** — the full order JSON is printed to stdout for inspection.

The script does **not** simulate capture, refund, or dispute. It only creates a USD 1.00 CAPTURE order and verifies its status is `CREATED`.

## Ledger

Transactions are recorded in `ledger.jsonl`, one JSON object per line. Each row has exactly these fields:

| Field | Type | Description |
|---|---|---|
| `date` | string (ISO 8601 UTC) | When the event was recorded |
| `order_id` | string | PayPal order ID |
| `sku` | string | Pricing tier SKU (e.g. `monthly`, `annual`, `annual+between_jobs`, `lifetime`) |
| `gross` | number | Gross amount in USD |
| `fee` | number | PayPal processing fee in USD |
| `net` | number | Net amount after fee in USD |
| `currency` | string | ISO 4217 currency code (`USD`) |
| `event` | string | One of `capture`, `refund`, `dispute` |

Never a buyer's name or email.

## Server-side changes before go-live

Before the site takes live payments, the checkout flow moves server-side:

- **Order creation and capture** move into a Supabase Edge Function (`supabase/functions/paypal-orders`), not the browser. The server sets the price and creates and captures each order.
- **Webhook verification** — PayPal webhooks are verified (signature, payload) and de-duplicated before a capture is trusted.
- **Capture trust** — a capture is trusted only once its status, amount, currency and buyer have been verified against PayPal's records.
- **Secrets** — live PayPal REST credentials exist only as Supabase function secrets, never in this repository. `python3 .benzene/checks/site.py secrets` must report no finding.
- **Ledger privacy** — the live ledger moves to a private Supabase table. Only monthly aggregates (`metrics.jsonl`) go into the repo. The sandbox ledger stays here because sandbox buyers are test accounts.

## Go-live checklist

- `finance/go-live.md` exists with dated sandbox evidence: at least one PayPal-wallet purchase from an `sb-...@personal.example.com` buyer, at least one card purchase, and at least one refund that shows in the ledger.
- `go-live.md` carries the CEO's dated sign-off and the go-live date.
- Until go-live, `paypal.env` in `docs/_config.yml` stays `sandbox`, and no file references `api-m.paypal.com` or `www.paypal.com/web-sdk` (only `api-m.sandbox.paypal.com`).
- The approve-cfo-prices ticket is done.
- `python3 .benzene/checks/material.py checkout` passes.
