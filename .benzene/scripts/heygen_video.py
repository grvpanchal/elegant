"""Make a video from a brief with HeyGen's Video Agent, and save the MP4 into the workspace.

    python3 .benzene/scripts/heygen_video.py <brief.md> [--orientation landscape|portrait] [--dry-run] [--session <id>]

The brief is markdown: its body is the prompt, sent as written; its front matter names `files` (images inside the
workspace, attached in order) and `out` (where the MP4 goes, `{orientation}` filled in). The key is HEYGEN_API_KEY,
from the environment or the workspace's .env; it is never printed. A run writes `<out>.json` with the session and
video ids, so `--session` picks a long render back up instead of paying for a second one.
"""
import argparse
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
API = "https://api.heygen.com"
TYPES = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".mp4": "video/mp4", ".pdf": "application/pdf"}


def api_key():
    key = os.environ.get("HEYGEN_API_KEY", "").strip()
    env = ROOT / ".env"
    if not key and env.is_file():
        for line in env.read_text(encoding="utf-8").splitlines():
            if line.startswith("HEYGEN_API_KEY="):
                key = line.split("=", 1)[1].strip().strip("'\"")
    if not key:
        sys.exit("no HEYGEN_API_KEY: create one at https://platform.heygen.com/api-keys and add it to the workspace .env")
    return key


def call(method, path, key, body=None):
    req = urllib.request.Request(API + path, method=method, data=None if body is None else json.dumps(body).encode(),
                                 headers={"X-Api-Key": key, "Content-Type": "application/json", "Accept": "application/json"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = json.loads(r.read() or b"{}")
                return data.get("data", data)
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 4:
                time.sleep(int(e.headers.get("Retry-After") or 30))
                continue
            sys.exit(f"{method} {path}: HTTP {e.code}: {e.read().decode(errors='replace')[:400]}")
        except urllib.error.URLError as e:
            if attempt == 4:
                sys.exit(f"{method} {path}: {e.reason}")
            time.sleep(15)


def download(url, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=600) as r, open(dest, "wb") as f:
        while chunk := r.read(1 << 20):
            f.write(chunk)
    return dest


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("brief")
    ap.add_argument("--orientation", choices=("landscape", "portrait"), default="landscape")
    ap.add_argument("--dry-run", action="store_true", help="show what would be sent; no call, no cost")
    ap.add_argument("--session", help="pick up a session already started instead of starting another")
    args = ap.parse_args()

    text = (ROOT / args.brief).read_text(encoding="utf-8") if not Path(args.brief).is_absolute() else Path(args.brief).read_text(encoding="utf-8")
    _, front, prompt = text.split("---\n", 2)
    meta, prompt = yaml.safe_load(front), prompt.strip()
    if not 1 <= len(prompt) <= 10000:
        sys.exit(f"the prompt is {len(prompt)} characters; HeyGen takes 1 to 10,000")
    files = []
    for rel in meta.get("files") or []:
        p = ROOT / rel
        if p.suffix.lower() not in TYPES or not p.is_file():
            sys.exit(f"{rel}: not a png, jpg, mp4 or pdf in the workspace")
        files.append({"type": "base64", "media_type": TYPES[p.suffix.lower()], "data": base64.b64encode(p.read_bytes()).decode()})
    out = ROOT / str(meta.get("out", "brand-intro-{orientation}.mp4")).format(orientation=args.orientation)
    body = {"prompt": prompt, "mode": "generate", "orientation": args.orientation, "files": files[:20], "visibility": "private"}

    if args.dry_run:
        print(f"would POST {API}/v3/video-agents: {len(prompt)}-character prompt, {args.orientation}, "
              f"{len(files)} file(s), {len(json.dumps(body)) / 1e6:.1f} MB; the MP4 would go to {out.relative_to(ROOT)}")
        return

    key = api_key()
    record = out.with_suffix(".json")
    if args.session:
        session_id = args.session
    else:
        started = call("POST", "/v3/video-agents", key, body)
        session_id = started["session_id"]
        record.parent.mkdir(parents=True, exist_ok=True)
        record.write_text(json.dumps({"session_id": session_id, "orientation": args.orientation, "brief": args.brief,
                                      "started": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}, indent=2) + "\n")
        print(f"session {session_id} started; rendering takes about 5 to 10 times the video's length")

    video_id, deadline = None, time.time() + 1800
    while not video_id:
        s = call("GET", f"/v3/video-agents/{session_id}", key)
        video_id = s.get("video_id")
        if s.get("status") == "failed":
            sys.exit(f"session {session_id} failed: {json.dumps(s)[:400]}")
        if not video_id:
            if time.time() > deadline:
                sys.exit(f"no video after 30 minutes; pick it up later with --session {session_id}")
            time.sleep(15)

    deadline = time.time() + 7200
    while True:
        v = call("GET", f"/v3/videos/{video_id}", key)
        if v.get("status") == "completed":
            break
        if v.get("status") == "failed":
            sys.exit(f"video {video_id} failed: {v.get('failure_code')}: {v.get('failure_message')}")
        if time.time() > deadline:
            sys.exit(f"still rendering after 2 hours; pick it up later with --session {session_id}")
        time.sleep(20)

    download(v["video_url"], out)
    saved = [out.relative_to(ROOT).as_posix()]
    for field, suffix in (("thumbnail_url", ".jpg"), ("captioned_video_url", ".captioned.mp4"), ("subtitle_url", ".srt")):
        if v.get(field):
            saved.append(download(v[field], out.with_suffix(suffix)).relative_to(ROOT).as_posix())
    record.write_text(json.dumps({"session_id": session_id, "video_id": video_id, "orientation": args.orientation, "brief": args.brief,
                                  "duration": v.get("duration"), "files": saved,
                                  "finished": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}, indent=2) + "\n")
    print(f"video {video_id}, {v.get('duration')} s: " + ", ".join(saved))


if __name__ == "__main__":
    main()
