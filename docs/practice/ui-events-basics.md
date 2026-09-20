---
title: Handling DOM Events
layout: question
slug: ui-events-basics
format: quiz
difficulty: easy
layer: ui
topics: [events]
skill: ui-events
minutes: 8
summary: Quick checks on attaching and handling DOM events in React and Vue.
---

In React, how do you prevent the default form submission when handling a submit event?
{% include quiz.html id="ui-events-basics-1"
   question="In React, how do you prevent the default form submission when handling a submit event?"
   options="A|return false;;B|event.preventDefault();;C|event.stopPropagation();;D|setDefaultPrevented(true)"
   correct="B"
   explanation="Option A only works in inline HTML handlers, not in React. Option C stops propagation but does not prevent the default action. Option D is not a standard method. Only B correctly calls the preventDefault method on the event object."
 %}

In Vue 3, how do you emit a custom event named 'submit' with a payload from a component?
{% include quiz.html id="ui-events-basics-2"
   question="In Vue 3, how do you emit a custom event named 'submit' with a payload from a component?"
   options="A|this.$emit('submit', payload);;B|this.$trigger('submit', payload);;C|emit('submit', payload);;D|this.$dispatch('submit', payload)"
   correct="A"
   explanation="Option B uses a non-existent method. Option C is the composition API function emit, which requires setup and is not available in the Options API without importing. Option D is from Vue 1.x. Only A correctly uses the instance method $emit to trigger a custom event with an optional payload."
 %}

## Related

- Reading: [Events](../ui/events.html) · [Component](../ui/component.html)
- Agent Skill: `ui-events`