---
name: sprint-within-capacity
description: 'The COO''s sprint ledger: name the current two-week sprint on the board and plan no office past its capacity,
  sized as Linear sizes a cycle, from the velocity the office has shown.'
triggers:
- sprint
- cycle
- capacity
- velocity
- overload
- defer
- board
- sprint.json
- material.sprint
- verify:sprint
tools:
- list_workspace_files
- read_workspace_file
- write_workspace_file
stages:
- name: plan
  role: writer
  writes: true
  instruction: Read the board's sprint ledger and the offices' cells, size each office's capacity, move every step over
    capacity to the next sprint, and write .benzene/board/sprint.json.
guardrail:
  verifiers:
  - type: command
    name: verify:sprint
    cwd: .
    command:
    - python3
    - .benzene/checks/material.py
    - sprint
    timeout_s: 900.0
    file: null
  judge_rubric: '1. A current sprint is named, with a start and an end two weeks apart.

    2. Every office''s capacity comes from its cells and the velocity it has shown, not from the size of the backlog.

    3. Overflow is deferred to the next sprint by name; no step is dropped and no capacity is raised to make the plan
    fit.'
---

# Sprints within capacity

The bar: `.benzene/board/sprint.json` names a current sprint, and no office has more steps planned in it than its
capacity. `python3 .benzene/checks/material.py sprint` is the check; it must print nothing and exit 0.

## How the competition does it

Linear runs work in **cycles** (two weeks is the most common length) that start and end automatically, and it sizes each
cycle from what the team actually finished: capacity is the **velocity of the last three completed cycles**, and the
rule is *"don't overload cycles"* — unfinished work rolls into the next cycle instead of piling onto this one
(https://linear.app/docs/use-cycles, https://linear.app/method/introduction). An overloaded team does not go faster; it
stalls every plan that waits on it.

## What you produce

One file, `.benzene/board/sprint.json`, in exactly this shape (the check reads `current.key`, then
`sprints[<key>][<office>].steps` and `.capacity`):

```json
{
  "current": {"key": "2026-S21", "start": "2026-10-12", "end": "2026-10-25"},
  "sprints": {
    "2026-S20": {"cto": {"steps": 9, "capacity": 10, "done": 8}, "cmo": {"steps": 5, "capacity": 5, "done": 5}},
    "2026-S21": {"cto": {"steps": 10, "capacity": 10, "done": 0}, "cmo": {"steps": 4, "capacity": 5, "done": 0}},
    "2026-S22": {"cto": {"steps": 3, "capacity": 10, "done": 0, "deferred": 3}}
  }
}
```

1. **Name the sprint.** `current.key` is `YYYY-S<nn>`; `start`/`end` span the board's `sprint_weeks` (2, in
   `benzene-org.yaml`). If today is past the current `end`, close it (keep its row with its `done` counts) and open the
   next one. Never leave `current` empty.
2. **Size capacity per office.** The ceiling is the office's cells times `tasks_per_cell` (5, in
   `benzene-org.yaml`; count cells in `.benzene/offices/<office>/colony.json`). Once an office has three completed
   sprints, capacity is the lower of that ceiling and the mean `done` of its last three — Linear's velocity rule. With
   fewer than three, use the ceiling. Write the number on every row; a row with no `capacity` is not a plan.
3. **Fill in order, defer the rest.** Count the office's open plan steps for this sprint (`steps`). Every step past
   `capacity` moves to the next sprint's row for that office and is counted there as `deferred`; keep the earliest
   steps (those others depend on) in the current sprint.
4. **Check.** Run the check; fix every `FAIL material.sprint` line it prints before you finish.

## Never

- Raise a capacity, or shrink a `steps` count without moving the steps, to make the check pass.
- Drop a step: deferred work goes to the next sprint by name.
- Edit any file but `.benzene/board/sprint.json`.
