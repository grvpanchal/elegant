---
name: traction
description: 'The CIO''s traction record: stars, downloads and subscribers as {value, source, date}, checked against the live
  APIs.'
triggers:
- traction
- stars
- downloads
- subscribers
- listing
- scores
- material.traction
tools:
- list_workspace_files
- read_workspace_file
- write_workspace_file
- fetch_url
stages:
- name: record
  role: primary
  writes: true
  instruction: Fetch the live numbers and write traction.json (and listing.md or scores.md when asked).
---

# Traction

`.benzene/material/investors/traction.json`:

```json
{"github_stars": {"value": <n>, "source": "https://api.github.com/repos/grvpanchal/elegant", "date": "YYYY-MM-DD"},
 "npm_downloads_last_month": {"value": <n>, "source": "https://api.npmjs.org/downloads/point/last-month/elegant", "date": "YYYY-MM-DD"},
 "newsletter_subscribers": {"value": <n>, "source": ".benzene/material/experience/analytics.md", "date": "YYYY-MM-DD"}}
```

`fetch_url` the two APIs and copy their numbers exactly; the subscribers come from the CXO's snapshot. Also keep
`listing.md` (`## One line`, `## Stage`, `## Traction`, `## Raising`, `## Links`) and `scores.md` (the leverage scores:
code, media, capital, labour, each with how it is measured) current from the same record.
