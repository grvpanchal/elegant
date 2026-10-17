#!/usr/bin/env python3
"""The CXO's weekly analytics snapshot, read-only, from Upload-Post (Instagram, Facebook, LinkedIn page, X, YouTube) and
ConnectSafely (personal LinkedIn). Google Analytics comes later.

    python3 .benzene/scripts/analytics.py            # writes .benzene/material/experience/analytics/<YYYY-Www>.json and analytics.md
    python3 .benzene/scripts/analytics.py --print    # the snapshot on stdout, nothing written

Keys come from the environment (the daemon loads .env): UPLOAD_POST_API_KEY, CONNECTSAFELY_API_KEY; ANALYTICS_PROFILE is the
Upload-Post profile (default ``elegant``). Only read-only endpoints are called (never upload, comment, react, message,
connect or follow), and only counts are written: no names, no handles of other people, no comment text. The record is
committed to a public repository.
"""

from __future__ import annotations

import datetime as dt
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path.cwd()
OUT = ROOT / ".benzene" / "material" / "experience"
UP = "https://api.upload-post.com"
CS = "https://api.connectsafely.ai/linkedin"
METRICS = {"instagram": ("followers", "reach", "views", "impressions", "profileViews", "likes", "comments", "shares", "saves"),
           "facebook": ("followers", "reach", "impressions", "likes", "comments", "shares"),
           "linkedin": ("followers", "reach", "impressions", "profileViews", "likes", "comments", "shares"),
           "x": ("followers", "impressions", "likes", "comments", "shares"),
           "youtube": ("followers", "views", "likes", "comments", "watch_time_minutes")}


def get(url: str, header: str) -> tuple[int, object]:
    req = urllib.request.Request(url, headers={"Authorization": header, "User-Agent": "elegant-cxo-analytics"})
    try:
        with urllib.request.urlopen(req, timeout=40) as resp:  # noqa: S310 - fixed https hosts
            return resp.status, json.loads(resp.read() or b"null")
    except urllib.error.HTTPError as exc:
        try:
            return exc.code, json.loads(exc.read() or b"null")
        except ValueError:
            return exc.code, None
    except (urllib.error.URLError, TimeoutError, ValueError) as exc:
        return 0, {"error": str(exc)[:160]}


def num(v: object) -> float | int | None:
    if isinstance(v, bool) or v is None:
        return None
    if isinstance(v, (int, float)):
        return int(v) if float(v).is_integer() else round(float(v), 2)
    if isinstance(v, dict):
        return num(v.get("value"))
    return None


def upload_post(snap: dict, errors: list[str]) -> None:
    key = os.environ.get("UPLOAD_POST_API_KEY", "")
    if not key:
        errors.append("upload_post: UPLOAD_POST_API_KEY is not set")
        return
    auth = f"Apikey {key}"
    profile = os.environ.get("ANALYTICS_PROFILE", "elegant")
    status, users = get(f"{UP}/api/uploadposts/users", auth)
    me = next((p for p in (users or {}).get("profiles", []) if p.get("username") == profile), None) if isinstance(users, dict) else None
    if me is None:
        errors.append(f"upload_post: profile {profile!r} not found (HTTP {status})")
        return
    params = {"platforms": ",".join(METRICS)}
    if me.get("facebook_page_id"):
        params["page_id"] = me["facebook_page_id"]
    if me.get("linkedin_page_id"):
        params["page_urn"] = me["linkedin_page_id"]
    status, data = get(f"{UP}/api/analytics/{urllib.parse.quote(profile)}?{urllib.parse.urlencode(params)}", auth)
    out: dict = {}
    for platform, keys in METRICS.items():
        block = (data or {}).get(platform) if isinstance(data, dict) else None
        if not isinstance(block, dict) or block.get("success") is False:
            errors.append(f"upload_post.{platform}: {(block or {}).get('message', 'no data') if isinstance(block, dict) else 'no data'}"[:160])
            out[platform] = {k: None for k in keys}
            continue
        out[platform] = {k: num(block.get(k)) for k in keys}
        out[platform]["metric_type"] = block.get("metric_type")
    status, total = get(f"{UP}/api/uploadposts/total-impressions/{urllib.parse.quote(profile)}?period=last_week", auth)
    out["total_impressions_last_week"] = num((total or {}).get("total_impressions")) if isinstance(total, dict) else None
    snap["upload_post"] = out


