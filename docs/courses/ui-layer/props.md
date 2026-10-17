---
title: "Props: the contract going in"
layout: lesson
course: ui-layer
slug: props
term: ui/props
skill: ui-props
practice: props-defaults
description: "Write a component's props like a function signature (read-only, typed, defaulted) so an agent implements the interface you meant, not one it guessed."
insight: "Props are the contract between a component and its users: read-only inputs that flow down, while changes flow back up through callbacks. Write them as a function signature and an agent's component becomes as predictable as a well-typed function."
---

## A signature, not a bag of values

The term doc's analogy is exact: props work like function parameters. The
parent supplies values, the child renders from them, and the child never
changes them. If a child needs a prop to "change", it calls a callback the
parent passed in, the parent updates its own state, and new props arrive on the
next render. Data flows down, events flow up.

The smallest example in the templates is the Loader atom,
`templates/chota-react-redux/src/ui/atoms/Loader/Loader.component.jsx`. It takes
three props, `size`, `width` and `color`, and nothing else. It applies fallbacks
inline (`height: size || "48px"`). That works, but `||` also replaces an empty
string or `0`, while a default parameter only fills a value that is
`undefined`. The difference is small until an agent passes `width={0}`
and gets five pixels.

## Where defaults live now

This is the review catch with the best payoff, because generated code often
copies patterns from older codebases. React 19 removed `defaultProps` on
function components: the static property is ignored, so
`Button.defaultProps = { size: "medium" }` silently does nothing. A default
parameter is the replacement, and the molecule
`templates/chota-react-redux/src/ui/molecules/AddTodoForm/AddTodoForm.component.jsx`
uses one: `buttonInfo = { label: 'Add', variant: 'primary' }`. In Vue the
default sits in the declaration, `props: { max: { default: 10 } }`, and marking
the same prop `required: true` makes Vue ignore the default. In both
frameworks a default applies only when the prop is `undefined`; `null` is a
deliberate value and is passed through.

## The mistakes to look for

The doc names three. **Mutating props** (`user.name = user.name.toUpperCase()`)
breaks one-way data flow; compute a new value instead. **Prop drilling** couples
middle components to data they never read. **Skipping defaults** produces
defensive ternaries on every line. The `ui-props` skill adds naming rules: no
generic names like `data`, `info` or `stuff`; `isDisabled`, not `d`; don't pass
a whole object when two fields would do; keep the count under ten.

## Hand the agent the signature

```text
Props (read-only, never assigned to):
  label: string, required
  variant: 'primary' | 'secondary' = 'primary'
  isDisabled: boolean = false
  onClick: () => void   (the only way to report a change)
Defaults as parameter defaults, not defaultProps.
```

Then check the result:

- Is any prop assigned to, or any object prop mutated in place?
- Is there a `defaultProps` on a function component?
- Is a fallback written with `||` where `0` or `""` is a valid value?
- Are required and optional props obvious from the signature?
- Is any prop named `data` or `info`, or are there more than ten?

The practice quiz tests the three default rules above in under ten minutes.
Callbacks like `onClick` are half of the next lesson.
