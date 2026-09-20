---
title: Event Propagation Phases
layout: question
slug: quiz-event-propagation
format: quiz
difficulty: medium
layer: ui
topics: [events, dom, component]
skill: ui-events
minutes: 8
summary: Identify the correct order of event propagation phases and related behavior.
---

{% include quiz.html id="quiz-event-propagation-1"
   question="In the DOM event flow, what is the correct order of phases when an event is dispatched from a nested element?"
   options="A|Target → Capturing → Bubbling;;B|Capturing → Target → Bubbling;;C|Bubbling → Target → Capturing;;D|Capturing → Bubbling → Target"
   correct="B"
   explanation="The event first travels down from the window to the target (capturing phase), then reaches the target element (target phase), and finally bubbles up from the target to the window (bubbling phase). Options A, C, and D reverse or skip phases." %}

{% include quiz.html id="quiz-event-propagation-2"
   question="Which statement correctly describes the difference between event.stopPropagation() and event.preventDefault()?"
   options="A|stopPropagation prevents the default action; preventDefault stops the event from bubbling;;B|stopPropagation stops the event from bubbling; preventDefault prevents the default action;;C|Both methods stop the event from bubbling and prevent the default action;;D|Both methods allow the event to bubble but stop default actions on parent elements"
   correct="B"
   explanation="stopPropagation halts further propagation (capturing or bubbling) of the event through the DOM. preventDefault cancels the browser’s default behavior associated with the event (e.g., form submission) but does not affect propagation. Options A, C, and D swap or conflate the two." %}

{% include quiz.html id="quiz-event-propagation-3"
   question="You have a <ul> with many <li> items. You attach a single click listener to the <ul> to handle clicks on any <li>. This pattern is known as:"
   options="A|Event capturing;;B|Event bubbling;;C|Event delegation;;D|Event isolation"
   correct="C"
   explanation="By listening on a common ancestor and using the event.target to determine which <li> was clicked, you are employing event delegation. This leverages bubbling so the ancestor receives the event. Options A and D are not standard terms, and B describes the mechanism but not the pattern." %}

## Related

- Reading: [Events](../ui/events.html) · [DOM](../ui/dom.html) · [Component](../ui/component.html)
- Agent Skill: `ui-events`