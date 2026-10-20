#!/usr/bin/env python3
"""The template harness: every template is the same architecture, configured for agents, and "build a todo app" is stable.

    python3 .benzene/checks/templates.py integrity      # atomic layout + the same todo-app parts in every template
    python3 .benzene/checks/templates.py agents         # every template's AGENTS.md wires the elegant skills it uses
    python3 .benzene/checks/templates.py stability [N]  # elegant-opencode's "build a todo app", N runs, on this repo's skills

The Frontend Template Harness Builder (a CTO sub-agent) keeps all three green: it combines the elegant skills
(skills/*/SKILL.md) with each template's AGENTS.md and the integrity check, and the stability run proves an agent
following those skills builds the same todo app every time (github.com/grvpanchal/elegant-opencode).
Prints ``FAIL <check> [<rule>] <what>`` per finding and exits 1 when there is any.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path.cwd()
TEMPLATES = ROOT / "templates"
SKILLS = ROOT / "skills"
LAYERS = ("atoms", "molecules", "organisms", "templates", "skeletons")
AGENT_SECTIONS = ("## Architecture", "## Skills", "## Commands", "## Build a todo app")
OPENCODE = Path(os.environ.get("ELEGANT_OPENCODE", Path.home() / ".cache" / "benzene" / "elegant-opencode"))


def templates() -> list[Path]:
    return sorted(p for p in TEMPLATES.iterdir() if p.is_dir() and (p / "package.json").exists())


def ui_root(t: Path) -> Path | None:
    for d in sorted(t.glob("src/**/ui"), key=lambda p: len(p.parts)):
        if "node_modules" not in d.parts and (d / "atoms").is_dir():
            return d
    return None


def parts(layer_dir: Path) -> set[str]:
    out = set()
    for p in layer_dir.iterdir():
        if p.name.startswith((".", "index")) or p.name.endswith((".test.js", ".spec.ts")):
            continue
        out.add(re.split(r"[.]", p.name)[0])
    return out


def integrity() -> int:
    lines, shape = [], {}
    for t in templates():
        ui = ui_root(t)
        if ui is None:
            lines.append(f"FAIL templates.integrity [layout] {t.name}: no src/**/ui/atoms")
            continue
        for layer in LAYERS:
            if not (ui / layer).is_dir():
                lines.append(f"FAIL templates.integrity [layout] {t.name}: no ui/{layer}")
        shape[t.name] = {layer: parts(ui / layer) for layer in LAYERS if (ui / layer).is_dir()}
        if not any((t / "src").rglob("containers")):
            lines.append(f"FAIL templates.integrity [layout] {t.name}: no containers folder")
    if shape:   # the todo app is the same in every template: the majority's parts per layer are the reference
        for layer in LAYERS:
            seen: dict[frozenset, list[str]] = {}
            for name, s in shape.items():
                seen.setdefault(frozenset(s.get(layer, set())), []).append(name)
            ref = max(seen.items(), key=lambda kv: len(kv[1]))[0]
            for key, names in seen.items():
                if key == ref:
                    continue
                for name in names:
                    missing, extra = sorted(ref - key), sorted(key - ref)
                    lines.append(f"FAIL templates.integrity [consistency] {name}/ui/{layer}: "
                                 + (f"missing {', '.join(missing)}" if missing else "") + ("; " if missing and extra else "")
                                 + (f"extra {', '.join(extra)}" if extra else "") + f" (the other templates have {', '.join(sorted(ref))})")
    for line in lines:
        print(line)
    if not lines:
        print(f"ok templates.integrity: {len(shape)} templates, the same todo app in every layer")
    return 1 if lines else 0


def agents() -> int:
    lines = []
    known = {p.name for p in SKILLS.iterdir() if (p / "SKILL.md").exists()} if SKILLS.is_dir() else set()
    for t in templates():
        md = t / "AGENTS.md"
        if not md.exists():
            lines.append(f"FAIL templates.agents [missing] {t.name}: no AGENTS.md (the agent config combining the elegant skills)")
            continue
        text = md.read_text(encoding="utf-8")
        for sec in AGENT_SECTIONS:
            if sec not in text:
                lines.append(f"FAIL templates.agents [section] {t.name}/AGENTS.md: no '{sec}'")
        named = set(re.findall(r"skills/([a-z0-9-]+)", text))
        if len(named) < 8:
            lines.append(f"FAIL templates.agents [skills] {t.name}/AGENTS.md names {len(named)} skills (skills/<name>); wire at least 8")
        for s in sorted(named - known):
            lines.append(f"FAIL templates.agents [unknown-skill] {t.name}/AGENTS.md names skills/{s}, which does not exist")
        scripts = json.loads((t / "package.json").read_text(encoding="utf-8")).get("scripts", {})
        for cmd in ("build", "test"):
            if cmd in scripts and f"npm run {cmd}" not in text and f"npm {cmd}" not in text:
                lines.append(f"FAIL templates.agents [commands] {t.name}/AGENTS.md does not say how to {cmd} (npm run {cmd})")
    for line in lines:
        print(line)
    if not lines:
        print(f"ok templates.agents: every template's AGENTS.md wires the elegant skills")
    return 1 if lines else 0


def stability(n: int) -> int:
    if not (OPENCODE / "test" / "stability.test.js").exists():
        OPENCODE.parent.mkdir(parents=True, exist_ok=True)
        got = subprocess.run(["git", "clone", "-q", "--depth", "1", "https://github.com/grvpanchal/elegant-opencode.git", str(OPENCODE)],
                             capture_output=True, text=True)
        if got.returncode != 0:
            print(f"FAIL templates.stability [setup] cannot fetch elegant-opencode: {got.stderr.strip()[:200]}")
            return 1
    if not (OPENCODE / "node_modules").exists():
        subprocess.run(["npm", "i", "-s", "--no-audit", "--no-fund"], cwd=OPENCODE, capture_output=True, text=True, timeout=600)
    env = {**os.environ, "N": str(n), "ELEGANT_SKILLS_ROOT": str(SKILLS)}
    proc = subprocess.run(["node", "test/stability.test.js"], cwd=OPENCODE, capture_output=True, text=True, env=env, timeout=900)
    out = proc.stdout + proc.stderr
    m = re.search(r"\{.*\}", out, re.S)
    data = json.loads(m.group(0)) if m else {}
    if proc.returncode != 0 or "STABLE" not in out or data.get("failures", 1) != 0 or not data.get("stableTreeAcrossRuns"):
        print(f"FAIL templates.stability [todo-app] build a todo app was not stable over {n} runs on skills/: "
              f"failures {data.get('failures')}, stable {data.get('stableTreeAcrossRuns')}; {out.strip()[-300:]}")
        return 1
    print(f"ok templates.stability: {n} runs, 0 failures, one tree {data.get('treeHash', '')[:12]} ({data.get('perRunFiles')} files)")
    return 0


def main() -> int:
    what = sys.argv[1] if len(sys.argv) > 1 else "integrity"
    if what == "integrity":
        return integrity()
    if what == "agents":
        return agents()
    if what == "stability":
        return stability(int(sys.argv[2]) if len(sys.argv) > 2 else 25)
    print(f"unknown check {what}: integrity | agents | stability [N]")
    return 2


if __name__ == "__main__":
    sys.exit(main())
