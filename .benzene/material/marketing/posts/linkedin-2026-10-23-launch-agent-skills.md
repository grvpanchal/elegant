---
channel: linkedin
date: 2026-10-23
format: document
claim: Elegant's 45 Agent Skills are open source and install with one command; each loads with the files it covers and turns a frontend term into DON'Ts and quality gates an agent's work must pass.
source: "skills/README.md (the install command, 45 skills, the paths globs); skills/state-selectors/SKILL.md (DON'T list and Quality Gates, quoted); github.com/grvpanchal/elegant/tree/master/skills (45 skill folders, public, checked 2026-10-19)"
campaign: launch
slides: .benzene/material/marketing/slides/agent-skills-open.md
document_title: "45 Agent Skills, open source"
showcase_url: https://elegantfrontend.training/practice/?utm_source=linkedin&utm_medium=social&utm_campaign=launch
first_comment: "Every skill has a practice question with real tests. Start with any of the 47, free and with no sign-up: https://elegantfrontend.training/practice/?utm_source=linkedin&utm_medium=social&utm_campaign=launch"
---
"Write good selectors" is advice. An agent ignores advice the moment the prompt gets long.

So the rules behind Elegant are published as 45 open-source Agent Skills, one per frontend term, across the UI, Server and State layers. One command installs any of them:

npx skills add grvpanchal/elegant --skill state-selectors

What's inside one, taking state-selectors as the example:

→ Paths. The skill names the files it applies to ("**/state/**/*.{js,ts}"), so an agent editing a state file loads the selector rules without anyone pasting them into the prompt.

→ DON'Ts that name the slop. "Access state directly in components." "Compute derived data in components." "Create selectors that return new objects every time." That last one is the bug that passes every value test and re-renders a list on every dispatch. We found it in our own template.

→ Quality gates. Input selectors for raw state paths, createSelector for derived data, selectors colocated with slices, no direct state access in components, selectXxx names. A checklist the work has to pass, not a style guide to admire.

They follow the Agent Skills open standard, so they work with any agent that reads SKILL.md files.

Each skill has a practice question where you write the code and the check. The practice bank is in the first comment.

#frontend #ai #opensource #javascript
