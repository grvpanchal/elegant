---
name: payments
description: 'The CFO''s sandbox payment flow: PayPal Orders v2 in the sandbox, verified server-side, the ledger and the go-live
  gate.'
triggers:
- paypal
- payment
- checkout
- order
- sandbox
- ledger
- go-live
- verify:paypal-sandbox
tools:
- list_workspace_files
- read_workspace_file
- write_workspace_file
stages:
- name: write
  role: primary
  writes: true
  instruction: Write the payments file or ledger rows the instruction asks for.
---

# Payments (sandbox)

The checkout on the site uses the PayPal JS SDK with the sandbox client id (the CTO owns the page). Your side:

- `.benzene/scripts/paypal_sandbox.py check` must pass: the sandbox credentials work and an order can be created;
  `verify <order id>` reads an order as PayPal records it. The secret lives only in the daemon's environment.
- `.benzene/material/finance/ledger.jsonl`: one row per sandbox capture, refund or dispute
  `{date, order_id, sku, gross, fee, net, currency, event}`; never a buyer's name or email.
- `.benzene/material/finance/payments.md`: how the flow works today (client-side create in the sandbox), what moves
  server-side before go-live (create and capture in a Supabase Edge Function, webhook verification), and the go-live
  checklist. `finance/go-live.md` is written only by a person, with dated sandbox evidence.

Never a live PayPal host, never a secret in a file.
