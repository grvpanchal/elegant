---
name: template-harness
description: 'The Frontend Template Harness Builder: combine the elegant skills (skills/*/SKILL.md) with every template''s
  AGENTS.md and the integrity check, so that ''build a todo app'' comes out the same in every template and in the elegant-opencode
  stability run.'
triggers:
- template
- templates
- AGENTS.md
- todo app
- integrity
- consistency
- stability
- harness
- templates.integrity
- templates.agents
- templates.stability
tools:
- list_workspace_files
- read_workspace_file
- write_workspace_file
stages:
- name: build
  role: coder
  writes: true
  instruction: Read the template's files, then write the change with write_workspace_file.
---

# Frontend Template Harness Builder

The templates under `templates/` (chota-react-redux, -rtk, -saga, -zustand, chota-vue-pinia, chota-angular-ngrx,
chota-wc-saga) are interchangeable shells over one architecture: the atomic layers (`ui/atoms`, `molecules`,
`organisms`, `templates`, `skeletons`), `containers`, `state`, pages. An agent building in any of them must produce the
same todo app (AddTodoForm, FilterGroup, TodoItems; TodoFilters, TodoList, SiteHeader; Layout), driven by the elegant
skills under `skills/` (the source of truth; github.com/grvpanchal/elegant-opencode runs them as a microtask harness).

You keep three checks green (`.benzene/checks/templates.py`):

- **integrity**: every template has every layer and the same todo-app parts per layer (the majority is the reference;
  rename or add the odd one out, e.g. Angular's `ui/templates/Skeleton` must be `Layout` like the others);
- **agents**: every template has `AGENTS.md` with `## Architecture` (the layers and where each kind of file lives, in
  that template's own file conventions), `## Skills` (the `skills/<name>` the template uses: ui-atom, ui-molecule,
  ui-organism, ui-template, ui-skeleton, ui-theme, state-actions, state-reducer, state-selectors, state-store,
  state-crud, server-container, server-page, server-app-shell, and the template's state family: state-saga or the
  RTK slice or Pinia or NgRx), `## Commands` (the template's real `npm run` scripts from its package.json: dev, build,
  test, storybook) and `## Build a todo app` (the crud-list archetype, step by step, naming each file to create and the
  skill it follows);
- **stability**: elegant-opencode's "build a todo app" over N runs on this repo's skills: 0 failures, one tree hash.

## Procedure

1. Run order: read the failing finding; `list_workspace_files templates/<t>/src` and read its package.json before
   writing anything about it. Never guess a script or a path.
2. One template per task when writing AGENTS.md; keep it under 150 lines, link the skills instead of copying them.
3. Never change a dependency version, a test, or a build config unless the finding names it.

Answer with the files you changed and what each check should now say.
