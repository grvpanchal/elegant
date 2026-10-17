#!/usr/bin/env python3
"""The CFO's server side of the sandbox payment flow: PayPal Orders v2 against the SANDBOX only.

    python3 .benzene/scripts/paypal_sandbox.py check            # the credentials work and a sandbox order can be created
    python3 .benzene/scripts/paypal_sandbox.py verify ORDER_ID  # a checkout's order, as PayPal records it (status, amount)

The client id is public by design (the site's checkout loads the JS SDK with it); the secret lives only in the daemon's
environment (PAYPAL_CLIENT_ID, PAYPAL_SECRET from .env) and never in a file of the repository. This script talks to
api-m.sandbox.paypal.com and nothing else: it cannot move real money.
"""

from __future__ import annotations

import base64
import json
import os
import sys
import urllib.error
import urllib.request

SANDBOX = "https://api-m.sandbox.paypal.com"


def call(method: str, path: str, *, token: str = "", body: object = None, form: str = "") -> tuple[int, dict]:
    headers = {"User-Agent": "elegant-cfo"}
    data = None
    if form:
        cid, sec = os.environ.get("PAYPAL_CLIENT_ID", ""), os.environ.get("PAYPAL_SECRET", "")
        headers["Authorization"] = "Basic " + base64.b64encode(f"{cid}:{sec}".encode()).decode()
        headers["Content-Type"] = "application/x-www-form-urlencoded"
        data = form.encode()
    else:
        headers["Authorization"] = f"Bearer {token}"
        headers["Content-Type"] = "application/json"
        data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(SANDBOX + path, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=40) as resp:  # noqa: S310 - the sandbox host only
            return resp.status, json.loads(resp.read() or b"{}")
    except urllib.error.HTTPError as exc:
        try:
            return exc.code, json.loads(exc.read() or b"{}")
        except ValueError:
            return exc.code, {}
    except (urllib.error.URLError, TimeoutError) as exc:
        return 0, {"error": str(exc)[:160]}


def token() -> str:
    if not os.environ.get("PAYPAL_CLIENT_ID") or not os.environ.get("PAYPAL_SECRET"):
        print("FAIL paypal.sandbox [credentials] PAYPAL_CLIENT_ID and PAYPAL_SECRET must be in the daemon's environment (.env)")
        sys.exit(1)
    status, data = call("POST", "/v1/oauth2/token", form="grant_type=client_credentials")
    if status != 200 or not data.get("access_token"):
        print(f"FAIL paypal.sandbox [oauth] the sandbox refused the credentials: HTTP {status} {data.get('error_description', '')}"[:200])
        sys.exit(1)
    return data["access_token"]


def check() -> int:
    tok = token()
    order = {"intent": "CAPTURE", "purchase_units": [{"reference_id": "benzene-cfo-check", "description": "Elegant sandbox check",
                                                       "amount": {"currency_code": "USD", "value": "1.00"}}]}
    status, data = call("POST", "/v2/checkout/orders", token=tok, body=order)
    if status not in (200, 201) or data.get("status") != "CREATED":
        print(f"FAIL paypal.sandbox [order] a sandbox order could not be created: HTTP {status} {json.dumps(data)[:200]}")
        return 1
    approve = next((l["href"] for l in data.get("links", []) if l.get("rel") in ("approve", "payer-action")), "")
    print(f"ok paypal.sandbox: credentials valid, order {data['id']} CREATED (sandbox, USD 1.00)"
          + (" with an approval link" if approve else ""))
    return 0


def verify(order_id: str) -> int:
    tok = token()
    status, data = call("GET", f"/v2/checkout/orders/{order_id}", token=tok)
    if status != 200:
        print(f"FAIL paypal.sandbox [verify] order {order_id}: HTTP {status}")
        return 1
    unit = (data.get("purchase_units") or [{}])[0]
    amount = unit.get("amount", {})
    print(json.dumps({"id": data.get("id"), "status": data.get("status"), "amount": amount.get("value"),
                      "currency": amount.get("currency_code"), "description": unit.get("description")}))
    return 0 if data.get("status") in ("COMPLETED", "APPROVED", "CREATED") else 1


def main() -> int:
    if len(sys.argv) >= 2 and sys.argv[1] == "check":
        return check()
    if len(sys.argv) >= 3 and sys.argv[1] == "verify":
        return verify(sys.argv[2])
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
