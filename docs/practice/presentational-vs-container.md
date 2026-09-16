---
title: Presentational vs container components
layout: question
slug: presentational-vs-container
format: quiz
difficulty: easy
layer: ui
topics: [component, props]
skill: ui-props
minutes: 5
summary: The split between a component that renders and a component that fetches, and what React 19 changed about defaults.
---

Which of the following best describes a presentational component?
{% include quiz.html id="presentational-vs-container-1"
   question="Which of the following best describes a presentational component?"
   options="A|It manages state and interacts with Redux;;B|It focuses on how things look and receives data via props;;C|It is connected to the store using connect();;D|It contains lifecycle methods for data fetching"
   correct="B"
   explanation="Presentational components are concerned with UI and get data through props; they do not manage state or interact with Redux directly. Options A, C, and D describe container concerns."
 %}

In React 19, a function component declares `function Badge({ tone = "info" })` and the parent passes `tone={undefined}`. What happens?
{% include quiz.html id="presentational-vs-container-2"
   question="In React 19, a function component declares `function Badge({ tone = \"info\" })` and the parent passes `tone={undefined}`. What does the component receive?"
   options="A|undefined — default parameters only apply when the prop is absent;;B|&quot;info&quot; — a JavaScript default parameter applies whenever the argument is undefined, whether the prop was omitted or explicitly passed as undefined;;C|An error, because defaultProps is required;;D|null"
   correct="B"
   explanation="This is plain JavaScript destructuring, not a React feature: a default parameter fills in for `undefined`, and `tone={undefined}` is indistinguishable from omitting the prop. It matters because React 19 removed `defaultProps` on function components — the old `Badge.defaultProps = { tone: \"info\" }` is now ignored with a warning, and every template in this repository uses default parameter values instead. Note that `tone={null}` is NOT undefined, so it bypasses the default and arrives as null." %}

## Related

- Reading: [Component](../ui/component.html) · [Props](../ui/props.html)
- Agent Skill: `ui-props`