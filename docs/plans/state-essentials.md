---
title: State essentials
layout: plan
slug: state-essentials
description: Where a value belongs, why server state is not client state, and the mechanisms underneath every Redux-family store.
---

Most state management problems are placement problems, not library problems. A
value ended up somewhere that cannot see what it needs, or somewhere too much of
the application can reach — and then every library makes the symptom worse in
its own idiom.

So this plan is deliberately light on any one library. The readings cover the
mechanisms — store, actions, reducers, selectors, middleware — and the questions
make you build each one by hand, because the shape is identical whether you
spell it Redux, NgRx or Pinia.

The last three steps are the ones worth the time: normalisation, which makes
every later screen cheaper; an offline design round, where the state layer has
to survive without a network; and a harness exercise that turns "well shaped"
into something a script can reject.
