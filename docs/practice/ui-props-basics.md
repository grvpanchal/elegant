---
title: Validating Prop Usage
layout: question
slug: ui-props-basics
format: quiz
difficulty: easy
layer: ui
topics: [props]
skill: ui-props
minutes: 7
summary: Quick checks on how to correctly declare and pass props in React and Vue.
---

Which of the following is a valid way to pass a callback prop to a child component in React?
{% include quiz.html id="ui-props-basics-1"
   question="Which of the following is a valid way to pass a callback prop to a child component in React?"
   options="A|onClick={handleClick};;B|onClick={handleClick()};;C|onClick=\"handleClick\";;D|onClick={=> handleClick}"
   correct="A"
   explanation="Option B invokes handleClick immediately, passing its return value (likely undefined) as the prop. Option C passes a string instead of a function. Option D has invalid arrow syntax (missing parentheses). Only A correctly passes the function reference."
 %}

In Vue 3, how do you declare a prop that is required and of type String?
{% include quiz.html id="ui-props-basics-2"
   question="In Vue 3, how do you declare a prop that is required and of type String?"
   options="A|props: { name: String };;B|props: { name: { type: String, required: true } };;C|props: ['name'];;D|props: { name: { required: true, validator: (v) => typeof v === 'string' } }"
   correct="B"
   explanation="Option A lacks the required flag, making the prop optional. Option C only declares the prop as an optional string without requiring it. Option D uses a validator to check the type but does not set required: true, so the prop remains optional. Only B explicitly sets both type and required."
 %}

## Related

- Reading: [Props](../ui/props.html) · [Component](../ui/component.html)
- Agent Skill: `ui-props`