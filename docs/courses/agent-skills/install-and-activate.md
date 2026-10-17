---
title: "Install a skill and let paths activate it"
layout: lesson
course: agent-skills
slug: install-and-activate
term: state/reducer
skill: state-reducer
practice: counter-reducer
description: "Install the site's skills into a coding agent, see which one a file path surfaces, and grade the agent's reducer with the bank's own tests."
insight: "A skill you installed but the agent never loaded changed nothing. Paths decide which skills are candidates for the file being edited; the bank's tests decide whether the result was right."
---

## Install it

Every term page with a matching skill shows the same box, "Agent Skill
Available", with one command and a download link. For reducers:

```bash
npx skills add grvpanchal/elegant --skill state-reducer
```

That works with any Agent-Skills-compatible runtime. The alternative is to
download the `SKILL.md` and copy the folder into your agent's skills directory —
for Claude Code, `~/.claude/skills/state-reducer/SKILL.md`. Keep the folder name
equal to the `name` in the frontmatter.

## Which skill loads for which file

The skills README is explicit: the agent loads a `SKILL.md` when its `paths`
match the file you are editing. Here are the globs `state-reducer` declares:

```yaml
paths:
  - "**/state/**/*.{js,ts}"
  - "**/store/**/*.{js,ts}"
  - "**/reducers/**/*.{js,ts}"
  - "**/*Reducer*.{js,ts}"
  - "**/*slice*.{js,ts}"
```

In `templates/chota-react-redux` a feature's reducer lives at
`src/state/todo/todo.reducer.js`, beside `todo.actions.js` and
`todo.selectors.js`. It matches the first glob. So does every file in that
folder — and `state-store` and `state-operations` declare the same
`**/state/**` pattern. Editing one reducer can surface three state skills. That
is fine: paths make skills *candidates*; each description says which one
applies.

The reverse case is the one that bites. If your project keeps reducers
somewhere none of those globs reach, the skill never surfaces on its own. Name
it in the prompt instead.

## What the skill encodes

The [Reducer]({{ '/state/reducer.html' | relative_url }}) doc calls reducers the
"laws of physics" of your state: given the same state and action, you always
get the same result. The skill turns that into three principles — pure
functions (no API calls, no `Date.now()`, no `Math.random()`), immutable
updates, and returning current state for unknown actions. Purity is what makes
the next step possible: a reducer can be graded by a script, with no browser and
no network.

## Drive an agent, grade it with the bank

The counter-reducer question asks for `increment`, `decrement` and `reset`,
returning a new object every time. Its workspace `tests.js` default-exports
`async (subject) => [{ name, pass, message }]` and runs unchanged in the
browser playground and under Node, so "solved" means the same in both. Two of
its checks are "the state argument is never mutated" and "a change returns a
NEW object".

Copy `starter.js` and `tests.js` from `docs/practice/workspace/counter-reducer/`
into a scratch folder with a `package.json` of `{"type": "module"}`, ask your
agent to implement the starter using the `state-reducer` skill, then grade it:

```js
// run.mjs — node run.mjs
import tests from "./tests.js";
import * as subject from "./starter.js";
for (const r of await tests(subject)) {
  console.log(r.pass ? "PASS" : "FAIL", r.name, r.message ?? "");
}
```

Paste every `FAIL` line back to the agent verbatim — the named defect, not
"try again" — and count the rounds until it is all `PASS`.
