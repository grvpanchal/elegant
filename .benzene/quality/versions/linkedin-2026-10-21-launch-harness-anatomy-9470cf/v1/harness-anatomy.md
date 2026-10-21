# What a slop-resistant harness looks like

Not a smarter agent: fewer ways for any agent to be wrong. Five parts, taken from Elegant's own templates.

---

# 1. Layers are folders

```text
src/ui/atoms  molecules  organisms
       templates  skeletons
src/containers
src/state/<feature>
```

Where a file lives says which layer it is in, and what it may import.

---

# 2. Every component has the same shape

```text
Button.component.jsx
Button.style.css
Button.stories.js
Button.type.js
Button.test.jsx
```

A missing story or test is visible at a glance, and a script can count it.

---

# 3. Rules load with the file

```yaml
name: ui-atom
paths:
  - "**/ui/atoms/**/*.{jsx,tsx,vue,js,ts}"
```

Open an atom and the agent reads the atom rules. Open a selector and it reads the selector rules.

---

# 4. Checks are scripts, not opinions

An atom imports nothing from state or containers. It does no I/O in an effect. Its button has an accessible name.

"No rule depends on an LLM judgement — each one is a parse, a count or a file-existence test."

---

# 5. One shell, any framework

React with Redux, Redux Toolkit, Saga or Zustand. Angular with NgRx. Vue with Pinia. Lit web components.

Swap the framework; the folders, the names and the tests stay.

---

# Write your first guardrail, free

The atom guardrail question: write the script, then point an agent at a broken atom and count the rounds to green. No sign-up.

elegantfrontend.training/practice/harness-atom-guardrail.html
