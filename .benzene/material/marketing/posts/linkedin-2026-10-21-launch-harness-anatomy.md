---
channel: linkedin
date: 2026-10-21
format: document
claim: "A slop-resistant frontend is one where any agent has fewer ways to be wrong: layers as folders, one shape per component, rules that load with the file, checks that are scripts, and the same shell on every framework."
source: "templates/*/src (the layer folders; templates/chota-react-redux/src/ui/atoms/Button); skills/ui-atom/SKILL.md (paths); docs/practice/harness-atom-guardrail.md (the rules and the quoted rubric line); CLAUDE.md (the seven templates' stacks)"
campaign: launch
slides: .benzene/material/marketing/slides/harness-anatomy.md
document_title: "What a slop-resistant harness looks like"
showcase_url: https://elegantfrontend.training/practice/harness-atom-guardrail.html?utm_source=linkedin&utm_medium=social&utm_campaign=launch
first_comment: "Write the atom guardrail yourself, then point an agent at a broken atom and count the rounds to green. Free, no sign-up: https://elegantfrontend.training/practice/harness-atom-guardrail.html?utm_source=linkedin&utm_medium=social&utm_campaign=launch"
---
A slop-resistant codebase isn't one where the agent is smarter.
It's one where any agent has fewer ways to be wrong.

Here is the harness every Elegant template ships, in five parts.

1. Layers are folders. src/ui holds atoms, molecules, organisms, templates and skeletons; src/containers connects them; src/state holds one folder per feature. Where a file lives says what it may import.

2. Every component has the same shape. Button.component.jsx, .style.css, .stories.js, .type.js and .test.jsx. A missing story or test is visible at a glance, and a script can count it.

3. Rules load with the file. Each Agent Skill names the paths it applies to. The ui-atom skill covers **/ui/atoms/**, so an agent editing an atom reads the atom rules, not a generic "write clean code".

4. Checks are scripts, not opinions. An atom imports nothing from state or containers, does no I/O in an effect, gives its button an accessible name. In our guardrail practice question the rubric is blunt: "No rule depends on an LLM judgement — each one is a parse, a count or a file-existence test."

5. One shell, any framework. React with Redux, Redux Toolkit, Saga or Zustand; Angular with NgRx; Vue with Pinia; Lit web components. Swap the framework and the folders, names and tests stay the same, so the harness travels with you.

None of this needs a better model. It needs someone who knows the architecture well enough to write it down. That is the skill Elegant teaches.

Write your first guardrail in the practice question linked in the first comment.

#frontend #ai #softwarearchitecture #testing
