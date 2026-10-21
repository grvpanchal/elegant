---
channel: linkedin
date: 2026-10-25
claim: "An agent puts code wherever the last file was; every Elegant template gives it a place for each kind of code instead: ui/ (atoms to templates, skeletons) imports nothing from state/ or containers/, containers read selectors and dispatch actions, pages place containers into a layout, and state/ keeps one folder per feature joined by rootReducer."
source: "templates/chota-react-redux/src (the tree in the diagram); no import from state/ or containers/ anywhere in ui/ (grep, 2026-10-21); state/rootReducer.js combines todo, filters and config; pages/index.jsx places the containers into ui/templates/Layout; README.md (npx elegant <template>)"
campaign: folder-diagrams
diagram: .benzene/material/marketing/diagrams/template-structure.md
showcase_url: https://elegantfrontend.training/cli.html?utm_source=linkedin&utm_medium=social&utm_campaign=folder-diagrams
first_comment: "Scaffold it with one command, then read the structure on the CLI page: https://elegantfrontend.training/cli.html?utm_source=linkedin&utm_medium=social&utm_campaign=folder-diagrams"
---
An agent puts code wherever the last file was.

That's how a frontend ends up with fetch calls inside buttons and state copied into pages, until every change breaks two others.

The fix isn't a better prompt. It's a structure the agent can't misread. This is the one every Elegant template follows:

UI layer, ui/
Atoms, molecules, organisms and templates, plus skeletons for the loading states. It imports nothing from state/ or containers/. That one rule is a grep you can run in CI.

Server layer, containers/ and pages/
Containers read selectors and dispatch actions. Pages place containers into a layout. Nothing below them knows where the data comes from.

State layer, state/
One folder per feature, each with its actions, reducer and selectors, each tested. rootReducer joins them.

Give your coding agent this tree and those three rules and it stops guessing where code goes. A reviewer stops guessing too: a file in the wrong folder is wrong on sight.

Scaffold it with one command: npx elegant chota-react-redux. The same layers ship for Vue, Angular and Web Components.

Which folder does your agent get wrong most often?

#frontend #react #softwarearchitecture #webdevelopment #ai
