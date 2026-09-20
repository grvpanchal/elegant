---
title: Selector Memoization Basics
layout: question
slug: selector-memoization
format: quiz
difficulty: medium
layer: state
topics: [selectors]
skill: state-selectors
minutes: 10
summary: Quick checks on when and why to use memoized selectors in Redux.
---

What is the primary purpose of using reselect's createSelector?
{% include quiz.html id="selector-memoization-1"
   question="What is the primary purpose of using reselect's createSelector?"
   options="A|To automatically persist state to localStorage;;B|To derive computed data from the store while avoiding expensive recalculations;;C|To dispatch actions asynchronously;;D|To bind action creators to component props"
   correct="B"
   explanation="Option A is incorrect because createSelector does not handle persistence; that is done by middleware like redux-persist. Option C is incorrect because async actions are handled by redux-thunk or redux-saga, not selectors. Option D is incorrect because binding action creators is done by connect or useDispatch, not selectors. Option B correctly describes memoization: the selector runs only when its inputs change, preventing expensive recalculations on every state change."
 %}

Which of the following will cause a memoized selector to recompute even if its input selectors return the same references?
{% include quiz.html id="selector-memoization-2"
   question="Which of the following will cause a memoized selector to recompute even if its input selectors return the same references?"
   options="A|The state tree is deeply cloned but leaf values are unchanged;;B|A parent component re-renders due to a context change;;C|The selector's result function is invoked with different arguments;;D|The store is replaced with a new instance but has the same shape"
   correct="A"
   explanation="Option B is incorrect because a context change does not affect selector inputs unless the selector reads from context; selectors typically read from Redux state, not React context. Option C is incorrect because createSelector selectors do not take arguments; they receive the whole state as argument from connect/useSelector. Option D is incorrect because if the store instance changes but the state shape is identical, the input selectors will still return the same state reference (if the store replacement returns the same state object) – but typically a new store instance means a new state reference, so the selector would recompute; however, the question asks about input selectors returning the same references, which would not happen if the store is replaced. Option A is correct: if the state tree is deeply cloned, the input selectors (which typically return references to nested objects) will return new references, causing the memoized selector to recompute even if the leaf values are unchanged."
 %}

## Related

- Reading: [Selectors](../state/selectors.html) · [State Basics](../state/state.html)
- Agent Skill: `state-selectors`