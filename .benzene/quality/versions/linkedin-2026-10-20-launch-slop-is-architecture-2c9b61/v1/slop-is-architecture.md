# AI slop is an architecture problem

Slop is what an agent writes when nobody named the boundaries or wrote the checks. A faster model only writes more of it.

---

# Cleanup is now a $10,000 week

Slopfix: three senior engineers, one week, a committed cut in lines of code.

What you keep at the end includes "a CLAUDE.md, lint rules, CI checks — that slow the slop down."

---

# Those guardrails are a harness

Named layers. Rules the agent loads with the file it opens. Checks that fail the change.

They work on day one, before the first prompt, not only after the 100,000th line.

---

# Elegant: 45 terms, three layers

UI, what people see: 16 terms. Server, what delivers it: 20. State, what remembers it: 9.

Every term has a page, an open-source Agent Skill and a practice question with real tests.

---

# Slop that passes review

```js
return { ...todo, todoItems };
```

The right todos, in a new object on every call. Every value test passes, and the list re-renders on every dispatch.

We found it in our own template.

---

# A check an agent can't argue with

```js
expect(selectTodoData(next))
  .toBe(selectTodoData(state));
```

next changed only the theme. The script decides, not a reviewer's mood. That's the harness.

---

# Start free, no sign-up

47 practice questions with real tests, 45 open-source Agent Skills, a free 354-page book.

elegantfrontend.training/practice/
