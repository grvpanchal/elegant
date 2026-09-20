---
title: How to delegate events in the DOM
layout: question
slug: event-delegation
format: quiz
difficulty: easy
layer: ui
topics: [events, dom]
skill: ui-events
minutes: 7
summary: Use event delegation to handle events efficiently on dynamic lists.
---

In a list of 1000 rows, each row has a Delete button. Where should you attach the click listener for best performance?
{% include quiz.html id="event-delegation-1"
   question="In a list of 1000 rows, each row has a Delete button. Where should you attach the click listener for best performance?"
   options="A|Attach a listener to each Delete button;;B|Attach a listener to the <ul> or <table> container;;C|Attach a listener to the document object;;D|Attach a listener to the window object"
   correct="B"
   explanation="Attaching a listener to each button creates 1000 handlers, wasting memory. Attaching to the container uses event delegation: the bubble event from the button is caught by the container, which can identify the target. Listening on document or window works but is less specific and can cause unnecessary checks; the container is the nearest common ancestor and is the correct delegation target."
%}

Which statement about event delegation is FALSE?
{% include quiz.html id="event-delegation-2"
   question="Which statement about event delegation is FALSE?"
   options="A|It works for dynamically added elements because the listener is on a stable ancestor.;;B|It prevents the default browser action for the event.;;C|It relies on the event bubbling phase.;;D|It reduces the number of event listeners needed."
   correct="B"
   explanation="Event delegation does not prevent the default browser action; you still need to call event.preventDefault() if desired. The other statements are true: delegation works for dynamic elements because the ancestor listener exists, it uses bubbling, and it reduces listener count."
%}

## Related

- Reading: [Events](../ui/events.html) · [DOM](../ui/dom.html)
- Agent Skill: `ui-events`