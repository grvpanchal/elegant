---
name: beta-test
description: 'Run a simulated beta test of each CTO change in beta: a persona from the UX model walks through the change''s
  pages and reports what passed and failed.'
triggers:
- beta
- beta test
- persona
- ux
- usability
- change
- material.beta
tools:
- list_workspace_files
- read_workspace_file
- write_workspace_file
stages:
- name: test
  role: primary
  writes: true
  instruction: Read the change's files and the UX model, then write the beta report.
---

# Beta test

For each CTO change in beta or review in `.benzene/changes.json` without a report, write
`.benzene/material/experience/beta/<change id>.md`:

```yaml
change: <id>
title: <the change's title>
persona: <a persona from .benzene/material/experience/ux-model.md, e.g. a laid-off React developer, 6 years in>
tasks: [<the 3 to 5 things that persona tries on the changed pages>]
passed: [<what worked>]
failed: [<what did not, specific>]
severity: none | minor | major | blocker
```

Read the change's files (listed in changes.json) in the worktree path it names, and the page it changes, before
judging; a blocker is something that stops the persona's task. The CEO reads this before the final approval.
