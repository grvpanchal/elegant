---
title: Setting Default Values for Props
layout: question
slug: props-defaults
format: quiz
difficulty: easy
layer: ui
topics: [props]
skill: ui-props
minutes: 7
summary: Quick checks on how to provide default values for component props in React and Vue.
---

In React and Vue, components can declare default values for props so that the parent does not have to pass every prop explicitly. Understanding the exact rules prevents bugs where a parent unintentionally overrides a default.

{% include quiz.html id="props-defaults-1"
   question="In React 19, how do you give a function component's `size` prop a default of `&quot;medium&quot;`?"
   options="A|function MyComp({ size = &quot;medium&quot; }) { ... };;B|MyComp.defaultProps = { size: &quot;medium&quot; };;C|Both are valid in React 19;;D|Only class components can have defaults"
   correct="A"
   explanation="React 19 removed support for `defaultProps` on function components — the static property is ignored and React warns about it — so B silently does nothing and C is the trap. A default parameter is now the only way, and it is the pattern every chota-* template in this repository uses. Class components still honour defaultProps, which is why D is also wrong."
 %}

{% include quiz.html id="props-defaults-2"
   question="In Vue 3, which option correctly sets a default value of `10` for a prop named `max`?"
   options="A|props: { max: { default: 10 } };;B|props: { max: { value: 10 } };;C|props: { max: 10 };;D|props: { max: { required: true, default: 10 } }"
   correct="A"
   explanation="Option A follows the Vue prop declaration syntax where the default option specifies the fallback. Option B uses a non‑existent `value` key. Option C is a shorthand that only accepts a type or an object, not a plain value for a default. Option D marks the prop as required; when required is true, Vue ignores the default value, so the prop must always be provided."
 %}

{% include quiz.html id="props-defaults-3"
   question="Which statement about prop default values is true across React and Vue?"
   options="A|Default values are only used when the parent passes undefined.;;B|Default values are used when the parent passes null.;;C|In React, default values are ignored if the prop is an empty string.;;D|In Vue, default values must be primitive types."
   correct="A"
   explanation="In both libraries, the default is applied only when the prop value is exactly `undefined` (i.e., the parent omitted the prop). Passing `null` is a deliberate value, so the default is not used (making B wrong). An empty string is a valid string value, so React does not substitute the default (making C wrong). Vue allows any value as a default, including objects, arrays, or functions that return a fresh value, so D is wrong."
 %}

## Related

- Reading: [Props](../ui/props.html) · [Component](../ui/component.html)
- Agent Skill: `ui-props`