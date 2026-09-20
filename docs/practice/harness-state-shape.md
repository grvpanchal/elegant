---
title: Guardrail a store's shape
layout: question
slug: harness-state-shape
format: harness
difficulty: hard
layer: state
topics: [store, selectors, reducer, state]
skill: state-store
minutes: 50
summary: Encode "this store is well shaped" as a script, then discover which of your rules an agent can satisfy without doing what you meant.
eval:
  rubric:
    - "The checker reports denormalised duplication: the same entity stored under two keys."
    - "The checker reports a component importing the store directly instead of through a selector."
    - "The checker reports a reducer that mutates its state argument, by static detection or by running it."
    - "Every rule is a parse, a count or an execution — none asks a model for an opinion."
    - "The report names a file and a line for every finding."
  threshold: 0.8
---

"Well-shaped store" is the kind of standard that lives in a style guide and
changes nothing. Turn it into a script and it changes the next commit.

Write a checker for a Redux-family store that exits 0 only when every rule
holds, then find out which rules an agent can satisfy while missing the point.

**Rules to encode**

1. **Normalised entities.** No entity type appears under two keys. If
   `state.users.byId` exists, there must be no `state.posts[].author` carrying a
   full user object — only an id.
2. **No direct store reads in components.** A file under `src/ui/` may not
   import from `src/state/` except through `src/state/selectors`. Atoms and
   molecules may not import from `src/state/` at all.
3. **Reducers are pure.** A reducer must not mutate its `state` argument.
   Detect it by running each reducer against a deep-frozen state and catching
   the throw — static detection misses aliasing, and this rule is worth getting
   right.
4. **Every async action has all three states.** For each `_REQUEST` action type
   there is a `_SUCCESS` and a `_FAIL`, and the reducer handles all three.
5. **Selectors are the only place shapes are derived.** No `.filter(`, `.sort(`
   or `.reduce(` over store data inside a component file.

**Then run it.** Point an agent at a store that breaks rules 1, 3 and 4, and let
your checker's output be the only instruction it gets.

## Deliverables

- The checker.
- A fixture store breaking at least three rules.
- A log of the agent's rounds, including anything it did that satisfied a rule
  without fixing the problem.

## Eval

Scored by the rubric above at a threshold of **0.8** — higher than the other
harness exercises because rule 3 has a correct mechanical answer
(`Object.freeze` recursively, run the reducer, catch the `TypeError` in strict
mode) and there is no credit for approximating it.

## How to think about it

Rule 3 is the one to build first, because it is the only rule here that can be
*proved* rather than inferred. Deep-freeze the state, call the reducer, and a
mutation throws. No regex over `state.x =` will ever match a mutation that
happens two function calls away through an alias, and every real mutation bug
looks like that.

Rule 2 is nearly free and catches the architectural drift that matters most:
once a component reads the store directly, the store's shape becomes public API
and you can no longer change it. An import-line parse gets this right in
practice.

Rules 1 and 5 are where you will learn something uncomfortable. Both are
heuristics over a shape you inferred, and both have false positives — a
legitimately embedded value object trips rule 1, a `.filter(` over props trips
rule 5. Watch what the agent does with those: a false positive it cannot fix
correctly is a false positive it will fix *incorrectly*, and the diff will show
you exactly how much your rule was actually measuring.

Rule 4 is the interesting failure. An agent can satisfy "there is a `_FAIL`
case in the reducer" with `case FOO_FAIL: return state;` — the rule passes, the
error is swallowed, and the UI now hangs on a spinner forever. Tightening it
means asserting that the `_FAIL` branch changes something observable, which is
the moment you discover your rule was measuring the presence of a case label
rather than the handling of an error.

## Trade-offs

Running reducers is slower than parsing them and needs the module to be
loadable in isolation, which pushes you toward reducers with no import-time side
effects — a constraint worth having anyway.

Every heuristic rule you add buys coverage and spends trust. A checker with two
rules that are always right changes behaviour; a checker with six rules where
two cry wolf gets an `# noqa` comment and then gets ignored. When a rule's false
positives outnumber its catches, delete it and write a test instead.

## Related

- Reading: [Store](../state/store.html) · [Reducer](../state/reducer.html) · [Selectors](../state/selectors.html)
- Playbook: [The agent harness](../playbooks/agent-harness.html)
- Agent Skill: `state-store`
