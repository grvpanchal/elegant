---
title: Where does an atom stop?
layout: question
slug: atom-boundaries
format: quiz
difficulty: easy
layer: ui
topics: [atom, atomic-design, component]
skill: ui-atom
minutes: 8
summary: Four rapid checks on the boundary between an atom, a molecule and a container.
---

Atomic design breaks down at exactly one place: the seam between an atom and
everything built from it. Get these four right and you will place almost any
component correctly.

{% include quiz.html id="atom-boundaries-1"
   question="A Button that renders a Loader while `isLoading` is true — atom or molecule?"
   options="A|Molecule, because it composes another component;;B|Atom, because it still has a single responsibility and one visual job;;C|Organism, because it owns state;;D|Container, because it branches on a prop"
   correct="B"
   explanation="Composition is not the test — responsibility is. The Button still does one thing: present a click target. Swapping its label for a spinner is the same job in a different state. A molecule would be a Button *plus a distinct second concern*, such as a field label and its error text." %}

{% include quiz.html id="atom-boundaries-2"
   question="Which of these disqualifies a component from being an atom?"
   options="A|It reads from the store;;B|It accepts twelve props;;C|It renders conditionally;;D|It has its own stylesheet"
   correct="A"
   explanation="Store access binds a component to one application. Atoms are portable across apps and frameworks, so data arrives as props and leaves as events. Twelve props is a smell, not a disqualification; conditional rendering and a stylesheet are normal." %}

{% include quiz.html id="atom-boundaries-3"
   question="Your Input atom needs debounced validation against an API. Where does the debounce live?"
   options="A|Inside the Input atom;;B|In a container above the molecule that owns the field;;C|In the store middleware;;D|In the organism's stylesheet"
   correct="B"
   explanation="The atom emits raw change events. Timing and network access are application concerns, so they belong in the container layer — the same Input then works in a form that validates on submit instead." %}

{% include quiz.html id="atom-boundaries-4"
   question="Two teams need a Button with different hover colours. What changes?"
   options="A|Fork the Button atom;;B|Add a `theme` prop with a switch inside the atom;;C|Change the design tokens the atom's stylesheet reads;;D|Wrap the Button in a molecule per team"
   correct="C"
   explanation="Atoms translate design tokens into pixels. A token change is the intended extension point; forking duplicates behaviour, and a `theme` switch inside the atom turns one component into N components with a shared bug surface." %}

## Related

- Reading: [Atom](../ui/atom.html) · [Atomic Design](../ui/atomic-design.html)
- Agent Skill: `ui-atom`
