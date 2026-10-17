---
name: feedback-log
description: 'Keep the feedback log: every piece of feedback from the channels and the site, its source and its response,
  so nothing is left unanswered.'
triggers:
- feedback
- comment
- reply
- response
- complaint
- material.feedback-log
tools:
- list_workspace_files
- read_workspace_file
- write_workspace_file
stages:
- name: log
  role: primary
  writes: true
  instruction: Update the log with what the instruction and the record say, then write it.
---

# Feedback log

`.benzene/material/experience/feedback-log.md` has `## Sources` (the channels feedback arrives on: GitHub issues,
LinkedIn, Instagram, X, YouTube comments, the site) and `## Responses`: a table
`| date | source | feedback | response | status |`, one row per item, the feedback paraphrased in a line (never a
person's name or handle), the response proposed (a person sends it), status open | answered | shipped.

Read the CXO's analytics snapshot for comment counts and the GitHub issues of the repository when the instruction gives
them; never invent feedback. An item older than 30 days without a response is the first thing you write about.
