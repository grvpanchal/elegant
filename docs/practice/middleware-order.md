---
title: What order does middleware run in?
layout: question
slug: middleware-order
format: quiz
difficulty: medium
layer: state
topics: [middleware, store, actions]
skill: state-middleware
minutes: 10
summary: Four questions on the middleware chain — the part of a Redux store that is a pipeline, not a switch.
---

Middleware is the only part of a Redux store that is not a pure function of
state and action, which is exactly why its ordering surprises people.

{% include quiz.html id="middleware-order-1"
   question="With applyMiddleware(logger, thunk), in what order does an action pass through them?"
   options="A|thunk then logger, because thunk is closer to the store;;B|logger then thunk, then the reducer, then back out through thunk and logger;;C|Both run in parallel;;D|Only the last one runs"
   correct="B"
   explanation="Middleware composes like an onion: an action travels inward in declaration order to the reducer, then control unwinds back outward in reverse. That is why a logger placed first sees the raw action and one placed last sees whatever earlier middleware turned it into." %}

{% include quiz.html id="middleware-order-2"
   question="Your logger is declared before thunk and prints '[object Function]' for every async action. Why?"
   options="A|The logger is broken;;B|Thunks are not actions;;C|The logger sits outside thunk, so it sees the function before thunk has a chance to call it;;D|Redux serialises actions before logging"
   correct="C"
   explanation="A thunk dispatches a function, and thunk middleware is what turns it into real actions. Anything declared before thunk sees the function; anything after sees the plain objects it eventually dispatches. Move the logger after thunk and it prints the actions you expected." %}

{% include quiz.html id="middleware-order-3"
   question="What does a middleware that forgets to call next(action) do?"
   options="A|Nothing, next() is optional;;B|Swallows the action: the reducer never sees it and no later middleware runs;;C|Causes an infinite loop;;D|Dispatches the action twice"
   correct="B"
   explanation="next is the rest of the chain. Not calling it stops the action dead — which is occasionally what you want (a rate limiter, a feature gate) and is otherwise a bug whose symptom is a UI that silently does nothing." %}

{% include quiz.html id="middleware-order-4"
   question="Inside middleware, when should you call store.dispatch(action) instead of next(action)?"
   options="A|They are interchangeable;;B|dispatch restarts the action at the top of the chain; next passes it on. Use dispatch only for a NEW action, never to forward the current one;;C|dispatch is faster;;D|next is deprecated"
   correct="B"
   explanation="Forwarding the current action with store.dispatch sends it back through every middleware including this one, which is the standard way to write an accidental infinite loop. Use next to forward, dispatch to emit something new." %}

## Related

- Reading: [Middleware](../state/middleware.html) · [Store](../state/store.html) · [Actions](../state/actions.html)
- Playbook: [State management](../playbooks/state-management.html)
- Agent Skill: `state-middleware`
