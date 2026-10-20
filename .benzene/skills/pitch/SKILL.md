---
name: pitch
description: 'The CIO''s pitch: problem, audience, why now, traction, ask, use of funds, risks and the competition table,
  every number from the record.'
triggers:
- pitch
- investor
- raise
- ask
- use of funds
- why now
- competition
- material.pitch
tools:
- list_workspace_files
- read_workspace_file
- write_workspace_file
- fetch_url
stages:
- name: write
  role: writer
  writes: true
  instruction: Write the pitch from the CIO report and the record.
guardrail:
  decisions:
  - name: not-ai-slop
    type: choice
    reject:
    - ai_slop
    question: 'Is this specific, opinionated material a frontend expert would recognise as grounded (a named term, technique,
      trade-off or failure mode, a concrete example), or generic AI slop: cliches, hedging, advice that could describe any
      topic?'
    criteria:
      ai_slop: cliche-ridden, vague, padded; lists options without committing; could be about any framework; no concrete detail
        an expert would recognise
      genuine: specific and concrete; takes and defends a position; names a real technique, trade-off or failure mode; grounded
        in the UI / Server / State terminology of the site
---

# Pitch

`.benzene/material/investors/pitch.md` front matter `status: draft` (a person sets live) and the sections
`## Problem` (first sentence at most 25 words, in the displaced developer's words), `## For whom` (names the frontend
developer), `## Why now` (at least 3 outside signals from 2025 or later, each with a URL and a date: fetch them),
`## Traction` (every number with its record: a URL or a .benzene path, and an ISO date), `## Ask` (one amount, one count
of seats or backers, a window of at most 35 days), `## Use of funds` (itemised, summing to the ask, Minimum and Stretch),
`## Risks`, `## Competition` (a table of at least 6 competitors with a price, their AI-harness coverage and a URL). Each
section at least 40 words. Read `.benzene/standards/cio.md` for the cases and numbers; never a number that is not there
or on the record.