def connectsafely(snap: dict, errors: list[str]) -> None:
    key = os.environ.get("CONNECTSAFELY_API_KEY", "")
    if not key:
        errors.append("connectsafely: CONNECTSAFELY_API_KEY is not set")
        return
    auth = f"Bearer {key}"
    status, accounts = get(f"{CS}/accounts", auth)
    acct = next((a for a in accounts if a.get("enabled") and a.get("apiSeatAllocated")), None) if isinstance(accounts, list) else None
    if acct is None:
        errors.append(f"connectsafely: no account with an API seat (HTTP {status})")
        return
    aid = urllib.parse.quote(str(acct["id"]))
    out: dict = {}
    status, dash = get(f"{CS}/analytics/creator/dashboard?accountId={aid}", auth)
    body = dash.get("data", dash) if isinstance(dash, dict) else {}
    for k in ("postImpressions", "totalFollowers", "profileViewers", "searchAppearances"):
        out[k] = num((body or {}).get(k))
    if status != 200:
        errors.append(f"connectsafely.dashboard: HTTP {status}")
    status, conns = get(f"{CS}/analytics/connections/count?accountId={aid}", auth)
    c = conns.get("data", conns) if isinstance(conns, dict) else {}
    out["connections"] = num((c or {}).get("count") if isinstance(c, dict) else None)
    status, net = get(f"{CS}/analytics/network/summary?accountId={aid}", auth)
    n = net.get("data", net) if isinstance(net, dict) else {}
    out["newsletters"] = num((n or {}).get("newsletters") if isinstance(n, dict) else None)
    snap["connectsafely"] = out


def audience(snap: dict) -> int:
    up = snap.get("upload_post") or {}
    total = sum(int((up.get(p) or {}).get("followers") or 0) for p in METRICS)
    return total + int((snap.get("connectsafely") or {}).get("totalFollowers") or 0)


def render(snap: dict) -> str:
    lines = ["---", f"week: {snap['week']}", f"captured_at: {snap['captured_at']}", f"combined_audience: {snap['combined_audience']}",
             "source: Upload-Post and ConnectSafely read-only analytics (.benzene/scripts/analytics.py)", "---", "",
             f"# Analytics {snap['week']}", "", "## Social accounts (Upload-Post)", "", "| platform | followers | reach | impressions | likes | comments | shares |",
             "|---|---|---|---|---|---|---|"]
    for p in METRICS:
        m = (snap.get("upload_post") or {}).get(p) or {}
        lines.append(f"| {p} | {m.get('followers')} | {m.get('reach')} | {m.get('impressions', m.get('views'))} | {m.get('likes')} | "
                     f"{m.get('comments')} | {m.get('shares')} |")
    cs = snap.get("connectsafely") or {}
    lines += ["", "## Personal LinkedIn (ConnectSafely)", "", "| metric | value |", "|---|---|"]
    lines += [f"| {k} | {v} |" for k, v in cs.items()] or ["| no data | |"]
    lines += ["", "## Combined audience", "", f"{snap['combined_audience']} followers across the channels: the CXO's audience "
              "threshold reads this number.", "", "## Errors", ""]
    lines += [f"- {e}" for e in snap["errors"]] or ["- none"]
    return "\n".join(lines) + "\n"


def main() -> int:
    now = dt.datetime.now(dt.timezone.utc)
    year, week, _ = now.isocalendar()
    snap: dict = {"week": f"{year}-W{week:02d}", "captured_at": now.strftime("%Y-%m-%dT%H:%M:%SZ"), "errors": []}
    upload_post(snap, snap["errors"])
    connectsafely(snap, snap["errors"])
    snap["combined_audience"] = audience(snap)
    if "--print" in sys.argv:
        print(json.dumps(snap, indent=1))
        return 0
    (OUT / "analytics").mkdir(parents=True, exist_ok=True)
    (OUT / "analytics" / f"{snap['week']}.json").write_text(json.dumps(snap, indent=1) + "\n", encoding="utf-8")
    (OUT / "analytics.md").write_text(render(snap), encoding="utf-8")
    print(f"analytics {snap['week']}: combined audience {snap['combined_audience']}, {len(snap['errors'])} error(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
