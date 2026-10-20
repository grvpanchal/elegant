---
name: analytics-report
description: Read the week's analytics snapshot (Upload-Post for Instagram, Facebook, the LinkedIn page, X and YouTube; ConnectSafely
  for personal LinkedIn) and write what it says and what the COO should do about it.
triggers:
- analytics
- metrics
- followers
- audience
- snapshot
- report
- material.analytics
- material.analytics-report
tools:
- list_workspace_files
- read_workspace_file
- write_workspace_file
stages:
- name: report
  role: primary
  writes: true
  instruction: Read the snapshot JSON and analytics.md, then write the report.
---

# Analytics report

The snapshot is taken by the instrument (`.benzene/scripts/analytics.py`, read-only) into
`.benzene/material/experience/analytics/<YYYY-Www>.json` and summarised in `analytics.md`. You read it and write
`.benzene/material/experience/analytics-report.md`:

```yaml
week: <the snapshot's week, e.g. 2026-W42>
combined_audience: <the snapshot's number>
source: .benzene/material/experience/analytics/<week>.json
```

Sections: `## Audience` (the combined audience against the 5,000 threshold at which feedback steers the product, and
the trend against last week's snapshot), `## Channels` (one line per channel with its numbers), `## What changed`
(only what the numbers show), `## Suggestion` (one concrete suggestion for the COO, written as `SUGGEST COO: ...`).
Never a number that is not in a snapshot; never a person's name or comment text.
