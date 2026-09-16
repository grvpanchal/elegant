---
name: fix-site-health
description: Repair site-health defects on the training site — missing front matter, broken internal links, images with no alt text, skipped heading levels.
triggers: [front matter, broken link, alt text, heading, health.front_matter, health.internal_links, health.alt_text, health.heading_order, accessibility fix, site health]
tools: [list_workspace_files, read_workspace_file, write_workspace_file]
guardrail:
  required_patterns: ["Confidence:"]
  max_chars: 10000
  # Verifiers are inherited from the manifest on purpose. A skill that declares
  # its own `verifiers:` REPLACES the manifest's list (GuardrailSpec.merged uses
  # exclude_unset), which would drop the site-wide `verify:capabilities` and
  # leave bza with nothing to discover work from.
---
You repair defects the site's own checker has already found and named. The
report gives you the file and the rule. Fix exactly those files and nothing
else — an unrelated edit in the same task is how a small fix becomes a
regression.

## Procedure

1. Read the failure report you were given. It names files and rules.
2. `read_workspace_file` each file **in full** before editing it.
3. `write_workspace_file` the complete corrected file. The tool replaces the
   file, so you must write back everything you read, with only the defect
   changed.
4. Answer with one line per file: the path and what you changed.

## The four defects

**Missing front matter** (`health.front_matter`) — every page needs `title:`
and `layout:` at the very top, between two `---` lines, before anything else.
Derive the title from the page's first heading. Use `layout: doc` for a page
under `docs/ui/`, `docs/server/` or `docs/state/`, and `layout: default`
elsewhere. Do not change a `layout:` that is already there.

**Broken internal link** (`health.internal_links`) — the target does not
exist. `list_workspace_files` the directory the link points into and find what
the author meant. Links between pages use the built `.html` extension
(`../ui/atom.html`), not `.md`. If nothing plausible exists, remove the link
and keep its text — never invent a page, and never create one to satisfy a
link.

**Image with no alt text** (`health.alt_text`) — add an `alt` attribute to the
`<img>` tag, or text inside the `![]()` brackets. Describe what the image
shows and why it is on the page, in under 125 characters. A decorative image
takes `alt=""` — but the checker counts that as missing, so only use it after
saying in your answer why the image carries no information.

**Skipped heading level** (`health.heading_order`) — a `##` followed by a
`####`. Promote the deeper heading; never demote the shallower one, which
changes the page outline.

## Rules

- Change only what the report names. Do not reformat, reflow or "improve" the
  surrounding text.
- Never edit a file under `docs/_data/` — those are generated.
- Never create a new page to satisfy a broken link.
- If a fix is not obvious from the file itself, say so in your answer and leave
  the file alone rather than guessing.

## Answer format, always

- One `Fixed: <path> — <what changed>` line per file.
- `Confidence: <low|medium|high>` as the last line.
