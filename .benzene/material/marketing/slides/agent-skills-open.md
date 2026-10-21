# 45 Agent Skills, open source

One per frontend term, across UI, Server and State.

Each is a SKILL.md written to the Agent Skills open standard, so any agent that reads skills can load it.

---

# One command per skill

```bash
npx skills add grvpanchal/elegant \
  --skill state-selectors
```

Install the ones for the layer you are working in, or all of them.

---

# It loads with the file

```yaml
name: state-selectors
paths:
  - "**/state/**/*.{js,ts}"
```

Open a state file and the agent reads the selector rules. Nobody has to remember to paste them into the prompt.

---

# The DON'Ts are the slop, named

From state-selectors:

- Access state directly in components
- Compute derived data in components
- Create selectors that return new objects every time

---

# Gates, not advice

- Input selectors for raw state paths
- createSelector for derived data
- Selectors colocated with slices
- No direct state access in components
- Naming convention (selectXxx)

"Write good selectors" is advice. A list an agent's work must pass is a gate.

---

# Learn the rule by writing the check

Every skill has a practice question with real tests. Free, in your browser, no sign-up.

elegantfrontend.training/practice/
