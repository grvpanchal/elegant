---
title: Elegant template
subtitle: UI · Server · State
root: templates/chota-react-redux
label: chota-react-redux/
source: "templates/chota-react-redux/src: the folders and files below; ui/ imports nothing from state/ or containers/ (grep, 2026-10-20); pages/index.jsx places containers into ui/templates/Layout; state/rootReducer.js combines todo, filters and config"
---
```tree
src/
  ui/
    atoms/
      Button/
        Button.component.jsx
        Button.test.jsx
    molecules/
    organisms/
    templates/
    skeletons/
  containers/
    TodoListContainer.jsx
    TodoFiltersContainer.jsx
  pages/
    index.jsx
  state/
    todo/
      todo.actions.js
      todo.reducer.js
      todo.selectors.js
    rootReducer.js
```

## UI layer → ui/ {blue}
- Atoms, molecules, organisms, templates
- Skeletons hold the loading states
- Imports nothing from state or containers

## Server layer → containers/, pages/ {orange}
- Containers read selectors, dispatch actions
- Pages place containers into a layout

## State layer → state/ {green}
- One folder per feature: config, filters, todo
- Actions, reducer and selectors, each tested
- rootReducer joins the features
