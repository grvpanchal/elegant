---
channel: x
date: 2026-10-22
format: thread
claim: "A slop-resistant frontend gives any agent fewer ways to be wrong: layers as folders, one shape per component, rules that load with the file, checks that are scripts."
source: "templates/*/src; templates/chota-react-redux/src/ui/atoms/Button; skills/ui-atom/SKILL.md (paths); docs/practice/harness-atom-guardrail.md (the rules)"
campaign: launch
showcase_url: https://elegantfrontend.training/practice/harness-atom-guardrail.html?utm_source=x&utm_medium=social&utm_campaign=launch
---
A slop-resistant frontend isn't one with a smarter agent. It's one where any agent has fewer ways to be wrong:

- layers as folders
- one shape per component
- rules that load with the file
- checks that are scripts
- the same shell on any framework

---

Every atom in our templates ships as Button.component, .style, .stories, .type and .test, and the ui-atom Agent Skill loads for any file under **/ui/atoms/**.

In our atom guardrail, a missing story isn't a review comment. It fails the script.

---

The other rules: no imports from state or containers, no I/O in an effect, an accessible name on every button.

Write that guardrail yourself, then point an agent at it: https://elegantfrontend.training/practice/harness-atom-guardrail.html?utm_source=x&utm_medium=social&utm_campaign=launch
